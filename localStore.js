// localStore.js - In-memory Database for Demo purposes
const bcrypt = require('bcryptjs');

class LocalStore {
  constructor() {
    this.users = [];
    this.products = [];
    this.orders = [];
    this.init();
  }

  init() {
    // Initial Seed Data
    const farmer1Id = 'f1_' + Date.now();
    const farmer2Id = 'f2_' + Date.now();

    this.users.push({
      _id: 'admin_1',
      name: 'Admin',
      email: 'admin@organic.com',
      password: bcrypt.hashSync('password', 10),
      role: 'admin',
      isApproved: true
    });

    this.users.push({
      _id: farmer1Id,
      name: 'John\'s Valley Farm',
      email: 'farmer@organic.com',
      password: bcrypt.hashSync('password', 10),
      role: 'farmer',
      isApproved: true
    });

    this.users.push({
      _id: farmer2Id,
      name: 'Green Leaf Experts',
      email: 'greenleaf@organic.com',
      password: bcrypt.hashSync('password', 10),
      role: 'farmer',
      isApproved: true
    });

    this.users.push({
      _id: 'user_1',
      name: 'Jane User',
      email: 'user@organic.com',
      password: bcrypt.hashSync('password', 10),
      role: 'user',
      isApproved: true
    });

    // Seed Products
    this.products = [
      { _id: 'p1', name: 'Organic Apples', description: 'Freshly picked apples', price: 120, category: 'Fruits', location: 'California', farmerId: farmer1Id, imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600' },
      { _id: 'p2', name: 'Ruby Avocados', description: 'Premium ripe avocados', price: 300, category: 'Fruits', location: 'Florida', farmerId: farmer2Id, imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600' },
      { _id: 'p3', name: 'Farm Blueberries', description: 'Sweet and nutritious', price: 250, category: 'Fruits', location: 'Oregon', farmerId: farmer1Id, imageUrl: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=600' },
      { _id: 'p4', name: 'Organic Strawberries', description: 'Juicy and sweet strawberries', price: 200, category: 'Fruits', location: 'California', farmerId: farmer1Id, imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600' },
      { _id: 'p5', name: 'Fresh Peaches', description: 'Farm fresh summer peaches', price: 180, category: 'Fruits', location: 'Georgia', farmerId: farmer2Id, imageUrl: 'https://images.unsplash.com/photo-1531688647565-d01d4a0458df?w=600' },
      { _id: 'p6', name: 'Organic Bananas', description: 'Perfectly ripe bananas', price: 100, category: 'Fruits', location: 'Hawaii', farmerId: farmer1Id, imageUrl: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600' },
      { _id: 'p7', name: 'Sweet Oranges', description: 'Citrusy organic oranges', price: 150, category: 'Fruits', location: 'Florida', farmerId: farmer2Id, imageUrl: 'https://images.unsplash.com/photo-1549888834-3ec93abae044?w=600' },
      { _id: 'p8', name: 'Organic Mangoes', description: 'Tropical sweet mangoes', price: 350, category: 'Fruits', location: 'Florida', farmerId: farmer1Id, imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600' },
      { _id: 'p9', name: 'Sweet Cherries', description: 'Dark sweet cherries', price: 400, category: 'Fruits', location: 'Washington', farmerId: farmer2Id, imageUrl: 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=600' },
      { _id: 'p10', name: 'Golden Pineapples', description: 'Ripe and ready pineapples', price: 280, category: 'Fruits', location: 'Hawaii', farmerId: farmer1Id, imageUrl: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600' },
      { _id: 'p11', name: 'Organic Dragonfruit', description: 'Exotic pitaya fruit', price: 450, category: 'Fruits', location: 'Vietnam', farmerId: farmer1Id, imageUrl: 'https://images.unsplash.com/photo-1527325511917-0ec997672191?w=600' },
      { _id: 'p12', name: 'Desert Watermelon', description: 'Sugar-sweet organic watermelon', price: 220, category: 'Fruits', location: 'Arizona', farmerId: farmer2Id, imageUrl: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=600' },
      
      // Vegetables
      { _id: 'p13', name: 'Fresh Carrots', description: 'Crunchy organic carrots', price: 60, category: 'Vegetables', location: 'Texas', farmerId: farmer1Id, imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600' },
      { _id: 'p14', name: 'Organic Kale', description: 'Fresh leafy green kale', price: 90, category: 'Vegetables', location: 'California', farmerId: farmer2Id, imageUrl: 'https://images.unsplash.com/photo-1524179091875-9b2f3bc191ca?w=600' },
      { _id: 'p15', name: 'Bell Peppers', description: 'Vibrant organic peppers', price: 150, category: 'Vegetables', location: 'Texas', farmerId: farmer1Id, imageUrl: 'https://images.unsplash.com/photo-1563514222080-6007ecad3c03?w=600' },
      { _id: 'p16', name: 'Green Broccoli', description: 'Nutrient-rich broccoli', price: 120, category: 'Vegetables', location: 'California', farmerId: farmer1Id, imageUrl: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600' },
      { _id: 'p17', name: 'Cherry Tomatoes', description: 'Sweet vine-ripened tomatoes', price: 100, category: 'Vegetables', location: 'Florida', farmerId: farmer2Id, imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600' },
      { _id: 'p18', name: 'Red Onions', description: 'Crisp organic red onions', price: 80, category: 'Vegetables', location: 'Texas', farmerId: farmer1Id, imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600' },
      { _id: 'p19', name: 'Organic Garlic', description: 'Fresh garlic bulbs', price: 140, category: 'Vegetables', location: 'California', farmerId: farmer2Id, imageUrl: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=600' },
      { _id: 'p20', name: 'Organic Potatoes', description: 'Earthy organic potatoes', price: 70, category: 'Vegetables', location: 'Idaho', farmerId: farmer1Id, imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600' },
      { _id: 'p21', name: 'Fresh Spinach', description: 'Green tender spinach', price: 85, category: 'Vegetables', location: 'California', farmerId: farmer2Id, imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600' },
      { _id: 'p22', name: 'Sweet Potatoes', description: 'Rich orange sweet potatoes', price: 95, category: 'Vegetables', location: 'North Carolina', farmerId: farmer1Id, imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600' },
      { _id: 'p23', name: 'Purple Eggplant', description: 'Smooth organic eggplant', price: 110, category: 'Vegetables', location: 'New Jersey', farmerId: farmer2Id, imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600' },
      { _id: 'p24', name: 'Snap Peas', description: 'Crisp sweet snap peas', price: 130, category: 'Vegetables', location: 'Colorado', farmerId: farmer1Id, imageUrl: 'https://images.unsplash.com/photo-1587313886566-a36729013f99?w=600' },

      // Grains
      { _id: 'p25', name: 'Whole Wheat Grains', description: 'Premium whole weight', price: 200, category: 'Grains', location: 'Kansas', farmerId: farmer1Id, imageUrl: 'https://images.unsplash.com/photo-1574323347407-15e3df50f38b?w=600' },
      { _id: 'p26', name: 'Quinoa', description: 'High protein organic quinoa', price: 400, category: 'Grains', location: 'Colorado', farmerId: farmer2Id, imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001f2aa?w=600' },
      { _id: 'p27', name: 'Brown Rice', description: 'Nutritious brown rice', price: 150, category: 'Grains', location: 'Arkansas', farmerId: farmer1Id, imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001f2aa?w=600' },
      { _id: 'p28', name: 'Organic Oats', description: 'Rich cut whole oats', price: 180, category: 'Grains', location: 'Iowa', farmerId: farmer2Id, imageUrl: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=600' },
      { _id: 'p29', name: 'Pearl Barley', description: 'Organically grown barley', price: 220, category: 'Grains', location: 'Montana', farmerId: farmer1Id, imageUrl: 'https://images.unsplash.com/photo-1574323347407-15e3df50f38b?w=600' },
      { _id: 'p30', name: 'Organic Cornmeal', description: 'Finely ground organic corn', price: 160, category: 'Grains', location: 'Illinois', farmerId: farmer2Id, imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600' },
      { _id: 'p31', name: 'Red Lentils', description: 'Protein-packed organic lentils', price: 140, category: 'Grains', location: 'North Dakota', farmerId: farmer1Id, imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600' },
      { _id: 'p32', name: 'Chia Seeds', description: 'Organic superfood chia seeds', price: 600, category: 'Grains', location: 'Mexico', farmerId: farmer2Id, imageUrl: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=600' },

      // Dairy
      { _id: 'p33', name: 'Raw Farm Milk', description: 'Fresh unpasteurized milk', price: 80, category: 'Dairy', location: 'Wisconsin', farmerId: farmer2Id, imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600' },
      { _id: 'p34', name: 'Aged Cheddar', description: 'Handcrafted ancient cheddar', price: 450, category: 'Dairy', location: 'Wisconsin', farmerId: farmer1Id, imageUrl: 'https://images.unsplash.com/photo-1618164435735-414d3b060ce4?w=600' },
      { _id: 'p35', name: 'Organic Butter', description: 'Creamy grass-fed butter', price: 320, category: 'Dairy', location: 'Vermont', farmerId: farmer2Id, imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135f783?w=600' },
      { _id: 'p36', name: 'Greek Yogurt', description: 'Thick organic yogurt', price: 150, category: 'Dairy', location: 'New York', farmerId: farmer1Id, imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600' },
      { _id: 'p37', name: 'Farm Fresh Eggs', description: 'Free-range organic eggs', price: 210, category: 'Dairy', location: 'Pennsylvania', farmerId: farmer2Id, imageUrl: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=600' },
      { _id: 'p38', name: 'Goat Cheese', description: 'Soft organic goat cheese', price: 380, category: 'Dairy', location: 'California', farmerId: farmer1Id, imageUrl: 'https://images.unsplash.com/photo-1618164435735-414d3b060ce4?w=600' },
      { _id: 'p39', name: 'Organic Ghee', description: 'Clarified grass-fed butter', price: 550, category: 'Dairy', location: 'India', farmerId: farmer2Id, imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600' },
      { _id: 'p40', name: 'Mozzarella Ball', description: 'Fresh organic mozzarella', price: 340, category: 'Dairy', location: 'Italy', farmerId: farmer1Id, imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135f783?w=600' },

      // Herbs
      { _id: 'p41', name: 'Fresh Basil', description: 'Aromatic fresh basil', price: 50, category: 'Herbs', location: 'California', farmerId: farmer2Id, imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600' },
      { _id: 'p42', name: 'Organic Mint', description: 'Refreshing organic mint leaves', price: 40, category: 'Herbs', location: 'Florida', farmerId: farmer1Id, imageUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600' },
      { _id: 'p43', name: 'Fresh Rosemary', description: 'Pine-scented rosemary', price: 60, category: 'Herbs', location: 'Oregon', farmerId: farmer2Id, imageUrl: 'https://images.unsplash.com/photo-1596647209707-1ae725cd8a80?w=600' },
      { _id: 'p44', name: 'Organic Thyme', description: 'Earthy organic thyme', price: 55, category: 'Herbs', location: 'Washington', farmerId: farmer1Id, imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600' },
      { _id: 'p45', name: 'Italian Parsley', description: 'Flat-leaf organic parsley', price: 45, category: 'Herbs', location: 'California', farmerId: farmer2Id, imageUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600' },
      { _id: 'p46', name: 'Fresh Cilantro', description: 'Vibrant green cilantro', price: 35, category: 'Herbs', location: 'Texas', farmerId: farmer1Id, imageUrl: 'https://images.unsplash.com/photo-1596647209707-1ae725cd8a80?w=600' },
      { _id: 'p47', name: 'Organic Turmeric', description: 'Fresh golden turmeric root', price: 120, category: 'Herbs', location: 'Hawaii', farmerId: farmer2Id, imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600' },
      { _id: 'p48', name: 'Dried Oregano', description: 'Strong aromatic dried oregano', price: 90, category: 'Herbs', location: 'Greece', farmerId: farmer1Id, imageUrl: 'https://images.unsplash.com/photo-1596647209707-1ae725cd8a80?w=600' },
    ];
    
    console.log('📦 Local Store Initialized with 48 Products');
  }

  // User Methods
  async findUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  async findUserById(id) {
    return this.users.find(u => u._id === id);
  }

  async createUser(userData) {
    const newUser = {
      _id: 'u' + Date.now(),
      ...userData,
      password: bcrypt.hashSync(userData.password, 10),
      isApproved: userData.role === 'user' ? true : false // User auto-approved, farmers need admin
    };
    this.users.push(newUser);
    return newUser;
  }

  async approveFarmer(id) {
    const user = await this.findUserById(id);
    if (user) user.isApproved = true;
    return user;
  }

  async getPendingFarmers() {
    return this.users.filter(u => u.role === 'farmer' && !u.isApproved);
  }

  // Product Methods
  async getAllProducts(filters = {}) {
    let result = [...this.products];
    if (filters.category) {
      result = result.filter(p => p.category === filters.category);
    }
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
    }
    return result;
  }

  async getProductById(id) {
    const p = this.products.find(p => p._id === id);
    if (!p) return null;
    // Mock populate farmerId
    const farmer = this.users.find(u => u._id === p.farmerId);
    return { ...p, farmerId: farmer || { name: 'Local Farmer' } };
  }

  async createProduct(productData) {
    const newProduct = { _id: 'p' + Date.now(), ...productData };
    this.products.push(newProduct);
    return newProduct;
  }

  // Order Methods
  async createOrder(orderData) {
    const newOrder = { 
      _id: 'o' + Date.now(), 
      ...orderData, 
      status: 'Pending', 
      createdAt: new Date() 
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  async getOrdersByUser(userId, role) {
    if (role === 'admin') return this.orders;
    if (role === 'farmer') {
      // Find orders that contain farmer's products
      return this.orders.filter(o => o.products.some(p => {
        const prod = this.products.find(pr => pr._id === p.product);
        return prod && prod.farmerId === userId;
      }));
    }
    return this.orders.filter(o => o.userId === userId);
  }
}

module.exports = new LocalStore();
