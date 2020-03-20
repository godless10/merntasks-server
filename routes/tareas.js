const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const tareaController = require ('../controllers/tareaController');
const auth = require('../middleware/auth');


// api/tareas

///////////////////////////////////CREAR tarea nueva para proyecto especifico
router.post('/',
    auth,
    [
        check('nombre','El nombre de la tarea es obligatorio').notEmpty(),
        check('proyecto','El nombre del proyecto es obligatorio').notEmpty(),
    ],
    tareaController.crearTarea
);



///////////////////////////////////OBTENER tareas de proyecto especifico
router.get('/',
    auth,
    [
        check('proyecto','El nombre del proyecto es obligatorio').notEmpty(),
    ],
    tareaController.obtenerTareas
);


///////////////////////////////////ACTUALIZAR una tarea por ID
router.put('/:id',
    auth,
    tareaController.actualizarTarea
);


///////////////////////////////////ELIMINAR una tarea por ID
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
);







module.exports = router;