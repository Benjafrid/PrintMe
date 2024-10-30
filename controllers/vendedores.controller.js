import VendedorServices from "../services/vendedor.service.js";
import { config } from "../dbconfig.js";
import pkg from "pg";
import vendedorServices from "../services/vendedor.service.js";
const { Client } = pkg;

const obtenervendedorID = async (req,res)=>{
    try {
        const {id} = req.params;
        const vendedor = await VendedorServices.obtenervendedorID(id);
        if (!vendedor) return res.status(404).send("No se encontro vendedor");

        res.json({vendedor: vendedor})
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updatevendedor = async (req, res) => {
    try {
        const {nombre_apellido, descripcion, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña, admin} = req.body;
        if (!nombre_apellido || !descripcion || !mail || !contraseña || !zona || !impresora_modelo || !impresora_materiales || !post_procesado || !admin) {
            return res.status(400).json({ message: "Faltan campos requeridos" });
        }
        const update = await VendedorServices.updatevendedor(nombre_apellido, descripcion, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña, admin);
        if (!update) return res.status(400).json({message: "no se pudo actualizar"});
        res.json({updated: update});

    } catch (error) {
        res.status(500).json({message: error.message})
    }
};
const deletevendedor = async (req, res) => {
    try {
        const {id} = req.params;
        const deletevend = await VendedorServices.deletevendedor(id)
        if (!deletevend) return res.status(400).json({message: "no se pudo eliminar"});
        res.json({deleted: deletevend});

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
const buscarVendedor = async (req, res) => {
    const termino = req.query.q; // Obtener el término de búsqueda desde la URL
    
    if (!termino) {
        return res.status(400).json({ message: "Se requiere un término de búsqueda." });
    }

    try {
        const vendedores = await vendedorServices.buscarVendedores(termino);
        if (vendedores.length === 0) {
            return res.status(404).json({ message: "No se encontraron vendedores." });
        }
        res.json({message: vendedores});
    } catch (error) {
        console.error(error); // Registrar el error
        res.status(500).json({ message: error.message });
    }
};



const VendedorController = {
    obtenervendedorID,
    updatevendedor,
    deletevendedor,
    buscarVendedor
}
export default VendedorController;