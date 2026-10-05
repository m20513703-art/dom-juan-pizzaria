const storageKey = 'domjuan_pdv_demo_v1';
const initialOrders = [{
  id: 1042,
  name: 'Mariana Oliveira',
  channel: 'Site · exemplo',
  type: 'Entrega',
  time: '11:02',
  status: 'novo',
  items: [
    ['Pizza calabresa', 1, 37],
    ['Refrigerante 1 litro', 1, 10]
  ],
  total: 47,
  address: 'Rua das Flores, 125',
  payment: 'Pix · ilustrativo'
}, {
  id: 1041,
  name: 'Rafael Mendes',
  channel: 'Balcão · exemplo',
  type: 'Retirada',
  time: '10:54',
  status: 'preparando',
  items: [
    ['Pizza quatro queijos', 1, 48],
    ['Água 500 ml', 1, 4]
  ],
  total: 52,
  address: 'Retirada no balcão',
  payment: 'Cartão · ilustrativo'
}, {
  id: 1040,
  name: 'Camila Souza',
  channel: 'Site · exemplo',
  type: 'Entrega',
  time: '10:41',
  status: 'pronto',
  items: [
    ['Pizza frango cremoso', 1, 49],
    ['Suco 300 ml', 1, 7]
  ],
  total: 56,
  address: 'Av. Central, 42',
  payment: 'Dinheiro · ilustrativo'
}, {
  id: 1039,
  name: 'Lucas Ferreira',
  channel: 'Telefone · exemplo',
  type: 'Retirada',
  time: '10:28',
  status: 'finalizado',
  items: [
    ['Pizza marguerita', 1, 39]
  ],
  total: 39,
  address: 'Retirada no balcão',
  payment: 'Pix · ilustrativo'
}];
const initialMenu = [
  {name: "Muçarela", category: "Tradicional", price: 35, ingredients: "Molho de tomate, muçarela, orégano e azeitonas.", available: true, image: 'pizza-01.jpg'},
  {name: "Calabresa", category: "Tradicional", price: 37, ingredients: "Molho de tomate, muçarela, calabresa fatiada e cebola.", available: true, image: 'pizza-02.jpg'},
  {name: "Marguerita", category: "Tradicional", price: 39, ingredients: "Molho de tomate, muçarela, tomate fresco e manjericão.", available: true, image: 'pizza-03.jpg'},
  {name: "Milho com Muçarela", category: "Tradicional", price: 38, ingredients: "Molho de tomate, muçarela, milho e orégano.", available: true, image: 'pizza-04.jpg'},
  {name: "Presunto", category: "Tradicional", price: 40, ingredients: "Molho de tomate, muçarela, presunto e azeitonas.", available: true, image: 'pizza-05.jpg'},
  {name: "Quatro Queijos", category: "Especial", price: 48, ingredients: "Molho de tomate, muçarela, provolone, parmesão e requeijão cremoso.", available: true, image: 'pizza-06.jpg'},
  {name: "Frango Cremoso", category: "Especial", price: 49, ingredients: "Molho de tomate, frango desfiado temperado, requeijão, milho e muçarela.", available: true, image: 'pizza-07.jpg'},
  {name: "Pepperoni", category: "Especial", price: 52, ingredients: "Molho de tomate, muçarela, pepperoni e orégano.", available: true, image: 'pizza-08.jpg'},
  {name: "Portuguesa Especial", category: "Especial", price: 51, ingredients: "Molho de tomate, presunto, ovo, cebola, ervilha, muçarela e azeitonas.", available: true, image: 'pizza-09.jpg'},
  {name: "Da Casa", category: "Especial", price: 54, ingredients: "Molho de tomate, calabresa, bacon, cebola roxa, muçarela e toque de barbecue.", available: true, image: 'pizza-10.jpg'},
  {name: "Chocolate", category: "Doce", price: 42, ingredients: "Massa com calda de chocolate ao leite e granulado.", available: true, image: 'pizza-11.jpg'},
  {name: "Chocolate com Morango", category: "Doce", price: 44, ingredients: "Calda de chocolate, morangos frescos e raspas de chocolate.", available: true, image: 'pizza-12.jpg'},
  {name: "Banana com Canela", category: "Doce", price: 46, ingredients: "Banana, calda de doce de leite, açúcar e canela.", available: true, image: 'pizza-13.jpg'},
  {name: "Romeu e Julieta", category: "Doce", price: 45, ingredients: "Calda de goiabada e queijo muçarela.", available: true, image: 'pizza-14.jpg'},
  {name: "Doce de Leite", category: "Doce", price: 48, ingredients: "Calda de doce de leite cremoso e coco ralado.", available: true, image: 'pizza-15.jpg'},
  {name: "Refrigerante lata 350 ml", category: 'Bebida', price: 6, ingredients: "Refrigerante gelado.", available: true},
  {name: "Refrigerante 1 litro", category: 'Bebida', price: 10, ingredients: "Refrigerante gelado.", available: true},
  {name: "Água 500 ml", category: 'Bebida', price: 4, ingredients: "Água mineral sem gás.", available: true},
  {name: "Suco 300 ml", category: 'Bebida', price: 7, ingredients: "Suco ilustrativo.", available: true},
];
let saved = {};
try {
  saved = JSON.parse(localStorage.getItem(storageKey) || '{}')
} catch (e) {}
let orders = Array.isArray(saved.orders) ? saved.orders : initialOrders;
let menu = Array.isArray(saved.menu) ? saved.menu : initialMenu;
const recipeDefaults = {
  'Muçarela': 'Molho de tomate, muçarela, orégano e azeitonas.',
  'Calabresa': 'Molho de tomate, muçarela, calabresa e cebola.',
  'Marguerita': 'Molho de tomate, muçarela, tomate e manjericão.',
  'Quatro queijos': 'Molho, muçarela, provolone, parmesão e requeijão.',
  'Frango cremoso': 'Molho, frango desfiado, requeijão, milho e muçarela.',
  'Chocolate': 'Chocolate ao leite e granulado.',
  'Refrigerante 1 litro': 'Refrigerante gelado.',
  'Água 500 ml': 'Água mineral sem gás.'
};
menu.forEach(p => {
  if (!p.ingredients) p.ingredients = recipeDefaults[p.name] || 'Ingredientes e descrição a definir.'
});
let activeFilter = 'todos';
let searchTerm = '';
let stagedItems = [];
const labels = {
  novo: 'Novo',
  preparando: 'Em preparo',
  pronto: 'Pronto',
  finalizado: 'Concluído',
  cancelado: 'Cancelado'
};
const money = n => 'R$ ' + Number(n || 0).toFixed(2).replace('.', ',');
const safe = s => String(s ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
} [c]));
let imageTargetIndex = null;

function compressImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Selecione um arquivo de imagem.'));
      return
    }
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      try {
        const maxDimension = 640;
        const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const data = canvas.toDataURL('image/jpeg', 0.76);
        URL.revokeObjectURL(objectUrl);
        resolve(data)
      } catch (error) {
        URL.revokeObjectURL(objectUrl);
        reject(error)
      }
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Não foi possível abrir essa imagem.'))
    };
    image.src = objectUrl
  })
}

function save() {
  localStorage.setItem(storageKey, JSON.stringify({
    orders,
    menu
  }))
}

function statusBadge(status) {
  return `<span class="status ${status}">● ${labels[status]||status}</span>`
}

function orderCard(o) {
  const next = {
    novo: ['preparando', 'Aceitar e preparar'],
    preparando: ['pronto', 'Marcar como pronto'],
    pronto: ['finalizado', 'Concluir pedido']
  } [o.status];
  const items = (o.items || []).map(x => `<div><span>${safe(x[0])} × ${x[1]}</span><span>${money(x[2]*x[1])}</span></div>`).join('');
  return `<article class="order-card"><div class="order-top"><div><div class="order-number">Pedido #${safe(o.id)}</div><div class="order-customer">${safe(o.name)} · ${safe(o.type)}</div></div>${statusBadge(o.status)}</div><div class="order-lines">${items}</div><div class="order-meta"><span>🕒 ${safe(o.time)}</span><span>📍 ${safe(o.address)}</span><span>💳 ${safe(o.payment)}</span><span>Via: ${safe(o.channel)}</span></div><div class="order-bottom"><span class="total-price">${money(o.total)}</span><div class="card-actions">${o.status==='novo'||o.status==='preparando'?`<button class="btn danger small" data-cancel="${safe(o.id)}">Cancelar</button>`:''}${next?`<button class="btn primary small" data-advance="${safe(o.id)}">${next[1]} →</button>`:''}</div></div></article>`
}

