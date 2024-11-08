import jwt from "jsonwebtoken";
import vendedoresControllers from "../controllers/vendedores.controller.js";
import compradoresControllers from "../controllers/compradores.controller.js";
import { config } from "../dbconfig.js";
import 'dotenv/config';
import pkg from "pg";
import vendedorServices from "../services/vendedor.service.js";
const { Client } = pkg;

// Middleware para verificar el token
export const verifyToken = async (req, res, next) => {
    const headerToken = req.headers['authorization'];
    console.log(headerToken);

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


      console.log(decoded);

        const {id} = decoded;
        const client = new Client(config);
        await client.connect();
 
       
        const usuario = await client.query('SELECT * FROM vendedor WHERE id= $1',[id]);

       
        // Si no se encuentra como comprador, intentar encontrar como vendedor
        if (!usuario) {
            usuario = await client.query('SELECT * FROM comprador WHERE id= $1',[id]);
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
            console.log(error);
            return res.status(500).json({ error: "Error interno del servidor." });
        }
    }
};
export const verifyAdmin = async (req, res, next) => {
    try {
        const id = req.id; // Obtener el ID del usuario autenticado
        
        // Verificar si el usuario está autenticado
        if (!id) {
            return res.status(400).json({ message: "Usuario no autenticado" });
        }

        const client = new Client(config);
        await client.connect();

        // Obtener el usuario de la base de datos
        const result = await client.query('SELECT * FROM public."vendedor" WHERE id = $1', [id]);

        // Verificar si el usuario fue encontrado
        if (result.rows.length < 1) {
            await client.end();
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const usuario = result.rows[0];

        // Debug para verificar el valor del campo admin
        console.log('Usuario encontrado:', usuario);
        console.log('Valor de admin:', usuario.admin);

        // Verificar si el campo admin es true
        if (usuario.admin === true|| usuario.admin === 'true' || Boolean(usuario.admin) === true) {
            await client.end();
            return next(); // Llamar al siguiente middleware o controlador
        } else {
            await client.end();
            return res.status(403).json({ message: "Acceso prohibido, no eres administrador" });
        }
    } catch (error) {
        console.error('Error en verifyAdmin:', error); // Registrar el error
        return res.status(500).json({ message: "Error del servidor al verificar administrador" });
    }
};
