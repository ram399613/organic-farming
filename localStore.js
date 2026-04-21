// localStore.js - Robust Data Layer with 30+ Products
const bcrypt = require('bcryptjs');

const IMG = {
    fruits: [
        'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=800&auto=format&fit=crop', // Apple
        'https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=800&auto=format&fit=crop', // Banana
        'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?q=80&w=800&auto=format&fit=crop', // Pineapple
        'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=800&auto=format&fit=crop', // Mango
        'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=800&auto=format&fit=crop', // Grapes
        'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=800&auto=format&fit=crop', // Avocado
        'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=800&auto=format&fit=crop', // Strawberry
        'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?q=80&w=800&auto=format&fit=crop'  // Berries
    ],
    veg: [
        'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=800&auto=format&fit=crop', // Carrot
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800&auto=format&fit=crop', // Tomato
        'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?q=80&w=800&auto=format&fit=crop', // Onion
        'https://images.unsplash.com/photo-1524179091875-9b2f3bc191ca?q=80&w=800&auto=format&fit=crop', // Kale
        'https://images.unsplash.com/photo-1563514222080-6007ecad3c03?q=80&w=800&auto=format&fit=crop', // Peppers
        'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=800&auto=format&fit=crop', // Potato
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop', // Yam
        'https://images.unsplash.com/photo-1587313886566-a36729013f99?q=80&w=800&auto=format&fit=crop'  // Peas
    ],
    dairy: [
        'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=800&auto=format&fit=crop', // Milk
        'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?q=80&w=800&auto=format&fit=crop', // Eggs
        'https://images.unsplash.com/photo-1486297678162-ad2a19b058fb?q=80&w=800&auto=format&fit=crop', // Cheese
        'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800&auto=format&fit=crop', // Honey
        'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800&auto=format&fit=crop', // Yogurt
        'https://images.unsplash.com/photo-1528740096961-3798add19cb7?q=80&w=800&auto=format&fit=crop'  // Butter
    ],
    grains: [
        'https://images.unsplash.com/photo-1574323347407-15e3df50f38b?q=80&w=800&auto=format&fit=crop', // Wheat
        'https://images.unsplash.com/photo-1586201375761-83865001f2aa?q=80&w=800&auto=format&fit=crop', // Rice
        'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=800&auto=format&fit=crop', // Corn
        'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=800&auto=format&fit=crop'  // Oats
    ],
    herbs: [
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop', // Basil
        'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?q=80&w=800&auto=format&fit=crop', // Mint
        'https://images.unsplash.com/photo-1596647209707-1ae725cd8a80?q=80&w=800&auto=format&fit=crop', // Rosemary
        'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800&auto=format&fit=crop'  // Turmeric
    ]
};

class LocalStore {
  constructor() {
    this.users = []; this.products = []; this.orders = [];
    this.init();
  }

