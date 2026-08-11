// ============================================================
// QM ACCESSORIES - E-COMMERCE DEMO
// This file contains a simple dataLayer implementation.
// Later, connect Google Tag Manager and create Meta Pixel tags.
// ============================================================

window.dataLayer = window.dataLayer || [];

const products = [
  {id:"QA-001",name:"MagSafe Power Bank",price:5999,category:"Power",icon:"🔋"},
  {id:"QA-002",name:"Premium Wireless Earbuds",price:4499,category:"Audio",icon:"🎧"},
  {id:"QA-003",name:"Fast Charge Cable",price:1299,category:"Cables",icon:"🔌"},
  {id:"QA-004",name:"MagSafe Phone Case",price:1999,category:"Cases",icon:"📱"},
  {id:"QA-005",name:"Smart Watch Pro",price:7999,category:"Wearables",icon:"⌚"},
  {id:"QA-006",name:"Laptop Stand",price:3499,category:"Desk",icon:"💻"},
  {id:"QA-007",name:"Car Phone Holder",price:2299,category:"Car",icon:"🚗"},
  {id:"QA-008",name:"USB-C Hub",price:4999,category:"Desk",icon:"🧩"}
];

let cart = JSON.parse(localStorage.getItem("qm_cart") || "[]");

function money(value){
  return "PKR " + Number(value).toLocaleString();
}

function pushEvent(eventName, data = {}){
  window.dataLayer.push({
    event: eventName,
    ...data
  });
  console.log("GTM dataLayer event:", eventName, data);
}

// ---------- Product rendering ----------

function renderProducts(){
  const grid = document.getElementById("productGrid");
  const query = document.getElementById("searchInput").value.toLowerCase().trim();

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );

  if(!filtered.length){
    grid.innerHTML = '<div class="empty" style="grid-column:1/-1">No products found.</div>';
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <article class="product">
      <div class="product-img">${p.icon}</div>
      <div class="product-body">
        <small>${p.category}</small>
        <h3>${p.name}</h3>
        <div class="price">${money(p.price)}</div>
        <button class="add-btn" onclick="addToCart('${p.id}')">Add to Cart</button>
      </div>
    </article>
  `).join("");
}

// ---------- ViewContent ----------

function viewProduct(product){
  pushEvent("view_item", {
    ecommerce: {
      currency: "PKR",
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: 1
      }]
    }
  });

  // Custom event specifically useful for Meta via GTM
  pushEvent("meta_view_content", {
    content_ids: [product.id],
    content_name: product.name,
    content_type: "product",
    value: product.price,
    currency: "PKR"
  });
}

// ---------- AddToCart ----------

function addToCart(id){
  const product = products.find(p => p.id === id);
  if(!product) return;

  const existing = cart.find(item => item.id === id);

  if(existing) existing.quantity += 1;
  else cart.push({...product, quantity:1});

  saveCart();
  updateCartUI();

  pushEvent("add_to_cart", {
    ecommerce: {
      currency: "PKR",
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: 1
      }]
    }
  });

  pushEvent("meta_add_to_cart", {
    content_ids: [product.id],
    content_name: product.name,
    content_type: "product",
    value: product.price,
    currency: "PKR"
  });

  openCart();
}

// ---------- Search ----------

document.getElementById("searchInput").addEventListener("change", function(){
  const query = this.value.trim();
  if(!query) return;

  pushEvent("search", {
    search_term: query
  });

  pushEvent("meta_search", {
    search_string: query
  });
});

// ---------- Cart ----------

function saveCart(){
  localStorage.setItem("qm_cart", JSON.stringify(cart));
}

function cartCount(){
  return cart.reduce((sum,item) => sum + item.quantity, 0);
}

function cartTotal(){
  return cart.reduce((sum,item) => sum + item.price * item.quantity, 0);
}

function updateCartUI(){
  document.getElementById("cartCount").textContent = cartCount();
  document.getElementById("cartTotal").textContent = money(cartTotal());

  const box = document.getElementById("cartItems");

  if(!cart.length){
    box.innerHTML = '<div class="empty">Your cart is empty.</div>';
    return;
  }

  box.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-icon">${item.icon}</div>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>${money(item.price)} × ${item.quantity}</p>
        <div class="qty">
          <button onclick="changeQty('${item.id}',-1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="changeQty('${item.id}',1)">+</button>
          <button onclick="removeItem('${item.id}')" style="margin-left:8px">Remove</button>
        </div>
      </div>
    </div>
  `).join("");
}

