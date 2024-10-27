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

const createProducto = async (productos) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            "INSERT INTO productos (nombre, precio, description) VALUES ($1, $2, $3)", [productos.nombre, productos.precio, productos.description]
        );

        await client.end();
        return rows;
    } catch (error) {
        await client.end();
        throw error;
    }
};

const updateProducto = async (id, nombre, precio, description) => {
    const client = new Client(config);
    await client.connect();

    try {
        // Verificar si el producto existe antes de actualizar
        const { rows: existingRows } = await client.query(
            "SELECT * FROM productos WHERE id = $1",
            [id]
        );

        if (existingRows.length === 0) {
            throw new Error("Producto no encontrado");
        }

        // Realizar la actualización
        const { rowCount } = await client.query(
            "UPDATE productos SET nombre = $1, precio = $2, description = $3 WHERE id = $4",
            [nombre, precio, description, id]
        );

        await client.end();

        // Verificar si se actualizó al menos un registro
        if (rowCount === 0) {
            return { message: "No se realizaron cambios en el producto" };
        }

        return { message: "Producto actualizado con éxito" };
    } catch (error) {
        await client.end();
        throw error;
    }
};



const deleteProducto = async (id) => {
    const client = new Client(config);
    await client.connect();

    try {
        // Primero elimina las referencias en pedidos_productos
        await client.query(
            "DELETE FROM pedidos_productos WHERE id_producto = $1",
            [id]
        );

        // Luego elimina el producto
        const result = await client.query(
            "DELETE FROM productos WHERE id = $1",
            [id]
        );

        await client.end();

        if (result.rowCount === 0) {
            return { message: "Producto no encontrado" };
        }

        return { message: "Producto eliminado con éxito" };
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