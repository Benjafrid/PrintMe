import pedidosService from "../services/pedidos.service";

const getPedidos = async (_, res) => {
    try {
        const pedidos = await pedidosService.getPedidos(id_pedidos);
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPedidosByUser = async (req, res) => {
    const userId = req.params;

    try {
        const pedidos = await pedidosService.getProductoByUser(userId);
        if (pedidos.length == 0) return res.json([]);
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPedidoById = async (req, res) => {
    const { id } = req.params;

    try {
        const pedido = await pedidosService.getPedidoById(id);
        if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPedido = async (req, res) => {
    const { platos } = req.body;

    if (!platos || !Array.isArray(platos) || platos.length === 0 || !platos.every(p => p.id && p.cantidad))
        return res.status(400).json({ message: "Datos del pedido incorrectos" });

    try {
        const userId = req.user.id;
        await PedidosService.createPedido(userId, platos);
        res.status(201).json({ message: "Pedido creado con éxito" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const aceptarPedido = async (req, res) => {
    const { id } = req.params;

    try {
        const pedido = await pedidosService.getPedidoById(id);
        if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });
        if (pedido.estado !== "pendiente") return res.status(400).json({ message: "Pedido no está en estado pendiente" });

        await pedidosService.updatePedido(id, "aceptado");
        res.json({ message: "Pedido aceptado con éxito" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const comenzarPedido = async (req, res) => {
    const { id } = req.params;

    try {
        const pedido = await pedidosService.getPedidoById(id);
        if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });
        if (pedido.estado !== "aceptado") return res.status(400).json({ message: "Pedido no está en estado aceptado" });

        await pedidosService.updatePedido(id, "en camino" );
        res.json({ message: "Pedido en camino" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const entregarPedido = async (req, res) => {
    const { id } = req.params;

    try {
        const pedido = await pedidosService.getPedidoById(id);
        if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });
        if (pedido.estado !== "en camino") return res.status(400).json({ message: "Pedido no está en camino" });

        await pedidosService.updatePedido(id, "entregado" );
        res.json({ message: "Pedido entregado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePedido = async (req, res) => {
    const { id } = req.params;

    try {
        const pedido = await pedidosService.getPedidoById(id);
        if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });

        await pedidosService.deletePedido(id);
        res.json({ message: "Pedido eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 const pedidosControllers = {
    getPedidos,
    getPedidosByUser,
    getPedidoById,
    createPedido,
    aceptarPedido,
    comenzarPedido,
    entregarPedido,
    deletePedido,
};

export default pedidosControllers;