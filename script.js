const PDV_STORAGE_KEY = "domjuan_pdv_demo_v1";
let lastSharedState = '';
let businessOpen = false;
const flavorImages = ['pizza-01.jpg', 'pizza-02.jpg', 'pizza-03.jpg', 'pizza-04.jpg', 'pizza-05.jpg', 'pizza-06.jpg', 'pizza-07.jpg', 'pizza-08.jpg', 'pizza-09.jpg', 'pizza-10.jpg', 'pizza-11.jpg', 'pizza-12.jpg', 'pizza-13.jpg', 'pizza-14.jpg', 'pizza-15.jpg'];
const flavors = [{
  name: 'Muçarela',
  group: 'traditional',
  price: 35,
  ingredients: 'Molho de tomate, muçarela, orégano e azeitonas.'
}, {
  name: 'Calabresa',
  group: 'traditional',
  price: 37,
  ingredients: 'Molho de tomate, muçarela, calabresa fatiada e cebola.'
}, {
  name: 'Marguerita',
  group: 'traditional',
  price: 39,
  ingredients: 'Molho de tomate, muçarela, tomate fresco e manjericão.'
}, {
  name: 'Milho com Muçarela',
  group: 'traditional',
  price: 38,
  ingredients: 'Molho de tomate, muçarela, milho e orégano.'
}, {
  name: 'Presunto',
  group: 'traditional',
  price: 40,
  ingredients: 'Molho de tomate, muçarela, presunto e azeitonas.'
}, {
  name: 'Quatro Queijos',
  group: 'special',
  price: 48,
  ingredients: 'Molho de tomate, muçarela, provolone, parmesão e requeijão cremoso.'
}, {
  name: 'Frango Cremoso',
  group: 'special',
  price: 49,
  ingredients: 'Molho de tomate, frango desfiado temperado, requeijão, milho e muçarela.'
}, {
  name: 'Pepperoni',
  group: 'special',
  price: 52,
  ingredients: 'Molho de tomate, muçarela, pepperoni e orégano.'
}, {
  name: 'Portuguesa Especial',
  group: 'special',
  price: 51,
  ingredients: 'Molho de tomate, presunto, ovo, cebola, ervilha, muçarela e azeitonas.'
}, {
  name: 'Da Casa',
  group: 'special',
  price: 54,
  ingredients: 'Molho de tomate, calabresa, bacon, cebola roxa, muçarela e toque de barbecue.'
}, {
  name: 'Chocolate',
  group: 'sweet',
  price: 42,
  ingredients: 'Massa com calda de chocolate ao leite e granulado.'
}, {
  name: 'Chocolate com Morango',
  group: 'sweet',
  price: 44,
  ingredients: 'Calda de chocolate, morangos frescos e raspas de chocolate.'
}, {
  name: 'Banana com Canela',
  group: 'sweet',
  price: 46,
  ingredients: 'Banana, calda de doce de leite, açúcar e canela.'
}, {
  name: 'Romeu e Julieta',
  group: 'sweet',
  price: 45,
  ingredients: 'Calda de goiabada e queijo muçarela.'
}, {
  name: 'Doce de Leite',
  group: 'sweet',
  price: 48,
  ingredients: 'Calda de doce de leite cremoso e coco ralado.'
}];
flavors.forEach((f, i) => {
  f.image = flavorImages[i] || '';
  f.available = true;
});
const toppingSets = {
  savory: [{
    name: 'Bacon',
    price: 5
  }, {
    name: 'Catupiry',
    price: 5
  }, {
    name: 'Cebola roxa',
    price: 2
  }, {
    name: 'Azeitonas',
    price: 2
  }, {
    name: 'Milho',
    price: 2
  }, {
    name: 'Muçarela extra',
    price: 4
  }],
  sweet: [{
    name: 'Morango',
    price: 4
  }, {
    name: 'Granulado',
    price: 2
  }, {
    name: 'Leite condensado',
    price: 3
  }, {
    name: 'Coco ralado',
    price: 2
  }, {
    name: 'Banana',
    price: 3
  }, {
    name: 'Chocolate extra',
    price: 4
  }]
};
const drinks = [{
  name: 'Refrigerante lata 350 ml',
  price: 6,
  emoji: '🥤',
  available: true
}, {
  name: 'Refrigerante 1 litro',
  price: 10,
  emoji: '🧃',
  available: true
}, {
  name: 'Água 500 ml',
  price: 4,
  emoji: '💧',
  available: true
}, {
  name: 'Suco 300 ml',
  price: 7,
  emoji: '🧋',
  available: true
}];
const money = n => 'R$ ' + n.toFixed(2).replace('.', ',');
const listIds = {
  traditional: 'traditional-list',
  special: 'special-list',
  sweet: 'sweet-list'
};
const gallery = document.getElementById('flavor-choice-grid');
let selectedFlavorIndices = [];
let cart = [];

