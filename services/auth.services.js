import UsuariosService from "../services/vendedor.services.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "./dbconfig.js"; 
import comprador from "./comprador.js";
import vendedorServices from "../services/vendedor.services.js";
import compradorServices from "../services/comprador.services.js";

const registercomprador = async (req, res) => {
    const { nombre, apellido, mail, contraseña} = req.body || {};
    if (!nombre || !apellido || !mail || !contraseña) {
        return res.status(400).json({ message: "Faltan campos por llenar" });
    }

    try {
        const existingcomprador = await compradorServices.getCompradorByEmail(mail);
        if (existingcomprador) {
            return res.status(400).json({ message: "El comprador ya existe" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await compradorServices.query("INSERT INTO public.comprador nombre,apellido,mail,contraseña VALUES ($2,$3,$4,$5)");
        const hashed = await compradorServices.createComprador({ nombre, apellido, mail, contraseña: hashedPassword });
        res.status(201).json({ message: "Usuario creado con éxito" });
    } catch (error) {
        console.error('Error creating user:', error); 
        res.status(500).json({ message: error.message });
    }
};

const registervendedor = async (req, res) => {
    const { nombre, apellido, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña} = req.body || {};
    if (!nombre || !apellido || !mail || !contraseña || !zona || !impresora_modelo || !impresora_materiales || !post_procesado) {
        return res.status(400).json({ message: "Faltan campos por llenar" });
    }

    try {
        const existingvendedor = await vendedorServices.getCompradorByEmail(mail);
        if (existingvendedor) {
            return res.status(400).json({ message: "El vendedor ya existe" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await vendedorServices.query("INSERT INTO public.vendedor nombre, apellido, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña VALUES ($2,$3,$4,$5,$6,$7,$8)");
        const hashed = await vendedorServices.createComprador({ nombre, apellido, mail, contraseña: hashedPassword });
        res.status(201).json({ message: "Usuario creado con éxito" });
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
        let checkUser;
        checkUser = await client.query("SELECT * FROM public.vendedor WHERE mail= $1",[vendedor]);

        if(!checkUser.rows.length){
            checkUser = await client.query("SELECT * FROM public.comprador WHERE mail = $1", [comprador]);
        }
        const vendedor = await UsuariosService.getVendedorByEmail(mail);
        if (!vendedor) {
            return res.status(400).json({ message: "Vendedor no encontrado" });
        }
        if(!checkUser.rows.length){
            return res.status(404).send("Usuario no encontrado");
        }
        
        const isMatch = await bcrypt.compare(contraseña, vendedor.contraseña);
        if (!isMatch) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }
        const token = jwt.sign({ id: vendedor.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ vendedor, token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: error.message });
    }
};

export default { registercomprador, login, registervendedor };