import { config } from "../dbconfig.js";
import pkg from "pg";
const { Client } = pkg;

const getProductos = async () => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query("SELECT * FROM productos");

        await client.end();
        return rows;
    } catch (error) {
        await client.end();
        throw error;
    }
};

const getProductoById = async (id) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            "SELECT * FROM productos WHERE id = $1",
            [id]
        );
        if (rows.length < 1) return null;

        await client.end();
        return rows[0];
    } catch (error) {
        await client.end();
        throw error;
    }
};

const createProducto = async (nombre, precio, descripcion) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            "INSERT INTO productos (nombre, precio, descripcion) VALUES ($1, $2, $3)",
            [nombre, precio, descripcion]
        );

        await client.end();
        return rows;
    } catch (error) {
        await client.end();
        throw error;
    }
};

const updateProducto = async (id, nombre, precio, descripcion) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            "UPDATE platos SET nombre = $1, precio = $2, descripcion = $3 WHERE id = $4",
            [nombre, precio, descripcion, id]
        );

        await client.end();
        return rows;
    } catch (error) {
        await client.end();
        throw error;
    }
};

const deleteProducto = async (id) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            "DELETE FROM productos WHERE id = $1",
            [id]
        );

        await client.end();
        return rows;
    } catch (error) {
        await client.end();
        throw error;
    }
};

const productosService = {
    getProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto
};

export default productosService;