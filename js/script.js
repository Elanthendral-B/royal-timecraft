/* CHRONOVA — Store interactions */
document.addEventListener("DOMContentLoaded", () => {
  const products = [
    { id: 1, name: "Chronova Royale", category: "Men's", tags: ["Luxury"], price: 48999, rating: 4.9, reviews: 128, badge: "Bestseller",
      desc: "A polished automatic timepiece with a balanced dial and refined steel case.",
      image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85" },
    { id: 2, name: "Chronova Eclipse", category: "Women's", tags: ["Luxury"], price: 42999, rating: 4.8, reviews: 94, badge: "New",
      desc: "A graceful silhouette pairing a luminous dial with understated contemporary detailing.",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85" },
    { id: 3, name: "Chronova Classic", category: "Men's", tags: ["Classic"], price: 32999, rating: 4.7, reviews: 211, badge: "",
      desc: "A timeless everyday watch designed around clean proportions and versatile elegance.",
      image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=900&q=85" },
    { id: 4, name: "Chronova Titan", category: "Men's", tags: ["Luxury"], price: 55999, oldPrice: 62999, rating: 4.9, reviews: 76, badge: "Sale",
      desc: "Bold architecture, premium finishing and a confident wrist presence for modern collectors.",
      image: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?auto=format&fit=crop&w=900&q=85" },
    { id: 5, name: "Chronova Aurelia", category: "Women's", tags: ["Classic"], price: 37999, rating: 4.8, reviews: 67, badge: "",
      desc: "Elegant details and a softly structured case make Aurelia an effortless signature.",
      image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=900&q=85" },
    { id: 6, name: "Chronova Noir", category: "Men's", tags: ["Luxury", "Limited Edition"], price: 64999, rating: 5.0, reviews: 41, badge: "Limited",
      desc: "A dark limited-edition statement with dramatic finishing and an atelier-inspired dial.",
      image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=900&q=85" },
    { id: 7, name: "Chronova Muse", category: "Women's", tags: ["Luxury"], price: 44999, rating: 4.9, reviews: 52, badge: "New",
      desc: "A modern luxury profile that blends delicate lines with confident mechanical character.",
      image: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=900&q=85" },
    { id: 8, name: "Chronova Atelier", category: "Men's", tags: ["Classic", "Limited Edition"], price: 71999, rating: 5.0, reviews: 29, badge: "Limited",
      desc: "Our most exclusive atelier-inspired expression, created for serious collectors.",
      image: "https://images.unsplash.com/photo-1526045431048-f857369baa09?auto=format&fit=crop&w=900&q=85" }
  ];

  let cart = JSON.parse(localStorage.getItem("chronovaCart") || "[]");
  let wishlist = JSON.parse(localStorage.getItem("chronovaWishlist") || "[]");
  let activeFilter = "all";
  let currentQuickView = null;

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

  function saveState() {
    localStorage.setItem("chronovaCart", JSON.stringify(cart));
    localStorage.setItem("chronovaWishlist", JSON.stringify(wishlist));
  }

  function stars(rating) {
    const full = Math.round(rating);
    return "★".repeat(full) + "☆".repeat(5 - full);
  }

  function renderProducts() {
    const grid = $("#productGrid");
    const noResults = $("#noResults");
    const sort = $("#sortSelect").value;

    let list = products.filter(p => {
      if (activeFilter === "all") return true;
      return p.category === activeFilter || p.tags.includes(activeFilter);
    });

    if (sort === "low") list.sort((a,b) => a.price - b.price);
    if (sort === "high") list.sort((a,b) => b.price - a.price);
    if (sort === "rating") list.sort((a,b) => b.rating - a.rating);

    noResults.classList.toggle("d-none", list.length !== 0);

    grid.innerHTML = list.map((p, i) => `
      <div class="col-sm-6 col-lg-3 reveal-up" style="--delay:${(i % 4) * 0.06}s">
        <article class="product-card" data-id="${p.id}">
          <div class="product-image-wrap">
            ${p.badge ? `<span class="product-badge ${p.badge === "Sale" ? "sale" : ""}">${p.badge}</span>` : ""}
            <button class="product-wishlist ${wishlist.includes(p.id) ? "active" : ""}" data-wishlist="${p.id}" aria-label="Wishlist ${p.name}">
              <i class="bi ${wishlist.includes(p.id) ? "bi-heart-fill" : "bi-heart"}"></i>
            </button>
            <img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy">
            <button class="product-quick-view" data-quick="${p.id}">Quick View</button>
          </div>
          <div class="product-info">
            <span class="product-category">${p.category}</span>
            <h3 class="product-name">${p.name}</h3>
            <p class="product-desc">${p.desc}</p>
            <div class="product-rating">${stars(p.rating)} <span class="rating-count">(${p.reviews})</span></div>
            <div class="product-price-row">
              <span class="product-price">${money(p.price)}</span>
              ${p.oldPrice ? `<span class="product-price-old">${money(p.oldPrice)}</span>` : ""}
            </div>
            <div class="product-actions">
              <button class="btn btn-view-details" data-quick="${p.id}">Details</button>
              <button class="btn btn-add-cart" data-cart="${p.id}">Add to Cart</button>
            </div>
          </div>
        </article>
      </div>
    `).join("");

    observeReveal();
  }

  function updateCounts() {
    const cartQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartCount = $("#cartCount");
    const wishCount = $("#wishlistCount");

    cartCount.textContent = cartQty;
    wishCount.textContent = wishlist.length;
    cartCount.classList.toggle("show", cartQty > 0);
    wishCount.classList.toggle("show", wishlist.length > 0);
  }

  function addToCart(id, qty = 1) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    const existing = cart.find(x => x.id === id);
    if (existing) existing.qty += qty;
    else cart.push({ id, qty });
    saveState();
    updateCounts();
    renderCart();
    showToast("Added to your bag", p.name);
  }

  function changeQty(id, delta) {
    const item = cart.find(x => x.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
    saveState();
    updateCounts();
    renderCart();
  }

  function removeFromCart(id) {
    cart = cart.filter(x => x.id !== id);
    saveState();
    updateCounts();
    renderCart();
  }

  function toggleWishlist(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    if (wishlist.includes(id)) {
      wishlist = wishlist.filter(x => x !== id);
      showToast("Removed from wishlist", p.name);
    } else {
      wishlist.push(id);
      showToast("Added to wishlist", p.name);
    }
    saveState();
    updateCounts();
    renderProducts();
    if ($("#cartSidebar").classList.contains("open") && $("#sidebarTitle").textContent === "Wishlist") renderWishlist();
  }

  function renderCart() {
    const body = $("#sidebarBody");
    const footer = $("#cartFooter");
    $("#sidebarTitle").textContent = "Your Bag";

    if (!cart.length) {
      body.innerHTML = `<div class="cart-empty"><i class="bi bi-bag"></i><p>Your bag is waiting for something timeless.</p><button class="btn btn-outline" id="continueShopping">Continue Shopping</button></div>`;
      footer.style.display = "none";
      $("#continueShopping")?.addEventListener("click", closeSidebar);
      return;
    }

    footer.style.display = "";
    let subtotal = 0;

    body.innerHTML = cart.map(item => {
      const p = products.find(x => x.id === item.id);
      subtotal += p.price * item.qty;
      return `
        <div class="cart-item">
          <img class="cart-item-img" src="${p.image}" alt="${p.name}">
          <div class="cart-item-info">
            <div><h4 class="cart-item-name">${p.name}</h4><span class="cart-item-price">${money(p.price)}</span></div>
            <div class="cart-item-controls">
              <div class="qty-controls">
                <button class="qty-btn" data-qty="${p.id}" data-delta="-1">−</button>
                <span class="qty-value">${item.qty}</span>
                <button class="qty-btn" data-qty="${p.id}" data-delta="1">+</button>
              </div>
              <button class="cart-item-remove" data-remove="${p.id}" aria-label="Remove ${p.name}"><i class="bi bi-trash3"></i></button>
            </div>
          </div>
        </div>`;
    }).join("");

    $("#cartSubtotal").textContent = money(subtotal);
  }

  function renderWishlist() {
    const body = $("#sidebarBody");
    const footer = $("#cartFooter");
    $("#sidebarTitle").textContent = "Wishlist";
    footer.style.display = "none";

    if (!wishlist.length) {
      body.innerHTML = `<div class="cart-empty"><i class="bi bi-heart"></i><p>Your wishlist is empty.</p></div>`;
      return;
    }

    body.innerHTML = wishlist.map(id => {
      const p = products.find(x => x.id === id);
      return `
        <div class="wishlist-item">
          <img src="${p.image}" alt="${p.name}">
          <div class="wishlist-item-info"><h5>${p.name}</h5><span>${money(p.price)}</span></div>
          <div class="wishlist-item-actions">
            <button class="wishlist-move" data-wish-cart="${p.id}" aria-label="Move to bag"><i class="bi bi-bag-plus"></i></button>
            <button class="wishlist-remove" data-wish-remove="${p.id}" aria-label="Remove"><i class="bi bi-x"></i></button>
          </div>
        </div>`;
    }).join("");
  }

  function openSidebar(mode = "cart") {
    $("#cartSidebar").classList.add("open");
    $("#pageOverlay").classList.add("active");
    if (mode === "wishlist") renderWishlist();
    else renderCart();
  }

  function closeSidebar() {
    $("#cartSidebar").classList.remove("open");
    $("#pageOverlay").classList.remove("active");
  }

  function showToast(title, msg) {
    const el = document.createElement("div");
    el.className = "toast-notification";
    el.innerHTML = `<i class="bi bi-check-circle"></i><div class="toast-text"><p class="toast-title">${title}</p><p class="toast-msg">${msg}</p></div>`;
    $("#toastContainer").appendChild(el);
    setTimeout(() => {
      el.classList.add("toast-out");
      setTimeout(() => el.remove(), 350);
    }, 2800);
  }

  function openQuickView(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    currentQuickView = id;
    $("#qvImage").src = p.image;
    $("#qvImage").alt = p.name;
    $("#qvCategory").textContent = p.category;
    $("#qvTitle").textContent = p.name;
    $("#qvRating").textContent = `${stars(p.rating)}  ${p.rating}/5`;
    $("#qvPrice").textContent = money(p.price);
    $("#qvDesc").textContent = p.desc;
    $("#qvWish").innerHTML = `<i class="bi ${wishlist.includes(id) ? "bi-heart-fill" : "bi-heart"}"></i>`;
    bootstrap.Modal.getOrCreateInstance($("#quickViewModal")).show();
  }

  function renderSearchResults(query = "") {
    const q = query.trim().toLowerCase();
    const result = products.filter(p => !q || [p.name, p.category, ...p.tags].join(" ").toLowerCase().includes(q)).slice(0, 5);
    $("#searchResults").innerHTML = result.map(p => `
      <div class="search-result-item" data-search-product="${p.id}">
        <img src="${p.image}" alt="${p.name}">
        <div><h5>${p.name}</h5><span>${money(p.price)}</span></div>
      </div>
    `).join("") || `<p class="text-secondary mt-3">No watches found.</p>`;
  }

  function observeReveal() {
    const els = $$(".reveal-up, .reveal-left, .reveal-right, .reveal-scale");
    if (!("IntersectionObserver" in window)) {
      els.forEach(e => e.classList.add("visible"));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => {
      if (!el.classList.contains("visible")) observer.observe(el);
    });
  }

  // Delegated product actions.
  document.addEventListener("click", e => {
    const cartBtn = e.target.closest("[data-cart]");
    const quickBtn = e.target.closest("[data-quick]");
    const wishBtn = e.target.closest("[data-wishlist]");
    const qtyBtn = e.target.closest("[data-qty]");
    const removeBtn = e.target.closest("[data-remove]");
    const wishCart = e.target.closest("[data-wish-cart]");
    const wishRemove = e.target.closest("[data-wish-remove]");
    const searchProduct = e.target.closest("[data-search-product]");

    if (cartBtn) addToCart(Number(cartBtn.dataset.cart));
    if (quickBtn) openQuickView(Number(quickBtn.dataset.quick));
    if (wishBtn) toggleWishlist(Number(wishBtn.dataset.wishlist));
    if (qtyBtn) changeQty(Number(qtyBtn.dataset.qty), Number(qtyBtn.dataset.delta));
    if (removeBtn) removeFromCart(Number(removeBtn.dataset.remove));
    if (wishCart) {
      addToCart(Number(wishCart.dataset.wishCart));
      wishlist = wishlist.filter(x => x !== Number(wishCart.dataset.wishCart));
      saveState(); updateCounts(); renderWishlist();
    }
    if (wishRemove) {
      wishlist = wishlist.filter(x => x !== Number(wishRemove.dataset.wishRemove));
      saveState(); updateCounts(); renderWishlist(); renderProducts();
    }
    if (searchProduct) {
      closeSearch();
      openQuickView(Number(searchProduct.dataset.searchProduct));
    }
  });

  // Filter / sort.
  $("#filterTabs").addEventListener("click", e => {
    const btn = e.target.closest(".filter-tab");
    if (!btn) return;
    $$(".filter-tab").forEach(x => x.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    renderProducts();
  });

  $("#sortSelect").addEventListener("change", renderProducts);

  $$(".category-card").forEach(card => card.addEventListener("click", () => {
    const category = card.dataset.category;
    activeFilter = category;
    $$(".filter-tab").forEach(x => x.classList.toggle("active", x.dataset.filter === category));
    setTimeout(renderProducts, 50);
  }));

  // Navbar scroll state.
  const navbar = $("#mainNavbar");
  const backTop = $("#backToTop");
  function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
    backTop.classList.toggle("show", window.scrollY > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Search.
  function openSearch() {
    $("#searchOverlay").classList.add("active");
    $("#searchOverlay").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $("#searchInput").focus();
    renderSearchResults("");
  }
  function closeSearch() {
    $("#searchOverlay").classList.remove("active");
    $("#searchOverlay").setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  $("#searchBtn").addEventListener("click", openSearch);
  $("#searchClose").addEventListener("click", closeSearch);
  $("#searchOverlay").addEventListener("click", e => { if (e.target === $("#searchOverlay")) closeSearch(); });
  $("#searchInput").addEventListener("input", e => renderSearchResults(e.target.value));
  $$(".suggestion-chip").forEach(btn => btn.addEventListener("click", () => {
    $("#searchInput").value = btn.dataset.search;
    renderSearchResults(btn.dataset.search);
    $("#searchInput").focus();
  }));

  // Cart / wishlist.
  $("#cartBtn").addEventListener("click", () => openSidebar("cart"));
  $("#wishlistBtn").addEventListener("click", () => openSidebar("wishlist"));
  $("#sidebarClose").addEventListener("click", closeSidebar);
  $("#pageOverlay").addEventListener("click", closeSidebar);

  // Quick view.
  $("#qvAdd").addEventListener("click", () => {
    if (currentQuickView) {
      addToCart(currentQuickView);
      bootstrap.Modal.getInstance($("#quickViewModal"))?.hide();
    }
  });
  $("#qvWish").addEventListener("click", () => {
    if (currentQuickView) toggleWishlist(currentQuickView);
    $("#qvWish").innerHTML = `<i class="bi ${wishlist.includes(currentQuickView) ? "bi-heart-fill" : "bi-heart"}"></i>`;
  });

  // Newsletter validation.
  $("#newsletterForm").addEventListener("submit", e => {
    e.preventDefault();
    const input = $("#newsletterEmail");
    const error = $("#newsletterError");
    const success = $("#newsletterSuccess");
    error.textContent = ""; success.textContent = "";
    if (!input.value || !input.checkValidity()) {
      error.textContent = "Please enter a valid email address.";
      input.focus();
      return;
    }
    success.textContent = "You're on the list. Welcome to CHRONOVA.";
    input.value = "";
  });

  $("#checkoutBtn").addEventListener("click", () => {
    if (!cart.length) return;
    showToast("Checkout ready", "Connect your preferred payment gateway to complete orders.");
  });

  $("#backToTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  $("#year").textContent = new Date().getFullYear();

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeSearch();
      closeSidebar();
    }
  });

  renderProducts();
  updateCounts();
  renderCart();
  observeReveal();
});
