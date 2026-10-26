const $ = s => document.querySelector(s);
const cartIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h2l2 14h12l2-10H6M9 21h.01M18 21h.01" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const products = MENU.flatMap(c=>c.items.map((p,i)=>({id:`${c.id}-${i}`,name:p[0],ar:p[1],price:p[2],note:p[3]||'',category:c.id,image:c.id==='juice'?`assets/juices/juice-${i}.webp`:`assets/premium/food-${c.id}.webp`})));
const byId = Object.fromEntries(products.map(p=>[p.id,p]));
let basket={};
try { const saved=JSON.parse(localStorage.getItem('jannat-cart-complete-v2')||'{}'); for(const [id,q] of Object.entries(saved||{})) if(byId[id]&&Number.isSafeInteger(q)&&q>0&&q<=999) basket[id]=q; } catch {}
let toastTimer;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function notify(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2000)}
function total(){return Object.entries(basket).reduce((sum,[id,q])=>sum+byId[id].price*q,0)}
function update(){
 try{localStorage.setItem('jannat-cart-complete-v2',JSON.stringify(basket))}catch{notify('Stockage indisponible : gardez cette page ouverte.')}
 const count=Object.values(basket).reduce((a,b)=>a+b,0);
 document.querySelectorAll('[data-count]').forEach(el=>el.textContent=count);
 $('#floating-cart').setAttribute('aria-label',`Ouvrir le panier, ${count} articles`);
 document.querySelectorAll('[data-qty]').forEach(el=>el.textContent=basket[el.dataset.qty]?`${basket[el.dataset.qty]} ×`:'');
 $('#confirmation').hidden=true;
 renderCart();
}
function renderMenu(){
 const query=normalize($('#search').value.trim());
 $('#products').innerHTML=[...MENU].sort((a,b)=>['tacos','sandwich','pizza','chicken','salad','pasticcio','traditional','daily','juice','cold','tea'].indexOf(a.id)-['tacos','sandwich','pizza','chicken','salad','pasticcio','traditional','daily','juice','cold','tea'].indexOf(b.id)).map(c=>{
 const matches=products.filter(p=>p.category===c.id&&normalize(`${p.name} ${p.ar} ${c.name} ${c.ar}`).includes(query));
 if(!matches.length)return '';
 const scene=`assets/premium/food-${c.id}.webp`;
 return `<section class="product-section" id="${c.id}"><div class="section-title"><h3><img src="assets/premium/food-${c.id}.webp" alt="">${c.name} <span lang="ar" dir="rtl">${c.ar}</span></h3><a class="see-all" href="#${c.id}">Voir tout ❯</a></div><div class="section-content"><img class="section-scene" src="${scene}" alt="${c.name}" loading="lazy"><div class="product-grid">${matches.map(p=>`<article class="product"><img class="product-photo" src="${p.image}" alt="${c.name}" loading="lazy"><div class="product-body"><h4>${p.name}</h4><p class="arabic" lang="ar" dir="rtl">${p.ar}</p><span class="dots"></span>${p.note?`<div class="availability">${p.note}</div>`:''}<div class="product-bottom"><span class="price">${p.price} <small>DH</small></span><button class="add" data-add="${p.id}" aria-label="Ajouter ${p.name} au panier">${cartIcon}</button></div><span class="qty-label" data-qty="${p.id}">${basket[p.id]?`${basket[p.id]} ×`:''}</span></div></article>`).join('')}</div></div>${c.id==='juice'?`<div class="juice-gallery" aria-label="Nos jus en images">${matches.map(p=>`<figure><img src="${p.image}" alt="${p.name}" loading="lazy" decoding="async" width="240" height="240"><figcaption><strong>${p.name}</strong><span lang="ar" dir="rtl">${p.ar}</span><b>${p.price} DH</b></figcaption></figure>`).join('')}</div>`:''}${c.note?`<small class="section-note">${c.note}</small>`:''}</section>`;

 }).join('');
 $('#no-results').hidden=!!$('#products').children.length;
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('reveal');observer.unobserve(e.target)}}),{threshold:.05});document.querySelectorAll('.product').forEach(el=>observer.observe(el))}
}
function fly(image,origin){
 if(reduced.matches)return;
 const from=origin.getBoundingClientRect(),to=$('#floating-cart').getBoundingClientRect();
 const copy=image.cloneNode();copy.removeAttribute('loading');copy.alt='';copy.className='fly-image';copy.style.cssText=`left:${from.left}px;top:${from.top}px;width:88px;height:88px`;document.body.append(copy);
 const dx=to.left+to.width/2-from.left-44,dy=to.top+to.height/2-from.top-44;
 const frames=Array.from({length:41},(_,i)=>{const t=i/40;return{transform:`translate3d(${dx*t}px,${dy*t-Math.min(230,Math.max(110,Math.abs(dy)*.35))*4*t*(1-t)}px,0) scale(${1-.88*t})`,opacity:t>.9?1-(t-.9)*10:1}});
 copy.animate(frames,{duration:760,easing:'ease-in-out'}).finished.then(()=>{$('#floating-cart').animate([{transform:'scale(1)'},{transform:'scale(1.2)',offset:.4},{transform:'scale(1)'}],{duration:280})}).catch(()=>{}).finally(()=>copy.remove());
}
function change(id,delta){if(!byId[id])return;const q=(basket[id]||0)+delta;if(q>999){notify('Quantité maximale : 999');return}if(q<=0)delete basket[id];else basket[id]=q;update()}
function renderCart(){
 $('#cart-items').innerHTML=Object.entries(basket).map(([id,q])=>{const p=byId[id];return `<div class="cart-item"><img src="${p.image}" alt=""><div class="cart-item-info"><h3>${p.name}</h3><p>${q*p.price} DH <small>· ${p.price} DH / unité</small></p></div><div class="controls"><button data-change="${id}" data-delta="-1" aria-label="Diminuer ${p.name}">−</button><span>${q}</span><button data-change="${id}" data-delta="1" aria-label="Augmenter ${p.name}">+</button><button class="remove" data-remove="${id}" aria-label="Supprimer ${p.name}">×</button></div></div>`}).join('')||'<div class="empty"><strong>Une envie à combler ?</strong>Ajoutez vos plats préférés au panier.<br>Votre prochain régal commence ici.</div>';
 $('#cart-summary').hidden=!Object.keys(basket).length;$('#total').textContent=`${total()} DH`;
}
$('#categories').innerHTML=MENU.map((c,i)=>`<button class="category${i===0?' active':''}" data-category="${c.id}"><img src="assets/premium/food-${c.id}.webp" alt=""><strong>${c.name}</strong><span lang="ar" dir="rtl">${c.ar}</span></button>`).join('');
$('#categories').addEventListener('click',e=>{const button=e.target.closest('[data-category]');if(!button)return;const id=button.dataset.category;if(!document.getElementById(id)){$('#search').value='';renderMenu()}document.getElementById(id).scrollIntoView({behavior:reduced.matches?'instant':'smooth'});document.querySelectorAll('.category').forEach(el=>el.classList.toggle('active',el===button))});
$('#products').addEventListener('click',e=>{const button=e.target.closest('[data-add]');if(!button)return;const id=button.dataset.add;if((basket[id]||0)>=999){notify('Quantité maximale : 999');return}change(id,1);fly(button.closest('.product').querySelector('img'),button);notify('Ajouté au panier ✓')});
$('#search').addEventListener('input',renderMenu);
document.querySelectorAll('[data-open-cart]').forEach(el=>el.addEventListener('click',()=>{if(!$('#cart').open){$('#cart').showModal();document.body.style.overflow='hidden'}}));
$('#close-cart').addEventListener('click',()=>$('#cart').close());
$('#cart').addEventListener('close',()=>document.body.style.overflow='');
$('#cart').addEventListener('click',e=>{if(e.target===$('#cart')){const r=$('#cart').getBoundingClientRect();if(e.clientY<r.top||e.clientX<r.left||e.clientX>r.right)$('#cart').close()}});
$('#cart-items').addEventListener('click',e=>{const changeButton=e.target.closest('[data-change]'),remove=e.target.closest('[data-remove]');if(changeButton)change(changeButton.dataset.change,Number(changeButton.dataset.delta));if(remove){delete basket[remove.dataset.remove];update()}});
const number=String(window.JANNAT_CONFIG.whatsappNumber||'').trim();
const configured=/^[1-9]\d{7,14}$/.test(number);
$('#config-notice').textContent=configured?'Vous pourrez vérifier le récapitulatif avant de passer sur WhatsApp.':'Commande WhatsApp bientôt disponible : le restaurant doit renseigner son numéro. Vous pouvez préparer et vérifier votre panier.';
$('#checkout').addEventListener('click',()=>{
 const table=$('#table').value.trim();
 const message=`SNACK JANNAT — Nouvelle commande\n\n${Object.entries(basket).map(([id,q])=>`${q} × ${byId[id].name} — ${byId[id].price} DH / unité — ${q*byId[id].price} DH`).join('\n')}\n\nTotal : ${total()} DH${table?`\nTable : ${table}`:''}`;
 $('#order-preview').textContent=message;$('#confirmation').hidden=false;
 const link=$('#send-order');link.hidden=!configured;if(configured)link.href=`https://wa.me/${number}?text=${encodeURIComponent(message)}`;
 $('#confirmation').scrollIntoView({block:'nearest',behavior:reduced.matches?'instant':'smooth'});
});
$('#table').addEventListener('input',()=>$('#confirmation').hidden=true);
renderMenu();update();

