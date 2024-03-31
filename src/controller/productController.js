const Product = require('../model/products');

const createProduct = async (req, res) => {
    try {
        const { name, category, price } = req.body;
        const newProduct = new Product({ name, category, price });
        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getProducts, createProduct };