function counts() {
  return {
    novo: orders.filter(o => o.status === 'novo').length,
    preparando: orders.filter(o => o.status === 'preparando').length,
    pronto: orders.filter(o => o.status === 'pronto').length,
    finalizado: orders.filter(o => o.status === 'finalizado').length
  }
}

function updateDashboard() {
  const c = counts();
  document.getElementById('stat-new').textContent = c.novo;
  document.getElementById('stat-preparing').textContent = c.preparando;
  document.getElementById('stat-ready').textContent = c.pronto;
  const sales = orders.filter(o => o.status === 'finalizado').reduce((a, o) => a + Number(o.total || 0), 0);
  document.getElementById('stat-sales').textContent = money(sales);
  document.getElementById('queue-summary').innerHTML = [
    ['Novos', 'novo'],
    ['Em preparo', 'preparando'],
    ['Prontos', 'pronto'],
    ['Concluídos', 'finalizado']
  ].map(([label, key]) => `<div class="summary-row"><span class="summary-label"><i class="dot" style="background:${key==='novo'?'#ffd47b':key==='preparando'?'#ff9b45':key==='pronto'?'#7fd49b':'#82bbff'}"></i>${label}</span><span class="summary-count">${c[key]}</span></div>`).join('');
  const recent = orders.filter(o => !['finalizado', 'cancelado'].includes(o.status)).slice(0, 3);
  document.getElementById('recent-orders').innerHTML = recent.length ? recent.map(orderCard).join('') : '<div class="empty">🎉<strong>Nenhum pedido pendente</strong>A fila está vazia nesta demonstração.</div>';
}

function updateOrders() {
  const filtered = orders.filter(o => activeFilter === 'todos' || o.status === activeFilter).filter(o => `${o.id} ${o.name} ${o.type}`.toLowerCase().includes(searchTerm.toLowerCase()));
  document.getElementById('all-orders').innerHTML = filtered.length ? filtered.map(orderCard).join('') : '<div class="panel empty" style="grid-column:1/-1">Nenhum pedido nesta etapa.</div>'
}

function updateMenu() {
  document.getElementById('menu-grid').innerHTML = menu.map((p, i) => `<article class="product"><div class="product-top"><div class="product-title-row">${p.image?`<img class="product-thumb" src="${safe(p.image)}" alt="Foto de ${safe(p.name)}">`:'<div class="product-placeholder">🍕</div>'}<div><h3>${safe(p.name)}</h3><p>${safe(p.category)}</p><div class="ingredient-list">${safe(p.ingredients||'Descrição não cadastrada')}</div></div></div><span class="product-price">${money(p.price)}</span></div><div class="product-bottom"><span class="availability ${p.available?'':'off'}">${p.available?'● Disponível':'● Indisponível'}</span><div class="card-actions"><button class="btn subtle small" data-price="${i}">Editar</button><button class="btn subtle small" data-image="${i}">Foto</button>${p.image?`<button class="btn subtle small" data-image-clear="${i}">Tirar foto</button>`:''}<button class="btn subtle small" data-availability="${i}">${p.available?'Pausar':'Ativar'}</button><button class="btn danger small" data-delete="${i}">Remover</button></div></div></article>`).join('')
}

function updateCash() {
  const done = orders.filter(o => o.status === 'finalizado');
  const total = done.reduce((sum, o) => sum + Number(o.total || 0), 0);
  document.getElementById('cash-sales').textContent = money(total);
  document.getElementById('cash-count').textContent = done.length;
  document.getElementById('cash-average').textContent = money(done.length ? total / done.length : 0);
  document.getElementById('cash-table').innerHTML = done.length ? done.map(o => `<tr><td>#${safe(o.id)}</td><td>${safe(o.name)}</td><td>${safe(o.payment)}</td><td>${safe(o.time)}</td><td><strong>${money(o.total)}</strong></td></tr>`).join('') : '<tr><td colspan="5" style="color:#b9afa5;text-align:center;padding:22px">Ainda não há pedidos concluídos.</td></tr>'
}

function render() {
  updateDashboard();
  updateOrders();
  updateMenu();
  updateCash();
  save()
}

function toast(text) {
  const el = document.getElementById('toast');
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => el.classList.remove('show'), 2600)
}