function changeQty(id, amount){
  const item = cart.find(x => x.id === id);
  if(!item) return;

  item.quantity += amount;

  if(item.quantity <= 0){
    cart = cart.filter(x => x.id !== id);
  }

  saveCart();
  updateCartUI();
}

function removeItem(id){
  cart = cart.filter(x => x.id !== id);
  saveCart();
  updateCartUI();
}

function openCart(){
  document.getElementById("cartDrawer").classList.add("active");
  document.getElementById("overlay").classList.add("active");
}

function closeCart(){
  document.getElementById("cartDrawer").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
}

function closeAll(){
  closeCart();
}

// ---------- InitiateCheckout ----------

function startCheckout(){
  if(!cart.length){
    alert("Please add a product first.");
    return;
  }

  const value = cartTotal();

  pushEvent("begin_checkout", {
    ecommerce: {
      currency: "PKR",
      value: value,
      items: cart.map(item => ({
        item_id: item.id,
        item_name: item.name,
        item_category: item.category,
        price: item.price,
        quantity: item.quantity
      }))
    }
  });

  pushEvent("meta_initiate_checkout", {
    content_ids: cart.map(item => item.id),
    content_type: "product",
    num_items: cartCount(),
    value: value,
    currency: "PKR"
  });

  closeCart();
  document.getElementById("checkoutModal").classList.add("active");
}

// ---------- AddPaymentInfo ----------

function trackPaymentInfo(){
  const method = document.getElementById("paymentMethod").value;
  if(!method) return;

  pushEvent("add_payment_info", {
    ecommerce: {
      currency: "PKR",
      value: cartTotal(),
      payment_type: method
    }
  });

  pushEvent("meta_add_payment_info", {
    value: cartTotal(),
    currency: "PKR",
    payment_type: method
  });
}

// ---------- Purchase ----------

function completePurchase(event){
  event.preventDefault();

  if(!cart.length) return;

  const orderId = "QM-" + Date.now();
  const value = cartTotal();

  const purchaseItems = cart.map(item => ({
    item_id: item.id,
    item_name: item.name,
    item_category: item.category,
    price: item.price,
    quantity: item.quantity
  }));

  // Main ecommerce event
  pushEvent("purchase", {
    transaction_id: orderId,
    ecommerce: {
      transaction_id: orderId,
      currency: "PKR",
      value: value,
      items: purchaseItems
    }
  });

  // Meta-friendly purchase event
  pushEvent("meta_purchase", {
    transaction_id: orderId,
    content_ids: cart.map(item => item.id),
    content_type: "product",
    num_items: cartCount(),
    value: value,
    currency: "PKR"
  });

  document.getElementById("orderMessage").textContent =
    `Order ${orderId} created successfully for ${money(value)}.`;

  document.getElementById("checkoutModal").classList.remove("active");
  document.getElementById("successBox").classList.add("active");

  cart = [];
  saveCart();
  updateCartUI();
  document.getElementById("checkoutForm").reset();
}

function closeCheckout(){
  document.getElementById("checkoutModal").classList.remove("active");
}

function closeSuccess(){
  document.getElementById("successBox").classList.remove("active");
}

// ---------- Contact ----------

function contactStore(){
  pushEvent("contact", {
    contact_method: "whatsapp_demo"
  });

  pushEvent("meta_contact", {
    contact_method: "whatsapp_demo"
  });

  alert("Demo contact event fired. Later you can replace this with your WhatsApp link.");
}

function trackHeroShopClick(){
  pushEvent("select_promotion", {
    promotion_name: "Hero Shop Collection"
  });
}

// Initial setup
renderProducts();
updateCartUI();

// Fire a page-level event so you can see GTM working.
pushEvent("qm_page_view", {
  page_type: "home"
});
