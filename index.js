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
  res.header("Access-Control-Allow-Origin",'https://127.0.0.1:5500');
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

app.get("/", async(_,res) =>{
 res.send("API WORKING")
})


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