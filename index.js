import express from 'express';
import CompradorRouter from './routes/compradores.router.js'
import VendedorRouter from './routes/vendedores.router.js'
const app = express();

app.use("/compradores", CompradorRouter);
app.use("/vendedores", VendedorRouter);
app.use("/login")
app.use("/register")


app.listen(3000, () => {
    console.log("PrintMe en puerto 3000");
});
