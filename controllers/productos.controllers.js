import productosService from "../services/productos.service.js";
import cloudinary from '../upload.js';

const getProductos = async (_, res) => {
    try {
        const productos = await productosService.getProductos();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductoById = async (req, res) => {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Se necesita un ID" });

    try {
        const plato = await productosService.getProductoById(id);
        if (!plato)
            return res.status(404).json({ message: "Producto no encontrado" });
        res.json(plato);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProducto = async (req, res) => {
    const  producto = req.body;

    if (!producto)
        return res.status(400).json({ message: "Se necesita un producto" });

    if (!producto.nombre || !producto.precio || !producto.description)
        return res.status(400).json({ message: "Faltan campos por llenar" });

    try {
        await productosService.createProducto(producto);
        res.json({ message: "Producto creado con éxito" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }


};

const updateProducto = async (req, res) => {
    const { id, nombre, precio, description } = req.body;
    const productos = req.body;

    if (!id || !productos)
        return res
            .status(400)
            .json({ message: "Se necesita un ID y un plato" });

    if (!productos.nombre || !productos.precio || !productos.description || !productos.id)
        return res.status(400).json({ message: "Faltan campos por llenar" });

    try {
        await productosService.updateProducto(id, nombre, precio, description);
        res.json({ message: "Producto actualizado con éxito" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProductos = async (req, res) => {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Se necesita un ID" });

    try {
        await productosService.deleteProducto(id);
        res.json({ message: "Producto eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const uploadProducto = async(req,res)=>{
    const foto = req.files?.foto?.[0] || null;

    console.log('Foto del producto:', foto);

    // Validar que la foto fue cargada
    if (!foto) {
      return res.status(400).json({ error: 'Se requiere una foto.' });
    }

      const fotoFile = foto[0];

      // Validar la extensión de la foto y del certificado
      const extensionesPermitidas = ['png', 'jpeg', 'jpg'];
      const extensionFoto = fotoFile.originalname.split('.').pop().toLowerCase();
      const extensionCertificado = certificadoFile.originalname.split('.').pop().toLowerCase();

      if (!extensionesPermitidas.includes(extensionFoto) || extensionCertificado !== 'pdf') {
        return res.status(400).send('Error: Extensiones no permitidas. La foto debe ser PNG, JPEG o JPG y el certificado debe ser PDF.');
      }
}

const productosControllers = {
    getProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProductos,
    uploadProducto
};

export default productosControllers;