import { config } from "../dbconfig.js";
import pkg from "pg";
const { Client } = pkg;

const getProductoByPedido = async (id_producto) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            "SELECT * FROM pedidos_producto WHERE id_productos = $1",
            [id_producto]
        );

        if (rows.length < 1) throw new Error("Pedido no encontrado");

        const result = await Promise.all(
            rows.map(async (producto) => {
                const { rows } = await client.query(
                    "SELECT * FROM pedidos WHERE id_productos = $1",
                    [producto.id_productos]
                );

                if (rows.length < 1) throw new Error("Producto no encontrado");

                return {
                    ...rows[0],
                };
            })
        );

        await client.end();
        return result;
    } catch (error) {
        await client.end();
        throw error;
    }
};

const Getpedidos = async (id_pedidos) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query("SELECT * FROM pedidos",[id_pedidos]);

        if (rows.length < 1) return [];

        const result = await Promise.all(
            rows.map(async (productos) => {
                const producto = await getProductoByPedido(productos.id);
                return {
                    ...producto,
                };
            })
        );

        await client.end();
        return result;
    } catch (error) {
        await client.end();
        throw error;
    }
};

const getPedidoById = async (id_pedidos) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            "SELECT * FROM pedidos WHERE id = $1",
            [id_pedidos]
        );

        if (rows.length < 1) return null;

        const result = rows[0];

        result.producto = await getProductoByPedido(id_producto);

        await client.end();
        return result;
    } catch (error) {
        await client.end();
        throw error;
    }
};

const getProductoByUser = async (id_comprador) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            "SELECT * FROM pedidos WHERE id_comprador = $1",
            [id_comprador]
        );

        if (rows.length < 1) return [];

        const result = await Promise.all(
            rows.map(async (producto) => {
                const pedido = await getProductoByPedido(producto.id);
                return {
                    ...producto,
                    pedido,
                };
            })
        );

        await client.end();
        return result;
    } catch (error) {
        await client.end();
        throw error;
    }
};

const createPedido = async (id_comprador, producto) => {
    const client = new Client(config);
    await client.connect();

    try {
        // Validar que los platos existan
        for (let producto of producto) {
            const { rows } = await client.query(
                "SELECT * FROM pedidos WHERE id = $1",
                [producto.id]
            );

            if (rows.length < 1) {
                await client.end();
                throw new Error("Plato no encontrado");
            }
        }

        // Crear el pedido
        const { rows } = await client.query(
            "INSERT INTO pedidos (id_comprador, fecha, estado) VALUES ($1, $2, 'pendiente') RETURNING id",
            [id_comprador, new Date()]
        );

        const idPedido = rows[0].id;
        await client.end();
        return { id: idPedido };
    } catch (error) {
        await client.end();
        throw error;
    }
};

const updatePedido = async (id, estado) => {
    if (
        estado !== "aceptado" &&
        estado !== "en camino" &&
        estado !== "entregado"
    )
        throw new Error("Estado inválido");

    const client = new Client(config);
    await client.connect();

    try {
        const { rowCount } = await client.query(
            "UPDATE pedidos SET estado = $1 WHERE id = $2",
            [estado, id]
        );

        if (rowCount === 0) throw new Error("Pedido no encontrado");

        await client.end();
        return { message: "Pedido actualizado con éxito" };
    } catch (error) {
        await client.end();
        throw error;
    }
};

const deletePedido = async (id) => {
    const client = new Client(config);
    await client.connect();

    try {
        // Primero eliminar los platos del pedido
        await client.query(
            "DELETE FROM pedidos_producto WHERE id_producto = $1",
            [id]
        );

        // Luego eliminar el pedido
        const { rowCount } = await client.query(
            "DELETE FROM pedidos WHERE id = $1",
            [id]
        );

        if (rowCount === 0) throw new Error("Pedido no encontrado");

        await client.end();
        return { message: "Pedido eliminado con éxito" };
    } catch (error) {
        await client.end();
        throw error;
    }
};

const pedidosService = {
    getPedidoById,
    getProductoByPedido,
    getProductoByUser,
    Getpedidos,
    createPedido,
    updatePedido,
    deletePedido
};
export default pedidosService;