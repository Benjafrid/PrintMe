import { config } from "../dbconfig.js";
import pkg from "pg";
const { Client } = pkg;

const getVendedoresByEmail = async (mail) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            "SELECT * FROM vendedor WHERE mail = $1",
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


const getvendedor = async () => {
    const client = new Client(config);
    await client.connect();
    try {
        const rows = await client.query("SELECT * FROM vendedor")

        res.json(rows[0])
        res.send("vendedor obtenido con éxito");
    } catch (error) {
        console.error('Error al obtener vendedor:', err);
        return res.status(500).json({ Error: 'Error al obtener vendedor' });
    }
}

const obtenervendedorID = async (id) => {
    const client = new Client(config);
    await client.connect();
    const vendedor = await client.query("SELECT * FROM vendedor WHERE id = $1", [id])
    if (vendedor.rows.lenght < 0) {
        return null;
    }
    else {
        return vendedor.rows[0];
    }
};


const updatevendedor = async (nombre_apellido, descripcion, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña, admin, numero_telefonico) => {
    const client = new Client(config);
    await client.connect();
   const result= await client.query(
    'UPDATE vendedor SET (nombre_apellido, descripcion, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña, admin, numero_telefonico) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)', 
    [nombre_apellido, descripcion, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña, admin, numero_telefonico]);
    if (result.rows.length > 0) {
        return result;
    } else {
        return null;
    }
};
const createvendedor = async (nombre_apellido, descripcion, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña, numero_telefonico) => {
    const client = new Client(config);
    await client.connect();

    try {
        const query = `
            INSERT INTO vendedor (nombre_apellido, descripcion, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña, numero_telefonico, admin)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true) 
            RETURNING *`;
        
        const values = [nombre_apellido, descripcion, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña, numero_telefonico];
        
        // Realiza la inserción
        const createvend = await client.query(query, values);

        // Si la inserción tiene éxito, devuelve el registro creado
        if (createvend.rowCount > 0) {
            return createvend.rows[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error al crear vendedor:', error);
        throw error;
    } finally {
        await client.end();
    }
};



const deletevendedor = async (id) => {
    const client = new Client(config);
    await client.connect();
    const result = await client.query("DELETE FROM vendedor WHERE id = $1 RETURNING* ", [id]);
    if (result.rows.length > 0) {
        return result.rows[0];
    }
    else {
        return null;
    }
};
 
const buscarVendedores = async (termino) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            'SELECT nombre_apellido, descripcion FROM vendedor WHERE nombre_apellido ILIKE $1 OR descripcion ILIKE $1',
            [`%${termino}%`] // Utiliza ILIKE para búsqueda insensible a mayúsculas
        );
        
        console.log("Resultados encontrados:", rows); // Imprime los resultados

        await client.end();
        return rows;
    } catch (error) {
        console.error("Error en la consulta de búsqueda:", error); // Log de errores
        await client.end();
        throw error;
    }
};



const vendedorServices = {
    getvendedor,
    obtenervendedorID,
    updatevendedor,
    deletevendedor,
    getVendedoresByEmail,
    createvendedor,
    buscarVendedores
};

export default vendedorServices;