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

const getAllcompradores = async () => {
    const client = new Client(config); 
    await client.connect();

    try {
        const { rows } = await client.query("SELECT * FROM comprador");
        console.log("Datos obtenidos:", rows); // Log para verificar los datos obtenidos
        return rows;
    } catch (error) {
        console.error('Error al obtener compradores:', error);
        throw new Error('Error al obtener compradores');
    } finally {
        await client.end();
    }
};

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

const createcomprador = async (nombre_apellido, mail, contraseña) => {
    const client = new Client(config);
    
    try {
        console.log("Intentando conectar a la base de datos...");
        await client.connect();
        console.log("Conectado a la base de datos");

        // Insertar y devolver el registro si se crea exitosamente
        const query = 'INSERT INTO comprador (nombre_apellido, mail, contraseña) VALUES ($1, $2, $3) RETURNING *';
        const values = [nombre_apellido, mail, contraseña];

        const createusu = await client.query(query, values);
        if (createusu.rows.length > 0) {
            console.log("Registro creado exitosamente:", createusu.rows[0]); // Confirmación del registro creado
            return createusu.rows[0];
        } else {
            console.log("No se logró insertar el registro.");
            return null;
        }
    } catch (error) {
        console.error('Error al crear comprador:', error.message);
        throw new Error(`Error en la inserción: ${error.message}`);
    } finally {
        try {
            await client.end(); // Cerrar la conexión
            console.log("Conexión a la base de datos cerrada.");
        } catch (closeError) {
            console.error("Error al cerrar la conexión:", closeError.message);
        }
    }
};


const updatecomprador = async (nombre_apellido, mail, contraseña, id) => {
    const client = new Client(config);
    await client.connect();
        const result = await client.query(
        'UPDATE comprador SET nombre_apellido = $1, mail = $2, contraseña = $3 WHERE id = $4 RETURNING *',
        [nombre_apellido, mail, contraseña, id]
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