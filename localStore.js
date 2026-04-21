// localStore.js - Mega Catalog (50+ Products)
const bcrypt = require('bcryptjs');

const IMG = {
    fruits: [
        'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=800',
        'https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=800',
        'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?q=80&w=800',
        'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=800',
        'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=800',
        'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=800',
        'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=800',
        'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?q=80&w=800'
    ],
    veg: [
        'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=800',
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800',
        'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?q=80&w=800',
        'https://images.unsplash.com/photo-1524179091875-9b2f3bc191ca?q=80&w=800',
        'https://images.unsplash.com/photo-1563514222080-6007ecad3c03?q=80&w=800',
        'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=800',
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800',
        'https://images.unsplash.com/photo-1587313886566-a36729013f99?q=80&w=800'
    ],
    pantry: [
        'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=800',
        'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?q=80&w=800',
        'https://images.unsplash.com/photo-1486297678162-ad2a19b058fb?q=80&w=800',
        'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800',
        'https://images.unsplash.com/photo-1574323347407-15e3df50f38b?q=80&w=800',
        'https://images.unsplash.com/photo-1586201375761-83865001f2aa?q=80&w=800',
        'https://images.unsplash.com/photo-1474979266404-7eaacbacf82a?q=80&w=800'
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
      { _id: f1, name: 'Eco Harvest', email: 'farmer@organic.com', password: bcrypt.hashSync('password', 10), role: 'farmer', isApproved: true },
      { _id: 'user_1', name: 'Jane User', email: 'user@organic.com', password: bcrypt.hashSync('password', 10), role: 'user', isApproved: true }
    ];

    const raw = [
        // Fruits
        { n: 'Red Apples', c: 'Fruits', p: 120, i: IMG.fruits[0] },
        { n: 'Green Apples', c: 'Fruits', p: 130, i: IMG.fruits[0] },
        { n: 'Cavendish Bananas', c: 'Fruits', p: 60, i: IMG.fruits[1] },
        { n: 'Yellow Bananas', c: 'Fruits', p: 55, i: IMG.fruits[1] },
        { n: 'MauiPineapple', c: 'Fruits', p: 250, i: IMG.fruits[2] },
        { n: 'Thai Pineapple', c: 'Fruits', p: 220, i: IMG.fruits[2] },
        { n: 'Alphonso Mango', c: 'Fruits', p: 400, i: IMG.fruits[3] },
        { n: 'Honey Mango', c: 'Fruits', p: 320, i: IMG.fruits[3] },
        { n: 'Black Grapes', c: 'Fruits', p: 180, i: IMG.fruits[4] },
        { n: 'Green Grapes', c: 'Fruits', p: 150, i: IMG.fruits[4] },
        { n: 'Creamy Avocado', c: 'Fruits', p: 350, i: IMG.fruits[5] },
        { n: 'Hass Avocado', c: 'Fruits', p: 300, i: IMG.fruits[5] },
        { n: 'Strawberries', c: 'Fruits', p: 200, i: IMG.fruits[6] },
        { n: 'Blueberries', c: 'Fruits', p: 350, i: IMG.fruits[7] },
        
        // Vegetables
        { n: 'Orange Carrots', c: 'Vegetables', p: 60, i: IMG.veg[0] },
        { n: 'Baby Carrots', c: 'Vegetables', p: 90, i: IMG.veg[0] },
        { n: 'Roma Tomatoes', c: 'Vegetables', p: 80, i: IMG.veg[1] },
        { n: 'Cherry Tomatoes', c: 'Vegetables', p: 110, i: IMG.veg[1] },
        { n: 'Red Onions', c: 'Vegetables', p: 50, i: IMG.veg[2] },
        { n: 'White Onions', c: 'Vegetables', p: 65, i: IMG.veg[2] },
        { n: 'Tuscan Kale', c: 'Vegetables', p: 120, i: IMG.veg[3] },
        { n: 'Green Kale', c: 'Vegetables', p: 100, i: IMG.veg[3] },
        { n: 'Red Bell Pepper', c: 'Vegetables', p: 150, i: IMG.veg[4] },
        { n: 'Yellow Pepper', c: 'Vegetables', p: 150, i: IMG.veg[4] },
        { n: 'Russet Potato', c: 'Vegetables', p: 70, i: IMG.veg[5] },
        { n: 'Sweet Potato', c: 'Vegetables', p: 95, i: IMG.veg[6] },
        { n: 'Green Peas', c: 'Vegetables', p: 130, i: IMG.veg[7] },
        { n: 'Sugar Snap Peas', c: 'Vegetables', p: 160, i: IMG.veg[7] },

        // Dairy / Pantry
        { n: 'Whole Milk', c: 'Dairy', p: 80, i: IMG.pantry[0] },
        { n: 'Skim Milk', c: 'Dairy', p: 75, i: IMG.pantry[0] },
        { n: 'Organic Eggs', c: 'Dairy', p: 210, i: IMG.pantry[1] },
        { n: 'Quail Eggs', c: 'Dairy', p: 450, i: IMG.pantry[1] },
        { n: 'Cheddar Cheese', c: 'Dairy', p: 500, i: IMG.pantry[2] },
        { n: 'Gouda Cheese', c: 'Dairy', p: 600, i: IMG.pantry[2] },
        { n: 'Wild Honey', c: 'Dairy', p: 550, i: IMG.pantry[3] },
        { n: 'Manuka Honey', c: 'Dairy', p: 1200, i: IMG.pantry[3] },
        { n: 'Whole Wheat', c: 'Grains', p: 180, i: IMG.pantry[4] },
        { n: 'Buckwheat', c: 'Grains', p: 250, i: IMG.pantry[4] },
        { n: 'Brown Rice', c: 'Grains', p: 160, i: IMG.pantry[5] },
        { n: 'Basmati Rice', c: 'Grains', p: 190, i: IMG.pantry[5] },
        { n: 'Extra Virgin Oil', c: 'Dairy', p: 850, i: IMG.pantry[6] },
        { n: 'Coconut Oil', c: 'Dairy', p: 400, i: IMG.pantry[6] },

        // Herbs
        { n: 'Fresh Basil', c: 'Herbs', p: 50, i: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800' },
        { n: 'Fresh Mint', c: 'Herbs', p: 40, i: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?q=80&w=800' },
        { n: 'Rosemary', c: 'Herbs', p: 65, i: 'https://images.unsplash.com/photo-1596647209707-1ae725cd8a80?q=80&w=800' },
        { n: 'Turmeric', c: 'Herbs', p: 125, i: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800' },
        { n: 'Thyme', c: 'Herbs', p: 55, i: 'https://images.unsplash.com/photo-1540417051310-24751f8a743c?q=80&w=800' },
        { n: 'Oregano', c: 'Herbs', p: 45, i: 'https://images.unsplash.com/photo-1540417051310-24751f8a743c?q=80&w=800' },
        { n: 'Parsley', c: 'Herbs', p: 50, i: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800' },
        { n: 'Cilantro', c: 'Herbs', p: 40, i: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?q=80&w=800' },
        { n: 'Ginger Root', c: 'Herbs', p: 110, i: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800' },
        { n: 'Garlic Bulbs', c: 'Herbs', p: 180, i: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?q=80&w=800' }
    ];

    this.products = raw.map((item, idx) => ({
        _id: 'p' + idx,
        name: item.n,
        category: item.c,
        price: item.p,
        description: `Premium quality organic ${item.n.toLowerCase()} sourced from sustainable fields.`,
        location: idx % 2 === 0 ? 'California' : 'Oregon',
        farmerId: idx % 2 === 0 ? f1 : 'f2',
        imageUrl: item.i
    }));

    console.log(`🚀 Store Live with ${this.products.length} Products`);
  }

  // Common Methods
  async findUserByEmail(email) { return this.users.find(u => u.email === email); }
  async findUserById(id) { return this.users.find(u => u._id === id); }
  async createUser(data) {
    const n = { _id: 'u' + Date.now(), ...data, password: bcrypt.hashSync(data.password, 10), isApproved: data.role === 'user' ? true : false };
    this.users.push(n); return n;
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
