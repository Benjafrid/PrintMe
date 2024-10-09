import jwt from "jsonwebtoken";
import vendedoresControllers from "../controllers/vendedores.controller.js";
import compradoresControllers from "../controllers/compradores.controller.js";
import { config } from "../dbconfig.js";
import pkg from "pg";
const { Client } = pkg;

// Middleware para verificar el token
export const verifyToken = async (req, res, next) => {
    const headerToken = req.headers['authorization'];
    const client = new Client(config);
    await client.connect();

    // Verificar si el token está proporcionado
    if (!headerToken) {
        return res.status(400).json({ message: "Token necesario" });
    }


    // Verificar si el token está en el formato correcto
    const tokenParts = headerToken.split(' ');
    if (tokenParts[0] !== 'Bearer' || tokenParts.length !== 2) {
        return res.status(400).json({ message: "Formato del token no válido" });
    }
    console.log(tokenParts);
    const token = tokenParts[1];


    console.log(token)
   
    try {
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret);


      console.log(decoded)

        const {id} = decoded;
       
        const usuario = await client.query('SELECT * FROM vendedor', [id])
       
        // Si no se encuentra como comprador, intentar encontrar como vendedor
        if (!usuario) {
            usuario = await client.query('SELECT * FROM comprador',[id]);
        }

        if (!usuario) {
            return res.status(400).json({ message: "ID no válido" });
        }


        req.id = id;
        req.role = usuario;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Token inválido." });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token expirado." });
        } else {
            return res.status(500).json({ error: "Error interno del servidor." });
        }
    }
}

