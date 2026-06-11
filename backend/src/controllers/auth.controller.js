const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../models/index')

// ── Genera el token JWT ──────────────────────────
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  )
}

// ── REGISTRO ─────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Todos los campos son obligatorios'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        ok: false,
        message: 'La contraseña debe tener mínimo 6 caracteres'
      })
    }

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({
        ok: false,
        message: 'Este email ya está registrado'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    const token = generateToken(user.id)

    res.status(201).json({
      ok: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    console.error('Error en register:', error)
    res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    })
  }
}

// ── LOGIN ─────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Email y contraseña son obligatorios'
      })
    }

    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: 'Credenciales incorrectas'
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        ok: false,
        message: 'Credenciales incorrectas'
      })
    }

    const token = generateToken(user.id)

    res.json({
      ok: true,
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    })
  }
}

// ── PERFIL ───────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'name', 'email', 'createdAt']
    })

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado'
      })
    }

    res.json({
      ok: true,
      user
    })

  } catch (error) {
    console.error('Error en getProfile:', error)
    res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    })
  }
}

module.exports = {
  register,
  login,
  getProfile
}