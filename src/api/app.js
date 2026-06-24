/* ═══════════════════════════════════════════════════════
   DATOS DE LIBROS
═══════════════════════════════════════════════════════ */
const BOOKS = [
  {
    id: 1,
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    price: 16.99,
    originalPrice: 24.99,
    rating: 5,
    reviews: 3841,
    image: "https://images.unsplash.com/photo-1762232978806-29b5d8986bb9?w=300&h=420&fit=crop&auto=format",
    badge: "Más vendido",
    badgeColor: "#c8773a",
    filter: "masvendido",
    desc: "Una historia íntima sobre Hollywood, amor, identidad y los secretos que guardamos durante toda una vida. La novela que todo el mundo está leyendo."
  },
  {
    id: 2,
    title: "Fourth Wing",
    author: "Rebecca Yarros",
    price: 19.99,
    originalPrice: null,
    rating: 5,
    reviews: 2190,
    image: "https://images.unsplash.com/photo-1759766199518-dbb5c6467707?w=300&h=420&fit=crop&auto=format",
    badge: "Nuevo",
    badgeColor: "#2d7a4f",
    filter: "nuevo",
    desc: "Violeta Sorrengail iba a unirse al Cuadrante de Escribas, pero su madre tiene otros planes. Una novela de fantasía épica con dragones y romance."
  },
  {
    id: 3,
    title: "Your Soul is a River",
    author: "Nikita Gill",
    price: 12.99,
    originalPrice: 18.00,
    rating: 5,
    reviews: 2034,
    image: "https://images.unsplash.com/photo-1518210777420-a2f84c71fffc?w=300&h=420&fit=crop&auto=format",
    badge: null,
    badgeColor: null,
    filter: "oferta",
    desc: "Una colección de poemas que exploran el amor, la pérdida y la sanación con una prosa lírica y hermosa que toca el alma."
  },
  {
    id: 4,
    title: "The First New Universe",
    author: "Marcus O'Brien",
    price: 13.50,
    originalPrice: null,
    rating: 4,
    reviews: 876,
    image: "https://images.unsplash.com/photo-1529521818954-c76995518833?w=300&h=420&fit=crop&auto=format",
    badge: "Oferta",
    badgeColor: "#c8773a",
    filter: "oferta",
    desc: "Una novela de ciencia ficción sobre el primer contacto con una civilización extraterrestre y lo que significa ser humano en un universo infinito."
  },
  {
    id: 5,
    title: "Your Heart is the Sea",
    author: "Mayra Cecilia Ortega",
    price: 14.99,
    originalPrice: 21.00,
    rating: 4,
    reviews: 1205,
    image: "https://images.unsplash.com/photo-1555252586-d77e8c828e41?w=300&h=420&fit=crop&auto=format",
    badge: null,
    badgeColor: null,
    filter: "oferta",
    desc: "Poemas íntimos sobre el mar, el amor y la distancia. Una voz única que transforma el dolor en belleza con cada verso cuidadosamente construido."
  },
  {
    id: 6,
    title: "Memorias del Futuro",
    author: "Clara Montoya",
    price: 17.99,
    originalPrice: null,
    rating: 4,
    reviews: 643,
    image: "https://images.unsplash.com/photo-1711185898226-beea7eee0611?w=300&h=420&fit=crop&auto=format",
    badge: "Editor's Pick",
    badgeColor: "#5b4fa0",
    filter: "masvendido",
    desc: "Una distopía latinoamericana donde el pasado puede editarse y el presente se vuelve inestable. Una de las novelas más originales del año."
  }
];

/* ═══════════════════════════════════════════════════════
   ESTADO DE LA APP
═══════════════════════════════════════════════════════ */
const state = {
  cart: [],        // { ...book, qty }
  wishlist: new Set(),
  filter: "todos",
  search: ""
};

