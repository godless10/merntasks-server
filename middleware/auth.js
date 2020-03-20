const jwt = require('jsonwebtoken');

module.exports = function (req,res,next){
    
    //Leer/extraer el token del header
    const token = req.header('x-auth-token');

    //revisar si no hay token
    if(!token){
        res.status(401).json({msg:'No hay token permiso no valido'});
    }

    //validar el token

    try {
        const cifrado = jwt.verify(token, process.env.SECRETA);
        req.usuario = cifrado.usuario;
        //esta siguiente linea envia a express(routes) al siguiente middleware
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({msg:'hubo un error validando el token'})
    }


}