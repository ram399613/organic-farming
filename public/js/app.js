const API_URL = '/api';

const app = {
    cart: [],
    user: null,
    authMode: 'login', // 'login' or 'signup'
    currentView: 'home',

    async init() {
        await this.fetchProducts();
        this.hideLoader();
        this.updateCartCount();
        this.checkAuth();
        window.addEventListener('scroll', () => this.revealOnScroll());
        if (!this.user) {
            this.navigate('login');
        } else {
            this.navigate('home');
        }
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
            }
        }
        this.updateAuthUI();
    },

    updateAuthUI() {
        const btn = document.getElementById('auth-btn');
        const nav = document.querySelector('nav.glass-nav');
        const footer = document.querySelector('footer.premium-footer');
        const chatTrigger = document.getElementById('chatbot-trigger');
        
        if (this.user) {
            if (nav) nav.style.display = '';
            if (footer) footer.style.display = '';
            if (chatTrigger) chatTrigger.style.display = '';
            
            if (btn) {
                btn.innerText = `Dashboard`;
                btn.onclick = () => this.navigate('dashboard');
            }
            
            // Auto-redirect if on login page
            if (this.currentView === 'login' || this.currentView === 'signup') {
                this.navigate('home');
            }
        } else {
            if (nav) nav.style.display = 'none';
            if (footer) footer.style.display = 'none';
            if (chatTrigger) chatTrigger.style.display = 'none';
            
            if (btn) {
                btn.innerText = 'Sign In';
                btn.onclick = () => this.navigate('login');
            }
        }
    },

    handleLogout() {
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.updateAuthUI();
        this.navigate('login');
        this.showToast("Signed out successfully");
    },

    async fetchProducts() {
        const container = document.getElementById('category-groups');
        if (container && container.innerHTML === '') {
            this.renderSkeletons();
        }

        const sb = document.getElementById('searchBar');
        const cf = document.getElementById('categoryFilter');
        const lf = document.getElementById('locationFilter');
        const search = sb ? sb.value : '';
        const category = cf ? cf.value : 'All';
        const location = lf ? lf.value : 'All';
        
        try {
            const res = await fetch(`${API_URL}/products?search=${search}&category=${category}&location=${location}`);
            if (!res.ok) throw new Error('Network response was not ok');
            const products = await res.json();
            this.renderProducts(products);
            if (this.currentView === 'home') this.renderFeatured(products);
        } catch (err) {
            console.error('Fetch error:', err);
            if (container) container.innerHTML = `<p style="text-align:center; padding: 2rem; color: var(--text-dim);">Error loading fresh produce. Please refresh the page. 🍃</p>`;
        }
    },

    renderSkeletons() {
        const container = document.getElementById('category-groups');
        if (!container) return;
        let skeletonHtml = '<div class="product-grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem; margin-top: 2rem;">';
        for (let i = 0; i < 8; i++) skeletonHtml += '<div class="skeleton-card"></div>';
        skeletonHtml += '</div>';
        container.innerHTML = skeletonHtml;
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
                <div class="category-header">
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
        const isLive = Math.random() > 0.7; // Mock real-time live status
        return `
            <div class="product-card">
                <div class="card-badges">
                    <span class="organic-badge">Organic</span>
                    ${isLive ? '<span class="live-badge">● Live</span>' : ''}
                </div>
                <img src="${p.imageUrl}" class="product-img" alt="${p.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500'">
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p style="font-size: 0.85rem; color: var(--text-dim); margin-bottom: 0.8rem;">
                        <span style="color: var(--primary);">📍</span> ${p.farmerLocation || 'Organic Farm, India'}
                    </p>
                    <div class="product-footer">
                        <span class="price">₹${p.price}</span>
                        <button class="add-btn" onclick="app.addToCart('${p._id}', '${p.name}', ${p.price}, '${p.imageUrl}')">+</button>
                    </div>
                </div>
            </div>
        `;
    },

    navigate(view) {
        if (!this.user && view !== 'login' && view !== 'signup') {
            if (view !== 'home') this.showToast("Please sign in to access the platform");
            return this.navigate('login');
        }

        if (view === 'login' && this.user) {
            return this.navigate(this.user.role === 'farmer' ? 'farmer' : 'home');
        }

        this.currentView = view;
        const views = ['home', 'market', 'education', 'contact', 'shipping', 'privacy', 'blog', 'farmer', 'admin', 'login', 'dashboard'];
        
        views.forEach(v => {
            const el = document.getElementById(`${v}-view`);
            if (el) el.style.display = (v === view) ? 'block' : 'none';
            const link = document.getElementById(`link-${v}`);
            if (link) link.classList.toggle('active', v === view);
        });

        if (view === 'market') this.fetchProducts();

        if (view === 'admin' && this.user && this.user.role === 'admin') {
            this.fetchAdminData();
        }

        if (view === 'farmer') {
            if (this.user.role !== 'farmer') {
                this.showToast("Farmer Portal is reserved for our certified partners.");
                this.navigate('home');
                return;
            }
            document.getElementById('farmer-dashboard').style.display = this.user.isApproved ? 'block' : 'none';
            document.getElementById('farmer-onboarding').style.display = this.user.isApproved ? 'none' : 'block';
        }

        if (view === 'dashboard') {
            this.renderDashboard();
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => this.revealOnScroll(), 100);
    },

    handleContact(e) {
        e.preventDefault();
        this.showToast("Message sent! Our farmers will grow back to you soon. 🌱");
        e.target.reset();
    },

    navigateAndFilter(view, category = 'All') {
        this.navigate(view);
        if (view === 'market') {
            const cf = document.getElementById('categoryFilter');
            if (cf) {
                cf.value = category;
                this.fetchProducts();
            }
        }
    },

    async renderDashboard() {
        if (!this.user) return;
        
        const nameEl = document.getElementById('dash-name');
        const emailEl = document.getElementById('dash-email');
        const roleEl = document.getElementById('dash-role');
        
        if (nameEl) nameEl.innerText = this.user.name;
        if (emailEl) emailEl.innerText = this.user.email;
        if (roleEl) roleEl.innerText = this.user.role.charAt(0).toUpperCase() + this.user.role.slice(1);
        
        const cartSummary = document.getElementById('dash-cart-summary');
        if (cartSummary) {
            if (this.cart.length === 0) {
                cartSummary.innerHTML = '<p>Your basket is empty.</p>';
            } else {
                cartSummary.innerHTML = `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Items:</span> <strong>${this.cart.reduce((sum, item) => sum + item.qty, 0)}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Total:</span> <strong>₹${this.calculateTotal()}</strong>
                    </div>
                `;
            }
        }

        try {
            const res = await fetch(`${API_URL}/orders`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                const orders = await res.json();
                const ordersList = document.getElementById('dash-orders');
                if (ordersList) {
                    if (orders.length === 0) {
                        ordersList.innerHTML = '<p style="color: var(--text-dim);">No recent orders found.</p>';
                    } else {
                        ordersList.innerHTML = orders.map(o => `
                            <div style="padding: 1rem; border: 1px solid var(--glass-border); border-radius: var(--radius-sm); margin-bottom: 1rem;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                    <strong>Order #${o._id.substring(0, 8)}</strong>
                                    <span style="color: var(--primary);">₹${o.totalAmount}</span>
                                </div>
                                <small style="color: var(--text-dim);">${new Date(o.createdAt).toLocaleDateString()}</small>
                            </div>
                        `).join('');
                    }
                }
            } else if (res.status === 401 || res.status === 403) {
                this.handleLogout();
            }
        } catch (err) {
            console.error("Dashboard fetch error:", err);
        }
    },

    toggleAuthMode() {
        this.authMode = (this.authMode === 'login') ? 'signup' : 'login';
        document.getElementById('auth-title').innerText = (this.authMode === 'login') ? 'Welcome Back' : 'Join the Hub';
        document.getElementById('auth-toggle-text').innerText = (this.authMode === 'login') ? "Don't have an account?" : "Already have an account?";
        document.getElementById('role-select').style.display = (this.authMode === 'signup') ? 'block' : 'none';
        document.getElementById('confirm-pass-group').style.display = (this.authMode === 'signup') ? 'block' : 'none';
        document.getElementById('auth-submit-btn').innerText = (this.authMode === 'login') ? 'Sign In' : 'Create Account';
    },

    async handleAuth(e) {
        e.preventDefault();
        const email = document.getElementById('auth-email').value;
        const pass = document.getElementById('auth-pass').value;
        const confirmPass = document.getElementById('auth-confirm-pass').value;
        const role = document.getElementById('auth-role').value;
        const btn = document.getElementById('auth-submit-btn');

        if (this.authMode === 'signup' && pass !== confirmPass) {
            return this.showToast("Passwords do not match");
        }

        try {
            btn.disabled = true;
            btn.innerText = (this.authMode === 'login') ? 'Authenticating...' : 'Creating Account...';
            
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
                this.showToast(`Welcome to the hub, ${this.user.name}! 🌱`);
                if (this.user.role === 'farmer') this.navigate('farmer');
                else if (this.user.role === 'admin') this.navigate('admin');
                else this.navigate('home');
            } else {
                this.showToast(data.message || "Auth failed");
                btn.disabled = false;
                btn.innerText = (this.authMode === 'login') ? 'Sign In' : 'Create Account';
            }
        } catch (err) {
            this.showToast("Connection error. Is the server running?");
            btn.disabled = false;
            btn.innerText = (this.authMode === 'login') ? 'Sign In' : 'Create Account';
        }
    },

    readFullStory(title, img, text) {
        const modal = document.createElement('div');
        modal.className = 'modal active reveal';
        modal.style.zIndex = '7000';
        modal.innerHTML = `
            <div class="modal-content auth-card" style="max-width: 800px; padding: 0; overflow: hidden; border-color: var(--primary);">
                <img src="${img}" style="width: 100%; height: 350px; object-fit: cover;">
                <div style="padding: 3rem;">
                    <h1 style="color: var(--primary); margin-bottom: 1.5rem; font-size: 2.5rem;">${title}</h1>
                    <div style="color: var(--text-dim); line-height: 2; font-size: 1.1rem; white-space: pre-line;">${text}</div>
                    <button class="btn-primary" style="margin-top: 3rem; width: 100%;" onclick="this.parentElement.parentElement.parentElement.remove()">Close Story</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    handleFarmerSignup(e) {
        e.preventDefault();
        this.showToast("Registration submitted! Pending admin approval.");
        setTimeout(() => this.navigate('home'), 1500);
    },

    addToCart(id, name, price, img) {
        const existing = this.cart.find(item => item.id === id);
        if (existing) {
            existing.qty++;
        } else {
            this.cart.push({ id, name, price, img, qty: 1 });
        }
        this.updateCartUI();
        this.showToast(`Harvested ${name} into your basket! 🧺`);
    },

    updateCartUI() {
        const count = document.getElementById('cart-count');
        if (count) count.innerText = this.cart.reduce((acc, item) => acc + item.qty, 0);
        this.renderCart();
    },

    renderCart() {
        const container = document.getElementById('cart-items');
        const totalEl = document.getElementById('total-amount');
        if (!container) return;

        if (this.cart.length === 0) {
            container.innerHTML = `
                <div class="empty-cart-state">
                    <div class="icon">🛒</div>
                    <p>Your harvest basket is empty.</p>
                </div>
            `;
            totalEl.innerText = '0';
            return;
        }

        container.innerHTML = this.cart.map((item, idx) => `
            <div class="cart-item">
                <img src="${item.img}" class="cart-item-img" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>₹${item.price}</p>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="app.updateQty('${item.id}', -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="app.updateQty('${item.id}', 1)">+</button>
                    </div>
                </div>
                <button class="remove-btn-small" onclick="app.updateQty('${item.id}', -${item.qty})">🗑️</button>
            </div>
        `).join('');
        totalEl.innerText = this.calculateTotal();
    },

    updateQty(id, delta) {
        const item = this.cart.find(i => i.id === id);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) {
                this.cart = this.cart.filter(i => i.id !== id);
            }
            this.updateCartUI();
        }
    },

    toggleCart() {
        if (!this.user) {
            this.showToast("Please sign in to view your cart");
            return this.navigate('login');
        }
        const sidebar = document.getElementById('cart-sidebar');
        if (!sidebar) return;
        const isHidden = sidebar.style.display === 'none' || !sidebar.style.display;
        sidebar.style.display = isHidden ? 'flex' : 'none';
        if (isHidden) this.renderCart();
    },

    showToast(msg, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast reveal active`;
        toast.style.cssText = `
            background: rgba(30, 41, 59, 0.9);
            backdrop-filter: blur(10px);
            color: white;
            padding: 1rem 2rem;
            border-radius: var(--radius-lg);
            margin-top: 1rem;
            border: 1px solid var(--glass-border);
            border-left: 4px solid var(--primary);
            box-shadow: 0 10px 30px rgba(0,0,0,0.4);
            font-weight: 600;
        `;
        toast.innerText = msg;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
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

    chatHistory: [],

    async sendChat() {
        const input = document.getElementById('chatInput');
        const msg = input.value.trim();
        if (!msg) return;

        this.appendMessage('user', msg);
        this.chatHistory.push({ role: 'user', content: msg });
        input.value = '';

        const messagesContainer = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'msg bot typing-container';
        typingDiv.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        const statusEl = document.getElementById('chat-status');
        if (statusEl) statusEl.style.opacity = '1';

        try {
            const res = await fetch(`${API_URL}/ai/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg, history: this.chatHistory })
            });
            const data = await res.json();
            
            if (statusEl) statusEl.style.opacity = '0';
            typingDiv.remove();
            if (res.ok) {
                this.chatHistory.push({ role: 'assistant', content: data.reply });
                await this.typeEffect(data.reply);
            } else {
                this.appendMessage('bot', "I'm having a bit of trouble connecting to the network. Let's try again? 🌿");
            }
        } catch (err) {
            typingDiv.remove();
            this.appendMessage('bot', "Our digital farm seems to be offline. Please check your connection! 🚜");
        }
    },

    async typeEffect(text) {
        const container = document.getElementById('chat-messages');
        const div = document.createElement('div');
        div.className = 'msg bot';
        container.appendChild(div);
        
        const words = text.split(' ');
        let currentText = '';
        
        for (let i = 0; i < words.length; i++) {
            currentText += words[i] + ' ';
            div.innerHTML = currentText + '<span class="typing-cursor">|</span>';
            container.scrollTop = container.scrollHeight;
            await new Promise(r => setTimeout(r, 40 + Math.random() * 40));
        }
        div.innerHTML = text; // Final clean text without cursor
    },

    async checkout() {
        if (!this.user) return this.navigate('login');
        if (this.cart.length === 0) return this.showToast("Your basket is empty!");

        try {
            const res = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ 
                    products: this.cart.map(item => ({ product: item.id, quantity: item.qty })), 
                    totalAmount: this.calculateTotal(),
                    paymentMethod: 'Card'
                })
            });

            if (res.ok) {
                this.cart = [];
                this.updateCartUI();
                this.toggleCart();
                this.showToast("Order placed successfully! Harvesting your items now... 🚜");
                
                const overlay = document.createElement('div');
                overlay.className = 'modal reveal active';
                overlay.style.zIndex = '6000';
                overlay.innerHTML = `
                    <div class="modal-content auth-card" style="text-align: center; border-color: var(--primary);">
                        <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
                        <h2>Harvest Confirmed!</h2>
                        <p style="color: var(--text-dim); margin-top: 1rem;">Your organic order has been received. Our farmers are already picking the freshest items for you.</p>
                        <button class="btn-primary" style="margin-top: 2rem; width: 100%;" onclick="this.parentElement.parentElement.remove(); app.navigate('dashboard');">View Orders</button>
                    </div>
                `;
                document.body.appendChild(overlay);
            } else {
                this.showToast("Failed to place order. Please try again.");
            }
        } catch (err) { this.showToast("Failed to place order"); }
    },

    async fetchAdminData() {
        try {
            const res = await fetch(`${API_URL}/admin/dashboard`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            
            document.getElementById('admin-total-users').innerText = data.totalUsers;
            document.getElementById('admin-total-farmers').innerText = data.totalFarmers;
            
            const list = document.getElementById('approval-list');
            if (list) {
                list.innerHTML = data.pendingFarmers.length ? '' : '<p style="color: var(--text-dim);">No pending approvals at the moment.</p>';
                data.pendingFarmers.forEach(f => {
                    const div = document.createElement('div');
                    div.className = 'auth-card';
                    div.style.marginBottom = '1rem';
                    div.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong>${f.name}</strong><br>
                                <small>${f.location} | ${f.email}</small>
                            </div>
                            <button class="btn-primary" style="padding: 0.4rem 1rem; font-size: 0.8rem;" onclick="app.approveFarmer('${f._id}')">Approve</button>
                        </div>
                    `;
                    list.appendChild(div);
                });
            }
        } catch (err) { console.error(err); }
    },

    async approveFarmer(id) {
        try {
            const res = await fetch(`${API_URL}/admin/approve-farmer/${id}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                this.showToast("Farmer approved and verified! 🚜");
                this.fetchAdminData();
            }
        } catch (err) { this.showToast("Approval failed"); }
    },

    appendMessage(sender, text) {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        const div = document.createElement('div');
        div.className = `msg ${sender}`;
        div.innerHTML = text;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    },

    calculateTotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }
};

window.onload = () => app.init();
