import VendedorServices from "../services/vendedor.service.js";


const obtenervendedorID = async (req,res)=>{
    try {
        const {id} = req.params.id;
        const comprador = await VendedorServices.obtenervendedorID(id);
        if (!comprador) return res.status(404).send("No se encontro comprador");

        res.json({comprador: comprador})
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updatevendedor = async (req, res) => {
    try {
        const {nombre, apellido, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña,id} = req.body;
        const update = await VendedorServices.updatecomprador(nombre, apellido, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña,id)

        if (!update) return res.status(400).json({message: "no se pudo actualizar"});

        res.json({updated: update});

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
const deletevendedor = async (req, res) => {
    try {
        const {id} = req.body;
        const deletevend = await VendedorServices.deletecomprador({id})

        if (!deletevend) return res.status(400).json({message: "no se pudo actualizar"});

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