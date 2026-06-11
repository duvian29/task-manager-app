const express = require('express')
const cors =require('cors')
require('dotenv').config()

const {connectDB, sequelize} = require('./config/database')
require('./models/index')

const authRoutes = require('./routes/auth.routes')

const app = express()
const PORT = process.env.PORT || 3000

//midlewares globales
app.use(express.json())
app.use(cors())

//rutas
app.get('/', (req, res) => {
  res.json({
    message: 'API funcionando correctamente',
    version: '1.0.0',
    status: 'ok'
  })
})

app.get('/health', async(req, res) => {
  try{
    await sequelize.authenticate()
    res.json({
      status: 'ok',
      database: 'MYSQL conectada',
      timestamp:new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'sin conexión'
    })
  }
})

app.use('/api/auth', authRoutes)

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: `Ruta ${req.method} ${req.url} no encontrada`
  })
})

const startServer = async () => {
  await connectDB()
  await sequelize.sync({ alter: true })
  console.log('tablas sincronizadas con MYSQL')

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhoust ${PORT}`)
      console.log(`📋 Rutas disponibles:`)
      console.log(` POST http://localhost:${PORT}/api/auth/register`)
      console.log(` POST http://localhost:${PORT}/api/auth/login`)
      console.log(` GET http://localhost:${PORT}/api/auth/profile`)
    })
}
startServer()

module.exports = app