function go(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === 'page-' + page));
  document.querySelectorAll('[data-page]').forEach(b => b.classList.toggle('active', b.dataset.page === page));
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

function pizzaProduct(p) {
  return p && p.category !== 'Bebida'
}

function fillOrderProducts() {
  const select = document.getElementById('order-product');
  const available = menu.map((p, i) => ({
    p,
    i
  })).filter(x => x.p.available);
  select.innerHTML = available.map(x => `<option value="${x.i}">${safe(x.p.name)} · ${money(x.p.price)}</option>`).join('') || '<option value="">Nenhum produto disponível</option>';
  updatePizzaOptions()
}

function updatePizzaOptions() {
  const idx = Number(document.getElementById('order-product').value);
  const product = menu[idx];
  const isPizza = pizzaProduct(product);
  document.getElementById('pizza-options').hidden = !isPizza;
  if (!isPizza) return;
  document.getElementById('base-ingredients').textContent = 'Ingredientes cadastrados: ' + (product.ingredients || 'descrição não cadastrada');
  const select = document.getElementById('pizza-second-flavor');
  select.innerHTML = '<option value="">Sem segundo sabor</option>' + menu.map((p, i) => ({
    p,
    i
  })).filter(x => x.p.available && pizzaProduct(x.p) && x.i !== idx && ((x.p.category === 'Doce') === (product.category === 'Doce'))).map(x => `<option value="${x.i}">${safe(x.p.name)} · ${money(x.p.price)}</option>`).join('')
}

function renderStaged() {
  const list = document.getElementById('staged-lines');
  if (!stagedItems.length) {
    list.innerHTML = '<div class="empty">Adicione uma pizza ou outro produto.</div>'
  } else {
    list.innerHTML = stagedItems.map((item, i) => `<div class="staged-line"><div><strong>${item.quantity} × ${safe(item.name)}</strong><small>${money(item.unitPrice)} cada</small></div><div style="text-align:right"><strong>${money(item.quantity*item.unitPrice)}</strong><br><button type="button" data-remove-staged="${i}">Remover item</button></div></div>`).join('')
  }
  const total = stagedItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  document.getElementById('staged-total').textContent = money(total);
  document.getElementById('save-new-order').disabled = !stagedItems.length
}

function openOrder() {
  stagedItems = [];
  renderStaged();
  fillOrderProducts();
  document.getElementById('order-customer').value = '';
  document.getElementById('order-address').value = '';
  document.getElementById('order-note').value = '';
  document.getElementById('order-quantity').value = '1';
  document.querySelectorAll('.pizza-extra').forEach(x => x.checked = false);
  document.getElementById('order-modal').hidden = false;
  document.getElementById('order-customer').focus()
}