/* ═══════════════════════════════════════════════════════
   UTILIDADES
═══════════════════════════════════════════════════════ */
function starsHTML(rating, size = 12) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += `<svg class="star${i > rating ? " empty" : ""}" style="width:${size}px;height:${size}px;" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  }
  return html;
}

function fmt(n) {
  return "$" + n.toFixed(2);
}

function cartTotal() {
  return state.cart.reduce((s, i) => s + i.price * i.qty, 0);
}

function cartCount() {
  return state.cart.reduce((s, i) => s + i.qty, 0);
}

/* ═══════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════ */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2500);
}

/* ═══════════════════════════════════════════════════════
   CARRITO
═══════════════════════════════════════════════════════ */
function openCart() {
  document.getElementById("cart-drawer").classList.add("open");
  document.getElementById("cart-overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.getElementById("cart-drawer").classList.remove("open");
  document.getElementById("cart-overlay").classList.remove("open");
  document.body.style.overflow = "";
}

function addToCart(id) {
  const book = BOOKS.find(b => b.id === id);
  const existing = state.cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    state.cart.push({ ...book, qty: 1 });
  }
  renderCart();
  updateCartBadge();
  showToast(`✓ "${book.title.split(" ").slice(0, 3).join(" ")}…" agregado al carrito`);
  openCart();
}

function removeFromCart(id) {
  state.cart = state.cart.filter(i => i.id !== id);
  renderCart();
  updateCartBadge();
}

function changeQty(id, delta) {
  const item = state.cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  renderCart();
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  const count = cartCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? "flex" : "none";
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const footer = document.getElementById("cart-footer");
  const countBadge = document.getElementById("cart-count-badge");

  countBadge.textContent = cartCount();

  if (state.cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        <p>Tu carrito está vacío</p>
        <button class="cart-empty-btn" onclick="closeCart()">Seguir comprando</button>
      </div>`;
    footer.style.display = "none";
    return;
  }

  footer.style.display = "block";

  container.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.image}" alt="${item.title}" />
      <div class="cart-item-info">
        <p class="cart-item-title">${item.title}</p>
        <p class="cart-item-author">${item.author}</p>
        <div class="cart-item-controls">
          <div class="qty-controls">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          </div>
          <span class="cart-item-price">${fmt(item.price * item.qty)}</span>
        </div>
      </div>
      <button class="cart-remove-btn" onclick="removeFromCart(${item.id})" title="Eliminar">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
      </button>
    </div>
  `).join("");

  const total = cartTotal();
  document.getElementById("cart-total").textContent = fmt(total);

  const shippingNote = document.getElementById("cart-shipping-note");
  if (total >= 29.99) {
    shippingNote.textContent = "✓ Envío gratis incluido";
    shippingNote.style.display = "block";
  } else {
    const diff = (29.99 - total).toFixed(2);
    shippingNote.textContent = `Agrega $${diff} más para envío gratis`;
    shippingNote.style.color = "var(--muted-fg)";
    shippingNote.style.display = "block";
  }
}

/* ═══════════════════════════════════════════════════════
   WISHLIST
═══════════════════════════════════════════════════════ */
function toggleWishlist(id, btn) {
  if (state.wishlist.has(id)) {
    state.wishlist.delete(id);
    btn.classList.remove("active");
    showToast("Eliminado de favoritos");
  } else {
    state.wishlist.add(id);
    btn.classList.add("active");
    showToast("❤️ Agregado a favoritos");
  }
}

/* ═══════════════════════════════════════════════════════
   MODAL VISTA RÁPIDA
═══════════════════════════════════════════════════════ */
function openModal(id) {
  const book = BOOKS.find(b => b.id === id);
  const body = document.getElementById("modal-body");
  body.innerHTML = `
    <img class="modal-img" src="${book.image.replace("w=300&h=420", "w=400&h=560")}" alt="${book.title}" />
    <div class="modal-info">
      ${book.badge ? `<span class="modal-badge" style="background:${book.badgeColor}">${book.badge}</span>` : ""}
      <h3 class="modal-title">${book.title}</h3>
      <p class="modal-author">${book.author}</p>
      <div class="modal-stars">
        ${starsHTML(book.rating, 16)}
        <span class="review-count">(${book.reviews.toLocaleString()})</span>
      </div>
      <p class="modal-desc">${book.desc}</p>
      <div class="modal-price-row">
        <span class="modal-price">${fmt(book.price)}</span>
        ${book.originalPrice ? `<span class="modal-price-orig">${fmt(book.originalPrice)}</span>` : ""}
      </div>
      <button class="modal-add-btn" onclick="addToCart(${book.id}); closeModal()">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        Agregar al carrito
      </button>
    </div>
  `;
  document.getElementById("modal").classList.add("open");
  document.getElementById("modal-overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modal").classList.remove("open");
  document.getElementById("modal-overlay").classList.remove("open");
  document.body.style.overflow = "";
}

/* ═══════════════════════════════════════════════════════
   RENDER GRID DE LIBROS
═══════════════════════════════════════════════════════ */
function renderBooks() {
  const grid = document.getElementById("books-grid");
  const noResults = document.getElementById("no-results");

  const filtered = BOOKS.filter(book => {
    const matchFilter = state.filter === "todos" || book.filter === state.filter;
    const q = state.search.toLowerCase();
    const matchSearch = !q ||
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = "";
    noResults.style.display = "block";
    return;
  }
  noResults.style.display = "none";

  grid.innerHTML = filtered.map(book => {
    const wished = state.wishlist.has(book.id);
    return `
      <div class="book-card">
        <div class="book-img-wrap">
          <img src="${book.image}" alt="${book.title}" loading="lazy" />
          ${book.badge ? `<span class="book-badge" style="background:${book.badgeColor}">${book.badge}</span>` : ""}
          <button class="wish-btn${wished ? " active" : ""}" onclick="toggleWishlist(${book.id}, this)" title="Favorito">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${wished ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </button>
          <div class="quick-view">
            <button class="quick-view-btn" onclick="openModal(${book.id})">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              Vista rápida
            </button>
          </div>
        </div>
        <p class="book-title">${book.title}</p>
        <p class="book-author">${book.author}</p>
        <div class="book-stars-row">
          ${starsHTML(book.rating)}
          <span class="review-count">(${book.reviews.toLocaleString()})</span>
        </div>
        <div class="book-footer">
          <div>
            <span class="book-price">${fmt(book.price)}</span>
            ${book.originalPrice ? `<span class="book-price-orig">${fmt(book.originalPrice)}</span>` : ""}
          </div>
          <button class="add-btn" onclick="addToCart(${book.id})" title="Agregar al carrito">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          </button>
        </div>
      </div>
    `;
  }).join("");
}

/* ═══════════════════════════════════════════════════════
   EVENTOS
═══════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {

  // Render inicial
  renderBooks();
  renderCart();

  // Abrir / cerrar carrito
  document.getElementById("cart-btn").addEventListener("click", openCart);
  document.getElementById("cart-close-btn").addEventListener("click", closeCart);
  document.getElementById("cart-overlay").addEventListener("click", closeCart);

  // Checkout (simulado)
  document.getElementById("btn-checkout").addEventListener("click", () => {
    closeCart();
    showToast("🎉 ¡Pedido procesado! Gracias por tu compra.");
    state.cart = [];
    renderCart();
    updateCartBadge();
  });

  // Cerrar modal
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-overlay").addEventListener("click", closeModal);

  // Filtros
  document.querySelectorAll(".filter-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      state.filter = tab.dataset.filter;
      renderBooks();
    });
  });

  // Búsqueda
  document.getElementById("search-input").addEventListener("input", e => {
    state.search = e.target.value.trim();
    renderBooks();
  });

  // Hamburguesa
  const ham = document.getElementById("hamburger-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  ham.addEventListener("click", () => {
    ham.classList.toggle("open");
    mobileMenu.classList.toggle("open");
  });

  // Newsletter
  document.getElementById("nl-form").addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("nl-email").value;
    document.getElementById("nl-form").outerHTML =
      `<p class="nl-success">✓ ¡Gracias! Revisa tu bandeja de entrada en <strong>${email}</strong></p>`;
  });

  // Tecla ESC cierra modales
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeCart();
      closeModal();
    }
  });
});