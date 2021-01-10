const express = require('express')
const bcrypt = require('bcrypt')
const _ = require('underscore')

const Usuario = require('../config/models/usuario')
const app = express() // cargar express

app.get('/usuario', function(req, res) {
    //res.json('get Usuario'
    let desde = req.query.desde || 0;
    desde = Number(desde)

    let limite = req.query.limite || 5;
    limite = Number(limite)
    const condicion = { estado: true }

    Usuario.find(condicion, 'nombre email role estado img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Usuario.count(condicion, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })

            })



        })

})

app.post('/usuario', (req, res) => {
    console.log('Inicio');
    let body = req.body
    console.log('Body ' + body.password);
    // new Usuario, cn u may
    // crea una nueva instancia de esquema Usuario
    // con todas las propiedades de mongodb
    let usuario = new Usuario({
            nombre: body.nombre,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            role: body.role

        })
        // metodo save , retorna :
        // err y usuario
        // save recibie un callback
    console.log('Antes de grabar');
    usuario.save((err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err

                })
            }
            // implicito el 200 si no lo coloca
            // res. ....
            usuarioDB.password = null
            res.json({
                ok: true,
                usuario: usuarioDB
            })
            console.log('Ok')


        })
        //res.end()




    /*res.json({
        persona: body
    })
    res.end()*/
})

// actualización
app.put('/usuario/:id', function(req, res) {
    // Obtener el parametro id
    let id = req.params.id
        // obtiene el body
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado', ])



    //let body = req.body
    //Usuario.findByIdAndUpdate(id, (err, usuarioDB) => {
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })

})

app.delete('/usuario/:id', function(req, res) {
    //res.json('delete Usuario')
    let id = req.params.id
    let cambiaEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err

            })
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })


    })



})

module.exports = app