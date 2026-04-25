require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/premium_organic');

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
      { name: 'Organic Apples', description: 'Freshly picked apples', price: 120, category: 'Fruits', location: 'California', farmerId: farmer1._id, imageUrl: '/product-images/apple.png' },
      { name: 'Ruby Avocados', description: 'Premium ripe avocados', price: 300, category: 'Fruits', location: 'Florida', farmerId: farmer2._id, imageUrl: '/product-images/avocado.jpg' },
      { name: 'Farm Blueberries', description: 'Sweet and nutritious', price: 250, category: 'Fruits', location: 'Oregon', farmerId: farmer1._id, imageUrl: '/product-images/blueberries.jpg' },
      { name: 'Organic Strawberries', description: 'Juicy and sweet strawberries', price: 200, category: 'Fruits', location: 'California', farmerId: farmer1._id, imageUrl: '/product-images/strawberry.jpg' },
      { name: 'Organic Bananas', description: 'Perfectly ripe bananas', price: 100, category: 'Fruits', location: 'Hawaii', farmerId: farmer1._id, imageUrl: '/product-images/banana.jpg' },
      { name: 'Sweet Oranges', description: 'Citrusy organic oranges', price: 150, category: 'Fruits', location: 'Florida', farmerId: farmer2._id, imageUrl: '/product-images/orange.jpg' },
      { name: 'Organic Mangoes', description: 'Tropical sweet mangoes', price: 350, category: 'Fruits', location: 'Florida', farmerId: farmer1._id, imageUrl: '/product-images/mango.jpg' },
      { name: 'Sweet Cherries', description: 'Dark sweet cherries', price: 400, category: 'Fruits', location: 'Washington', farmerId: farmer2._id, imageUrl: '/product-images/cherry.jpg' },
      { name: 'Golden Pineapples', description: 'Ripe and ready pineapples', price: 280, category: 'Fruits', location: 'Hawaii', farmerId: farmer1._id, imageUrl: '/product-images/pineapple.jpg' },
      { name: 'Organic Dragonfruit', description: 'Exotic pitaya fruit', price: 450, category: 'Fruits', location: 'Vietnam', farmerId: farmer1._id, imageUrl: '/product-images/dragon-fruit.jpg' },
      { name: 'Desert Watermelon', description: 'Sugar-sweet organic watermelon', price: 220, category: 'Fruits', location: 'Arizona', farmerId: farmer2._id, imageUrl: '/product-images/watermelon.jpg' },
      
      // Vegetables
      { name: 'Fresh Carrots', description: 'Crunchy organic carrots', price: 60, category: 'Vegetables', location: 'Texas', farmerId: farmer1._id, imageUrl: '/product-images/carrot.jpg' },
      { name: 'Organic Kale', description: 'Fresh leafy green kale', price: 90, category: 'Vegetables', location: 'California', farmerId: farmer2._id, imageUrl: '/product-images/cabbage.jpg' },
      { name: 'Bell Peppers', description: 'Vibrant organic peppers', price: 150, category: 'Vegetables', location: 'Texas', farmerId: farmer1._id, imageUrl: '/product-images/capsicum.jpg' },
      { name: 'Green Broccoli', description: 'Nutrient-rich broccoli', price: 120, category: 'Vegetables', location: 'California', farmerId: farmer1._id, imageUrl: '/product-images/broccoli.jpg' },
      { name: 'Cherry Tomatoes', description: 'Sweet vine-ripened tomatoes', price: 100, category: 'Vegetables', location: 'Florida', farmerId: farmer2._id, imageUrl: '/product-images/tomato.jpg' },
      { name: 'Red Onions', description: 'Crisp organic red onions', price: 80, category: 'Vegetables', location: 'Texas', farmerId: farmer1._id, imageUrl: '/product-images/onion.jpg' },
      { name: 'Organic Garlic', description: 'Fresh garlic bulbs', price: 140, category: 'Vegetables', location: 'California', farmerId: farmer2._id, imageUrl: '/product-images/garlic.jpg' },
      { name: 'Organic Potatoes', description: 'Earthy organic potatoes', price: 70, category: 'Vegetables', location: 'Idaho', farmerId: farmer1._id, imageUrl: '/product-images/potato.jpg' },
      { name: 'Fresh Spinach', description: 'Green tender spinach', price: 85, category: 'Vegetables', location: 'California', farmerId: farmer2._id, imageUrl: '/product-images/spinach.jpg' },
      { name: 'Sweet Potatoes', description: 'Rich orange sweet potatoes', price: 95, category: 'Vegetables', location: 'North Carolina', farmerId: farmer1._id, imageUrl: '/product-images/sweet-potato.jpg' },
      { name: 'Purple Eggplant', description: 'Smooth organic eggplant', price: 110, category: 'Vegetables', location: 'New Jersey', farmerId: farmer2._id, imageUrl: '/product-images/brinjal.jpg' },
      { name: 'Snap Peas', description: 'Crisp sweet snap peas', price: 130, category: 'Vegetables', location: 'Colorado', farmerId: farmer1._id, imageUrl: '/product-images/green-peas.jpg' },

      // Grains
      { name: 'Quinoa', description: 'High protein organic quinoa', price: 400, category: 'Grains', location: 'Colorado', farmerId: farmer2._id, imageUrl: '/product-images/quinoa.jpg' },
      { name: 'Brown Rice', description: 'Nutritious brown rice', price: 150, category: 'Grains', location: 'Arkansas', farmerId: farmer1._id, imageUrl: '/product-images/rice.jpg' },
      { name: 'Organic Oats', description: 'Rich cut whole oats', price: 180, category: 'Grains', location: 'Iowa', farmerId: farmer2._id, imageUrl: '/product-images/oats.jpg' },
      { name: 'Pearl Barley', description: 'Organically grown barley', price: 220, category: 'Grains', location: 'Montana', farmerId: farmer1._id, imageUrl: '/product-images/barley.jpg' },
      { name: 'Organic Cornmeal', description: 'Finely ground organic corn', price: 160, category: 'Grains', location: 'Illinois', farmerId: farmer2._id, imageUrl: '/product-images/maize.jpg' },
      { name: 'Red Lentils', description: 'Protein-packed organic lentils', price: 140, category: 'Grains', location: 'North Dakota', farmerId: farmer1._id, imageUrl: '/product-images/lentils.jpg' },
      { name: 'Chia Seeds', description: 'Organic superfood chia seeds', price: 600, category: 'Grains', location: 'Mexico', farmerId: farmer2._id, imageUrl: '/product-images/chia-seeds.jpg' },

      // Dairy
      { name: 'Aged Cheddar', description: 'Handcrafted ancient cheddar', price: 450, category: 'Dairy', location: 'Wisconsin', farmerId: farmer1._id, imageUrl: '/product-images/cheese.jpg' },
      { name: 'Organic Butter', description: 'Creamy grass-fed butter', price: 320, category: 'Dairy', location: 'Vermont', farmerId: farmer2._id, imageUrl: '/product-images/butter.jpg' },
      { name: 'Greek Yogurt', description: 'Thick organic yogurt', price: 150, category: 'Dairy', location: 'New York', farmerId: farmer1._id, imageUrl: '/product-images/greek-yogurt.jpg' },
      { name: 'Farm Fresh Eggs', description: 'Free-range organic eggs', price: 210, category: 'Dairy', location: 'Pennsylvania', farmerId: farmer2._id, imageUrl: '/product-images/eggs.jpg' },
      { name: 'Goat Cheese', description: 'Soft organic goat cheese', price: 380, category: 'Dairy', location: 'California', farmerId: farmer1._id, imageUrl: '/product-images/goat-cheese.jpg' },
      { name: 'Organic Ghee', description: 'Clarified grass-fed butter', price: 550, category: 'Dairy', location: 'India', farmerId: farmer2._id, imageUrl: '/product-images/ghee.jpg' },
      { name: 'Mozzarella Ball', description: 'Fresh organic mozzarella', price: 340, category: 'Dairy', location: 'Italy', farmerId: farmer1._id, imageUrl: '/product-images/mozzarella.jpg' },

      // Herbs
      { name: 'Fresh Basil', description: 'Aromatic fresh basil', price: 50, category: 'Herbs', location: 'California', farmerId: farmer2._id, imageUrl: '/product-images/basil.jpg' },
      { name: 'Organic Mint', description: 'Refreshing organic mint leaves', price: 40, category: 'Herbs', location: 'Florida', farmerId: farmer1._id, imageUrl: '/product-images/dried-oregano.jpg' },
      { name: 'Fresh Rosemary', description: 'Pine-scented rosemary', price: 60, category: 'Herbs', location: 'Oregon', farmerId: farmer2._id, imageUrl: '/product-images/rosemary.jpg' },
      { name: 'Organic Thyme', description: 'Earthy organic thyme', price: 55, category: 'Herbs', location: 'Washington', farmerId: farmer1._id, imageUrl: '/product-images/thyme.jpg' },
      { name: 'Italian Parsley', description: 'Flat-leaf organic parsley', price: 45, category: 'Herbs', location: 'California', farmerId: farmer2._id, imageUrl: '/product-images/parsley.jpg' },
      { name: 'Fresh Cilantro', description: 'Vibrant green cilantro', price: 35, category: 'Herbs', location: 'Texas', farmerId: farmer1._id, imageUrl: '/product-images/cilantro.jpg' },
      { name: 'Organic Turmeric', description: 'Fresh golden turmeric root', price: 120, category: 'Herbs', location: 'Hawaii', farmerId: farmer2._id, imageUrl: '/product-images/turmeric.jpg' },
      { name: 'Mixed Herbs', description: 'Strong aromatic herbs collection', price: 90, category: 'Herbs', location: 'Global', farmerId: farmer1._id, imageUrl: '/product-images/herbs.jpg' },
    ]);

    console.log('✅ Database Seeded Successfully with 38 Products');
    process.exit();
  } catch (error) {
    console.error('❌ SEED ERROR:', error);
    process.exit(1);
  }
};

seedDB();
