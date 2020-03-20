const Usuario = require ('../models/Usuarios');
const bcryptjs = require ('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {
    
    //revisamos si hay errores de validacion
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    // extraer email y password
    const {email, password} = req.body;

    try {
        //Revisar q el usuario registrado sea unico
        let usuario = await Usuario.findOne({ email });

        if(usuario){
            return res.status(400).json({ msg: 'un usuario con ese email ya existe'});
        }

        //crea un modelo de usuario nuevo
        usuario = new Usuario(req.body);

        //creamos un hash para el password del usuario
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password,salt);

        //guardamos el usuario con el chequeo de estructura definido en el schema
        await usuario.save();

        //Crear y firmar el Json Web Token
        const payload = {
            usuario: {
                id: usuario.id,
            }
        };
        //firmar el jwt
        jwt.sign(payload,process.env.SECRETA, {
            expiresIn: 3600 //1 hora autenticados
        },(error,token)=>{
            if(error) throw error;

            //Mensaje de confirmacion con el token de usuario
            return res.json({ token: token });

        });

        //Enviando un mensaje de respuesta
        //return res.status(200).json({ msg: 'Usuario creado con EXITO'});


    } catch (error) {
        console.log(error);
        res.status(400).send('hubo un error');
    }
}