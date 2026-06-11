const jwt = require('jsonwebtoken')
const {user} = require('../models/index')

const authMiddleware = async (req, res, next) => {
  try{
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({
        ok: false,
        message: 'no autorizado - token no proporcionado'
      })
    }
    const token = authHeader.split(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findBypk(decoded.id)
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: 'no autorizado - usuario no encontrado'
      })
    }
    req.userId = decoded.id
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        ok: false,
        message: 'sesion expirada - inicia sesion nuevamente'
      })
    }
    return res.status(401).json({
      ok: false,
      message: 'no autorizado - token invalido'
    })
  }
}
module.exports = authMiddleware