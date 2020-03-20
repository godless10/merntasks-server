const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');


////////////////////////////////////////////////CREAR PROYECTO
exports.crearProyecto = async (req,res) => {

    //revisamos si hay errores de validacion
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }


    try {
        //creamos un nuevo proyecto!
        //el body es lo q envio el usuario
        //para este caso solamente el nombre
        const proyecto = new Proyecto(req.body);

        //el modelo de proyecto tambien contiene un 'creador'
        //en nuestro middleware anterior creamos un req.usuario
        //req.usuario guarda la parte 'usuario' del payload
        proyecto.creador = req.usuario.id;

        //una vez q ya definimos proyecto.nombre y proyecto.creador
        //guardamos el objeto en la base de datos
        await proyecto.save();
        res.json(proyecto);

    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error');  
    }
}


////////////////////////////////////////////////OBTENER PROYECTOS DE USUARIO ACTUAL
exports.obtnerProyectos = async (req,res) =>{

    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({creado: -1});
        res.json({proyectos});

    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error obteniendo proyectos');
    }
}

////////////////////////////////////////////////ACTUALIZA UN PROYECTO

exports.actualizarProyecto = async (req,res) => {
    //revisamos si hay errores de validacion
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    //extraemos la info relevante del proyecto
    const {nombre} = req.body;
    const nuevoProyecto = {};

    if(nombre){
        nuevoProyecto.nombre = nombre;
    }


    try {
        
        //revisar ID
        let proyecto = await Proyecto.findById(req.params.id);

        //Si el proyecto existe o no
        //EN REALIDAD esta parte no se ejecuta ya que si la consulta
        // a la base de datos no es exitosa, se nos envia al catch
        if(!proyecto){ 
            return res.status(404).json({msg:'Proyecto no encontrado'});
        }

        //verificamos el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg:'Proyecto no Autorizado'});
        }

        //actualizar proyecto
        proyecto = await Proyecto.findByIdAndUpdate({_id: req.params.id}, {$set: nuevoProyecto},{new: true})
        res.json({proyecto});

    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error actualizando proyectos');
    }
}


////////////////////////////////////////////////ELIMINA UN PROYECTO

exports.eliminarProyecto = async (req,res) => {


    try {
        
        //revisar ID
        let proyecto = await Proyecto.findById(req.params.id);

        //Si el proyecto existe o no
        //EN REALIDAD esta parte no se ejecuta ya que si la consulta
        // a la base de datos no es exitosa, se nos envia al catch
        if(!proyecto){ 
            return res.status(404).json({msg:'Proyecto no encontrado'});
        }

        //verificamos el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg:'Proyecto no Autorizado'});
        }

        //eliminar proyecto
        proyecto = await Proyecto.findOneAndRemove({_id: req.params.id})
        res.json({msg: 'proyecto ELIMINADO exitosamente'});

    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error Eliminando proyectos');
    }
}



