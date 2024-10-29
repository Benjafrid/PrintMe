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


const getvendedor = async (_, res) => {
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


const updatevendedor = async (nombre, apellido, descripcion, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña, id, admin) => {
    const client = new Client(config);
    await client.connect();
   const result= await client.query(
    'UPDATE vendedor SET nombre = $1, apellido = $2, descripcion = $3 email = $4, zona = $5, impresora_modelo = $6, impresora_materiales = $7, post_procesado = $8, contraseña = $9, admin = false WHERE id = $11 RETURNING*', 
    [nombre, apellido, descripcion, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña, admin, id]);
    if (result.rows.length > 0) {
        return result;
    } else {
        return null;
    }
};
const createvendedor = async (nombre, apellido, descripcion, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña) => {
    const client = new Client(config);
    await client.connect();
    const createvend = await client.query('INSERT INTO vendedor (nombre, apellido, descripcion, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña, admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)', [nombre, apellido, descripcion, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña]);
    if (createvend.rowCount > 0) {
        return createvend.rows[0];
    } else {
        return null;
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
            'SELECT nombre, descripcion FROM vendedor WHERE nombre ILIKE $1 OR descripcion ILIKE $1',
            [`%${termino}%`]
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