import CompradoresService from "../services/comprador.service.js";


const obtenercompradoresID = async (req,res)=>{
    try {
        const {id} = req.params;
        const comprador = await CompradoresService.obtenercompradorID(id);
        if (!comprador) return res.status(404).send("No se encontro comprador");

        res.json({comprador: comprador})

    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
};

const updateComprador = async (req, res) => {
    try {
        const {nombre_apellido, mail, contraseña, id} = req.body;
        if (!nombre_apellido || !mail || !contraseña || !id) {
            return res.status(400).json({ message: "Faltan campos requeridos" });
        }
        console.log(req.body)
        const update = await CompradoresService.updatecomprador(nombre_apellido, mail, contraseña,id);
        if (!update) return res.status(400).json({message: "no se pudo actualizar"});
        res.json({updated: update});
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
const deletecomprador = async (req, res) => {
    try {
        const {id} = req.params;
        const deletecom = await CompradoresService.deletecomprador(id);
        console.log(deletecom);
        if (!deletecom) return res.status(400).json({message: "no se pudo eliminar"});

        res.json({deleted: deletecom});

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const getCompradores = async (_, res) => {
    try {
        const compradores = await CompradoresService.getAllcompradores();
        
        if (!compradores || compradores.length === 0) {
            return res.status(404).json({ message: "No se encontraron compradores" });
        }

        console.log("Compradores obtenidos:", compradores);
        res.status(200).json({ compradores, message: 'Obtenidos con éxito' });
    } catch (error) {
        console.error("Error en el controlador getCompradores:", error.message);
        res.status(500).json({ message: "Error al obtener compradores", error: error.message });
    }
};

const CompradoresController = {
    obtenercompradoresID,
    updateComprador,
    deletecomprador,
    getCompradores
}

export default CompradoresController;