function normalizeName(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()
}

function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  } [char]))
}

function categoryGroup(value) {
  const category = normalizeName(value);
  if (category.includes('doce')) return 'sweet';
  if (category.includes('especial')) return 'special';
  return 'traditional'
}

function syncSiteCatalog() {
  let state = {};
  try {
    state = JSON.parse(localStorage.getItem(PDV_STORAGE_KEY) || '{}')
  } catch (error) {
    state = {}
  }
  if (!Array.isArray(state.menu)) return;
  const drinkEmojiByName = new Map(drinks.map(drink => [normalizeName(drink.name), drink.emoji]));
  const menuItems = state.menu.filter(item => item && String(item.name || '').trim());
  const pdvFlavors = menuItems.filter(item => normalizeName(item.category) !== 'bebida').map((item, index) => ({
    name: String(item.name).trim(),
    group: categoryGroup(item.category),
    price: Number(item.price) || 0,
    ingredients: item.ingredients === undefined || item.ingredients === null ? '' : String(item.ingredients),
    available: item.available !== false,
    image: item.image && (String(item.image).startsWith('data:image/') || /^pizza-\d{2}\.jpg$/i.test(String(item.image))) ? String(item.image) : (flavorImages[index % flavorImages.length] || '')
  }));
  const pdvDrinks = menuItems.filter(item => normalizeName(item.category) === 'bebida').map(item => ({
    name: String(item.name).trim(),
    price: Number(item.price) || 0,
    emoji: drinkEmojiByName.get(normalizeName(item.name)) || '🥤',
    available: item.available !== false
  }));
  flavors.splice(0, flavors.length, ...pdvFlavors);
  drinks.splice(0, drinks.length, ...pdvDrinks);
}

function renderMenuAndChoices() {
  Object.values(listIds).forEach(id => {
    document.getElementById(id).innerHTML = ''
  });
  for (const flavor of flavors) {
    const status = flavor.available ? 'Disponível' : 'Indisponível';
    const name = escapeHtml(flavor.name);
    const ingredients = flavor.ingredients ? `<p>${escapeHtml(flavor.ingredients)}</p>` : '';
    const photo = flavor.image ? `<img class="flavor-photo" src="${escapeHtml(flavor.image)}" alt="Pizza ${name}">` : '<div class="flavor-photo-placeholder" role="img" aria-label="Foto da pizza não cadastrada"><span>🍕</span><small>Foto não cadastrada</small></div>';
    document.getElementById(listIds[flavor.group]).insertAdjacentHTML('beforeend', `<article class="flavor ${flavor.available?'':'unavailable'}">${photo}<div class="flavor-copy"><div class="flavor-head"><h4>${name}</h4><span class="price">${money(flavor.price)}</span></div>${ingredients}<span class="pill-tag">${status}</span></div></article>`)
  }
  gallery.innerHTML = flavors.map((flavor, index) => {
    if (!flavor.available) return '';
    const photo = flavor.image ? `<img src="${escapeHtml(flavor.image)}" alt="Pizza ${escapeHtml(flavor.name)}">` : '<span class="flavor-choice-photo-placeholder" role="img" aria-label="Foto não cadastrada">🍕</span>';
    return `<button type="button" class="flavor-choice" data-flavor="${index}">${photo}<strong>${escapeHtml(flavor.name)}</strong><small>${money(flavor.price)}</small></button>`;
  }).join('');
}

