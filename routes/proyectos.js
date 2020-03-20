const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const proyectoController = require ('../controllers/proyectoController');
const auth = require('../middleware/auth');



//crea proyectos
// api/proyectos
router.post('/', 
    auth,
    [
        check('nombre','El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
);




//obtiene proyectos por usuario autenticado
router.get('/', 
    auth,
    proyectoController.obtnerProyectos
);




//modifica un proyecto de un usuario autenticado via ID
router.put('/:id', 
    auth,
    [
        check('nombre','El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
);


//Eliminar un proyecto de un usuario autenticado via ID
router.delete('/:id', 
    auth,
    proyectoController.eliminarProyecto
);




module.exports = router;