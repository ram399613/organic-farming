// localStore.js - Enterprise Catalog (150+ Products)
const bcrypt = require('bcryptjs');

const POOLS = {
    Fruits: {
        names: ['Apple', 'Banana', 'Pineapple', 'Mango', 'Grape', 'Avocado', 'Strawberry', 'Blueberry', 'Peach', 'Plum', 'Kiwi', 'Orange', 'Lemon', 'Pear', 'Cherry'],
        adjectives: ['Golden', 'Sun-Ripened', 'Organic', 'Sweet', 'Juicy', 'Wild', 'Heritage', 'Fresh', 'Premium'],
        img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=800'
    },
    Vegetables: {
        names: ['Carrot', 'Tomato', 'Onion', 'Kale', 'Pepper', 'Potato', 'Yam', 'Pea', 'Broccoli', 'Spinach', 'Cucumber', 'Zucchini', 'Radish', 'Garlic', 'Beetroot'],
        adjectives: ['Earth-Grown', 'Farm-Fresh', 'Crispy', 'Garden', 'Verdant', 'Robust', 'Natural', 'Nutrient-Rich'],
        img: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c12e8c?q=80&w=800'
    },
    Dairy: {
        names: ['Milk', 'Egg', 'Cheese', 'Honey', 'Yogurt', 'Butter', 'Cream', 'Ghee', 'Paneer'],
        adjectives: ['Pure', 'Raw', 'Pasture-Raised', 'Artisan', 'Golden', 'Traditional', 'Clover', 'Valley'],
        img: 'https://images.unsplash.com/photo-1528740096961-3798add19cb7?q=80&w=800'
    },
    Grains: {
        names: ['Wheat', 'Rice', 'Flour', 'Oats', 'Corn', 'Barley', 'Quinoa', 'Millet', 'Buckwheat'],
        adjectives: ['Stone-Ground', 'Ancestral', 'Whole', 'Organic', 'Ancient', 'Native', 'Harvested', 'Sun-Dried'],
        img: 'https://images.unsplash.com/photo-1574323347407-15e3df50f38b?q=80&w=800'
    },
    Herbs: {
        names: ['Basil', 'Mint', 'Rosemary', 'Turmeric', 'Thyme', 'Oregano', 'Parsley', 'Cilantro', 'Ginger', 'Chives'],
        adjectives: ['Aromatic', 'Wild-Harvested', 'Medicinal', 'Pure', 'Kitchen-Ready', 'Dried', 'Fragrant', 'Fresh-Cut'],
        img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800'
    }
};

class LocalStore {
  constructor() {
    this.users = []; this.products = []; this.orders = [];
    this.init();
  }

  init() {
    const f1 = 'f1_' + Date.now();
    this.users = [
      { _id: 'admin_1', name: 'Admin', email: 'admin@organic.com', password: bcrypt.hashSync('password', 10), role: 'admin', isApproved: true },
      { _id: f1, name: 'Valley Organic Co.', email: 'farmer@organic.com', password: bcrypt.hashSync('password', 10), role: 'farmer', isApproved: true },
      { _id: 'user_1', name: 'Jane User', email: 'user@organic.com', password: bcrypt.hashSync('password', 10), role: 'user', isApproved: true }
    ];

    // Generate 35 items per category = 175 products total
    let pCount = 0;
    Object.keys(POOLS).forEach(cat => {
        const pool = POOLS[cat];
        for (let i = 0; i < 35; i++) {
            const adj = pool.adjectives[i % pool.adjectives.length];
            const name = pool.names[i % pool.names.length];
            this.products.push({
                _id: 'p' + (pCount++),
                name: `${adj} ${name}`,
                category: cat,
                price: 50 + (i * 12) + (Math.floor(Math.random() * 50)),
                description: `A premium selection of ${adj.toLowerCase()} ${name.toLowerCase()} grown with 100% organic methods.`,
                location: i % 2 === 0 ? 'Northern Farms' : 'Southern Valley',
                farmerId: f1,
                imageUrl: pool.img + `&t=${pCount}` // Unique timestamp to force diverse renders if Unsplash supports it
            });
        }
    });

    console.log(`📡 Enterprise Data Layer Active: ${this.products.length} Products Loaded`);
  }

  // API Methods
  async findUserByEmail(e) { return this.users.find(u => u.email === e); }
  async findUserById(i) { return this.users.find(u => u._id === i); }
  async createUser(d) {
    const n = { _id: 'u'+Date.now(), ...d, password: bcrypt.hashSync(d.password, 10), isApproved: d.role==='user' };
    this.users.push(n); return n;
  }
  async getAllProducts(f = {}) {
    let r = [...this.products];
    if (f.category) r = r.filter(p => p.category === f.category);
    if (f.search) {
      const s = f.search.toLowerCase();
      r = r.filter(p => p.name.toLowerCase().includes(s));
    }
    return r;
  }
  async getProductById(i) {
    const p = this.products.find(p => p._id === i);
    return p ? { ...p, farmerId: this.users.find(u => u._id === p.farmerId) || {name:'Valley Farmer'} } : null;
  }
  async createOrder(d) { 
    const o = { _id: 'o'+Date.now(), ...d, status: 'Confirmed', createdAt: new Date() }; 
    this.orders.push(o); return o; 
  }
  async getOrdersByUser(u, r) {
    if (r === 'admin') return this.orders;
    return this.orders.filter(o => o.userId === u);
  }
}

module.exports = new LocalStore();