function renderDrinks() {
  document.getElementById('drink-list').innerHTML = drinks.map((drink, index) => `<article class="drink"><div class="emoji">${drink.emoji}</div><h3>${escapeHtml(drink.name)}</h3><p>${money(drink.price)}</p>${drink.available===false?'<button class="btn" disabled>Indisponível</button>':`<button class="btn" data-drink="${index}">Adicionar</button>`}</article>`).join('');
}
syncSiteCatalog();
renderMenuAndChoices();
renderDrinks();
try {
  lastSharedState = localStorage.getItem(PDV_STORAGE_KEY) || '{}'
} catch (error) {
  lastSharedState = '{}'
}
const stepIds = ['wizard-size', 'wizard-flavors', 'wizard-border', 'wizard-complements'];

function showStep(i) {
  stepIds.forEach((id, n) => document.getElementById(id).hidden = n !== i);
  document.getElementById('step-count').textContent = `Etapa ${i+1} de 4`
}

function fillSauces(group) {
  const sel = document.getElementById('sauce');
  const opts = group === 'sweet' ? [
    ['choc', 'Calda de chocolate (incluída)'],
    ['dulce', 'Calda de doce de leite (incluída)'],
    ['white', 'Calda de chocolate branco (incluída)']
  ] : [
    ['tomato', 'Molho de tomate (incluído)'],
    ['white', 'Molho branco (incluído)'],
    ['bbq', 'Molho barbecue (incluído)']
  ];
  sel.innerHTML = opts.map(o => `<option value="${o[0]}">${o[1]}</option>`).join('');
  sel.disabled = false
}

function fillBorders(group) {
  const sel = document.getElementById('border');
  const opts = group === 'sweet' ? [
    ['0', 'Sem borda recheada'],
    ['8', 'Chocolate · + R$ 8,00'],
    ['8', 'Doce de leite · + R$ 8,00']
  ] : [
    ['0', 'Sem borda recheada'],
    ['7', 'Requeijão · + R$ 7,00'],
    ['7', 'Cheddar · + R$ 7,00']
  ];
  sel.innerHTML = opts.map(o => `<option value="${o[0]}">${o[1]}</option>`).join('')
}

function fillToppings(group) {
  const arr = toppingSets[group];
  document.getElementById('toppings').innerHTML = arr.map((t, i) => `<label class="check"><input type="checkbox" value="${i}"> ${t.name} <span class="small">+${money(t.price)}</span></label>`).join('')
}

