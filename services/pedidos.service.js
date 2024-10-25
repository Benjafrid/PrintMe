import { config } from "../dbconfig.js";
import pkg from "pg";
const { Client } = pkg;

const getProductoByPedido = async (idPedido) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            "SELECT * FROM pedidos_productos WHERE id_pedido = $1",
            [idPedido]
        );

        // Verificar si no hay productos relacionados con el pedido
        if (rows.length === 0) throw new Error("Pedido no encontrado");

        const result = await Promise.all(
            rows.map(async (producto) => {
                const { rows: productoRows } = await client.query(
                    "SELECT * FROM productos WHERE id = $1",
                    [producto.id_producto]
                );


                if (productoRows.length === 0) throw new Error("Producto no encontrado");

                return {
                    ...productoRows[0],
                    cantidad: producto.cantidad,
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

const getPedidos = async () => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query("SELECT * FROM pedidos");

        if (rows.length < 1) return [];
        console.log(rows);

        const result = await Promise.all(
            rows.map(async (pedido) => {
                const pedidos = await getProductoByPedido(pedido.id);
                return {
                    ...pedido,
                    pedidos,
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

const getPedidoById = async (id) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            "SELECT * FROM pedidos WHERE id = $1",
            [id]
        );

        if (rows.length < 1) return null;

        const result = rows[0];

        result.producto = await getProductoByPedido(id);

        await client.end();
        return result;
    } catch (error) {
        await client.end();
        throw error;
    }
};

const getPedidosByUser = async (idUsuario) => {
    const client = new Client(config);
    await client.connect();

    try {
        // Obtener los pedidos del usuario
        const { rows: pedidos } = await client.query(
            "SELECT * FROM pedidos WHERE id_vendedor = $1",
            [idUsuario]
        );

        if (pedidos.length === 0) return []; // Si no hay pedidos, retornar un array vacío

        // Obtener los productos para cada pedido
        const result = await Promise.all(
            pedidos.map(async (pedido) => {
                const productos = await getProductoByPedido(pedido.id);
                return {
                    ...pedido,
                    productos, // Agregar los productos al pedido
                };
            })
        );

        return result;
    } catch (error) {
        throw error; // Re-lanzar el error para ser manejado fuera del servicio
    } finally {
        await client.end(); // Asegurar el cierre de la conexión en finally
    }
};

const createPedido = async (idUsuario, productos) => {
    const client = new Client(config);
    await client.connect();

    try {
        // Validar que los productos existan
        for (let producto of productos) {
            const { rows } = await client.query(
                "SELECT * FROM productos WHERE id = $1",
                [producto.id] 
            );

            if (rows.length < 0) {
                throw new Error(`Producto con id ${producto.id} no encontrado`);
            }
        }

        // Crear el pedido
        const { rows } = await client.query(
            "INSERT INTO pedidos (id_vendedor, fecha, estado) VALUES ($1, $2, 'aceptado') RETURNING id",
            [idUsuario, new Date()]
        );

        const idPedido = rows[0].id;

        // Agregar los productos al pedido
        for (let producto of productos) {
            await client.query(
                "INSERT INTO pedidos_productos (id_pedido, id_producto, cantidad) VALUES ($1, $2, $3)",
                [idPedido, producto.id, producto.cantidad]
            );
        }

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
            "DELETE FROM pedidos_producto WHERE id_pedido = $1",
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
    getPedidos,
    getPedidoById,
    getPedidosByUser,
    createPedido,
    updatePedido,
    deletePedido,
    getProductoByPedido
};
export default pedidosService;
