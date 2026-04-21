const API_URL = '/api';

const app = {
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isNavigating: false,

    init() {
        this.navigate('home');
        this.updateNavContent();
        this.updateCartBadge();
        this.initObservers();
        this.initParallax();
        
        // Handle initial scroll reveals
        setTimeout(() => this.revealElements(), 100);
    },

    initParallax() {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 10; // Max 5deg
            const y = (e.clientY / window.innerHeight - 0.5) * -10;
            document.documentElement.style.setProperty('--mx', `${x}deg`);
            document.documentElement.style.setProperty('--my', `${y}deg`);
        });
    },


    // ============ NAVIGATION (SPA Router with Transitions) ============
    async navigate(viewId) {
        if (this.isNavigating) return;
        this.isNavigating = true;

        const currentActive = document.querySelector('.view.active');
        const target = document.getElementById(`view-${viewId}`);

        if (!target) {
            this.isNavigating = false;
            return;
        }

        // Show Loader for data-heavy views
        if (['products', 'dashboard'].includes(viewId)) {
            this.showLoading(true);
        }

        // 1. Exit current view
        if (currentActive) {
            currentActive.classList.add('view-exit');
            await new Promise(r => setTimeout(r, 400));
            currentActive.classList.remove('active', 'view-exit');
        }

        // 2. Load data if needed
        try {
            if(viewId === 'products') await this.fetchProducts();
            if(viewId === 'cart') this.renderCart();
            if(viewId === 'dashboard') {
                if(!this.token) {
                    this.isNavigating = false;
                    this.navigate('login');
                    this.showToast('Please login first', 'warning');
                    return;
                }
                await this.loadDashboard();
            }
        } catch (err) {
            this.showToast('Error loading content', 'error');
        }

        // 3. Enter new view
        target.style.display = 'block';
        setTimeout(() => {
            target.classList.add('active');
            this.showLoading(false);
            this.revealElements();
            this.isNavigating = false;
            window.scrollTo({ top: 0, behavior: 'auto' });
        }, 50);
    },

    // ============ AUTHENTICATION ============
    async handleRegister(e) {
        e.preventDefault();
        this.showLoading(true);
        const body = {
            name: document.getElementById('regName').value,
            email: document.getElementById('regEmail').value,
            password: document.getElementById('regPassword').value,
            role: document.getElementById('regRole').value
        };

        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
            });
            const data = await res.json();
            if(!res.ok) throw new Error(data.message);

            this.setAuth(data);
            this.showToast('Successfully registered! 🌿');
            this.navigate('dashboard');
        } catch (err) {
            this.showToast(err.message, 'error');
        } finally {
            this.showLoading(false);
        }
    },

    async handleLogin(e) {
        e.preventDefault();
        this.showLoading(true);
        const body = {
            email: document.getElementById('loginEmail').value,
            password: document.getElementById('loginPassword').value,
        };

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
            });
            const data = await res.json();
            if(!res.ok) throw new Error(data.message);

            this.setAuth(data);
            this.showToast('Welcome back, ' + data.user.name + '! ✨');
            this.navigate('dashboard');
        } catch (err) {
            this.showToast(err.message, 'error');
        } finally {
            this.showLoading(false);
        }
    },

    setAuth(data) {
        this.user = data.user;
        this.token = data.token;
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('token', this.token);
        this.updateNavContent();
    },

    logout() {
        this.user = null;
        this.token = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.updateNavContent();
        this.navigate('home');
        this.showToast('Logged out successfully');
    },

    updateNavContent() {
        const authBtns = document.getElementById('auth-buttons');
        const userMenu = document.getElementById('user-menu');
        const dashLink = document.getElementById('nav-dashboard');

        if(this.user) {
            authBtns.style.display = 'none';
            userMenu.style.display = 'flex';
            dashLink.style.display = 'block';
            document.getElementById('user-name').innerText = this.user.name;
        } else {
            authBtns.style.display = 'flex';
            userMenu.style.display = 'none';
            dashLink.style.display = 'none';
        }
    },

    // ============ PRODUCTS MARKET ============
    async fetchProducts() {
        try {
            const search = document.getElementById('searchBar').value;
            const category = document.getElementById('categoryFilter').value;
            
            let url = `${API_URL}/products?`;
            if(search) url += `search=${search}&`;
            if(category) url += `category=${category}`;

            const res = await fetch(url);
            const products = await res.json();
            this.renderProducts(products);
        } catch (error) {
            this.showToast('Failed to sync with market', 'error');
        }
    },

    renderProducts(products) {
        const container = document.getElementById('product-container');
        if (!products.length) {
            container.innerHTML = '<div class="glass panel" style="grid-column: 1/-1; text-align: center;"><h3>No products found in this category.</h3></div>';
            return;
        }

        container.innerHTML = products.map((p, i) => `
            <div class="product-card glass glass-hover reveal stagger-${(i % 5) + 1}">
                <div class="product-img-wrapper" onclick="app.viewProduct('${p._id}')">
                    <img src="${p.imageUrl}" alt="${p.name}" class="product-img">
                </div>
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p>${p.description.substring(0, 70)}...</p>
                    <div class="price-row">
                        <span class="price">₹${p.price}</span>
                        <button class="btn-primary" onclick="app.handleAddToCart(event, '${p._id}', '${p.name}', ${p.price})">Add to Cart</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        setTimeout(() => this.revealElements(), 100);
    },

    filterProducts() {
        this.fetchProducts();
    },

    async viewProduct(id) {
        try {
            this.showLoading(true);
            const res = await fetch(`${API_URL}/products/${id}`);
            const p = await res.json();
            const container = document.getElementById('details-content');
            container.innerHTML = `
                <div class="details-img reveal" style="flex: 1;">
                    <img src="${p.imageUrl}" alt="${p.name}" class="glass" style="width: 100%; border-radius: 20px;">
                </div>
                <div class="details-info reveal stagger-1" style="flex: 1.2;">
                    <span style="color: var(--primary); font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">${p.category}</span>
                    <h2 style="font-size: 3.5rem; margin: 1rem 0;">${p.name}</h2>
                    <p style="color: var(--text-muted); font-size: 1.2rem; margin-bottom: 2rem;">${p.description}</p>
                    <div class="glass panel" style="margin-bottom: 2rem; border-color: var(--primary);">
                        <p><strong>📍 Location:</strong> ${p.location}</p>
                        <p><strong>👨‍🌾 Farmer:</strong> ${p.farmerId ? p.farmerId.name : 'Premium Local Farmer'}</p>
                    </div>
                    <div class="price-row" style="margin-bottom: 2rem;">
                        <span class="price" style="font-size: 2.5rem;">₹${p.price}</span>
                    </div>
                    <div style="display: flex; gap: 1rem;">
                        <button class="btn-primary" style="flex: 2;" onclick="app.handleAddToCart(event, '${p._id}', '${p.name}', ${p.price})">Add to Basket</button>
                        <button class="btn-outline" style="flex: 1;" onclick="app.navigate('products')">Back</button>
                    </div>
                </div>
            `;
            this.navigate('product-details');
        } catch (error) {
            this.showToast('Failed to load details', 'error');
        } finally {
            this.showLoading(false);
        }
    },

    // ============ CART LOGIC ============
    handleAddToCart(e, id, name, price) {
        // Linked Animation: Fly to Cart
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        const cartBtn = document.getElementById('cart-btn');
        const cartRect = cartBtn.getBoundingClientRect();

        const fly = document.createElement('div');
        fly.className = 'fly-item';
        fly.style.left = `${rect.left + rect.width/2}px`;
        fly.style.top = `${rect.top + rect.height/2}px`;
        document.body.appendChild(fly);

        setTimeout(() => {
            fly.style.left = `${cartRect.left + cartRect.width/2}px`;
            fly.style.top = `${cartRect.top + cartRect.height/2}px`;
            fly.style.transform = 'scale(0.2)';
            fly.style.opacity = '0';
        }, 10);

        setTimeout(() => {
            fly.remove();
            this.addToCart(id, name, price);
            cartBtn.style.transform = 'scale(1.2)';
            setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);
        }, 800);
    },

    addToCart(id, name, price) {
        const existing = this.cart.find(c => c.product === id);
        if(existing) {
            existing.quantity++;
        } else {
            this.cart.push({ product: id, name, price, quantity: 1 });
        }
        this.saveCart();
        this.showToast(`${name} added!`);
    },

    removeFromCart(id) {
        this.cart = this.cart.filter(c => c.product !== id);
        this.saveCart();
        this.renderCart();
    },

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartBadge();
    },

    updateCartBadge() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cart-count').innerText = totalItems;
    },

    renderCart() {
        const list = document.getElementById('cart-list');
        const totalEl = document.getElementById('cart-total-price');
        
        if(this.cart.length === 0) {
            list.innerHTML = '<div class="panel" style="text-align:center"><h3>Your basket is empty.</h3><button class="btn-primary" onclick="app.navigate(\'products\')">Go Shopping</button></div>';
            totalEl.innerText = '0';
            return;
        }

        let total = 0;
        list.innerHTML = '<div class="dashboard-panels">' + this.cart.map((item, i) => {
            total += item.price * item.quantity;
            return `
            <div class="glass panel reveal stagger-${(i%5)+1}" style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div>
                    <h4 style="font-size: 1.2rem;">${item.name}</h4>
                    <p style="color:var(--text-muted)">₹${item.price} x ${item.quantity}</p>
                </div>
                <button class="btn-outline" onclick="app.removeFromCart('${item.product}')">Remove</button>
            </div>
        `}).join('') + '</div>';
        totalEl.innerText = total;
        this.revealElements();
    },

    async checkout() {
        if(!this.token) {
            this.showToast('Please login to checkout');
            this.navigate('login');
            return;
        }
        if(this.cart.length === 0) return this.showToast('Cart is empty', 'warning');

        this.showLoading(true);
        try {
            const totalAmount = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
            const res = await fetch(`${API_URL}/orders`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}` },
                body: JSON.stringify({ products: this.cart, totalAmount, paymentMethod })
            });
            if(!res.ok) throw new Error('Checkout failed');

            this.cart = [];
            this.saveCart();
            this.showToast('Order confirmed! Harvest is on the way. 🌿');
            this.navigate('dashboard');
        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    },

    // ============ DASHBOARD ============
    async loadDashboard() {
        this.showLoading(true);
        // Reset view
        document.getElementById('farmer-dashboard').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'none';
        document.getElementById('stats-grid').style.display = 'grid';

        // Role-based UI setup
        const labels = {
            admin: ['Total Orders', 'Revenue', 'Pending Approvals'],
            farmer: ['My Sales', 'Farm Revenue', 'Active Items'],
            user: ['My Orders', 'Amount Spent', 'Voucher Balance']
        };
        const role = this.user.role === 'admin' ? 'admin' : (this.user.role === 'farmer' ? 'farmer' : 'user');
        
        document.getElementById('stat-label-1').innerText = labels[role][0];
        document.getElementById('stat-label-2').innerText = labels[role][1];
        document.getElementById('stat-label-3').innerText = labels[role][2];
        document.getElementById('stat-card-3').style.display = 'block';

        if(this.user.role === 'admin') {
            document.getElementById('admin-dashboard').style.display = 'block';
            await this.loadAdminPanel();
        } else if (this.user.role === 'farmer') {
            document.getElementById('farmer-dashboard').style.display = 'block';
        }

        // Load Orders and Stats
        try {
            const res = await fetch(`${API_URL}/orders`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const orders = await res.json();
            
            const totalCount = orders.length;
            const totalSum = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

            document.getElementById('stat-value-1').innerText = totalCount;
            document.getElementById('stat-value-2').innerText = `₹${totalSum}`;
            
            if(role === 'user') document.getElementById('stat-value-3').innerText = '₹500';

            document.getElementById('orders-list').innerHTML = orders.length === 0 ? 
                '<div class="panel" style="text-align:center"><p>You haven\'t placed any orders yet.</p></div>' :
                orders.map((o, i) => `
                    <div class="glass panel glass-hover reveal stagger-${(i % 5) + 1}" style="display:flex; justify-content:space-between; margin-bottom:1rem; border-left: 4px solid var(--primary);">
                        <div>
                            <h4 style="color:var(--primary)">Order #${o._id.substring(o._id.length - 6).toUpperCase()}</h4>
                            <p style="font-size:0.9rem; color:var(--text-muted)">📅 ${new Date(o.createdAt || Date.now()).toLocaleDateString()}</p>
                            <p style="font-size:0.9rem; margin-top:0.5rem;">💳 Method: <strong>${o.paymentMethod || 'COD'}</strong></p>
                            <div style="margin-top: 0.5rem; font-size: 0.8rem;">
                                ${o.products.map(p => `<span>${p.product?.name || 'Item'} (x${p.quantity})</span>`).join(', ')}
                            </div>
                        </div>
                        <div style="text-align:right">
                            <p class="price" style="font-size:1.2rem; margin-bottom: 0.5rem;">₹${o.totalAmount}</p>
                            <span style="font-size:0.8rem; padding:6px 12px; border-radius:20px; background: rgba(16, 185, 129, 0.1); border:1px solid var(--primary); font-weight: 600;">${o.status.toUpperCase()}</span>
                        </div>
                    </div>
                `).join('');
            this.renderCharts(orders);
        } catch (error) {
            this.showToast('Failed to sync dashboard', 'error');
        } finally {
            this.showLoading(false);
        }
    },

    renderCharts(orders) {
        const container = document.getElementById('chart-container');
        const title = document.getElementById('chart-title');
        const role = this.user.role;

        title.innerText = role === 'farmer' ? 'Monthly Revenue (₹)' : (role === 'admin' ? 'Platform Orders' : 'My Spending (₹)');

        // Simple aggregation logic for 6 months
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const data = [10, 45, 30, 80, 55, 90]; // Fake data for initial visual

        // If we had real order dates, we would aggregate here. 
        // For now, let's use the total order count to scale the fake data
        const scale = orders.length > 0 ? 1 : 0.2;

        container.innerHTML = months.map((m, i) => `
            <div class="chart-bar" style="height: ${data[i] * scale}%" data-label="${m}"></div>
        `).join('');
    },

    // ============ AI CHATBOT ============
    toggleChat() {
        const win = document.getElementById('ai-chat-window');
        const isHidden = win.style.display === 'none' || !win.style.display;
        win.style.display = isHidden ? 'flex' : 'none';
        if(isHidden) document.getElementById('chatInput').focus();
    },

    async sendMessage() {
        const input = document.getElementById('chatInput');
        const msg = input.value.trim();
        if(!msg) return;

        const body = document.getElementById('chat-messages');
        
        // Add User Message
        body.innerHTML += `<div class="message user">${msg}</div>`;
        input.value = '';
        body.scrollTop = body.scrollHeight;

        // Fetch AI Response
        try {
            const res = await fetch(`${API_URL}/ai/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg })
            });
            const data = await res.json();
            
            // Add AI Message
            body.innerHTML += `<div class="message ai">${data.reply}</div>`;
            body.scrollTop = body.scrollHeight;
        } catch (error) {
            this.showToast('AI is offline', 'error');
        }
    },


    async loadAdminPanel() {
        try {
            const res = await fetch(`${API_URL}/admin/farmers`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const farmers = await res.json();
            const pending = farmers.filter(f => !f.isApproved);
            
            document.getElementById('stat-value-3').innerText = pending.length;

            document.getElementById('admin-list').innerHTML = pending.length === 0 ? 
                '<p style="padding:1rem; color:var(--text-muted)">All farmers are currently approved.</p>' :
                pending.map((f, i) => `
                    <div class="glass panel reveal stagger-${(i % 5) + 1}" style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <div>
                            <h4>${f.name}</h4>
                            <p style="font-size:0.8rem; color:var(--text-muted)">${f.email}</p>
                        </div>
                        <button class="btn-primary" onclick="app.approveFarmer('${f._id}')">Approve</button>
                    </div>
                `).join('');
        } catch (error) {
            console.error(error);
        }
    },

    async approveFarmer(id) {
        this.showLoading(true);
        try {
            await fetch(`${API_URL}/admin/approve-farmers/${id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            this.showToast('Farmer Access Granted!');
            this.loadAdminPanel();
        } catch (error) {
            this.showToast('Approval failed', 'error');
        } finally {
            this.showLoading(false);
        }
    },

    async handleAddProduct(e) {
        e.preventDefault();
        this.showLoading(true);
        const body = {
            name: document.getElementById('addName').value,
            description: document.getElementById('addDesc').value,
            price: document.getElementById('addPrice').value,
            category: document.getElementById('addCategory').value,
            location: document.getElementById('addLocation').value,
        };

        try {
            const res = await fetch(`${API_URL}/products`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}` },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if(!res.ok) throw new Error(data.message);
            this.showToast('Product launched to market! 🚀');
            e.target.reset();
        } catch (err) {
            this.showToast(err.message, 'error');
        } finally {
            this.showLoading(false);
        }
    },

    // ============ UTILS ============
    showToast(message, type='') {
        const t = document.createElement('div');
        t.className = `toast ${type}`;
        t.innerText = message;
        document.getElementById('toast-container').appendChild(t);
        setTimeout(() => {
            t.style.opacity = '0';
            t.style.transform = 'translateY(20px)';
            setTimeout(() => t.remove(), 500);
        }, 4000);
    },

    showLoading(show) {
        const loader = document.getElementById('loader-overlay');
        if (show) loader.classList.add('active');
        else loader.classList.remove('active');
    },

    revealElements() {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                el.classList.add('active');
            }
        });
    },

    initObservers() {
        window.addEventListener('scroll', () => this.revealElements());
    }
};

window.onload = () => app.init();
