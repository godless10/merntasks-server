const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');


//////////////////////////////////////////CREAR una nueva tarea
exports.crearTarea = async (req,res) =>{

    //revisamos si hay errores de validacion
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    //Extraemos el proyecto id que viene en el body de la peticion
    const {proyecto} = req.body;

    try {
        //Comprobamos si el proyecto extraido existe
        const proyectoActual = await Proyecto.findById(proyecto);
        if(!proyectoActual){
            return res.status(404).send('Proyecto no encontrado');  
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(proyectoActual.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg:'Proyecto no Autorizado'});
        }

        //Creamos la tarea asignada al proyecto correcto
        const tarea = new Tarea(req.body);
        await tarea.save();

        //imprimimos la tarea recien agregada
        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error con la CREACION de TAREA');  
    }

}









//////////////////////////////////////////OBTENER tareas para proyecto especifico
exports.obtenerTareas = async (req,res) =>{

    //revisamos si hay errores de validacion
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    //Extraemos el proyecto id que viene en el body de la peticion
    //Cuando desde react enviamos params el valor no se lee desde el
    //body sino desde la propiedad query
    //const {proyecto} = req.body;
    const {proyecto} = req.query;

    try {
        //Comprobamos si el proyecto extraido existe
        const proyectoActual = await Proyecto.findById(proyecto);
        if(!proyectoActual){
            return res.status(404).send('Proyecto no encontrado');  
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(proyectoActual.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg:'Proyecto no Autorizado'});
        }

        //Obtener tareas por proyecto
        //y se ordena la consulta de ultima a primera
        //o de mas reciente a mas vieja segun el campo CREADO
        const tareas = await Tarea.find({proyecto}).sort({creado: -1});
        

        //imprimimos la tareas con la recien agregada
        res.json({tareas});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error OBTENIENDO TAREAS por proyecto');  
    }

}







//////////////////////////////////////////ACTUALIZAR TAREA POR ID
exports.actualizarTarea = async (req,res) =>{


    //Extraemos el proyecto id que viene en el body de la peticion
    const {nombre,estado} = req.body;

    try {

        //Comprobamos is la tarea existe
        let tareaExiste = await Tarea.findById(req.params.id);
        if(!tareaExiste){
            return res.status(404).send('Tarea no encontrada');  
        }

        //Buscamos el proyecto al que pertenece dicha tarea
        const proyectoActual = await Proyecto.findById(tareaExiste.proyecto.toString());

        //Revisar si el proyecto encontrado y asociado a la tarea pertenece al usuario autenticado
        if(proyectoActual.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg:'Proyecto no Autorizado'});
        }

        //Creamos un objeto con la nueva informacion
        const nuevaTarea = {};
        
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;
        

        //Guardamos los cambios en la nueva tarea
        tareaExiste = await Tarea.findOneAndUpdate({_id: req.params.id},nuevaTarea,{new: true});

        //mostramos la tarea recien modificada
        res.json({tareaExiste});


    } catch (error) {
        console.log(error);
        res.status(500).send('Error ACTUALIZANDO TAREA');  
    }

}






//////////////////////////////////////////ELIMINAR TAREA POR ID
exports.eliminarTarea = async (req,res) =>{


    try {

        //Comprobamos is la tarea existe
        let tareaExiste = await Tarea.findById(req.params.id);
        if(!tareaExiste){
            return res.status(404).send('Tarea no encontrada');  
        }

        //Buscamos el proyecto al que pertenece dicha tarea
        const proyectoActual = await Proyecto.findById(tareaExiste.proyecto.toString());

        //Revisar si el proyecto encontrado y asociado a la tarea pertenece al usuario autenticado
        if(proyectoActual.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg:'Proyecto no Autorizado'});
        }


        //ELIMINAMOS la tarea
        tareaExiste = await Tarea.findOneAndRemove({_id: req.params.id});

        //mostramos la tarea recien modificada
        res.json({msg:'tarea ELIMINADA'});


    } catch (error) {
        console.log(error);
        res.status(500).send('Error ACTUALIZANDO TAREA');  
    }

}