import express from 'express';
import CompradorRouter from './routes/compradores.router.js'
import VendedorRouter from './routes/vendedores.router.js'
import authRouter from './routes/auth.routes.js'
import multer from 'multer';
import { fileURLToPath } from 'url'; 
import { dirname } from 'path'; 
import { join } from 'path';
import cors from "cors"


const app = express();
app.use(express.json());
app.use(cors({
    origin: "*", // origen permitido
    methods: ['GET', 'POST', 'OPTIONS']
  }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Poner la ubicacion de la carpeta de Uploads correspondiente, en este caso se ubica dentro del SRC
const uploadDir = join(__dirname, "../uploads");

// Se define donde se va a ubicar el archivo que vamos a subir y el nombre, este se puede modificar, en este caso el nombre que se le va a asignar es la fecha de subida sumado del nombre del archivo original
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

// El siguiente filtro es para que se suban unicamente archivos con extensiones especificas. En este caso serian JPEG, PNG y JPG
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, PNG, JPEG, and JPG files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});


app.listen(3000, () => {
    console.log("PrintMe en puerto 3000");
});

app.use("/compradores", CompradorRouter);
app.use("/vendedores", VendedorRouter);
app.use("/login",authRouter);
app.use("/registercomprador",authRouter);
app.use("/registervendedor",authRouter);
app.use("/productos", CompradorRouter)
app.use("/pedidos", VendedorRouter);
app.use("/fotos",CompradorRouter);