const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const port = procces.env.port;

// estos son los middlewares globales (estos se ejecutan en cada petición antes de llegar a las rutas)
app.use(cors()); // este es para poder hacer peticiones desde diferentes orígenes (del puerto x al puerto del poyecto)
app.use(morgan("combined")); // es para el logging, osea mostraar en consola las peticiones que llegn al server. El combined es solo una forma en que se quiere recibir los datos
app.use(express.json({ limit: "10mb" })); // convierte el request con body formato json a objeto javascript. Permite hasta 10 megas en el body
app.use(express.urlencoded({ extended: true })); // esto es para leer datos desde formularios html y con el extended true permite leer objetos

// los middleware para archivos estáticos
app.use("/uploads", express.static("uploads")); // devuelve las imagenes con la ruta /uploads. Esto solo se tiene en cuenta si la búsqueda tiene ese endpoint

// rutas

app.get("/", (req, res) => {
  res.json({
    mensaje: "Marketplace Inteligente API",
    version: "1.0.0",
    documentacion: "/api-docs",
  });
});


// manejo de errores

app.use((err, req, res, next) =>{
    console.error(err.stack)
    res.status(err.status || 500).json({
        error: true,
        mensaje: err.message || 'Error interno del servidor'
    })
})


// Middleware para rutas no encontradas
app.use('*', (req, res) => {
 res.status(404).json({
 error: true,
 mensaje: 'Endpoint no encontrado'
 });
});



app.listen(PORT, () =>{
  console.log(`Servidor corriendo en puerto ${PORT}`)
  console.log(`Logs: ${procces.env.NODE_ENV || `development`}`)
})





