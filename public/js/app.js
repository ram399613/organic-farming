const API_URL = '/api';

const app = {
    cart: [],
    user: null,
    authMode: 'login', // 'login' or 'signup'
    currentView: 'home',

    init() {
        this.fetchProducts();
        this.hideLoader();
        this.updateCartCount();
        this.checkAuth();
        window.addEventListener('scroll', () => this.revealOnScroll());
        this.navigate('home');
    },

    hideLoader() {
        const loader = document.getElementById('loader');
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 500);
            }, 800);
        }
    },

    checkAuth() {
        const token = localStorage.getItem('token');
        if (token) {
            // In a real app, verify token. Here we'll just mock it.
            const savedUser = JSON.parse(localStorage.getItem('user'));
            if (savedUser) {
                this.user = savedUser;
                this.updateAuthUI();
            }
        }
    },

    updateAuthUI() {
        const btn = document.getElementById('auth-btn');
        if (this.user) {
            btn.innerText = `Hi, ${this.user.name.split(' ')[0]}`;
            btn.onclick = () => this.handleLogout();
        } else {
            btn.innerText = 'Sign In';
            btn.onclick = () => this.navigate('login');
        }
    },

    handleLogout() {
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.updateAuthUI();
        this.navigate('home');
        this.showToast("Signed out successfully");
    },

    async fetchProducts() {
        const sb = document.getElementById('searchBar');
        const cf = document.getElementById('categoryFilter');
        const search = sb ? sb.value : '';
        const category = cf ? cf.value : 'All';
        
        try {
            const res = await fetch(`${API_URL}/products?search=${search}&category=${category}`);
            const products = await res.json();
            this.renderProducts(products);
            if (this.currentView === 'home') this.renderFeatured(products);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    },

    renderProducts(products) {
        const container = document.getElementById('category-groups');
        if (!container) return;
        container.innerHTML = '';

        const groups = products.reduce((acc, p) => {
            if (!acc[p.category]) acc[p.category] = [];
            acc[p.category].push(p);
            return acc;
        }, {});

        Object.keys(groups).forEach(cat => {
            const groupHtml = `
                <div class="category-header reveal">
                    <h2 class="category-title">${cat}</h2>
                    <div class="title-underline"></div>
                </div>
                <div class="product-grid">
                    ${groups[cat].map(p => this.createProductCard(p)).join('')}
                </div>
            `;
            container.insertAdjacentHTML('beforeend', groupHtml);
        });
        setTimeout(() => this.revealOnScroll(), 100);
    },

    renderFeatured(products) {
        const container = document.getElementById('featured-grid');
        if (!container) return;
        container.innerHTML = products.slice(0, 3).map(p => this.createProductCard(p)).join('');
    },

    createProductCard(p) {
        return `
            <div class="product-card reveal">
                <span class="organic-badge">Organic</span>
                <img src="${p.imageUrl}" class="product-img" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500'">
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 0.5rem;">📍 ${p.location || 'Organic Farm, India'}</p>
                    <div class="product-footer">
                        <span class="price">₹${p.price}</span>
                        <button class="add-btn" onclick="app.addToCart('${p._id}', '${p.name}', ${p.price})">+</button>
                    </div>
                </div>
            </div>
        `;
    },

    navigate(view) {
        this.currentView = view;
        const views = ['home', 'market', 'education', 'farmer', 'admin'];
        
        views.forEach(v => {
            const el = document.getElementById(`${v}-view`);
            if (el) el.style.display = (v === view) ? 'block' : 'none';
            const link = document.getElementById(`link-${v}`);
            if (link) link.classList.toggle('active', v === view);
        });

        if (view === 'login') this.openLogin();
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => this.revealOnScroll(), 100);
    },

    openLogin() {
        document.getElementById('login-modal').style.display = 'flex';
    },

    closeLogin() {
        document.getElementById('login-modal').style.display = 'none';
    },

    toggleAuthMode() {
        this.authMode = (this.authMode === 'login') ? 'signup' : 'login';
        document.getElementById('auth-title').innerText = (this.authMode === 'login') ? 'Sign In' : 'Create Account';
        document.getElementById('role-select').style.display = (this.authMode === 'signup') ? 'block' : 'none';
    },

    async handleAuth(e) {
        e.preventDefault();
        const email = document.getElementById('auth-email').value;
        const pass = document.getElementById('auth-pass').value;
        const role = document.getElementById('auth-role').value;

        try {
            const endpoint = (this.authMode === 'login') ? '/api/auth/login' : '/api/auth/register';
            const body = (this.authMode === 'login') ? { email, password: pass } : { email, password: pass, name: email.split('@')[0], role };
            
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();

            if (res.ok) {
                this.user = data.user;
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                this.updateAuthUI();
                this.closeLogin();
                this.showToast(`Welcome back, ${this.user.name}!`);
                if (this.user.role === 'farmer') this.navigate('farmer');
                if (this.user.role === 'admin') this.navigate('admin');
            } else {
                this.showToast(data.message || "Auth failed");
            }
        } catch (err) {
            this.showToast("Connection error");
        }
    },

    handleFarmerSignup(e) {
        e.preventDefault();
        this.showToast("Registration submitted! Pending admin approval.");
        setTimeout(() => this.navigate('home'), 1500);
    },

    addToCart(id, name, price) {
        const existing = this.cart.find(item => item.id === id);
        if (existing) {
            existing.qty++;
        } else {
            this.cart.push({ id, name, price, qty: 1 });
        }
        this.updateCartCount();
        this.renderCart();
        this.showToast(`Added ${name} to basket`);
    },

    renderCart() {
        const container = document.getElementById('cart-items');
        const totalEl = document.getElementById('total-amount');
        if (!container) return;
        container.innerHTML = this.cart.map((item, idx) => `
            <div class="cart-item">
                <div class="item-info"><h4>${item.name}</h4><p>₹${item.price} x ${item.qty}</p></div>
                <button class="remove-btn" onclick="app.removeFromCart(${idx})">🗑️</button>
            </div>
        `).join('');
        const total = this.cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
        totalEl.innerText = total;
    },

    removeFromCart(idx) {
        this.cart.splice(idx, 1);
        this.updateCartCount();
        this.renderCart();
    },

    updateCartCount() {
        const count = document.getElementById('cart-count');
        if (count) count.innerText = this.cart.reduce((acc, item) => acc + item.qty, 0);
    },

    toggleCart() {
        const sidebar = document.getElementById('cart-sidebar');
        sidebar.style.display = (sidebar.style.display === 'none') ? 'flex' : 'none';
        if (sidebar.style.display === 'flex') this.renderCart();
    },

    checkout() {
        if (this.cart.length === 0) return this.showToast("Basket is empty");
        this.showToast("Order placed successfully! Connecting with farmers...");
        this.cart = [];
        this.updateCartCount();
        this.toggleCart();
    },

    showToast(msg) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.style.cssText = `background:#1e293b; color:white; padding:1rem 2rem; border-radius:12px; margin-top:1rem; border-left:4px solid var(--primary); box-shadow:0 10px 20px rgba(0,0,0,0.3); animation:slideIn 0.3s ease-out;`;
        toast.innerText = msg;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    revealOnScroll() {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 50) el.classList.add('active');
        });
    },

    toggleChat() {
        const chat = document.getElementById('chatbot-window');
        if (!chat) return;
        const isHidden = chat.style.display === 'none';
        chat.style.display = isHidden ? 'flex' : 'none';
        
        // Add welcome message if empty
        const messages = document.getElementById('chat-messages');
        if (isHidden && messages && messages.children.length === 0) {
            this.appendMessage('bot', "Welcome to Organic Farming Hub! I'm AgriBot, your personal farming assistant. How can I help you grow today?");
        }
    },

    async sendChat() {
        const input = document.getElementById('chatInput');
        const msg = input.value.trim();
        if (!msg) return;

        this.appendMessage('user', msg);
        input.value = '';

        // Show "typing" indicator
        const typingId = 'bot-typing-' + Date.now();
        const container = document.getElementById('chat-messages');
        const div = document.createElement('div');
        div.className = 'msg bot typing';
        div.id = typingId;
        div.innerText = "...";
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;

        // Expanded Knowledge Base
        const KB = {
            'soil': "Soil health is the foundation. Use <b>crop rotation</b> and <b>green manures</b>. If your soil is acidic, add lime; if alkaline, add organic sulfur or peat moss.",
            'pest': "For pests, use <b>Integrated Pest Management (IPM)</b>. Neem oil spray, yellow sticky traps, and introducing ladybugs are excellent chemical-free solutions.",
            'fertilizer': "The best organic fertilizers are <b>Vermicompost</b>, <b>Seaweed extract</b>, and <b>Fish emulsion</b>. You can also make Jeevamrutha using cow dung and jaggery.",
            'weed': "Manage weeds by <b>mulching</b> heavily with straw or wood chips. You can also use flame weeders or organic vinegar-based sprays for paths.",
            'water': "Conserve water with <b>drip irrigation</b>. Watering early in the morning reduces evaporation and prevents fungal diseases on leaves.",
            'seed': "Always use <b>heirloom or non-GMO organic seeds</b>. They are better adapted to local conditions and you can save them for next season.",
            'compost': "A good compost pile needs a <b>C:N ratio of 30:1</b>. Mix 'browns' (dried leaves, cardboard) with 'greens' (food scraps, fresh grass).",
            'tomato': "Tomatoes need <b>calcium</b> to prevent blossom end rot. Add crushed eggshells to the soil and ensure consistent watering.",
            'disease': "For fungal diseases like powdery mildew, use a spray of <b>1 part milk to 9 parts water</b>. It changes the leaf pH and kills fungi.",
            'certification': "To get certified organic, you usually need to avoid synthetic chemicals for <b>3 years</b>. Contact your local organic certifying body for an audit.",
            'hello': "Hello! I am AgriBot, your expert guide to organic farming. Ask me about soil, pests, fertilizers, or specific crops!",
            'help': "I can help with: \n1. Soil preparation\n2. Pest control\n3. Organic fertilizers\n4. Crop-specific advice\n5. Certification guidance"
        };

        setTimeout(() => {
            document.getElementById(typingId).remove();
            let reply = "I'm not quite sure about that specific detail. However, in organic farming, the general rule is to focus on <b>preventative care</b> and <b>biological diversity</b>. Could you try asking about soil, pests, or fertilizers?";
            
            const text = msg.toLowerCase();
            for (const key in KB) {
                if (text.includes(key)) {
                    reply = KB[key];
                    break;
                }
            }

            this.appendMessage('bot', reply);
        }, 1200);
    },

    appendMessage(sender, text) {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        const div = document.createElement('div');
        div.className = `msg ${sender}`;
        div.innerHTML = text; // Enable HTML for bold tags and breaks
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }
};

window.onload = () => app.init();
