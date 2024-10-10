import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import vendedorServices from "../services/vendedor.service.js";
import CompradoresService from "../services/comprador.service.js";

const registervendedor = async (req, res) => {
    const { nombre, apellido, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña } = req.body || {};
    if (!nombre || !apellido || !mail || !contraseña || !zona || !impresora_modelo || !impresora_materiales || post_procesado) {
        return res.status(400).json({ message: "Faltan campos por llenar" });
    }

    try {
        const existingUser = await vendedorServices.getVendedoresByEmail(mail);
        if (existingUser) {
            return res.status(400).json({ message: "El vendedor ya existe" });
        }

        const hashedPassword = await bcrypt.hash(contraseña, 10);
        await vendedorServices.createvendedor(nombre, apellido, mail, zona, impresora_modelo, impresora_materiales, post_procesado, hashedPassword);
        res.status(201).json({ message: "Vendedor creado con éxito" });
    } catch (error) {
        console.error('Error creating vendedor:', error);
        res.status(500).json({ message: error.message });
    }
};


const registercomp = async (req, res) => {
    const { nombre, apellido, mail, contraseña } = req.body || {};
    if (!nombre || !apellido || !mail || !contraseña) {
        return res.status(400).json({ message: "Faltan campos por llenar" });
    }
    try {
        const existingcomp = await CompradoresService.getCompradorByEmail(mail);
        if (existingcomp) {
            return res.status(400).json({ message: "El comprador ya existe" });
        }
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        await CompradoresService.createcomprador(nombre, apellido, mail, hashedPassword);
        res.status(201).json({ message: "Comprador creado con éxito" });
    } catch (error) {
        console.error('Error creating comprador:', error);
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
        const { mail, contraseña } = req.body;
    
        // Verificación de datos requeridos
        if (!mail || !contraseña) {
            return res.status(400).json({ message: "Email y contraseña requeridos" });
        }
    
        try {
            // Buscando al comprador y vendedor por email
            const comprador = await CompradoresService.getCompradorByEmail(mail);
            console.log("Comprador encontrado:", comprador);
            const vendedor = await vendedorServices.getVendedoresByEmail(mail);
            console.log("Vendedor encontrado:", vendedor);
    
            if (!comprador && !vendedor) {
                return res.status(400).json({ message: "Usuario no encontrado" });
            }
    
            // Verificando la contraseña
            if (comprador) {
                const isMatchcomprador = await bcrypt.compare(contraseña, comprador.contraseña);
                console.log("Contraseña coincide para comprador:", isMatchcomprador);

                if (!isMatchcomprador) {
                    return res.status(400).json({ message: "Contraseña incorrecta" });
                }
    
                // Generando token para comprador
                const tokencomprador = jwt.sign({ id: comprador.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
                console.log("Token comprador:", tokencomprador);
            }
            
            if (vendedor) {
                const isMatchvendedor = await bcrypt.compare(contraseña, vendedor.contraseña);
                console.log("Contraseña coincide para vendedor:", isMatchvendedor);

                if (!isMatchvendedor) {
                    return res.status(400).json({ message: "Contraseña incorrecta" });
                }
    
                // Generando token para vendedor
                const tokenvendedor = jwt.sign({ id: vendedor.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
                console.log("Token vendedor:", tokenvendedor);
            }
        } catch (error) {
            console.error('Error durante el login:', error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    };

export default { registervendedor, registercomp, login };
