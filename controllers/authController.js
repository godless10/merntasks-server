const Usuario = require ('../models/Usuarios');
const bcryptjs = require ('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');





exports.autenticarUsuario = async (req,res) => {

    //revisamos si hay errores de validacion
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    //extraer el email y password
    const {email, password} = req.body;

    try {
        
        //Revisar q el usuario exista (revisando su email)
        let usuario = await Usuario.findOne({ email });

        if(!usuario){
            return res.status(400).json({ msg: 'El usuario no se encuentra registrado'});
        }

        //Revisar el password del usuario si este EXISTE
        const passCorrecto = await bcryptjs.compare(password, usuario.password);

        if(!passCorrecto){
            return res.status(400).json({ msg: 'El password NO ES CORRECTO'});
        }

        //Si todo es correcto
        //Crear y firmar el Json Web Token
        const payload = {
            usuario: {
                id: usuario.id,
            }
        };
        //firmar el jwt
        jwt.sign(payload,process.env.SECRETA, {
            expiresIn: 36000 //1 hora autenticados
        },(error,token)=>{
            if(error) throw error;

            //Mensaje de confirmacion con el token de usuario
            return res.json({ token: token });

        });


    } catch (error) {
        console.log(error);
        res.status(400).send('hubo un error');  
    }

}




////////////////////////////////////////OBTIENE QUE USUARIO ESTA AUTENTICADO
exports.usuarioAutenticado = async (req,res) => {

    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({usuario});
    } catch (error) {
        console.log(error);
        res.status(400).send('Error obteniendo el usuario autenticado'); 
    }

}