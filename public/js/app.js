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
        // Simple SPA navigation logic
        console.log('Navigating to:', view);
        // For this demo, we'll stay on the market view mostly
        if (view === 'market' || view === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
};

window.onload = () => app.init();
