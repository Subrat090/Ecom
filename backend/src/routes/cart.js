const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('cart.product', 'name price image category stock');

    res.json({
      cart: user.cart,
      totalItems: user.cart.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: user.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const user = await User.findById(req.user._id);
    
    // Check if item already exists in cart
    const existingItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = user.cart[existingItemIndex].quantity + quantity;
      
      if (newQuantity > product.stock) {
        return res.status(400).json({ message: 'Insufficient stock for requested quantity' });
      }
      
      user.cart[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      user.cart.push({ product: productId, quantity });
    }

    await user.save();

    // Populate the cart with product details
    await user.populate('cart.product', 'name price image category stock');

    res.json({
      message: 'Item added to cart successfully',
      cart: user.cart,
      totalItems: user.cart.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: user.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/cart/update
// @desc    Update cart item quantity
// @access  Private
router.put('/update', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    if (quantity < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative' });
    }

    // Check if product exists and has enough stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const user = await User.findById(req.user._id);
    const itemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity === 0) {
      // Remove item from cart
      user.cart.splice(itemIndex, 1);
    } else {
      // Update quantity
      user.cart[itemIndex].quantity = quantity;
    }

    await user.save();

    // Populate the cart with product details
    await user.populate('cart.product', 'name price image category stock');

    res.json({
      message: 'Cart updated successfully',
      cart: user.cart,
      totalItems: user.cart.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: user.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/cart/remove
// @desc    Remove item from cart
// @access  Private
router.delete('/remove', auth, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const user = await User.findById(req.user._id);
    const itemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    user.cart.splice(itemIndex, 1);
    await user.save();

    // Populate the cart with product details
    await user.populate('cart.product', 'name price image category stock');

    res.json({
      message: 'Item removed from cart successfully',
      cart: user.cart,
      totalItems: user.cart.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: user.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete('/clear', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();

    res.json({
      message: 'Cart cleared successfully',
      cart: [],
      totalItems: 0,
      totalPrice: 0
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
