const API_URL = '/api';

const app = {
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,

    init() {
        this.navigate('home');
        this.updateNavContent();
        this.updateCartBadge();
        window.addEventListener('scroll', () => this.revealElements());
    },

    async navigate(viewId) {
        const currentActive = document.querySelector('.view.active');
        const target = document.getElementById(`view-${viewId}`);
        if (!target) return;

        if (['products', 'dashboard', 'explore'].includes(viewId)) this.showLoading(true);

        if (currentActive) {
            currentActive.style.opacity = '0';
            await new Promise(r => setTimeout(r, 200));
            currentActive.classList.remove('active');
        }

        try {
            if(viewId === 'products') await this.fetchProducts();
            if(viewId === 'cart') this.renderCart();
            if(viewId === 'dashboard') {
                if(!this.token) {
                    this.showLoading(false);
                    return this.navigate('login');
                }
                await this.loadDashboard();
            }
        } catch (err) { 
            console.error(err); 
            this.showLoading(false);
        }

        target.classList.add('active');
        setTimeout(() => {
            target.style.opacity = '1';
            this.showLoading(false);
            this.revealElements();
            window.scrollTo(0,0);
        }, 50);
    },

    // AUTH
    async handleLogin(e) {
        e.preventDefault();
        this.showLoading(true);
        const body = { email: document.getElementById('loginEmail').value, password: document.getElementById('loginPassword').value };
        try {
            const res = await fetch(`${API_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            const data = await res.json();
            if(!res.ok) throw new Error(data.message);
            this.setAuth(data);
            this.showToast('Welcome back! ✨');
            this.navigate('home');
        } catch (err) { this.showToast(err.message); } finally { this.showLoading(false); }
    },

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
            const res = await fetch(`${API_URL}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            const data = await res.json();
            if(!res.ok) throw new Error(data.message);
            this.setAuth(data);
            this.showToast('Account created! 🌿');
            this.navigate('home');
        } catch (err) { this.showToast(err.message); } finally { this.showLoading(false); }
    },

    setAuth(data) {
        this.user = data.user; this.token = data.token;
        localStorage.setItem('user', JSON.stringify(this.user)); localStorage.setItem('token', this.token);
        this.updateNavContent();
    },

    logout() {
        this.user = null; this.token = null;
        localStorage.removeItem('user'); localStorage.removeItem('token');
        this.updateNavContent(); this.navigate('home');
        this.showToast('Logged out');
    },

    updateNavContent() {
        const authBtns = document.getElementById('auth-buttons');
        const userMenu = document.getElementById('user-menu');
        const dashLink = document.getElementById('nav-dashboard');
        if(this.user) {
            authBtns.style.display = 'none'; userMenu.style.display = 'flex'; dashLink.style.display = 'block';
            document.getElementById('user-name').innerText = this.user.name.split(' ')[0];
        } else {
            authBtns.style.display = 'flex'; userMenu.style.display = 'none'; dashLink.style.display = 'none';
        }
    },

    // MARKET
    async fetchProducts() {
        try {
            const search = document.getElementById('searchBar').value;
            const category = document.getElementById('categoryFilter').value;
            let url = `${API_URL}/products?search=${search}&category=${category}`;
            const res = await fetch(url);
            if(!res.ok) throw new Error('Failed to fetch products');
            this.renderProducts(await res.json());
        } catch (err) {
            console.error(err);
            this.showToast('Error loading products. Please try again.');
        } finally {
            this.showLoading(false);
        }
    },

    renderProducts(products) {
        const container = document.getElementById('product-container');
        if(!products.length) { 
            container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 4rem;"><h3>No organic treasures found.</h3></div>'; 
            return; 
        }

        const grouped = products.reduce((acc, p) => {
            if(!acc[p.category]) acc[p.category] = [];
            acc[p.category].push(p);
            return acc;
        }, {});

        let html = '';
        Object.keys(grouped).forEach(cat => {
            html += `
                <div style="grid-column: 1/-1; margin-top: 3rem; margin-bottom: 1.5rem; border-bottom: 2px solid var(--primary); padding-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                    <h2 style="font-size: 2rem; color: var(--primary);">${cat}</h2>
                    <span style="font-size: 0.9rem; color: var(--text-dim);">${grouped[cat].length} Items</span>
                </div>
            `;
            html += grouped[cat].map(p => `
                <div class="glass-card reveal">
                    <div class="img-box" onclick="app.viewProduct('${p._id}')">
                        <img src="${p.imageUrl}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=600'">
                    </div>
                    <div class="card-content">
                        <small style="color:var(--primary); font-weight:700; text-transform:uppercase; font-size:0.65rem;">${p.category}</small>
                        <h3 style="margin: 0.2rem 0 0.5rem; font-size: 1.1rem; height: 1.4em; overflow: hidden;">${p.name}</h3>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1.2rem;">
                            <span class="price" style="font-size: 1.25rem;">₹${p.price}</span>
                            <button class="btn-primary" style="padding:0.4rem 1rem; font-size:0.8rem;" onclick="app.addToCart('${p._id}', '${p.name}', ${p.price})">Buy</button>
                        </div>
                    </div>
                </div>
            `).join('');
        });

        container.innerHTML = html;
        this.revealElements();
    },

    filterProducts() { this.fetchProducts(); },

    async viewProduct(id) {
        this.showLoading(true);
        const res = await fetch(`${API_URL}/products/${id}`);
        const p = await res.json();
        document.getElementById('details-content').innerHTML = `
            <img src="${p.imageUrl}" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=600'" style="width:100%; max-width:450px; height:400px; object-fit:cover;">
            <div style="flex:1; min-width:320px; padding:3.5rem;">
                <span style="color:var(--primary); font-weight:800; text-transform:uppercase; font-size:0.75rem; letter-spacing:1px;">${p.category}</span>
                <h2 style="font-size:3rem; margin:0.8rem 0; line-height:1;">${p.name}</h2>
                <p style="color:var(--text-dim); margin-bottom:2rem; font-size:1.1rem; line-height:1.6;">${p.description}</p>
                <div style="margin-bottom:2.5rem; display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                    <p><strong>📍 Region:</strong><br>${p.location}</p>
                    <p><strong>👨‍🌾 Specialist:</strong><br>${p.farmerId?.name || 'Local Expert'}</p>
                </div>
                <div style="display:flex; align-items:center; gap:2.5rem;">
                    <span style="font-size:2.5rem; font-weight:800; color:var(--primary);">₹${p.price}</span>
                    <button class="btn-primary" style="padding: 1.2rem 2.5rem;" onclick="app.addToCart('${p._id}', '${p.name}', ${p.price})">Add to Basket</button>
                </div>
            </div>
        `;
        this.navigate('product-details');
    },

    // CART
    addToCart(id, name, price) {
        const exist = this.cart.find(c => c.product === id);
        if(exist) exist.quantity++; else this.cart.push({ product: id, name, price, quantity: 1 });
        this.saveCart(); this.showToast(`${name} in basket! 🌿`);
    },
    removeFromCart(id) { this.cart = this.cart.filter(c => c.product !== id); this.saveCart(); this.renderCart(); },
    saveCart() { localStorage.setItem('cart', JSON.stringify(this.cart)); this.updateCartBadge(); },
    updateCartBadge() { document.getElementById('cart-count').innerText = this.cart.reduce((s, i) => s + i.quantity, 0); },
    renderCart() {
        const list = document.getElementById('cart-list');
        if(!this.cart.length) { list.innerHTML = '<div style="text-align:center; padding:2rem;"><p>Your basket is empty.</p><button class="btn-primary" style="margin-top:1rem;" onclick="app.navigate(\'products\')">Shop Now</button></div>'; return; }
        list.innerHTML = this.cart.map(item => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:1.2rem; background:rgba(255,255,255,0.03); border-radius:10px; margin-bottom:0.8rem;">
                <div><strong>${item.name}</strong><br><small style="color:var(--text-dim)">₹${item.price} × ${item.quantity}</small></div>
                <button onclick="app.removeFromCart('${item.product}')" style="background:none; border:none; color:#f87171; cursor:pointer; font-size:0.8rem; font-weight:800;">REMOVE</button>
            </div>
        `).join('');
        document.getElementById('cart-total-price').innerText = this.cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    },
    async checkout() {
        if(!this.token) return this.navigate('login');
        if(!this.cart.length) return;
        this.showLoading(true);
        try {
            const res = await fetch(`${API_URL}/orders`, { 
                method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}` },
                body: JSON.stringify({ products: this.cart, totalAmount: this.cart.reduce((s,i)=>s+(i.price*i.quantity),0), paymentMethod: 'COD' })
            });
            if(res.ok) { this.cart = []; this.saveCart(); this.showToast('Harvest order confirmed! 🚜'); this.navigate('dashboard'); }
        } catch (e) { console.error(e); } finally { this.showLoading(false); }
    },

    // DASHBOARD
    async loadDashboard() {
        try {
            const res = await fetch(`${API_URL}/orders`, { headers: { 'Authorization': `Bearer ${this.token}` } });
            if(!res.ok) throw new Error('Failed to load dashboard');
            const orders = await res.json();
            document.getElementById('stat-value-1').innerText = orders.length;
            document.getElementById('stat-value-2').innerText = '₹' + orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
            document.getElementById('orders-list').innerHTML = orders.length === 0 ? 
                '<p style="text-align:center; padding:2rem; color:var(--text-dim);">No orders found.</p>' :
                orders.map(o => `
                <div class="glass-card" style="padding:1.4rem; margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center; border-left: 4px solid var(--primary);">
                    <div>
                        <h4 style="color:var(--primary); font-size:0.9rem;">#${o._id.substring(o._id.length-6).toUpperCase()}</h4>
                        <small style="color:var(--text-dim)">Confirmed ${new Date(o.createdAt).toLocaleDateString()}</small>
                    </div>
                    <strong style="font-size:1.1rem;">₹${o.totalAmount}</strong>
                </div>
            `).join('');
        } catch (err) {
            console.error(err);
            this.showToast('Error loading dashboard.');
        } finally {
            this.showLoading(false);
        }
    },

    // AI
    toggleChat() { const c = document.getElementById('ai-chat-window'); c.style.display = c.style.display === 'flex' ? 'none' : 'flex'; },
    async sendMessage() {
        const i = document.getElementById('chatInput'); if(!i.value) return;
        const msg = i.value; i.value = '';
        const b = document.getElementById('chat-messages');
        b.innerHTML += `<div style="align-self:flex-end; background:var(--primary); padding:0.7rem 1.2rem; border-radius:15px 15px 0 15px; color:white;">${msg}</div>`;
        const res = await fetch(`${API_URL}/ai/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: msg }) });
        const data = await res.json();
        b.innerHTML += `<div style="align-self:flex-start; background:rgba(255,255,255,0.06); padding:0.7rem 1.2rem; border-radius:15px 15px 15px 0; border:1px solid rgba(255,255,255,0.1);">${data.reply}</div>`;
        b.scrollTop = b.scrollHeight;
    },

    // UTILS
    showLoading(s) { document.getElementById('loader-overlay').classList.toggle('active', s); },
    showToast(m) {
        const t = document.createElement('div'); t.className = 'toast'; t.innerText = m;
        document.getElementById('toast-container').appendChild(t);
        setTimeout(() => { t.style.opacity = '0'; setTimeout(()=>t.remove(), 500); }, 3500);
    },
    revealElements() {
        document.querySelectorAll('.reveal').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 30) el.classList.add('active');
        });
    }
};

window.onload = () => app.init();
