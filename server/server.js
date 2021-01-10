require('./config/config.js')
const express = require('express')

const mongoose = require('mongoose')
const app = express()

const bodyParser = require('body-parser')

// app.use siempre son middlewares , siempre pasarán porestas lineas
// Para procesar peticiones x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // para parsear application / json
app.use(bodyParser.json())

app.use(require('./routes/usuario'))

//mongodb es el protocolo
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err
        console.log('Base de datos ONLINE')

    })

app.listen(process.env.PORT, (req, res) => {
    console.log('Escuchando del puerto', 3000);
})