import express from 'express';
import CompradorRouter from './routes/compradores.router.js'
import VendedorRouter from './routes/vendedores.router.js'
import authServices from './routes/auth.routes.js'
const app = express();

app.use("/compradores", CompradorRouter);
app.use("/vendedores", VendedorRouter);
app.use("/login",authServices);
app.use("/registercomprador",authServices)
app.use("/registervendedor",authServices)


app.listen(3000, () => {
    console.log("PrintMe en puerto 3000");
});