  init() {
    const f1 = 'f1_' + Date.now();
    const f2 = 'f2_' + Date.now();

    this.users = [
      { _id: 'admin_1', name: 'Admin', email: 'admin@organic.com', password: bcrypt.hashSync('password', 10), role: 'admin', isApproved: true },
      { _id: f1, name: 'Valley Harvest Co.', email: 'farmer@organic.com', password: bcrypt.hashSync('password', 10), role: 'farmer', isApproved: true },
      { _id: f2, name: 'Verdant Fields', email: 'greenleaf@organic.com', password: bcrypt.hashSync('password', 10), role: 'farmer', isApproved: true },
      { _id: 'user_1', name: 'Jane User', email: 'user@organic.com', password: bcrypt.hashSync('password', 10), role: 'user', isApproved: true }
    ];

    // Build 30+ products dynamically to ensure variety
    const items = [
        { n: 'Golden Apples', c: 'Fruits', p: 140, i: IMG.fruits[0] },
        { n: 'Organic Bananas', c: 'Fruits', p: 90, i: IMG.fruits[1] },
        { n: 'Sweet Pineapples', c: 'Fruits', p: 260, i: IMG.fruits[2] },
        { n: 'Tropical Mangoes', c: 'Fruits', p: 320, i: IMG.fruits[3] },
        { n: 'Flame Grapes', c: 'Fruits', p: 180, i: IMG.fruits[4] },
        { n: 'Ripened Avocados', c: 'Fruits', p: 300, i: IMG.fruits[5] },
        { n: 'Summer Strawberries', c: 'Fruits', p: 240, i: IMG.fruits[6] },
        { n: 'Nordic Berries', c: 'Fruits', p: 350, i: IMG.fruits[7] },
        { n: 'Heritage Carrots', c: 'Vegetables', p: 75, i: IMG.veg[0] },
        { n: 'Vine Tomatoes', c: 'Vegetables', p: 110, i: IMG.veg[1] },
        { n: 'Red Onions', c: 'Vegetables', p: 60, i: IMG.veg[2] },
        { n: 'Volcanic Kale', c: 'Vegetables', p: 130, i: IMG.veg[3] },
        { n: 'Bell Peppers', c: 'Vegetables', p: 160, i: IMG.veg[4] },
        { n: 'Idaho Potatoes', c: 'Vegetables', p: 85, i: IMG.veg[5] },
        { n: 'Sweet Yams', c: 'Vegetables', p: 95, i: IMG.veg[6] },
        { n: 'Sweet Snap Peas', c: 'Vegetables', p: 145, i: IMG.veg[7] },
        { n: 'Raw Farm Milk', c: 'Dairy', p: 85, i: IMG.dairy[0] },
        { n: 'Free Range Eggs', c: 'Dairy', p: 210, i: IMG.dairy[1] },
        { n: 'Aged Farm Cheese', c: 'Dairy', p: 480, i: IMG.dairy[2] },
        { n: 'Wild Bloom Honey', c: 'Dairy', p: 550, i: IMG.dairy[3] },
        { n: 'Artisan Yogurt', c: 'Dairy', p: 140, i: IMG.dairy[4] },
        { n: 'Grass-Fed Butter', c: 'Dairy', p: 290, i: IMG.dairy[5] },
        { n: 'Ancestral Wheat', c: 'Grains', p: 190, i: IMG.grains[0] },
        { n: 'Polished Brown Rice', c: 'Grains', p: 160, i: IMG.grains[1] },
        { n: 'Sweet Corn Flour', c: 'Grains', p: 120, i: IMG.grains[2] },
        { n: 'Old Fashioned Oats', c: 'Grains', p: 135, i: IMG.grains[3] },
        { n: 'Fresh Italian Basil', c: 'Herbs', p: 55, i: IMG.herbs[0] },
        { n: 'Peppermint Leaves', c: 'Herbs', p: 45, i: IMG.herbs[1] },
        { n: 'Culinary Rosemary', c: 'Herbs', p: 65, i: IMG.herbs[2] },
        { n: 'Turmeric Roots', c: 'Herbs', p: 125, i: IMG.herbs[3] }
    ];

    this.products = items.map((item, idx) => ({
        _id: 'p' + idx,
        name: item.n,
        category: item.c,
        price: item.p,
        description: `Premium quality organic ${item.n.toLowerCase()} from local fields.`,
        location: idx % 2 === 0 ? 'California' : 'Oregon',
        farmerId: idx % 2 === 0 ? f1 : f2,
        imageUrl: item.i
    }));

    console.log(`📦 Catalog Ready: ${this.products.length} Items Loaded`);
  }

  // Common Methods
  async findUserByEmail(email) { return this.users.find(u => u.email === email); }
  async findUserById(id) { return this.users.find(u => u._id === id); }
  async createUser(userData) {
    const newUser = { _id: 'u' + Date.now(), ...userData, password: bcrypt.hashSync(userData.password, 10), isApproved: userData.role === 'user' ? true : false };
    this.users.push(newUser); return newUser;
  }
  async approveFarmer(id) { const u = await this.findUserById(id); if (u) u.isApproved = true; return u; }
  async getPendingFarmers() { return this.users.filter(u => u.role === 'farmer' && !u.isApproved); }

  async getAllProducts(filters = {}) {
    let r = [...this.products];
    if (filters.category) r = r.filter(p => p.category === filters.category);
    if (filters.search) {
      const s = filters.search.toLowerCase();
      r = r.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
    }
    return r;
  }
  async getProductById(id) {
    const p = this.products.find(p => p._id === id);
    if (!p) return null;
    return { ...p, farmerId: this.users.find(u => u._id === p.farmerId) || { name: 'Local Farmer' } };
  }
  async createProduct(data) { const n = { _id: 'p' + Date.now(), ...data }; this.products.push(n); return n; }

  async createOrder(data) { const o = { _id: 'o' + Date.now(), ...data, status: 'Processing', createdAt: new Date() }; this.orders.push(o); return o; }
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
