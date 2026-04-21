// localStore.js - Professional Seed & In-memory Store
const bcrypt = require('bcryptjs');

// High-quality, reliable agriculture images from Unsplash
const IMG = {
    apples: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=800&q=80',
    avocados: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&q=80',
    berries: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800&q=80',
    honey: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80',
    milk: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80',
    eggs: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800&q=80',
    cheese: 'https://images.unsplash.com/photo-1486297678162-ad2a19b058fb?w=800&q=80',
    veg_mix: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c12e8c?w=800&q=80',
    tomatoes: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80',
    kale: 'https://images.unsplash.com/photo-1524179091875-9b2f3bc191ca?w=800&q=80',
    grains: 'https://images.unsplash.com/photo-1574323347407-15e3df50f38b?w=800&q=80',
    herbs: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80'
};

class LocalStore {
  constructor() {
    this.users = [];
    this.products = [];
    this.orders = [];
    this.init();
  }

  init() {
    const farmer1Id = 'f1_' + Date.now();
    const farmer2Id = 'f2_' + Date.now();

    this.users = [
      { _id: 'admin_1', name: 'Admin User', email: 'admin@organic.com', password: bcrypt.hashSync('password', 10), role: 'admin', isApproved: true },
      { _id: farmer1Id, name: 'Eco Harvest Farms', email: 'farmer@organic.com', password: bcrypt.hashSync('password', 10), role: 'farmer', isApproved: true },
      { _id: farmer2Id, name: 'Sunberry Experts', email: 'greenleaf@organic.com', password: bcrypt.hashSync('password', 10), role: 'farmer', isApproved: true },
      { _id: 'user_1', name: 'Jane User', email: 'user@organic.com', password: bcrypt.hashSync('password', 10), role: 'user', isApproved: true }
    ];

    this.products = [
      { _id: 'p1', name: 'Premium Honey Crisp Apples', description: 'Sweet, crips, and 100% pesticide-free.', price: 150, category: 'Fruits', location: 'California', farmerId: farmer1Id, imageUrl: IMG.apples },
      { _id: 'p2', name: 'Organic Hass Avocados', description: 'Creamy and ready-to-eat luxury avocados.', price: 280, category: 'Fruits', location: 'Florida', farmerId: farmer2Id, imageUrl: IMG.avocados },
      { _id: 'p3', name: 'Wild Forest Berries', description: 'Antioxidant-rich handpicked blueberries.', price: 220, category: 'Fruits', location: 'Oregon', farmerId: farmer1Id, imageUrl: IMG.berries },
      { _id: 'p4', name: 'Raw Honey Blossom', description: 'Unfiltered, pure golden nectar.', price: 450, category: 'Dairy', location: 'Texas', farmerId: farmer1Id, imageUrl: IMG.honey },
      { _id: 'p5', name: 'Pasture-Raised Eggs', description: 'Free-range golden yolk eggs.', price: 180, category: 'Dairy', location: 'Wisconsin', farmerId: farmer2Id, imageUrl: IMG.eggs },
      { _id: 'p6', name: 'Artisan Goat Cheese', description: 'Soft, creamy local goat cheese.', price: 350, category: 'Dairy', location: 'New York', farmerId: farmer1Id, imageUrl: IMG.cheese },
      { _id: 'p7', name: 'Heritage Heirloom Tomatoes', description: 'Juicy variety for gourmet salads.', price: 120, category: 'Vegetables', location: 'Florida', farmerId: farmer2Id, imageUrl: IMG.tomatoes },
      { _id: 'p8', name: 'Curly Green Kale', description: 'Superfood kale grown in volcanic soil.', price: 95, category: 'Vegetables', location: 'California', farmerId: farmer2Id, imageUrl: IMG.kale }
    ];

    console.log('🌱 Data Layer Initialized: 8 High-Quality Products Ready');
  }

  // User Auth
  async findUserByEmail(email) { return this.users.find(u => u.email === email); }
  async findUserById(id) { return this.users.find(u => u._id === id); }
  async createUser(userData) {
    const newUser = { _id: 'u' + Date.now(), ...userData, password: bcrypt.hashSync(userData.password, 10), isApproved: userData.role === 'user' ? true : false };
    this.users.push(newUser);
    return newUser;
  }
  async approveFarmer(id) {
    const user = await this.findUserById(id);
    if (user) user.isApproved = true;
    return user;
  }
  async getPendingFarmers() { return this.users.filter(u => u.role === 'farmer' && !u.isApproved); }

  // Products
  async getAllProducts(filters = {}) {
    let result = [...this.products];
    if (filters.category) result = result.filter(p => p.category === filters.category);
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
    }
    return result;
  }
  async getProductById(id) {
    const p = this.products.find(p => p._id === id);
    if (!p) return null;
    const farmer = this.users.find(u => u._id === p.farmerId);
    return { ...p, farmerId: farmer || { name: 'Local Expert' } };
  }
  async createProduct(data) {
    const newP = { _id: 'p' + Date.now(), ...data };
    this.products.push(newP);
    return newP;
  }

  // Orders
  async createOrder(data) {
    const o = { _id: 'o' + Date.now(), ...data, status: 'Confirmed', createdAt: new Date() };
    this.orders.push(o);
    return o;
  }
  async getOrdersByUser(userId, role) {
    if (role === 'admin') return this.orders;
    if (role === 'farmer') return this.orders.filter(o => o.products.some(p => {
        const prod = this.products.find(pr => pr._id === p.product);
        return prod && prod.farmerId === userId;
    }));
    return this.orders.filter(o => o.userId === userId);
  }
}

module.exports = new LocalStore();
