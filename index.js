import express from 'express';
import CompradorRouter from './routes/compradores.router.js'
import VendedorRouter from './routes/vendedores.router.js'
import authRouter from './routes/auth.routes.js'
import cors from "cors"


const app = express();
app.use(express.json());
const corsOptions = {
  origin: ['*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Configuración de respuesta para solicitudes
app.options('*', (_, res) => {
  res.header("Access-Control-Allow-origin", "http://print-me-ten.vercel.app");
  res.header("Access-Control-Allow-methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-credentials", "true");
  res.sendStatus(200);
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