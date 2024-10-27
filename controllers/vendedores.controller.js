import VendedorServices from "../services/vendedor.service.js";
import { config } from "../dbconfig.js";
import pkg from "pg";
const { Client } = pkg;

const obtenervendedorID = async (req,res)=>{
    try {
        const {id} = req.params;
        const vendedor = await VendedorServices.obtenervendedorID(id);
        if (!vendedor) return res.status(404).send("No se encontro comprador");

        res.json({vendedor: vendedor})
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updatevendedor = async (req, res) => {
    try {
        const {nombre, descripcion, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña, id, admin} = req.body;
        if (!nombre || !descripcion || !mail || !contraseña || !id || !zona || !impresora_modelo || !impresora_materiales || !post_procesado || !admin) {
            return res.status(400).json({ message: "Faltan campos requeridos" });
        }
        const update = await VendedorServices.updatevendedor(nombre, descripcion, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña, id, admin);
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
const buscarVendedores = async (req, res) => {
    const termino = req.query.q; //obtiene el valor del parámetro de consulta q que se envía en la URL de la solicitud, algo típico en las búsquedas
    if (!termino) return res.status(400).json({ message: "El término de búsqueda es requerido" });

    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            `SELECT nombre, descripcion FROM vendedor WHERE nombre ILIKE $1 OR descripcion ILIKE $1`,
            [`%${termino}%`] // ILIKE no distingue entre mayúsculas y minúsculas.
        );

        await client.end();

        if (rows.length === 0) return res.json({ message: "No se encontraron resultados" });

        res.json(rows);
    } catch (error) {
        console.error("Error en la búsqueda:", error);
        await client.end();
        res.status(500).json({ message: "Error al realizar la búsqueda" });
    }
};


const VendedorController = {
    obtenervendedorID,
    updatevendedor,
    deletevendedor,
    buscarVendedores
}
export default VendedorController;