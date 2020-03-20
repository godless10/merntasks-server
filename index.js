const express = require ('express');
const conectarDB = require ('./config/db');
const cors = require('cors');

//crear el servidor
const app = express();

//conectar a la base de datos
conectarDB();

//Habilitar CORS
app.use(cors());

//habilitar express.json
app.use(express.json({ extended: true }));


//puerto de la app
const port = process.env.port || 4000;

//importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));




//definir pag principal
/*
app.get('/', (req, res) =>{
    res.send('Hola Mundo')
});
*/



app.listen(port,'0.0.0.0', () =>{
    console.log(`el server esta funcionando en el puerto ${PORT}`)
})