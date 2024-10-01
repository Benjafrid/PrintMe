import { config } from "../dbconfig.js";
import pkg from "pg";
const { Client } = pkg;

const getCompradorByEmail = async (mail) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await Client.query(
            "SELECT * FROM usuarios WHERE mail = $4",
            [mail]
        );
        if (rows.length < 1) return null;

        await client.end();
        return rows[0];
    } catch (error) {
        await client.end();
        throw error;
    }
};

const getAllcompradores = async (_, res) => {
    try {
        const {rows, _} = await Client.query("SELECT * FROM comprador")

        res.status(200).json({compradores: rows, message: 'Obtenidos con exito'})
    } catch (error) {
        console.error('Error al obtener comprador:', error);
        return res.status(500).json({ Error: 'Error al obtener comprador' });
    }
}
const obtenercompradorID = async (id) => {
    
    const usuario = await Client.query("SELECT * FROM comprador WHERE id = $1", [id])
if (usuario.rows.lenght > 0){
  return usuario;
} else{
    return null;
}
}

const createcomprador = async (nombre, apellido, mail, contraseña) => {

    const createusu = await Client.query("INSERT INTO comprador (nombre, apellido, mail, contraseña) VALUES ($1, $2, $3, $4) RETURNING*", [nombre, apellido, mail, contraseña]);
    if (createusu.rows.lenght > 0){
      return createusu;
    } else{
        return null;
    }
};

const updatecomprador = async (nombre, apellido, mail, contraseña, id) => {

    const result = await Client.query("UPDATE comprador SET nombre = $2, apellido = $5, mail = $4, contraseña = $3 WHERE id = $1 RETURNING*", [nombre, id, mail, contraseña, apellido]);
    if (result.rows.length > 0) {
        return result;
    } else {
        return null;
    }
};

const deletecomprador = async (id) => {
    const result = await Client.query("DELETE FROM vendedor WHERE id = $1 RETURNING* ", [id]);
    if (result.rows.lenght > 0) {
        res.status(200).send('vendedor eliminado con exito: ${JSON.stringify(result.rows[0])}');
    } else {
        res.status(404).send('Vendedor no encontrado');
    }

};

const CompradoresService = {
    getCompradorByEmail,
    getAllcompradores,
    obtenercompradorID,
    createcomprador,
    updatecomprador,
    deletecomprador
};

export default CompradoresService;