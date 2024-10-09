import { config } from "../dbconfig.js";
import pkg from "pg";
const { Client } = pkg;

const getCompradorByEmail = async (mail) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            "SELECT * FROM comprador WHERE mail = $1",
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
    const client = new Client(config);
    await client.connect();
    try {
        const {rows, _} = await client.query("SELECT * FROM comprador")

        res.status(200).json({compradores: rows, message: 'Obtenidos con exito'})
    } catch (error) {
        console.error('Error al obtener comprador:', error);
        return res.status(500).json({ Error: 'Error al obtener comprador' });
    }
}
const obtenercompradorID = async (id) => {
    const client = new Client(config);
    await client.connect();
    const usuario = await client.query("SELECT * FROM comprador WHERE id = $1", [id])
    if (usuario.rows.lenght < 0) {
        return null;
    }
    else {
        return usuario.rows[0];
    }
}

const createcomprador = async (nombre, apellido, mail, contraseña) => {
    const client = new Client(config);
    await client.connect();
    const createusu = await client.query("INSERT INTO comprador (nombre, apellido, mail, contraseña) VALUES ($1, $2, $3, $4) RETURNING*", [nombre, apellido, mail, contraseña]);
    if (createusu.rows.lenght > 0){
      return createusu;
    } else{
        return null;
    }
};

const updatecomprador = async (nombre, apellido, mail, contraseña, id) => {
    const client = new Client(config);
    await client.connect();
        const result = await client.query(
        'UPDATE comprador SET nombre = $1, apellido = $2, mail = $3, contraseña = $4 WHERE id = $5 RETURNING *',
        [nombre, apellido, mail, contraseña, id]
    );

    console.log(result);

    if (result.rowCount > 0) {
        return result.rows[0];
    } else {
        return null;
    }
};


const deletecomprador = async (id) => {
    const client = new Client(config);
    await client.connect();
    const result = await client.query("DELETE FROM comprador WHERE id = $1 RETURNING* ", [id]);
    if (result.rows.length > 0) {
        return result;
    }
    else {
        return null;
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