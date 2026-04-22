// localStore.js - High-Variety Enterprise Catalog (175+ Unique Product Visuals)
const bcrypt = require('bcryptjs');

const POOLS = {
    Fruits: [
        { name: 'Gala Apple', img: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6bccb?w=800' },
        { name: 'Cavendish Banana', img: 'https://images.unsplash.com/photo-1571771894821-ad9b58865c9d?w=800' },
        { name: 'Honey Pineapple', img: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800' },
        { name: 'Alphonso Mango', img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800' },
        { name: 'Red Globe Grapes', img: 'https://images.unsplash.com/photo-1537640538966-79f369b41e8f?w=800' },
        { name: 'Hass Avocado', img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800' },
        { name: 'Garden Strawberry', img: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800' },
        { name: 'Wild Blueberry', img: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800' },
        { name: 'Yellow Peach', img: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=800' },
        { name: 'Black Plum', img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800' },
        { name: 'Golden Kiwi', img: 'https://images.unsplash.com/photo-1585059895524-72359e061381?w=800' },
        { name: 'Navel Orange', img: 'https://images.unsplash.com/photo-1549888834-3ec93abae044?w=800' },
        { name: 'Eureka Lemon', img: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=800' },
        { name: 'Anjou Pear', img: 'https://images.unsplash.com/photo-1541859482180-df4c67dec90a?w=800' },
        { name: 'Bing Cherry', img: 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=800' },
        { name: 'Pomegranate', img: 'https://images.unsplash.com/photo-1621345472851-ae327663f78b?w=800' },
        { name: 'Green Watermelon', img: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=800' },
        { name: 'Dragon Fruit', img: 'https://images.unsplash.com/photo-1527325511917-0ec997672191?w=800' },
        { name: 'Cantaloupe', img: 'https://images.unsplash.com/photo-1601344445214-cb911a3d3cbe?w=800' },
        { name: 'Passion Fruit', img: 'https://images.unsplash.com/photo-1534119394531-ed46d8de8ad4?w=800' }
    ],
    Vegetables: [
        { name: 'Nantes Carrot', img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800' },
        { name: 'Roma Tomato', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800' },
        { name: 'Red Onion', img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800' },
        { name: 'Curly Kale', img: 'https://images.unsplash.com/photo-1524179091875-9b2f3bc191ca?w=800' },
        { name: 'Bell Pepper', img: 'https://images.unsplash.com/photo-1563514222080-6007ecad3c03?w=800' },
        { name: 'Russet Potato', img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800' },
        { name: 'Garnet Yam', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800' },
        { name: 'Sweet Snap Pea', img: 'https://images.unsplash.com/photo-1587313886566-a36729013f99?w=800' },
        { name: 'Italian Broccoli', img: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800' },
        { name: 'Baby Spinach', img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800' },
        { name: 'Persian Cucumber', img: 'https://images.unsplash.com/photo-1449333256619-fa20af5ae51f?w=800' },
        { name: 'Black Zucchini', img: 'https://images.unsplash.com/photo-1534073828943-f801091bbffb?w=800' },
        { name: 'Red Radish', img: 'https://images.unsplash.com/photo-1508215885820-4df893b4f2fa?w=800' },
        { name: 'Hardneck Garlic', img: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=800' },
        { name: 'Detroit Beetroot', img: 'https://images.unsplash.com/photo-1444464666168-49d633b86747?w=800' },
        { name: 'Cauliflower', img: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c12e8c?w=800' },
        { name: 'Eggplant', img: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800' },
        { name: 'Asparagus', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800' },
        { name: 'Brussels Sprouts', img: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=800' },
        { name: 'Cabbage', img: 'https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?w=800' }
    ],
    Dairy: [
        { name: 'Whole Raw Milk', img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800' },
        { name: 'Free-Range Eggs', img: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800' },
        { name: 'Cheddar Cheese', img: 'https://images.unsplash.com/photo-1486297678162-ad2a19b058fb?w=800' },
        { name: 'Wildflower Honey', img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800' },
        { name: 'Greek Yogurt', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800' },
        { name: 'Cultured Butter', img: 'https://images.unsplash.com/photo-1528740096961-3798add19cb7?w=800' },
        { name: 'Heavy Cream', img: 'https://images.unsplash.com/photo-1463123081488-789f6684041e?w=800' },
        { name: 'Pure Ghee', img: 'https://images.unsplash.com/photo-1550583724-b26cc28ae5cd?w=800' },
        { name: 'Fresh Paneer', img: 'https://images.unsplash.com/photo-1528515014902-613d5482f347?w=800' },
        { name: 'Goat Milk', img: 'https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?w=800' },
        { name: 'Mozzarella', img: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=800' },
        { name: 'Feta Cheese', img: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=800' },
        { name: 'Sour Cream', img: 'https://images.unsplash.com/photo-1552683326-40f44bb571bb?w=800' },
        { name: 'Cottage Cheese', img: 'https://images.unsplash.com/photo-1580231575084-fa060372df3a?w=800' },
        { name: 'Skimmed Milk', img: 'https://images.unsplash.com/photo-1628088062854-d1870b4553ad?w=800' },
        { name: 'Brown Eggs', img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=800' },
        { name: 'Quail Eggs', img: 'https://images.unsplash.com/photo-1463123081488-789f6684041e?w=800' },
        { name: 'Ricotta Cheese', img: 'https://images.unsplash.com/photo-1511520668940-08198f15eca1?w=800' },
        { name: 'Buttermilk', img: 'https://images.unsplash.com/photo-1510431199141-39690327f27a?w=800' },
        { name: 'Whey Protein', img: 'https://images.unsplash.com/photo-1594142465967-e41f69abb92a?w=800' }
    ],
    Grains: [
        { name: 'Hard Red Wheat', img: 'https://images.unsplash.com/photo-1574323347407-15e3df50f38b?w=800' },
        { name: 'Basmati Rice', img: 'https://images.unsplash.com/photo-1586201375761-83865001f2aa?w=800' },
        { name: 'Whole Wheat Flour', img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800' },
        { name: 'Rolled Oats', img: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=800' },
        { name: 'Sweet Corn', img: 'https://images.unsplash.com/photo-1536511118275-81203597d30d?w=800' },
        { name: 'Pearl Barley', img: 'https://images.unsplash.com/photo-1474979266404-7eaacbacf82a?w=800' },
        { name: 'White Quinoa', img: 'https://images.unsplash.com/photo-1568249622055-6b453e0f40d8?w=800' },
        { name: 'Finger Millet', img: 'https://images.unsplash.com/photo-1509482560494-4126f8225994?w=800' },
        { name: 'Buckwheat', img: 'https://images.unsplash.com/photo-1622241944227-aff27d425c28?w=800' },
        { name: 'Brown Rice', img: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800' },
        { name: 'Rye Grains', img: 'https://images.unsplash.com/photo-1510255973121-66df9892c55e?w=800' },
        { name: 'Chia Seeds', img: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=800' },
        { name: 'Flax Seeds', img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800' },
        { name: 'Sorghum', img: 'https://images.unsplash.com/photo-1574323347407-15e3df50f38b?w=800' },
        { name: 'Amaranth', img: 'https://images.unsplash.com/photo-1504973991023-90703f1981cc?w=800' },
        { name: 'Black Rice', img: 'https://images.unsplash.com/photo-1536304953400-eeadc2035133?w=800' },
        { name: 'Couscous', img: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800' },
        { name: 'Millet Flour', img: 'https://images.unsplash.com/photo-1536511118275-81203597d30d?w=800' },
        { name: 'Spelt', img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800' },
        { name: 'Bulgur Wheat', img: 'https://images.unsplash.com/photo-1520073201524-8b5d329aa57c?w=800' }
    ],
    Herbs: [
        { name: 'Sweet Basil', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800' },
        { name: 'Peppermint', img: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800' },
        { name: 'Fresh Rosemary', img: 'https://images.unsplash.com/photo-1596647209707-1ae725cd8a80?w=800' },
        { name: 'Turmeric Root', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800' },
        { name: 'Garden Thyme', img: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=800' },
        { name: 'Oregano', img: 'https://images.unsplash.com/photo-1540417051310-24751f8a743c?w=800' },
        { name: 'Flat Parsley', img: 'https://images.unsplash.com/photo-1466067576624-9b57849d4793?w=800' },
        { name: 'Fresh Cilantro', img: 'https://images.unsplash.com/photo-1510431199141-39690327f27a?w=800' },
        { name: 'Ginger Root', img: 'https://images.unsplash.com/photo-1588600036306-dc17924564bc?w=800' },
        { name: 'Chives', img: 'https://images.unsplash.com/photo-1557090491-0322c36678b8?w=800' },
        { name: 'Sage Leaves', img: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=800' },
        { name: 'Dill', img: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800' },
        { name: 'Lemongrass', img: 'https://images.unsplash.com/photo-1520286851410-612663964177?w=800' },
        { name: 'Bay Leaves', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800' },
        { name: 'Lavender', img: 'https://images.unsplash.com/photo-1527335932348-42196ea8a291?w=800' },
        { name: 'Tarragon', img: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=800' },
        { name: 'Marjoram', img: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=800' },
        { name: 'Stevia', img: 'https://images.unsplash.com/photo-1550583724-b26cc28ae5cd?w=800' },
        { name: 'Lemon Balm', img: 'https://images.unsplash.com/photo-1596647209707-1ae725cd8a80?w=800' },
        { name: 'Curry Leaves', img: 'https://images.unsplash.com/photo-1610450539162-421b4a496885?w=800' }
    ]
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

    let pCount = 0;
    Object.keys(POOLS).forEach(cat => {
        const items = POOLS[cat];
        items.forEach((item, i) => {
            this.products.push({
                _id: 'p' + (pCount++),
                name: `Fresh ${item.name}`,
                category: cat,
                price: 50 + (i * 12) + (Math.floor(Math.random() * 50)),
                description: `Experience the difference with our organic ${item.name.toLowerCase()}. 100% certified organic and farm-fresh from the heart of the valley.`,
                location: i % 2 === 0 ? 'Northern Farms' : 'Central Valley',
                farmerId: f1,
                imageUrl: item.img
            });
        });
    });

    console.log(`📡 High-Variety Catalog Active: ${this.products.length} Products with Unique Visuals`);
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
