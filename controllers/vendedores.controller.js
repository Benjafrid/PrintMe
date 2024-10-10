import VendedorServices from "../services/vendedor.service.js";

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
        const {nombre, apellido, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña, id} = req.body;
        if (!nombre || !apellido || !mail || !contraseña || !id || !zona || !impresora_modelo || !impresora_materiales || !post_procesado) {
            return res.status(400).json({ message: "Faltan campos requeridos" });
        }
        const update = await VendedorServices.updatevendedor(nombre, apellido, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña,id);
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

const VendedorController = {
    obtenervendedorID,
    updatevendedor,
    deletevendedor
}
export default VendedorController;