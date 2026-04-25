const bcrypt = require('bcryptjs');

const POOLS = {
    Fruits: [
        { name: 'Red Apple', img: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?w=500' },
        { name: 'Organic Banana', img: 'https://images.unsplash.com/photo-1571771894821-ad9902d83f4e?w=500' },
        { name: 'Sweet Mango', img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500' },
        { name: 'Juicy Orange', img: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=500' },
        { name: 'Fresh Pineapple', img: 'https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=500' },
        { name: 'Watermelon', img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500' },
        { name: 'Strawberries', img: 'https://images.unsplash.com/photo-1464960350295-c92c8c690ec7?w=500' },
        { name: 'Cherries', img: 'https://images.unsplash.com/photo-1528821128474-27f963b067f7?w=500' },
        { name: 'Grapes', img: 'https://images.unsplash.com/photo-1533604131587-3282c3f2ec9e?w=500' },
        { name: 'Avocado', img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500' }
    ],
    Vegetables: [
        { name: 'Tomato', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500' },
        { name: 'Potato', img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500' },
        { name: 'Red Onion', img: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=500' },
        { name: 'Carrot', img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500' },
        { name: 'Broccoli', img: 'https://images.unsplash.com/photo-1452948491233-ad8a1ed01085?w=500' },
        { name: 'Spinach', img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500' },
        { name: 'Capsicum', img: 'https://images.unsplash.com/photo-1563513307168-a4262ed37511?w=500' },
        { name: 'Cucumber', img: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=500' },
        { name: 'Cabbage', img: 'https://images.unsplash.com/photo-1550142411-125513b9c099?w=500' },
        { name: 'Cauliflower', img: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=500' }
    ],
    Dairy: [
        { name: 'Fresh Milk', img: 'https://images.unsplash.com/photo-1563636619-e910029339e0?w=500' },
        { name: 'Organic Butter', img: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500' },
        { name: 'Artisan Cheese', img: 'https://images.unsplash.com/photo-1486297678162-ad2a19b058fb?w=500' },
        { name: 'Greek Yogurt', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500' },
        { name: 'Fresh Eggs', img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500' }
    ],
    Grains: [
        { name: 'Brown Rice', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500' },
        { name: 'Whole Wheat', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500' },
        { name: 'Oats', img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500' },
        { name: 'Quinoa', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500' },
        { name: 'Lentils', img: 'https://images.unsplash.com/photo-1515942400420-2b98fed1f515?w=500' }
    ],
    Herbs: [
        { name: 'Fresh Basil', img: 'https://images.unsplash.com/photo-1618375511471-9783f6080b05?w=500' },
        { name: 'Rosemary', img: 'https://images.unsplash.com/photo-1594313054113-9af9621370bc?w=500' },
        { name: 'Mint Leaves', img: 'https://images.unsplash.com/photo-1615485290382-441e4d019cb0?w=500' },
        { name: 'Turmeric Root', img: 'https://images.unsplash.com/photo-1615485290382-441e4d019cb0?w=500' },
        { name: 'Mixed Spices', img: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=500' }
    ]
};

class LocalStore {
    constructor() {
        this.users = []; this.products = []; this.orders = [];
        this.init();
    }

    init() {
        this.users = [
            { _id: 'admin_1', name: 'Platform Admin', email: 'admin@organic.com', password: 'password', role: 'admin', isApproved: true },
            { _id: 'farmer_1', name: 'Green Valley Farms', email: 'farmer@organic.com', password: 'password', role: 'farmer', isApproved: true, location: 'Himachal Pradesh' },
            { _id: 'user_1', name: 'John Buyer', email: 'user@organic.com', password: 'password', role: 'user', isApproved: true }
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
