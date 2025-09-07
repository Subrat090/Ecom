const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with titanium design and A17 Pro chip',
    price: 999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300',
    stock: 50,
    rating: 4.8
  },
  {
    name: 'Samsung Galaxy S24',
    description: 'Premium Android smartphone with AI features',
    price: 899,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300',
    stock: 30,
    rating: 4.7
  },
  {
    name: 'MacBook Pro M3',
    description: 'Powerful laptop for professionals and creators',
    price: 1999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300',
    stock: 25,
    rating: 4.9
  },
  {
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with Max Air cushioning',
    price: 150,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300',
    stock: 100,
    rating: 4.5
  },
  {
    name: 'Adidas Ultraboost 22',
    description: 'High-performance running shoes with Boost technology',
    price: 180,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300',
    stock: 75,
    rating: 4.6
  },
  {
    name: 'The Great Gatsby',
    description: 'Classic American novel by F. Scott Fitzgerald',
    price: 12,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300',
    stock: 200,
    rating: 4.4
  },
  {
    name: 'To Kill a Mockingbird',
    description: 'Harper Lee\'s masterpiece about justice and morality',
    price: 14,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300',
    stock: 150,
    rating: 4.7
  },
  {
    name: 'Smart Coffee Maker',
    description: 'WiFi-enabled coffee maker with app control',
    price: 299,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300',
    stock: 40,
    rating: 4.3
  },
  {
    name: 'Air Purifier',
    description: 'HEPA filter air purifier for clean indoor air',
    price: 199,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f6c5?w=300',
    stock: 60,
    rating: 4.2
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat with carrying strap',
    price: 45,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300',
    stock: 80,
    rating: 4.4
  },
  {
    name: 'Wireless Headphones',
    description: 'Noise-cancelling wireless headphones with 30hr battery',
    price: 199,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
    stock: 45,
    rating: 4.5
  },
  {
    name: 'Skincare Set',
    description: 'Complete skincare routine with cleanser, toner, and moisturizer',
    price: 89,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=300',
    stock: 35,
    rating: 4.3
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('Sample products inserted successfully');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
