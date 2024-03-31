const User = require('../model/user');
const Product = require('../model/products');
const Cart = require('../model/cart');


const addCartProducts = async (req, res) => {
    try {
        const { _id: productId, quantity } = req.body;

        // Find the user by ID
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find the cart entry for the user
        let cartEntry = await Cart.findOne({ user: user._id });

        // If the cart entry doesn't exist, create a new one
        if (!cartEntry) {
            cartEntry = new Cart({
                user: user._id,
                products: [{ product: product._id, quantity: quantity }]
            });
        } else {
            // Check if the product already exists in the cart
            const existingProduct = cartEntry.products.find(item => item.product.equals(product._id));
            if (existingProduct) {
                existingProduct.quantity += 1; // Increase the quantity if the product already exists
            } else {
                cartEntry.products.push({ product: product._id, quantity: quantity }); // Add the product to the cart
            }
        }

        // Save the cart entry to the database
        await cartEntry.save();

        res.status(201).json({ status: 201, message: 'Product added to cart' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const removeProduct = async (req, res) => {
    try {
        const productId = req.body._id;
        console.log(req.user);
        const cart = await Cart.findOne({ user: req.user.id });
        console.log(productId, cart);
        cart.products = cart.products.filter(item => item.product.toString() !== productId);
        await cart.save();
        res.json({ status: 200, message: 'Product removed from cart' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const userAddedProductsToCart = async (req, res) => {
    try {
        const products = req.body;
        const userId = req.user.id;
        // Find the cart entry for the user
        let cartEntry = await Cart.findOne({ user: userId });

        // If the cart entry doesn't exist, create a new one

        if (!cartEntry) {
            cartEntry = new Cart({
                user: userId,
                products: [] // Initialize products array as empty
            });
        }

        // Loop through the provided products and add them to the cart
        for (const providedProduct of products) {
            const existingProductIndex = cartEntry.products.findIndex(item => item.product.equals(providedProduct._id));
            if (existingProductIndex !== -1) {
                // If the product exists, update its quantity
                cartEntry.products[existingProductIndex].quantity = providedProduct.quantity;
            } else {
                // If the product doesn't exist, add it to the cart
                cartEntry.products.push({ product: providedProduct._id.toString(), quantity: providedProduct.quantity });
            }
        }

        // Save the cart entry to the database
        const data = await cartEntry.save();

        res.json({ status: 201, data: data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { addCartProducts, removeProduct, userAddedProductsToCart }


