import vendedorServices from "../services/vendedor.service.js";
import CompradoresService from "../services/comprador.service.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config"; 

const registervendedor = async (req, res) => {
    const { nombre, apellido, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña} = req.body || {};
    if (!nombre || !apellido || !mail || !contraseña || !zona || !impresora_modelo || !impresora_materiales || !post_procesado) {
        return res.status(400).json({ message: "Faltan campos por llenar" });
    }
    try {
        const existingUser = await vendedorServices.getVendedoresByEmail(mail);
        if (existingUser) {
            return res.status(400).json({ message: "El vendedor ya existe" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await vendedorServices.createvendedor({ nombre, apellido, mail, password: hashedPassword });
        res.status(201).json({ message: "vendedor creado con éxito" });
    } catch (error) {
        console.error('Error creating user:', error); 
        res.status(500).json({ message: error.message });
    }
};

const registercomp = async (req, res) => {
    const { nombre, apellido, mail, contraseña} = req.body || {};
    if (!nombre || !apellido || !mail || !contraseña ) {
        return res.status(400).json({ message: "Faltan campos por llenar" });
    }
    try {
        const existingcomp = await compradorServices.getCompradorByEmail(mail);
        if (existingcomp) {
            return res.status(400).json({ message: "El comprador ya existe" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await compradorServices.createcomprador({ nombre, apellido, mail, contraseña: hashedPassword });
        res.status(201).json({ message: "comprador creado con éxito" });
    } catch (error) {
        console.error('Error creating user:', error); 
        res.status(500).json({ message: error.message });
    }
};


const login = async (req, res) => {
    const { mail, contraseña } = req.body;
    if (!mail || !contraseña) {
        return res.status(400).json({ message: "Email y password requeridos" });
    }
    try {
        const comprador = await CompradoresService.getCompradorByEmail(mail);
        if (!comprador) {
            return res.status(400).json({ message: "comprador no encontrado" });
        }
        const vendedor = await vendedorServices.getVendedoresByEmail(mail);
        if(!vendedor){
            return res.status(400).json({ message: "vendedor no encontrado" });
        }

        const isMatchcomprador = await bcrypt.compare(contraseña, comprador.contraseña);
        if (!isMatchcomprador) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }
        const isMatchvendedor = await bcrypt.compare(contraseña, vendedor.contraseña);
        if (!isMatchvendedor) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }
        const tokenvendedor = jwt.sign({ id: vendedor.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const tokencomprador = jwt.sign({ id: vendedor.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ comprador,vendedor, tokenvendedor,tokencomprador });
    } catch (error) {
        console.error('Error during login:', error); 
        res.status(500).json({ message: error.message });
    }
};


export default { registervendedor, registercomp, login };