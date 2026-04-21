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

        if (['products', 'dashboard'].includes(viewId)) this.showLoading(true);

        if (currentActive) {
            currentActive.style.opacity = '0';
            await new Promise(r => setTimeout(r, 300));
            currentActive.classList.remove('active');
        }

        try {
            if(viewId === 'products') await this.fetchProducts();
            if(viewId === 'cart') this.renderCart();
            if(viewId === 'dashboard') {
                if(!this.token) return this.navigate('login');
                await this.loadDashboard();
            }
        } catch (err) { console.error(err); }

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
            this.user = data.user; this.token = data.token;
            localStorage.setItem('user', JSON.stringify(this.user)); localStorage.setItem('token', this.token);
            this.updateNavContent(); this.navigate('home');
        } catch (err) { this.showToast(err.message); } finally { this.showLoading(false); }
    },

    logout() {
        this.user = null; this.token = null;
        localStorage.removeItem('user'); localStorage.removeItem('token');
        this.updateNavContent(); this.navigate('home');
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
        const search = document.getElementById('searchBar').value;
        const category = document.getElementById('categoryFilter').value;
        let url = `${API_URL}/products?search=${search}&category=${category}`;
        const res = await fetch(url);
        this.renderProducts(await res.json());
    },

    renderProducts(products) {
        const container = document.getElementById('product-container');
        if(!products.length) { container.innerHTML = '<p>No items found.</p>'; return; }
        container.innerHTML = products.map(p => `
            <div class="glass-card reveal">
                <div class="img-box" onclick="app.viewProduct('${p._id}')"><img src="${p.imageUrl}" alt="${p.name}"></div>
                <div class="card-content">
                    <h3>${p.name}</h3>
                    <p style="font-size:0.8rem; color:var(--text-dim);">${p.description.substring(0, 50)}...</p>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1rem;">
                        <span class="price">₹${p.price}</span>
                        <button class="btn-primary" style="padding:0.5rem 1rem; font-size:0.8rem;" onclick="app.addToCart('${p._id}', '${p.name}', ${p.price})">Add</button>
                    </div>
                </div>
            </div>
        `).join('');
        this.revealElements();
    },

    filterProducts() { this.fetchProducts(); },

    async viewProduct(id) {
        this.showLoading(true);
        const res = await fetch(`${API_URL}/products/${id}`);
        const p = await res.json();
        document.getElementById('details-content').innerHTML = `
            <img src="${p.imageUrl}" style="width:100%; max-width:400px; height:300px; object-fit:cover;">
            <div style="flex:1; min-width:300px; padding:2rem;">
                <span style="color:var(--primary); font-weight:800; text-transform:uppercase; font-size:0.7rem;">${p.category}</span>
                <h2 style="font-size:2.5rem; margin:0.5rem 0;">${p.name}</h2>
                <p style="color:var(--text-dim); margin-bottom:1.5rem;">${p.description}</p>
                <div style="margin-bottom:2rem;">
                    <p><strong>📍 Origin:</strong> ${p.location}</p>
                    <p><strong>👨‍🌾 Expert:</strong> ${p.farmerId?.name || 'Local Farmer'}</p>
                </div>
                <div style="display:flex; align-items:center; gap:2rem;">
                    <span style="font-size:2rem; font-weight:800; color:var(--primary);">₹${p.price}</span>
                    <button class="btn-primary" onclick="app.addToCart('${p._id}', '${p.name}', ${p.price})">Add to Basket</button>
                </div>
            </div>
        `;
        this.navigate('product-details');
    },

    // CART
    addToCart(id, name, price) {
        const exist = this.cart.find(c => c.product === id);
        if(exist) exist.quantity++; else this.cart.push({ product: id, name, price, quantity: 1 });
        this.saveCart(); this.showToast(`${name} added!`);
    },
    removeFromCart(id) { this.cart = this.cart.filter(c => c.product !== id); this.saveCart(); this.renderCart(); },
    saveCart() { localStorage.setItem('cart', JSON.stringify(this.cart)); this.updateCartBadge(); },
    updateCartBadge() { document.getElementById('cart-count').innerText = this.cart.reduce((s, i) => s + i.quantity, 0); },
    renderCart() {
        const list = document.getElementById('cart-list');
        if(!this.cart.length) { list.innerHTML = '<p>Your basket is empty.</p>'; return; }
        list.innerHTML = this.cart.map(item => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:1rem; border-bottom:1px solid rgba(255,255,255,0.05);">
                <div><strong>${item.name}</strong><br><small>₹${item.price} x ${item.quantity}</small></div>
                <button onclick="app.removeFromCart('${item.product}')" style="background:none; border:none; color:#ef4444; cursor:pointer;">Remove</button>
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
            if(res.ok) { this.cart = []; this.saveCart(); this.showToast('Order confirmed!'); this.navigate('dashboard'); }
        } catch (e) { console.error(e); } finally { this.showLoading(false); }
    },

    // DASHBOARD
    async loadDashboard() {
        document.getElementById('farmer-dashboard').style.display = this.user.role === 'farmer' ? 'block' : 'none';
        const res = await fetch(`${API_URL}/orders`, { headers: { 'Authorization': `Bearer ${this.token}` } });
        const orders = await res.json();
        document.getElementById('stat-value-1').innerText = orders.length;
        document.getElementById('stat-value-2').innerText = '₹' + orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
        document.getElementById('orders-list').innerHTML = orders.map(o => `
            <div class="glass-card" style="padding:1.5rem; margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <h4 style="color:var(--primary)">Order #${o._id.substring(o._id.length-4)}</h4>
                    <small>${new Date(o.createdAt).toLocaleDateString()}</small>
                </div>
                <strong>₹${o.totalAmount}</strong>
            </div>
        `).join('');
    },

    // AI
    toggleChat() { const c = document.getElementById('ai-chat-window'); c.style.display = c.style.display === 'flex' ? 'none' : 'flex'; },
    async sendMessage() {
        const i = document.getElementById('chatInput'); if(!i.value) return;
        const msg = i.value; i.value = '';
        const b = document.getElementById('chat-messages');
        b.innerHTML += `<div style="align-self:flex-end; background:var(--primary); padding:0.5rem 1rem; border-radius:10px;">${msg}</div>`;
        const res = await fetch(`${API_URL}/ai/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: msg }) });
        const data = await res.json();
        b.innerHTML += `<div style="align-self:flex-start; background:rgba(255,255,255,0.05); padding:0.5rem 1rem; border-radius:10px;">${data.reply}</div>`;
        b.scrollTop = b.scrollHeight;
    },

    // UTILS
    showLoading(s) { document.getElementById('loader-overlay').classList.toggle('active', s); },
    showToast(m) {
        const t = document.createElement('div'); t.className = 'toast'; t.innerText = m;
        document.getElementById('toast-container').appendChild(t);
        setTimeout(() => { t.style.opacity = '0'; setTimeout(()=>t.remove(), 500); }, 3000);
    },
    revealElements() {
        document.querySelectorAll('.reveal').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 50) el.classList.add('active');
        });
    }
};

window.onload = () => app.init();
