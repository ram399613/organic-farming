const bcrypt = require('bcryptjs');

const POOLS = {
    Fruits: [
        { name: 'Apple', img: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=800' },
        { name: 'Banana', img: 'https://images.unsplash.com/photo-1543218024-57a70143c369?w=800' },
        { name: 'Mango', img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800' },
        { name: 'Pineapple', img: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800' },
        { name: 'Orange', img: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=800' },
        { name: 'Grapes', img: 'https://images.unsplash.com/photo-1537640538966-79f369b41e8f?w=800' },
        { name: 'Strawberry', img: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800' },
        { name: 'Papaya', img: 'https://images.unsplash.com/photo-1517282001574-fba0b571eb30?w=800' },
        { name: 'Watermelon', img: 'https://images.unsplash.com/photo-1563270284-38a3003a2e0c?w=800' },
        { name: 'Guava', img: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=800' },
        { name: 'Kiwi', img: 'https://images.unsplash.com/photo-1585059895524-72359e061381?w=800' },
        { name: 'Pomegranate', img: 'https://images.unsplash.com/photo-1621345472851-ae327663f78b?w=800' }
    ],
    Vegetables: [
        { name: 'Tomato', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800' },
        { name: 'Carrot', img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800' },
        { name: 'Broccoli', img: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800' },
        { name: 'Spinach', img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800' },
        { name: 'Potato', img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800' },
        { name: 'Onion', img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800' },
        { name: 'Cabbage', img: 'https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?w=800' },
        { name: 'Cauliflower', img: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c12e8c?w=800' },
        { name: 'Capsicum', img: 'https://images.unsplash.com/photo-1563514222080-6007ecad3c03?w=800' },
        { name: 'Cucumber', img: 'https://images.unsplash.com/photo-1449333256619-fa20af5ae51f?w=800' },
        { name: 'Beetroot', img: 'https://images.unsplash.com/photo-1444464666168-49d633b86747?w=800' },
        { name: 'Garlic', img: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=800' }
    ],
    Dairy: [
        { name: 'Milk', img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800' },
        { name: 'Butter', img: 'https://images.unsplash.com/photo-1528740096961-3798add19cb7?w=800' },
        { name: 'Cheese', img: 'https://images.unsplash.com/photo-1486297678162-ad2a19b058fb?w=800' },
        { name: 'Yogurt', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800' },
        { name: 'Paneer', img: 'https://images.unsplash.com/photo-1564149504294-81c62f927ed9?w=800' },
        { name: 'Cream', img: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=800' },
        { name: 'Ghee', img: 'https://images.unsplash.com/photo-1631709497146-a239ef373cf1?w=800' },
        { name: 'Buttermilk', img: 'https://images.unsplash.com/photo-1510431199141-39690327f27a?w=800' },
        { name: 'Flavored Milk', img: 'https://images.unsplash.com/photo-1550583724-b26cc28ae5cd?w=800' },
        { name: 'Curd', img: 'https://images.unsplash.com/photo-1552683326-40f44bb571bb?w=800' }
    ],
    Grains: [
        { name: 'Rice', img: 'https://images.unsplash.com/photo-1586201375761-83865001f2aa?w=800' },
        { name: 'Wheat', img: 'https://images.unsplash.com/photo-1574323347407-15e3df50f38b?w=800' },
        { name: 'Oats', img: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=800' },
        { name: 'Barley', img: 'https://images.unsplash.com/photo-1474979266404-7eaacbacf82a?w=800' },
        { name: 'Corn', img: 'https://images.unsplash.com/photo-1536511118275-81203597d30d?w=800' },
        { name: 'Quinoa', img: 'https://images.unsplash.com/photo-1568249622055-6b453e0f40d8?w=800' },
        { name: 'Millets', img: 'https://images.unsplash.com/photo-1509482560494-4126f8225994?w=800' },
        { name: 'Brown Rice', img: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800' },
        { name: 'Flour', img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800' },
        { name: 'Lentils', img: 'https://images.unsplash.com/photo-1511200230240-410a624597d3?w=800' }
    ]
};

class LocalStore {
    constructor() {
        this.users = []; this.products = []; this.orders = [];
        this.init();
    }

    init() {
        const f1 = 'farmer_1';
        this.users = [
            { _id: 'admin_1', name: 'Admin', email: 'admin@organic.com', password: bcrypt.hashSync('password', 10), role: 'admin', isApproved: true },
            { _id: f1, name: 'Valley Farms', email: 'farmer@organic.com', password: bcrypt.hashSync('password', 10), role: 'farmer', isApproved: true },
            { _id: 'user_1', name: 'John Doe', email: 'user@organic.com', password: bcrypt.hashSync('password', 10), role: 'user', isApproved: true }
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
                    farmerId: f1
                });
            });
        });
    }

    async getAllProducts(filters = {}) {
        let res = [...this.products];
        if (filters.category && filters.category !== 'All') {
            res = res.filter(p => p.category === filters.category);
        }
        if (filters.search) {
            const s = filters.search.toLowerCase();
            res = res.filter(p => p.name.toLowerCase().includes(s));
        }
        return res;
    }

    async findUserByEmail(e) { return this.users.find(u => u.email === e); }
    async createOrder(o) {
        const order = { ...o, _id: 'o' + Date.now(), createdAt: new Date() };
        this.orders.push(order);
        return order;
    }
}

module.exports = new LocalStore();