function updateFlavorChoices() {
  gallery.querySelectorAll('[data-flavor]').forEach(b => b.classList.toggle('selected', selectedFlavorIndices.includes(Number(b.dataset.flavor))));
  document.getElementById('choice-count').textContent = `${selectedFlavorIndices.length} de 2 sabores selecionados`;
  const ready = selectedFlavorIndices.length === 2;
  document.getElementById('next-border').disabled = !ready;
  document.getElementById('flavor-message').textContent = ready ? 'Agora escolha a borda recheada ou deixe sem.' : 'Escolha dois sabores da mesma categoria: salgados ou doces.';
  if (ready) {
    const group = flavors[selectedFlavorIndices[0]].group === 'sweet' ? 'sweet' : 'savory';
    fillSauces(group);
    fillBorders(group);
    fillToppings(group)
  }
}
gallery.addEventListener('click', e => {
  const button = e.target.closest('[data-flavor]');
  if (!button) return;
  const idx = Number(button.dataset.flavor);
  if (selectedFlavorIndices.includes(idx)) {
    selectedFlavorIndices = selectedFlavorIndices.filter(x => x !== idx)
  } else if (selectedFlavorIndices.length >= 2) {
    document.getElementById('flavor-message').textContent = 'Você já escolheu dois sabores. Toque em um selecionado para trocar.';
    return
  } else if (selectedFlavorIndices.length && ((flavors[selectedFlavorIndices[0]].group === 'sweet') !== (flavors[idx].group === 'sweet'))) {
    document.getElementById('flavor-message').textContent = 'Combine sabores doces com doces, ou salgados com salgados.';
    return
  } else {
    selectedFlavorIndices.push(idx)
  }
  updateFlavorChoices()
});
document.querySelectorAll('input[name="size"]').forEach(r => r.addEventListener('change', () => document.getElementById('next-size').disabled = false));
document.getElementById('next-size').addEventListener('click', () => {
  if (!document.querySelector('input[name="size"]:checked')) return;
  selectedFlavorIndices = [];
  updateFlavorChoices();
  showStep(1)
});
document.getElementById('next-border').addEventListener('click', () => showStep(2));
document.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', () => showStep(stepIds.indexOf(b.dataset.next))));
document.querySelectorAll('[data-back]').forEach(b => b.addEventListener('click', () => showStep(stepIds.indexOf(b.dataset.back))));
const cartEl = document.getElementById('cart');

function renderCart() {
  if (!cart.length) {
    cartEl.innerHTML = '<p class="cart-empty">Seu pedido de demonstração está vazio.</p>'
  } else {
    cartEl.innerHTML = cart.map((x, i) => `<div class="cart-row"><div><strong>${escapeHtml(x.title)}</strong><small>${escapeHtml(x.description)}</small></div><div style="text-align:right"><strong>${money(x.price)}</strong><button class="remove" data-remove="${i}">Remover</button></div></div>`).join('')
  }
  document.getElementById('total').textContent = money(cart.reduce((sum, x) => sum + x.price, 0));
  const sendButton = document.getElementById('send-to-pdv');
  if (sendButton) sendButton.disabled = cart.length === 0 || !businessOpen;
  cartEl.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => {
    cart.splice(Number(b.dataset.remove), 1);
    renderCart()
  }))
}
document.getElementById('add-pizza').addEventListener('click', () => {
  if (!isCurrentlyOpen()) {
    refreshBusinessStatus();
    return
  }
  if (selectedFlavorIndices.length !== 2) return;
  const [a, b] = selectedFlavorIndices.map(i => flavors[i]);
  const slices = Number(document.querySelector('input[name="size"]:checked').value);
  const border = document.getElementById('border');
  const borderPrice = Number(border.value);
  const sauce = document.getElementById('sauce').selectedOptions[0].textContent;
  const group = a.group === 'sweet' ? 'sweet' : 'savory';
  const extraItems = [...document.querySelectorAll('#toppings input:checked')].map(c => toppingSets[group][Number(c.value)]);
  const extra = extraItems.reduce((sum, t) => sum + t.price, 0);
  const price = Math.max(a.price, b.price) * (slices === 4 ? 0.7 : 1) + borderPrice + extra;
  const additions = [border.selectedOptions[0].text, ...extraItems.map(x => x.name)].filter(x => !x.startsWith('Sem borda'));
  cart.push({
    title: `Pizza ${slices} pedaços · ${money(price)}`,
    description: `${a.name} + ${b.name} · ${sauce}${additions.length?' · '+additions.join(', '):''}`,
    price
  });
  renderCart();
  selectedFlavorIndices = [];
  document.querySelectorAll('input[name="size"]').forEach(r => r.checked = false);
  document.getElementById('next-size').disabled = true;
  showStep(0)
});
document.getElementById('drink-list').addEventListener('click', event => {
  const button = event.target.closest('[data-drink]');
  if (!button) return;
  const drink = drinks[Number(button.dataset.drink)];
  if (!isCurrentlyOpen()) {
    refreshBusinessStatus();
    return
  }
  if (!drink || drink.available === false) return;
  cart.push({
    title: drink.name,
    description: 'Bebida · valor ilustrativo',
    price: drink.price
  });
  renderCart();
});