function closeOrder() {
  document.getElementById('order-modal').hidden = true
}
document.querySelectorAll('[data-open-order]').forEach(b => b.addEventListener('click', openOrder));
document.querySelectorAll('[data-close-order]').forEach(b => b.addEventListener('click', closeOrder));
document.getElementById('order-modal').addEventListener('click', e => {
  if (e.target.id === 'order-modal') closeOrder()
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeOrder()
});
document.getElementById('order-product').addEventListener('change', updatePizzaOptions);
document.getElementById('add-order-line').addEventListener('click', () => {
  const index = Number(document.getElementById('order-product').value);
  const product = menu[index];
  if (!product || !product.available) {
    toast('Escolha um produto disponível.');
    return
  }
  const quantity = Math.max(1, Math.min(20, Number(document.getElementById('order-quantity').value) || 1));
  let unitPrice = Number(product.price);
  let name = product.name;
  if (pizzaProduct(product)) {
    const secondIndex = document.getElementById('pizza-second-flavor').value;
    const second = secondIndex === '' ? null : menu[Number(secondIndex)];
    if (second) {
      unitPrice = Math.max(unitPrice, Number(second.price));
      name += ' meio a meio: ' + second.name
    }
    const size = document.getElementById('pizza-size');
    const sizeFactor = Number(size.value);
    unitPrice = unitPrice * sizeFactor;
    name += ' · ' + size.selectedOptions[0].textContent;
    const sauce = document.getElementById('pizza-sauce').value;
    name += ' · molho ' + sauce;
    const crust = document.getElementById('pizza-crust');
    const crustPrice = Number(crust.value);
    if (crustPrice) {
      unitPrice += crustPrice;
      name += ' · borda ' + crust.selectedOptions[0].textContent.split(' · ')[0]
    }
    const extras = [...document.querySelectorAll('.pizza-extra:checked')];
    if (extras.length) {
      unitPrice += extras.reduce((sum, x) => sum + Number(x.value), 0);
      name += ' · extras: ' + extras.map(x => x.dataset.name).join(', ')
    }
    const remove = document.getElementById('remove-ingredients').value.trim();
    const add = document.getElementById('add-ingredients').value.trim();
    if (remove) name += ' · sem ' + remove;
    if (add) name += ' · adicionar ' + add
  } else {
    const description = product.ingredients ? ` · ${product.ingredients}` : '';
    name += description
  }
  stagedItems.push({
    name,
    quantity,
    unitPrice
  });
  renderStaged();
  document.getElementById('order-quantity').value = '1';
  document.querySelectorAll('.pizza-extra').forEach(x => x.checked = false);
  document.getElementById('remove-ingredients').value = '';
  document.getElementById('add-ingredients').value = '';
  toast('Item adicionado ao pedido.')
});
document.getElementById('staged-lines').addEventListener('click', e => {
  const btn = e.target.closest('[data-remove-staged]');
  if (btn) {
    stagedItems.splice(Number(btn.dataset.removeStaged), 1);
    renderStaged()
  }
});
document.getElementById('save-new-order').addEventListener('click', () => {
  if (!stagedItems.length) return;
  const id = Math.max(1042, ...orders.map(o => Number(o.id) || 0)) + 1;
  const total = stagedItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const type = document.getElementById('order-type').value;
  const customer = document.getElementById('order-customer').value.trim() || 'Cliente balcão';
  const address = document.getElementById('order-address').value.trim() || (type === 'Retirada' ? 'Retirada no balcão' : 'Endereço a confirmar');
  const note = document.getElementById('order-note').value.trim();
  const items = stagedItems.map(item => [item.name + (note ? ' · Obs.: ' + note : ''), item.quantity, item.unitPrice]);
  orders.unshift({
    id,
    name: customer,
    channel: 'PDV · demonstração',
    type,
    time: new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    status: 'novo',
    items,
    total,
    address,
    payment: document.getElementById('order-payment').value
  });
  closeOrder();
  render();
  go('orders');
  activeFilter = 'novo';
  document.querySelectorAll('[data-filter]').forEach(b => b.classList.toggle('active', b.dataset.filter === 'novo'));
  updateOrders();
  toast(`Pedido #${id} criado na demonstração.`)
});
document.querySelectorAll('[data-page]').forEach(b => b.addEventListener('click', () => go(b.dataset.page)));
document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));
document.addEventListener('click', e => {
  const photoButton = e.target.closest('[data-image]');
  if (photoButton) {
    imageTargetIndex = Number(photoButton.dataset.image);
    const picker = document.getElementById('product-image-picker');
    picker.value = '';
    picker.click();
    return
  }
  const clearPhoto = e.target.closest('[data-image-clear]');
  if (clearPhoto) {
    const item = menu[Number(clearPhoto.dataset.imageClear)];
    if (item) {
      delete item.image;
      render();
      toast('Foto removida; o site voltará à imagem padrão.')
    }
    return
  }
  const advance = e.target.closest('[data-advance]');
  if (advance) {
    const order = orders.find(o => String(o.id) === advance.dataset.advance);
    if (order) {
      order.status = {
        novo: 'preparando',
        preparando: 'pronto',
        pronto: 'finalizado'
      } [order.status];
      render();
      toast(`Pedido #${order.id}: ${labels[order.status]}.`)
    }
    return
  }
  const cancel = e.target.closest('[data-cancel]');
  if (cancel) {
    const order = orders.find(o => String(o.id) === cancel.dataset.cancel);
    if (order) {
      order.status = 'cancelado';
      render();
      toast(`Pedido #${order.id} cancelado na demonstração.`)
    }
    return
  }
  const filter = e.target.closest('[data-filter]');
  if (filter) {
    activeFilter = filter.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b => b.classList.toggle('active', b === filter));
    updateOrders();
    return
  }
  const avail = e.target.closest('[data-availability]');
  if (avail) {
    const item = menu[Number(avail.dataset.availability)];
    item.available = !item.available;
    render();
    toast(`${item.name}: ${item.available?'disponível':'pausado'}.`);
    return
  }
  const del = e.target.closest('[data-delete]');
  if (del) {
    const index = Number(del.dataset.delete);
    const name = menu[index]?.name;
    if (name && confirm(`Remover ${name} do cardápio demonstrativo?`)) {
      menu.splice(index, 1);
      render();
      toast('Produto removido da demonstração.')
    }
    return
  }
  const edit = e.target.closest('[data-price]');
  if (edit) {
    const item = menu[Number(edit.dataset.price)];
    if (!item) return;
    const nameValue = prompt('Nome do produto:', item.name);
    if (nameValue === null) return;
    const categoryValue = prompt('Categoria: Tradicional, Especial, Doce ou Bebida', item.category);
    if (categoryValue === null) return;
    const priceValue = prompt('Preço ilustrativo (use vírgula ou ponto):', String(item.price).replace('.', ','));
    if (priceValue === null) return;
    const ingredientsValue = prompt('Ingredientes/descrição (apague o texto para remover):', item.ingredients || '');
    if (ingredientsValue === null) return;
    const name = nameValue.trim();
    const categoryText = categoryValue.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const category = categoryText.includes('bebida') ? 'Bebida' : categoryText.includes('doce') ? 'Doce' : categoryText.includes('especial') ? 'Especial' : 'Tradicional';
    const price = Number(priceValue.replace(',', '.'));
    if (!name || price <= 0) {
      toast('Informe um nome e um preço maior que zero.');
      return
    }
    item.name = name;
    item.category = category;
    item.price = price;
    item.ingredients = ingredientsValue.trim();
    render();
    toast('Produto atualizado; o site será sincronizado.');
    return
  }
});
document.getElementById('order-search').addEventListener('input', e => {
  searchTerm = e.target.value;
  updateOrders()
});

