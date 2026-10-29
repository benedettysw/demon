const params=new URLSearchParams(location.search);
const product=getProduct(params.get("id"))||PRODUCTS[0];
document.title=`${product.name} | MiTienda`;
document.getElementById("crumbCategory").textContent=product.category;
const detail=document.getElementById("productDetail");
detail.innerHTML=`
 <div class="detail-layout">
  <section class="gallery-panel">
   <div class="thumbnail-list">${product.gallery.map((src,i)=>`<button class="thumbnail ${i===0?"selected":""}" data-gallery="${src}" aria-label="Ver imagen ${i+1}"><img src="${src}" alt=""></button>`).join("")}</div>
   <div class="main-product-image"><img id="mainProductImage" src="${product.gallery[0]}" alt="${product.name}"></div>
  </section>
  <section class="product-main-info">
   <div class="detail-meta"><span class="category-label">${product.category}</span><span class="condition">Nuevo</span><span>• ${product.sold}</span></div>
   <h1>${product.name}</h1><div class="detail-rating"><strong>${product.rating} ★★★★★</strong> <span>Opiniones de compradores</span></div>
   <div class="detail-price"><del>${money(product.oldPrice)}</del><div><strong>${money(product.price)}</strong><span class="detail-discount">${Math.round((1-product.price/product.oldPrice)*100)}% OFF</span></div><p>6 cuotas de ${money(Math.round(product.price/6))} sin interés*</p><small>*Condición ilustrativa para el proyecto académico.</small></div>
   <h3 class="know-title">Lo que tienes que saber</h3><ul class="quick-specs">${Object.entries(product.specs).slice(0,5).map(([k,v])=>`<li><b>${k}:</b> ${v}</li>`).join("")}</ul>
   <a class="text-button" href="#technical">Ver todas las características</a>
  </section>
  <aside class="purchase-box">
   <span class="shipping large">✓ Envío gratis a todo el país</span><h2>${money(product.price)}</h2><p class="installments">6 cuotas de ${money(Math.round(product.price/6))}</p>
   <p class="stock-label"><span class="stock-dot"></span> Disponible</p><p class="stock-count">Quedan ${product.stock} unidades</p>
   <label class="quantity-label">Cantidad:
    <select id="detailQty">${Array.from({length:Math.min(product.stock,10)},(_,i)=>`<option value="${i+1}">${i+1} unidad${i?"es":""}</option>`).join("")}</select>
   </label>
   <button class="btn btn-blue full" id="detailAdd">Agregar al carrito</button>
   <button class="btn btn-green full" id="buyProduct">Comprar por WhatsApp ↗</button>
   <div class="purchase-assurance"><p>🛡️ <span><b>Compra protegida</b><br>Consulta las condiciones con el vendedor.</span></p><p>↩️ <span><b>Devolución</b><br>Pregunta por la política de cambios.</span></p></div>
  </aside>
 </div>
 <section class="technical-section" id="technical"><div class="technical-copy"><span class="eyebrow">DETALLES DEL PRODUCTO</span><h2>Características principales</h2><table class="spec-table"><tbody>${Object.entries(product.specs).map(([k,v])=>`<tr><th>${k}</th><td>${v}</td></tr>`).join("")}<tr><th>Estado</th><td>Nuevo</td></tr><tr><th>Envío</th><td>Gratis</td></tr></tbody></table></div><div class="description-copy"><span class="eyebrow">CONOCE MÁS</span><h2>Descripción</h2><p>${product.description}</p><p>Este producto forma parte de un catálogo demostrativo creado para una actividad académica del SENA. Consulta disponibilidad, garantía y características definitivas antes de acordar la compra.</p></div></section>`;
document.querySelectorAll("[data-gallery]").forEach(btn=>btn.addEventListener("click",()=>{document.querySelector(".thumbnail.selected")?.classList.remove("selected");btn.classList.add("selected");document.getElementById("mainProductImage").src=btn.dataset.gallery;}));
document.getElementById("detailAdd").addEventListener("click",()=>{const qty=Number(document.getElementById("detailQty").value);addToCart(product.id,qty);});
document.getElementById("buyProduct").addEventListener("click",()=>{const qty=Number(document.getElementById("detailQty").value);const msg=`¡Hola! Me interesa este producto de MiTienda:\n• ${product.name}\n• Cantidad: ${qty}\n• Precio unitario: ${money(product.price)}\n• Total estimado: ${money(product.price*qty)}\n¿Me confirmas disponibilidad y opciones de entrega?`;window.open(whatsappUrl(msg),"_blank","noopener");});