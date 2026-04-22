const API_URL = '/api';

const app = {
    cart: [],
    currentView: 'home',

    init() {
        this.fetchProducts();
        this.hideLoader();
        this.updateCartCount();
        window.addEventListener('scroll', () => this.revealOnScroll());
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

    async fetchProducts() {
        const search = document.getElementById('searchBar').value;
        const category = document.getElementById('categoryFilter').value;
        
        try {
            const res = await fetch(`${API_URL}/products?search=${search}&category=${category}`);
            const products = await res.json();
            this.renderProducts(products);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    },

    renderProducts(products) {
        const container = document.getElementById('category-groups');
        container.innerHTML = '';

        if (products.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:5rem; color:var(--text-dim);">No products found. Try a different search.</div>';
            return;
        }

        const groups = products.reduce((acc, p) => {
            if (!acc[p.category]) acc[p.category] = [];
            acc[p.category].push(p);
            return acc;
        }, {});

        Object.keys(groups).forEach(cat => {
            const groupHtml = `
                <div class="category-header reveal">
                    <div class="category-title-wrap">
                        <h2 class="category-title">${cat}</h2>
                        <div class="title-underline"></div>
                    </div>
                    <span class="item-count">${groups[cat].length} Items</span>
                </div>
                <div class="product-grid">
                    ${groups[cat].map(p => `
                        <div class="product-card reveal">
                            <span class="organic-badge">Organic</span>
                            <img src="${p.imageUrl}" 
                                 class="product-img" 
                                 alt="${p.name}"
                                 onerror="this.parentElement.style.display='none';">
                            <div class="product-info">
                                <h3>${p.name}</h3>
                                <div class="product-footer">
                                    <span class="price">₹${p.price}</span>
                                    <button class="add-btn" onclick="app.addToCart('${p._id}', '${p.name}', ${p.price})">+</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            container.insertAdjacentHTML('beforeend', groupHtml);
        });

        // Trigger reveal after a tiny delay for DOM to settle
        setTimeout(() => this.revealOnScroll(), 100);
    },

    addToCart(id, name, price) {
        this.cart.push({ id, name, price });
        this.updateCartCount();
        this.showToast(`Added ${name} to cart!`);
    },

    updateCartCount() {
        const count = document.getElementById('cart-count');
        if (count) count.innerText = this.cart.length;
    },

    showToast(msg) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.style.cssText = `
            background: #1e293b;
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            margin-top: 1rem;
            border-left: 4px solid var(--primary);
            box-shadow: 0 10px 20px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `;
        toast.innerText = msg;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    revealOnScroll() {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 50) {
                el.classList.add('active');
            }
        });
    },

    navigate(view) {
        this.currentView = view;
        const views = ['home', 'market', 'login', 'explore'];
        
        views.forEach(v => {
            const el = document.getElementById(`${v}-view`);
            if (el) el.style.display = (v === view) ? 'block' : 'none';
            
            const link = document.getElementById(`link-${v}`);
            if (link) {
                if (v === view) link.classList.add('active');
                else link.classList.remove('active');
            }
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        if (view === 'market') {
            this.fetchProducts();
        }

        // Re-trigger reveal animations for new view
        setTimeout(() => this.revealOnScroll(), 100);
    },

    toggleChat() {
        const chat = document.getElementById('chatbot-window');
        if (chat) {
            chat.style.display = (chat.style.display === 'none') ? 'flex' : 'none';
        }
    },

    async sendChat() {
        const input = document.getElementById('chatInput');
        const msg = input.value.trim();
        if (!msg) return;

        this.appendMessage('user', msg);
        input.value = '';

        try {
            const res = await fetch(`${API_URL}/ai/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg })
            });
            const data = await res.json();
            this.appendMessage('bot', data.reply || "I'm processing your request!");
        } catch (err) {
            this.appendMessage('bot', "I'm having trouble connecting right now, but I'm here to help!");
        }
    },

    appendMessage(sender, text) {
        const container = document.getElementById('chatMessages') || document.getElementById('chat-messages');
        const div = document.createElement('div');
        div.className = `msg ${sender}`;
        div.innerText = text;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    },

    async handleLogin(e) {
        e.preventDefault();
        this.showToast("Signing you in...");
        setTimeout(() => {
            this.showToast("Login successful! Welcome back.");
            this.navigate('home');
        }, 1500);
    }
};

window.onload = () => app.init();
