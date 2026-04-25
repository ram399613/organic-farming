const bcrypt = require('bcryptjs');

const POOLS = {
    Fruits: [
        { name: 'Apple', img: '/product-images/apple.png' },
        { name: 'Banana', img: '/product-images/banana.jpg' },
        { name: 'Mango', img: '/product-images/mango.jpg' },
        { name: 'Orange', img: '/product-images/orange.jpg' },
        { name: 'Pineapple', img: '/product-images/pineapple.jpg' },
        { name: 'Watermelon', img: '/product-images/watermelon.jpg' },
        { name: 'Strawberry', img: '/product-images/strawberry.jpg' },
        { name: 'Cherry', img: '/product-images/cherry.jpg' },
        { name: 'Dragon Fruit', img: '/product-images/dragon-fruit.jpg' },
        { name: 'Avocado', img: '/product-images/avocado.jpg' },
        { name: 'Blueberries', img: '/product-images/blueberries.jpg' }
    ],
    Vegetables: [
        { name: 'Tomato', img: '/product-images/tomato.jpg' },
        { name: 'Potato', img: '/product-images/potato.jpg' },
        { name: 'Onion', img: '/product-images/onion.jpg' },
        { name: 'Carrot', img: '/product-images/carrot.jpg' },
        { name: 'Cabbage', img: '/product-images/cabbage.jpg' },
        { name: 'Broccoli', img: '/product-images/broccoli.jpg' },
        { name: 'Spinach', img: '/product-images/spinach.jpg' },
        { name: 'Brinjal', img: '/product-images/brinjal.jpg' },
        { name: 'Capsicum', img: '/product-images/capsicum.jpg' },
        { name: 'Green Peas', img: '/product-images/green-peas.jpg' },
        { name: 'Sweet Potato', img: '/product-images/sweet-potato.jpg' },
        { name: 'Garlic', img: '/product-images/garlic.jpg' }
    ],
    Dairy: [
        { name: 'Butter', img: '/product-images/butter.jpg' },
        { name: 'Cheese', img: '/product-images/cheese.jpg' },
        { name: 'Ghee', img: '/product-images/ghee.jpg' },
        { name: 'Yogurt', img: '/product-images/greek-yogurt.jpg' },
        { name: 'Cottage Cheese', img: '/product-images/goat-cheese.jpg' },
        { name: 'Eggs', img: '/product-images/eggs.jpg' },
        { name: 'Mozzarella', img: '/product-images/mozzarella.jpg' }
    ],
    Grains: [
        { name: 'Rice', img: '/product-images/rice.jpg' },
        { name: 'Maize', img: '/product-images/maize.jpg' },
        { name: 'Oats', img: '/product-images/oats.jpg' },
        { name: 'Barley', img: '/product-images/barley.jpg' },
        { name: 'Lentils', img: '/product-images/lentils.jpg' },
        { name: 'Quinoa', img: '/product-images/quinoa.jpg' },
        { name: 'Chia Seeds', img: '/product-images/chia-seeds.jpg' }
    ],
    Herbs: [
        { name: 'Fresh Basil', img: '/product-images/basil.jpg' },
        { name: 'Organic Mint', img: '/product-images/dried-oregano.jpg' },
        { name: 'Fresh Rosemary', img: '/product-images/rosemary.jpg' },
        { name: 'Organic Thyme', img: '/product-images/thyme.jpg' },
        { name: 'Italian Parsley', img: '/product-images/parsley.jpg' },
        { name: 'Fresh Cilantro', img: '/product-images/cilantro.jpg' },
        { name: 'Organic Turmeric', img: '/product-images/turmeric.jpg' },
        { name: 'Mixed Herbs', img: '/product-images/herbs.jpg' }
    ]
};

class LocalStore {
    constructor() {
        this.users = []; this.products = []; this.orders = [];
        this.init();
    }

    init() {
        this.users = [
            { _id: 'admin_1', name: 'Platform Admin', email: 'admin@organic.com', password: bcrypt.hashSync('password', 10), role: 'admin', isApproved: true },
            { _id: 'farmer_1', name: 'Green Valley Farms', email: 'farmer@organic.com', password: bcrypt.hashSync('password', 10), role: 'farmer', isApproved: true, location: 'Himachal Pradesh' },
            { _id: 'user_1', name: 'John Buyer', email: 'user@organic.com', password: bcrypt.hashSync('password', 10), role: 'user', isApproved: true }
        ];

        let pCount = 0;
        Object.keys(POOLS).forEach(cat => {
            POOLS[cat].forEach((item, i) => {
                this.products.push({
                    _id: 'p' + (pCount++),
                    name: item.name,
                    category: cat,
                    price: 45 + (i * 15),
                    imageUrl: item.img,
                    farmerId: 'farmer_1'
                });
            });
        });
    }

    async getAllProducts(filters = {}) {
        let res = [...this.products];
        
        // Join with farmer info for location filtering
        res = res.map(p => {
            const farmer = this.users.find(u => u._id === p.farmerId);
            return { ...p, farmerLocation: farmer ? farmer.location : 'Unknown' };
        });

        if (filters.category && filters.category !== 'All') {
            res = res.filter(p => p.category === filters.category);
        }
        if (filters.location && filters.location !== 'All') {
            res = res.filter(p => p.farmerLocation === filters.location);
        }
        if (filters.search) {
            const s = filters.search.toLowerCase();
            res = res.filter(p => p.name.toLowerCase().includes(s));
        }
        return res;
    }

    async findUserByEmail(e) { return this.users.find(u => u.email === e); }
    
    async registerUser(userData) {
        const newUser = { 
            _id: 'u' + Date.now(), 
            ...userData, 
            password: bcrypt.hashSync(userData.password, 10),
            isApproved: userData.role !== 'farmer' // Farmers need approval
        };
        this.users.push(newUser);
        return newUser;
    }

    async createOrder(o) {
        const order = { ...o, _id: 'o' + Date.now(), createdAt: new Date() };
        this.orders.push(order);
        return order;
    }

    async approveFarmer(id) {
        const user = this.users.find(u => u._id === id);
        if (user) user.isApproved = true;
        return user;
    }

    async getAdminStats() {
        return {
            totalUsers: this.users.length,
            totalFarmers: this.users.filter(u => u.role === 'farmer').length,
            pendingFarmers: this.users.filter(u => u.role === 'farmer' && !u.isApproved)
        };
    }
}

module.exports = new LocalStore();
