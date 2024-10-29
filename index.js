import express from 'express';
import CompradorRouter from './routes/compradores.router.js'
import VendedorRouter from './routes/vendedores.router.js'
import authRouter from './routes/auth.routes.js'
import cors from "cors"


const app = express();
app.use(express.json());
app.use(cors({
    origin: "*", // origen permitido
    methods: ['GET', 'POST', 'OPTIONS']
  }));



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