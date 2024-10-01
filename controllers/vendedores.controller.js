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

const updateComprador = async (req, res) => {
    try {
        const {nombre, apellido, mail, contraseña, id} = req.body;
        const update = await CompradoresService.updatecomprador(nombre, apellido, mail, contraseña, id)

        if (!update) return res.status(400).json({message: "non se pudo actualizar"});

        res.json({updated: update});

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
const deletecomprador = async (req, res) => {
    try {
        const {id} = req.body;
        const deletecom = await CompradoresService.deletecomprador(id)

        if (!deletecom) return res.status(400).json({message: "non se pudo actualizar"});

        res.json({deleted: deletecom});

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const CompradoresController = {
    obtenercompradoresID,
    updateComprador,
    deletecomprador
}
