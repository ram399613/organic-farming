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
        const searchBar = document.getElementById('searchBar');
        const categoryFilter = document.getElementById('categoryFilter');
        const search = searchBar ? searchBar.value : '';
        const category = categoryFilter ? categoryFilter.value : 'All';
        
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
        if (!container) return;
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

        setTimeout(() => this.revealOnScroll(), 100);
    },

    addToCart(id, name, price) {
        const existing = this.cart.find(item => item.id === id);
        if (existing) {
            existing.qty = (existing.qty || 1) + 1;
        } else {
            this.cart.push({ id, name, price, qty: 1 });
        }
        this.updateCartCount();
        this.showToast(`Added ${name} to basket!`);
        this.renderCart();
    },

    removeFromCart(index) {
        this.cart.splice(index, 1);
        this.updateCartCount();
        this.renderCart();
    },

    updateCartCount() {
        const count = document.getElementById('cart-count');
        if (count) {
            const totalQty = this.cart.reduce((acc, item) => acc + (item.qty || 1), 0);
            count.innerText = totalQty;
        }
    },

    renderCart() {
        const container = document.getElementById('cart-items');
        const totalEl = document.getElementById('total-amount');
        if (!container || !totalEl) return;
        container.innerHTML = '';
        
        let total = 0;
        this.cart.forEach((item, index) => {
            total += item.price * (item.qty || 1);
            container.innerHTML += `
                <div class="cart-item">
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <p>₹${item.price} x ${item.qty || 1}</p>
                    </div>
                    <button class="remove-btn" onclick="app.removeFromCart(${index})">🗑️</button>
                </div>
            `;
        });
        
        totalEl.innerText = total;
        if (this.cart.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:2rem; color:var(--text-dim);">Your basket is empty.</div>';
        }
    },

    toggleCart() {
        const sidebar = document.getElementById('cart-sidebar');
        if (sidebar) {
            const isHidden = sidebar.style.display === 'none';
            sidebar.style.display = isHidden ? 'flex' : 'none';
            if (isHidden) this.renderCart();
        }
    },

    checkout() {
        if (this.cart.length === 0) return this.showToast("Your basket is empty!");
        this.showToast("Thank you for supporting organic farmers!");
        this.cart = [];
        this.updateCartCount();
        this.toggleCart();
    },

    showToast(msg) {
        const container = document.getElementById('toast-container');
        if (!container) return;
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
        const banner = document.getElementById('home-banner');
        const title = document.getElementById('view-title');
        const eduSection = document.getElementById('edu-section');
        const eduContent = document.getElementById('edu-content');
        const searchSection = document.querySelector('.search-section');
        const links = ['home', 'market', 'explore'];

        // Reset search bar and filters for new view
        const sb = document.getElementById('searchBar');
        const cf = document.getElementById('categoryFilter');
        if (sb) sb.value = '';
        if (cf) cf.value = 'All';

        // Update links
        links.forEach(l => {
            const el = document.getElementById(`link-${l}`);
            if (el) el.classList.toggle('active', l === view);
        });

        if (view === 'home') {
            if (banner) banner.style.display = 'block';
            if (eduSection) eduSection.style.display = 'block';
            if (title) title.innerText = 'Featured Freshness';
            if (eduContent) {
                eduContent.innerHTML = `
                    <h2>Organic Farming: The Future</h2>
                    <p>Organic farming involves the cultivation of plants in natural ways, avoiding synthetic substances to maintain soil fertility and ecological balance.</p>
                    <ul style="margin-top: 1rem; text-align: left; padding-left: 1.5rem; color: var(--text-dim);">
                        <li>No Synthetic Pesticides</li>
                        <li>Soil Health & Biodiversity</li>
                        <li>Eco-friendly & Sustainable</li>
                    </ul>
                `;
            }
            this.fetchProducts(); 
        } else if (view === 'market') {
            if (banner) banner.style.display = 'none';
            if (eduSection) eduSection.style.display = 'none';
            if (title) title.innerText = 'Full Marketplace';
            this.fetchProducts();
        } else if (view === 'explore') {
            if (banner) banner.style.display = 'none';
            if (eduSection) eduSection.style.display = 'block';
            if (title) title.innerText = 'Explore Sustainable Grains';
            if (eduContent) {
                eduContent.innerHTML = `
                    <h2>Sustainable Grains</h2>
                    <p>Our farmers use traditional crop rotation to ensure nutrient density. By choosing organic, you're supporting soil regeneration.</p>
                    <div style="margin-top: 1rem; display: flex; gap: 1rem; justify-content: center;">
                        <div class="stat"><b>100%</b><br>Natural</div>
                        <div class="stat"><b>0%</b><br>Chemicals</div>
                    </div>
                `;
            }
            if (cf) cf.value = 'Grains';
            this.fetchProducts();
        } else if (view === 'login') {
            this.openLogin();
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => this.revealOnScroll(), 100);
    },

    openLogin() {
        const modal = document.getElementById('login-modal');
        if (modal) modal.style.display = 'flex';
    },

    closeLogin() {
        const modal = document.getElementById('login-modal');
        if (modal) modal.style.display = 'none';
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
            this.appendMessage('bot', "I'm here to help you find the best organic products!");
        }
    },

    appendMessage(sender, text) {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        const div = document.createElement('div');
        div.className = `msg ${sender}`;
        div.innerText = text;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    },

    async handleLogin(e) {
        e.preventDefault();
        this.showToast("Welcome back!");
        this.closeLogin();
        this.navigate('home');
    }
};

window.onload = () => app.init();
