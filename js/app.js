const COP = new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0});
const money = n => COP.format(n);
const getCart = () => { try { return JSON.parse(localStorage.getItem("mitienda-cart")||"[]"); } catch { return []; } };
const saveCart = cart => { localStorage.setItem("mitienda-cart",JSON.stringify(cart)); updateCartUI(); };
const getProduct = id => PRODUCTS.find(p=>p.id===Number(id));
function addToCart(id,qty=0){
 const p=getProduct(id); if(!p)return;
 const cart=getCart(), item=cart.find(x=>x.id===p.id);
 if(item)item.qty=Math.min(p.stock,item.qty+qty); else cart.push({id:p.id,qty:Math.min(p.stock,qty)});
 saveCart(cart); toast(`${p.name} agregado al carrito`);
}
function changeQty(id,delta){
 const cart=getCart(),item=cart.find(x=>x.id===Number(id)),p=getProduct(id); if(!item||!p)return;
 item.qty+=delta; if(item.qty<=0)cart.splice(cart.indexOf(item),1); else item.qty=Math.min(item.qty,p.stock);
 saveCart(cart);
}
function removeFromCart(id){saveCart(getCart().filter(x=>x.id!==Number(id)));}
function cartDetails(){return getCart().map(x=>({...getProduct(x.id),qty:x.qty})).filter(x=>x.id);}
function cartTotal(){return cartDetails().reduce((sum,p)=>sum+p.price*p.qty,0);}
function updateCartUI(){
 const details=cartDetails(),count=details.reduce((s,p)=>s+p.qty,0);
 document.querySelectorAll("#cartCount").forEach(el=>el.textContent=count);
 const items=document.getElementById("cartItems"),total=document.getElementById("cartTotal");
 if(items)items.innerHTML=details.length?details.map(p=>`<div class="cart-item"><img src="${p.image}" alt=""><div class="cart-item-info"><a href="producto.html?id=${p.id}">${p.name}</a><strong>${money(p.price)}</strong><div class="qty-control"><button data-cart-dec="${p.id}" aria-label="Restar">−</button><span>${p.qty}</span><button data-cart-inc="${p.id}" aria-label="Sumar">+</button><button class="remove-item" data-remove="${p.id}">Quitar</button></div></div></div>`).join(""):'<div class="cart-empty"><span>🛒</span><h3>Tu carrito está vacío</h3><p>Agrega productos del catálogo para verlos aquí.</p><a href="index.html" class="primary-link">Ver productos →</a></div>';
 if(total)total.textContent=money(cartTotal());
 const checkout=document.getElementById("checkoutWhatsApp"); if(checkout)checkout.disabled=!details.length;
}
function toast(message){const el=document.getElementById("toast");if(!el)return;el.textContent=message;el.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove("show"),2400);}
function whatsappUrl(message){const phone=(window.WHATSAPP_NUMBER||"573001234567").replace(/\D/g,"");return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;}
function cartWhatsApp(){
 const details=cartDetails();if(!details.length){toast("Agrega al menos un producto primero");return;}
 const lines=details.map(p=>`• ${p.name} x${p.qty}: ${money(p.price*p.qty)}`).join("\n");
 const message=`¡Hola! Quiero consultar y confirmar este pedido de MiTienda:\n\n${lines}\n\nSubtotal: ${money(cartTotal())}\n¿Me confirmas disponibilidad y entrega?`;
 window.open(whatsappUrl(message),"_blank","noopener");
}
function openCart(){document.getElementById("overlay")?.classList.add("active");const d=document.getElementById("cartDrawer");d?.classList.add("open");d?.setAttribute("aria-hidden","false");}
function closeCart(){document.getElementById("overlay")?.classList.remove("active");const d=document.getElementById("cartDrawer");d?.classList.remove("open");d?.setAttribute("aria-hidden","true");}
document.addEventListener("click",e=>{
 const add=e.target.closest("[data-add]");if(add){addToCart(Number(add.dataset.add),Number(add.dataset.qty||1));return;}
 const inc=e.target.closest("[data-cart-inc]");if(inc){changeQty(inc.dataset.cartInc,1);return;}
 const dec=e.target.closest("[data-cart-dec]");if(dec){changeQty(dec.dataset.cartDec,-1);return;}
 const rem=e.target.closest("[data-remove]");if(rem){removeFromCart(rem.dataset.remove);return;}
});
document.getElementById("openCart")?.addEventListener("click",openCart);
document.getElementById("closeCart")?.addEventListener("click",closeCart);
document.getElementById("overlay")?.addEventListener("click",closeCart);
document.getElementById("checkoutWhatsApp")?.addEventListener("click",cartWhatsApp);
document.getElementById("clearCart")?.addEventListener("click",()=>{saveCart([]);toast("Carrito vaciado");});
document.getElementById("searchForm")?.addEventListener("submit",e=>{e.preventDefault();const q=document.getElementById("searchInput").value.trim();if(document.getElementById("productGrid"))renderCatalog(q);else window.location.href=`index.html?q=${encodeURIComponent(q)}`;});
function renderCatalog(query=""){
 const grid=document.getElementById("productGrid");if(!grid)return;
 const active=document.querySelector(".chip.active")?.dataset.category||"Todos",sort=document.getElementById("sortSelect")?.value||"featured";
 let list=PRODUCTS.filter(p=>(active==="Todos"||p.category===active)&&(`${p.name} ${p.category} ${p.short}`).toLowerCase().includes(query.toLowerCase()));
 if(sort==="low")list.sort((a,b)=>a.price-b.price);if(sort==="high")list.sort((a,b)=>b.price-a.price);
 grid.innerHTML=list.map(p=>`<article class="product-card"><a class="product-image" href="producto.html?id=${p.id}"><span class="discount-tag">-${Math.round((1-p.price/p.oldPrice)*100)}%</span><img src="${p.image}" alt="${p.name}"></a><div class="product-info"><span class="category-label">${p.category}</span><a class="product-title" href="producto.html?id=${p.id}">${p.name}</a><div class="rating">★ <b>${p.rating}</b> <span>(${p.sold})</span></div><div class="price-row"><strong>${money(p.price)}</strong><del>${money(p.oldPrice)}</del></div><p class="installments">6 cuotas de ${money(Math.round(p.price/6))}</p><p class="shipping">✓ Envío gratis</p><button class="btn btn-dark full" data-add="${p.id}">Agregar al carrito</button><a class="detail-link" href="producto.html?id=${p.id}">Ver detalle →</a></div></article>`).join("");
 document.getElementById("emptyMessage").hidden=list.length>0;
}
document.querySelectorAll(".chip").forEach(chip=>chip.addEventListener("click",()=>{document.querySelector(".chip.active")?.classList.remove("active");chip.classList.add("active");renderCatalog(document.getElementById("searchInput")?.value||"");}));
document.getElementById("sortSelect")?.addEventListener("change",()=>renderCatalog(document.getElementById("searchInput")?.value||""));
const initialQuery=new URLSearchParams(location.search).get("q")||"";
if(document.getElementById("searchInput"))document.getElementById("searchInput").value=initialQuery;
renderCatalog(initialQuery);updateCartUI();