function addSample() {
  const id = Math.max(1042, ...orders.map(o => Number(o.id) || 0)) + 1;
  orders.unshift({
    id,
    name: 'Pedido de teste',
    channel: 'Site · simulado',
    type: 'Entrega',
    time: new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    status: 'novo',
    items: [
      ['Pizza calabresa', 1, 37],
      ['Refrigerante lata 350 ml', 1, 6]
    ],
    total: 43,
    address: 'Endereço fictício de demonstração',
    payment: 'A definir · demonstração'
  });
  render();
  toast(`Pedido de exemplo #${id} adicionado.`)
}
document.getElementById('add-sample').addEventListener('click', addSample);
document.getElementById('add-sample-2').addEventListener('click', addSample);
document.getElementById('product-image-picker').addEventListener('change', async e => {
  const file = e.target.files[0];
  const index = imageTargetIndex;
  imageTargetIndex = null;
  if (!file || !Number.isInteger(index) || !menu[index]) return;
  try {
    menu[index].image = await compressImageFile(file);
    render();
    toast('Foto atualizada e sincronizada com o site.')
  } catch (error) {
    toast('Não consegui carregar essa foto. Tente outra imagem.')
  }
  e.target.value = ''
});
document.getElementById('product-form').addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('product-name').value.trim();
  const category = document.getElementById('product-category').value;
  const price = Number(document.getElementById('product-price').value);
  const ingredients = document.getElementById('product-ingredients').value.trim();
  const imageFile = document.getElementById('product-image').files[0];
  if (!name || price <= 0) return;
  let image = '';
  try {
    if (imageFile) image = await compressImageFile(imageFile)
  } catch (error) {
    toast('Não consegui carregar essa foto. Tente outra imagem.');
    return
  }
  menu.push({
    name,
    category,
    price,
    ingredients,
    available: true,
    ...(image ? {
      image
    } : {})
  });
  e.target.reset();
  render();
  toast('Produto adicionado; foto e cardápio sincronizados.')
});
window.addEventListener('storage', event => {
  if (event.key !== storageKey) return;
  try {
    const updated = JSON.parse(event.newValue || '{}');
    if (Array.isArray(updated.orders)) orders = updated.orders;
    if (Array.isArray(updated.menu)) menu = updated.menu;
    render();
    toast('Pedido recebido do site nesta demonstração.');
  } catch (error) {
    console.error('Não foi possível atualizar os pedidos do site.', error);
  }
});
render();