function businessScheduleNow() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(new Date()).map(part => [part.type, part.value]));
  const minutes = Number(parts.hour) * 60 + Number(parts.minute);
  const isOpen = minutes >= 8 * 60 && minutes < 23 * 60;
  const nextOpening = minutes < 8 * 60 ? 'hoje às 8h' : 'amanhã às 8h';
  return { isOpen, minutes, nextOpening, closesAt: '23h' };
}
function isCurrentlyOpen() {
  return businessScheduleNow().isOpen
}

function refreshBusinessStatus() {
  const schedule = businessScheduleNow();
  businessOpen = schedule.isOpen;
  document.body.dataset.open = businessOpen ? 'true' : 'false';
  const banner = document.getElementById('business-status');
  const message = businessOpen ? `ABERTO AGORA · pedidos disponíveis até às ${schedule.closesAt}.` : `FECHADO · voltamos ${schedule.nextOpening}.`;
  if (banner) {
    banner.textContent = message;
    banner.classList.toggle('closed', !businessOpen)
  }
  ['closed-menu-message', 'closed-builder-message', 'closed-drinks-message'].forEach(id => {
    const box = document.getElementById(id);
    if (box) box.textContent = `Estamos fechados no momento. O cardápio e os pedidos voltam ${schedule.nextOpening}.`
  });
  renderCart();
}

function escapeHistoryText(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  } [char]))
}

function renderOrderHistory() {
  const list = document.getElementById('order-history-list');
  if (!list) return;
  let state = {};
  try {
    state = JSON.parse(localStorage.getItem(PDV_STORAGE_KEY) || '{}')
  } catch (error) {
    state = {}
  }
  const orders = Array.isArray(state.orders) ? state.orders : [];
  if (!orders.length) {
    list.innerHTML = '<article class="history-card"><p>Ainda não há pedidos nesta demonstração neste navegador. Depois de criar um pedido, ele aparecerá aqui.</p><a class="btn" href="#montar">Montar um pedido</a></article>';
    return
  }
  const statusLabels = {
    novo: 'Recebido',
    new: 'Recebido',
    recebido: 'Recebido',
    preparando: 'Em preparo',
    preparing: 'Em preparo',
    'em-preparo': 'Em preparo',
    pronto: 'Pronto',
    ready: 'Pronto',
    entregue: 'Entregue',
    delivered: 'Entregue',
    cancelado: 'Cancelado',
    cancelled: 'Cancelado',
    finalizado: 'Concluído',
    completed: 'Concluído'
  };
  list.innerHTML = orders.map(order => {
    const statusKey = String(order.status || 'novo').toLowerCase();
    const status = escapeHistoryText(statusLabels[statusKey] || statusKey.replace(/[-_]/g, ' '));
    const date = order.createdAt ? new Date(order.createdAt) : null;
    const dateLabel = date && !Number.isNaN(date.getTime()) ? date.toLocaleString('pt-BR') : (order.time ? `Hoje às ${escapeHistoryText(order.time)}` : 'Horário não informado');
    const itemText = Array.isArray(order.items) ? order.items.map(item => Array.isArray(item) ? `${Number(item[1])||1} × ${escapeHistoryText(item[0])}` : escapeHistoryText(item)).join(' · ') : 'Itens do pedido';
    return `<article class="history-card"><div class="history-card-head"><h3>Pedido #${escapeHistoryText((order.id==null?'—':order.id))}</h3><span class="history-status">${status}</span></div><div class="history-meta">${escapeHistoryText(dateLabel)}</div><div class="history-items">${itemText}</div><div class="history-total">Total: ${money(Number(order.total)||0)}</div></article>`
  }).join('');
}

