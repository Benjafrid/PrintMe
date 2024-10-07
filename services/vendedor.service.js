import { config } from "../dbconfig.js";
import pkg from "pg";
const { Client } = pkg;

const getVendedoresByEmail = async (mail) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            "SELECT * FROM usuarios WHERE mail = $1",
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
    const vendedor = await client.query("SELECT * FROM comprador WHERE id = $1", [id])
if (vendedor.rows.lenght > 0){
  return vendedor;
} else{
    return null;
}
};

const updatevendedor = async (nombre, apellido, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña ) => {
    const client = new Client(config);
    await client.connect();
   const result= await client.query("UPDATE vendedor SET nombre = $2, apellido = $3, mail = $4, zona = $5, impresora_modelo = $6, impresora_materiales = $7, post_procesado = $8, contraseña = $9 WHERE id = $1 RETURNING*", [nombre, apellido, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña]);
    if (result.rows.length > 0) {
        return result;
    } else {
        return null;
    }
};
const createvendedor = async (nombre, apellido, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña) => {
    const client = new Client(config);
    await client.connect();
    const createvend = await client.query("INSERT INTO vendedor (nombre, apellido, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña) VALUES ($1, $2, $3, $4,$5,$6,$7,$8,$9) RETURNING*", [nombre, apellido, mail, zona, impresora_modelo, impresora_materiales, post_procesado, contraseña]);
    if (createvend.rows.lenght > 0){
      return createvend;
    } else{
        return null;
    }
};

const deletevendedor = async (req, res) => {
    const client = new Client(config);
    await client.connect();
    const result = await Client.query("DELETE FROM vendedor WHERE id = $1 RETURNING* ", [id]);
    if (result.rows.length > 0) {
        return result;
    } else {
        return null;
    }
};

const vendedorServices = {
    getvendedor,
    obtenervendedorID,
    updatevendedor,
    deletevendedor,
    getVendedoresByEmail,
    createvendedor
};

export default vendedorServices;