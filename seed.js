require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/premium_organic');

    await User.deleteMany();
    await Product.deleteMany();

    const admin = await User.create({
      name: 'Admin', email: 'admin@organic.com', password: 'password', role: 'admin', isApproved: true
    });

    const farmer1 = await User.create({
      name: 'John\'s Valley Farm', email: 'farmer@organic.com', password: 'password', role: 'farmer', isApproved: true
    });

    const farmer2 = await User.create({
      name: 'Green Leaf Experts', email: 'greenleaf@organic.com', password: 'password', role: 'farmer', isApproved: true
    });

    await User.create({
      name: 'Jane User', email: 'user@organic.com', password: 'password', role: 'user', isApproved: true
    });

    await Product.create([
      // Fruits
      { name: 'Organic Apples', description: 'Freshly picked apples', price: 120, category: 'Fruits', location: 'California', farmerId: farmer1._id, imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600' },
      { name: 'Ruby Avocados', description: 'Premium ripe avocados', price: 300, category: 'Fruits', location: 'Florida', farmerId: farmer2._id, imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600' },
      { name: 'Farm Blueberries', description: 'Sweet and nutritious', price: 250, category: 'Fruits', location: 'Oregon', farmerId: farmer1._id, imageUrl: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=600' },
      { name: 'Organic Strawberries', description: 'Juicy and sweet strawberries', price: 200, category: 'Fruits', location: 'California', farmerId: farmer1._id, imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600' },
      { name: 'Fresh Peaches', description: 'Farm fresh summer peaches', price: 180, category: 'Fruits', location: 'Georgia', farmerId: farmer2._id, imageUrl: 'https://images.unsplash.com/photo-1531688647565-d01d4a0458df?w=600' },
      { name: 'Organic Bananas', description: 'Perfectly ripe bananas', price: 100, category: 'Fruits', location: 'Hawaii', farmerId: farmer1._id, imageUrl: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600' },
      { name: 'Sweet Oranges', description: 'Citrusy organic oranges', price: 150, category: 'Fruits', location: 'Florida', farmerId: farmer2._id, imageUrl: 'https://images.unsplash.com/photo-1549888834-3ec93abae044?w=600' },
      { name: 'Organic Mangoes', description: 'Tropical sweet mangoes', price: 350, category: 'Fruits', location: 'Florida', farmerId: farmer1._id, imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600' },
      { name: 'Sweet Cherries', description: 'Dark sweet cherries', price: 400, category: 'Fruits', location: 'Washington', farmerId: farmer2._id, imageUrl: 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=600' },
      { name: 'Golden Pineapples', description: 'Ripe and ready pineapples', price: 280, category: 'Fruits', location: 'Hawaii', farmerId: farmer1._id, imageUrl: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600' },
      
      // Vegetables
      { name: 'Fresh Carrots', description: 'Crunchy organic carrots', price: 60, category: 'Vegetables', location: 'Texas', farmerId: farmer1._id, imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600' },
      { name: 'Organic Kale', description: 'Fresh leafy green kale', price: 90, category: 'Vegetables', location: 'California', farmerId: farmer2._id, imageUrl: 'https://images.unsplash.com/photo-1524179091875-9b2f3bc191ca?w=600' },
      { name: 'Bell Peppers', description: 'Vibrant organic peppers', price: 150, category: 'Vegetables', location: 'Texas', farmerId: farmer1._id, imageUrl: 'https://images.unsplash.com/photo-1563514222080-6007ecad3c03?w=600' },
      { name: 'Green Broccoli', description: 'Nutrient-rich broccoli', price: 120, category: 'Vegetables', location: 'California', farmerId: farmer1._id, imageUrl: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600' },
      { name: 'Cherry Tomatoes', description: 'Sweet vine-ripened tomatoes', price: 100, category: 'Vegetables', location: 'Florida', farmerId: farmer2._id, imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600' },
      { name: 'Red Onions', description: 'Crisp organic red onions', price: 80, category: 'Vegetables', location: 'Texas', farmerId: farmer1._id, imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600' },
      { name: 'Organic Garlic', description: 'Fresh garlic bulbs', price: 140, category: 'Vegetables', location: 'California', farmerId: farmer2._id, imageUrl: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=600' },
      { name: 'Organic Potatoes', description: 'Earthy organic potatoes', price: 70, category: 'Vegetables', location: 'Idaho', farmerId: farmer1._id, imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600' },
      { name: 'Fresh Spinach', description: 'Green tender spinach', price: 85, category: 'Vegetables', location: 'California', farmerId: farmer2._id, imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600' },
      { name: 'Sweet Potatoes', description: 'Rich orange sweet potatoes', price: 95, category: 'Vegetables', location: 'North Carolina', farmerId: farmer1._id, imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600' },

      // Grains
      { name: 'Whole Wheat Grains', description: 'Premium whole wheat', price: 200, category: 'Grains', location: 'Kansas', farmerId: farmer1._id, imageUrl: 'https://images.unsplash.com/photo-1574323347407-15e3df50f38b?w=600' },
      { name: 'Quinoa', description: 'High protein organic quinoa', price: 400, category: 'Grains', location: 'Colorado', farmerId: farmer2._id, imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001f2aa?w=600' },
      { name: 'Brown Rice', description: 'Nutritious brown rice', price: 150, category: 'Grains', location: 'Arkansas', farmerId: farmer1._id, imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001f2aa?w=600' },
      { name: 'Organic Oats', description: 'Rich cut whole oats', price: 180, category: 'Grains', location: 'Iowa', farmerId: farmer2._id, imageUrl: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=600' },
      { name: 'Pearl Barley', description: 'Organically grown barley', price: 220, category: 'Grains', location: 'Montana', farmerId: farmer1._id, imageUrl: 'https://images.unsplash.com/photo-1574323347407-15e3df50f38b?w=600' },
      { name: 'Organic Cornmeal', description: 'Finely ground organic corn', price: 160, category: 'Grains', location: 'Illinois', farmerId: farmer2._id, imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600' },

      // Dairy
      { name: 'Raw Farm Milk', description: 'Fresh unpasteurized milk', price: 80, category: 'Dairy', location: 'Wisconsin', farmerId: farmer2._id, imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600' },
      { name: 'Aged Cheddar', description: 'Handcrafted ancient cheddar', price: 450, category: 'Dairy', location: 'Wisconsin', farmerId: farmer1._id, imageUrl: 'https://images.unsplash.com/photo-1618164435735-414d3b060ce4?w=600' },
      { name: 'Organic Butter', description: 'Creamy grass-fed butter', price: 320, category: 'Dairy', location: 'Vermont', farmerId: farmer2._id, imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135f783?w=600' },
      { name: 'Greek Yogurt', description: 'Thick organic yogurt', price: 150, category: 'Dairy', location: 'New York', farmerId: farmer1._id, imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600' },
      { name: 'Farm Fresh Eggs', description: 'Free-range organic eggs', price: 210, category: 'Dairy', location: 'Pennsylvania', farmerId: farmer2._id, imageUrl: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=600' },
      { name: 'Goat Cheese', description: 'Soft organic goat cheese', price: 380, category: 'Dairy', location: 'California', farmerId: farmer1._id, imageUrl: 'https://images.unsplash.com/photo-1618164435735-414d3b060ce4?w=600' },

      // Herbs
      { name: 'Fresh Basil', description: 'Aromatic fresh basil', price: 50, category: 'Herbs', location: 'California', farmerId: farmer2._id, imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600' },
      { name: 'Organic Mint', description: 'Refreshing organic mint leaves', price: 40, category: 'Herbs', location: 'Florida', farmerId: farmer1._id, imageUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600' },
      { name: 'Fresh Rosemary', description: 'Pine-scented rosemary', price: 60, category: 'Herbs', location: 'Oregon', farmerId: farmer2._id, imageUrl: 'https://images.unsplash.com/photo-1596647209707-1ae725cd8a80?w=600' },
      { name: 'Organic Thyme', description: 'Earthy organic thyme', price: 55, category: 'Herbs', location: 'Washington', farmerId: farmer1._id, imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600' },
      { name: 'Italian Parsley', description: 'Flat-leaf organic parsley', price: 45, category: 'Herbs', location: 'California', farmerId: farmer2._id, imageUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600' },
      { name: 'Fresh Cilantro', description: 'Vibrant green cilantro', price: 35, category: 'Herbs', location: 'Texas', farmerId: farmer1._id, imageUrl: 'https://images.unsplash.com/photo-1596647209707-1ae725cd8a80?w=600' },
    ]);

    console.log('✅ Database Seeded Successfully with 38 Products');
    process.exit();
  } catch (error) {
    console.error('❌ SEED ERROR:', error);
    process.exit(1);
  }
};

seedDB();