function sendCartToPdv() {
  if (!isCurrentlyOpen()) {
    refreshBusinessStatus();
    const status = document.getElementById('checkout-status');
    if (status) status.textContent = 'Estamos fechados no momento. O cardápio e os pedidos voltam no horário de funcionamento.';
    return
  }
  if (!cart.length) {
    document.getElementById('checkout-status').textContent = 'Adicione itens ao pedido antes de enviar.';
    return
  }
  let state = {};
  try {
    state = JSON.parse(localStorage.getItem(PDV_STORAGE_KEY) || '{}')
  } catch (error) {
    state = {}
  }
  const orders = Array.isArray(state.orders) ? state.orders : [];
  const id = Math.max(1042, ...orders.map(order => Number(order.id) || 0)) + 1;
  const type = document.getElementById('delivery-type').value;
  const customer = document.getElementById('customer-name').value.trim() || 'Cliente de teste';
  const address = document.getElementById('customer-address').value.trim() || (type === 'Retirada' ? 'Retirada no balcão' : 'Endereço de teste a confirmar');
  const items = cart.map(item => [`${item.title} · ${item.description}`, 1, Number(item.price) || 0]);
  const total = items.reduce((sum, item) => sum + item[1] * item[2], 0);
  const order = {
    id,
    name: customer,
    channel: 'Site · teste local',
    type,
    time: new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    createdAt: new Date().toISOString(),
    status: 'novo',
    items,
    total,
    address,
    payment: 'A definir · teste'
  };
  orders.unshift(order);
  state.orders = orders;
  localStorage.setItem(PDV_STORAGE_KEY, JSON.stringify(state));
  try {
    lastSharedState = localStorage.getItem(PDV_STORAGE_KEY) || '{}'
  } catch (error) {}
  cart = [];
  renderCart();
  document.getElementById('checkout-status').innerHTML = 'Pedido enviado! O prazo estimado para ficar pronto é de 60 a 80 minutos. <a href="#historico">Acompanhe no histórico.</a>';
  renderOrderHistory();
}
document.getElementById('send-to-pdv').addEventListener('click', sendCartToPdv);

function refreshFromSharedState() {
  let snapshot = '{}';
  try {
    snapshot = localStorage.getItem(PDV_STORAGE_KEY) || '{}'
  } catch (error) {
    return
  }
  if (snapshot === lastSharedState) return;
  lastSharedState = snapshot;
  const selectedNames = selectedFlavorIndices.map(index => flavors[index] && flavors[index].name).filter(Boolean);
  syncSiteCatalog();
  renderMenuAndChoices();
  renderDrinks();
  selectedFlavorIndices = selectedNames.map(name => flavors.findIndex(flavor => normalizeName(flavor.name) === normalizeName(name) && flavor.available !== false)).filter(index => index >= 0);
  if (selectedFlavorIndices.length === 2 && ((flavors[selectedFlavorIndices[0]].group === 'sweet') !== (flavors[selectedFlavorIndices[1]].group === 'sweet'))) selectedFlavorIndices = [];
  updateFlavorChoices();
  renderOrderHistory();
  const message = document.getElementById('checkout-status');
  if (message) message.textContent = 'Cardápio e pedidos atualizados.';
}
window.addEventListener('storage', event => {
  if (event.key === PDV_STORAGE_KEY) refreshFromSharedState();
});
window.addEventListener('focus', refreshFromSharedState);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) refreshFromSharedState()
});
setInterval(refreshFromSharedState, 1200);
refreshBusinessStatus();
setInterval(refreshBusinessStatus, 30000);
renderCart();
renderOrderHistory();
const routeMap = {
  inicio: 'home',
  cardapio: 'cardapio',
  montar: 'montar',
  bebidas: 'bebidas',
  historico: 'historico',
  'quem-somos': 'quem-somos',
  horarios: 'horarios',
  contato: 'contato'
};

function setViewFromHash() {
  const key = decodeURIComponent(location.hash.slice(1));
  document.body.dataset.view = routeMap[key] || 'home';
  window.scrollTo(0, 0)
}
window.addEventListener('hashchange', setViewFromHash);
setViewFromHash();
