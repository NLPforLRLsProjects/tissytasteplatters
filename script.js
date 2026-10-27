'use strict';

const BUSINESS_WHATSAPP = '27789161088';
const MAX_QUANTITY = 99;

const offerings = [
  {
    id: 'savoury',
    category: 'Platters',
    name: 'Savoury platters',
    description: 'Ask about a customised selection of savoury bites for your guests.'
  },
  {
    id: 'sweet',
    category: 'Platters',
    name: 'Sweet platters',
    description: 'Enquire about dessert and sweet-treat options for your celebration.'
  },
  {
    id: 'mixed',
    category: 'Platters',
    name: 'Mixed occasion platters',
    description: 'Request a platter assortment suited to your event and preferences.'
  },
  {
    id: 'corporate',
    category: 'Catering',
    name: 'Corporate event catering',
    description: 'Catering enquiries for meetings, workshops and business functions.'
  },
  {
    id: 'celebration',
    category: 'Catering',
    name: 'Party & celebration catering',
    description: 'Food arrangements for birthdays, gatherings and special occasions.'
  },
  {
    id: 'planning',
    category: 'Events',
    name: 'Event planning assistance',
    description: 'Request support with event planning and coordination.'
  }
];

const categories = ['All', 'Platters', 'Catering', 'Events'];
const basket = new Map();
let activeCategory = 'All';

const getElement = id => document.getElementById(id);

function drawFilters() {
  const root = getElement('filters');
  root.replaceChildren();

  for (const category of categories) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `filter${activeCategory === category ? ' active' : ''}`;
    button.textContent = category;
    button.setAttribute('aria-pressed', String(activeCategory === category));
    button.addEventListener('click', () => {
      activeCategory = category;
      drawFilters();
      drawCatalogue();
    });
    root.append(button);
  }
}

function drawCatalogue() {
  const root = getElement('catalogueGrid');
  root.replaceChildren();

  const visibleOfferings = offerings.filter(
    item => activeCategory === 'All' || item.category === activeCategory
  );

  for (const item of visibleOfferings) {
    const card = document.createElement('article');
    card.className = 'menu-card';

    const category = document.createElement('span');
    category.className = 'tag';
    category.textContent = item.category;

    const title = document.createElement('h3');
    title.textContent = item.name;

    const description = document.createElement('p');
    description.textContent = item.description;

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Add to enquiry ↗';
    button.setAttribute('aria-label', `Add ${item.name} to your enquiry`);
    button.addEventListener('click', () => addToBasket(item.id));

    card.append(category, title, description, button);
    root.append(card);
  }
}

function addToBasket(id) {
  const item = offerings.find(offer => offer.id === id);
  if (!item) {
    return;
  }

  const currentQuantity = basket.get(id) || 0;
  if (currentQuantity >= MAX_QUANTITY) {
    getElement('formStatus').textContent = `You can add up to ${MAX_QUANTITY} of each service.`;
    return;
  }

  basket.set(id, currentQuantity + 1);
  getElement('formStatus').textContent = '';
  drawBasket();
  getElement('order').scrollIntoView({ behavior: 'smooth' });
}

function changeQuantity(id, amount) {
  const item = offerings.find(offer => offer.id === id);
  if (!item) {
    return;
  }

  const nextQuantity = (basket.get(id) || 0) + amount;
  if (nextQuantity <= 0) {
    basket.delete(id);
  } else if (nextQuantity <= MAX_QUANTITY) {
    basket.set(id, nextQuantity);
  }

  drawBasket();
}

function drawBasket() {
  const root = getElement('basket');
  root.replaceChildren();

  let totalCount = 0;

  for (const [id, quantity] of basket) {
    const item = offerings.find(offer => offer.id === id);
    if (!item) {
      continue;
    }

    totalCount += quantity;

    const row = document.createElement('div');
    row.className = 'basket-item';

    const info = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = item.name;
    const detail = document.createElement('small');
    detail.textContent = 'Quotation required';
    info.append(title, detail);

    const controls = document.createElement('div');
    controls.className = 'qty';

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = '−';
    removeButton.setAttribute('aria-label', `Remove one ${item.name}`);
    removeButton.addEventListener('click', () => changeQuantity(id, -1));

    const quantityLabel = document.createElement('span');
    quantityLabel.textContent = String(quantity);
    quantityLabel.setAttribute('aria-label', `${quantity} selected`);

    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.textContent = '+';
    addButton.setAttribute('aria-label', `Add one ${item.name}`);
    addButton.disabled = quantity >= MAX_QUANTITY;
    addButton.addEventListener('click', () => changeQuantity(id, 1));

    controls.append(removeButton, quantityLabel, addButton);
    row.append(info, controls);
    root.append(row);
  }

  if (totalCount === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'empty';
    emptyMessage.textContent = 'Nothing selected yet. Explore the catalogue to get started.';
    root.append(emptyMessage);
  }

  getElement('basketCount').textContent = String(totalCount);
  getElement('basketCount').setAttribute('aria-label', `${totalCount} items in enquiry`);
}

function setUpNavigation() {
  const toggle = getElement('navToggle');
  const links = getElement('navLinks');

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function setUpOrderForm() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  getElement('date').min = `${year}-${month}-${day}`;
  getElement('year').textContent = String(year);

  const form = getElement('orderForm');
  const status = getElement('formStatus');

  form.addEventListener('invalid', () => {
    status.textContent = 'Please complete all required fields and tick the consent box.';
  }, true);

  form.addEventListener('submit', event => {
    event.preventDefault();

    if (basket.size === 0) {
      status.textContent =
        'Please add at least one catalogue option to your enquiry.';
      getElement('catalogue').scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const value = id => getElement(id).value.trim();
    const requestedServices = Array.from(basket, ([id, quantity]) => {
      const item = offerings.find(offer => offer.id === id);
      return `${quantity} x ${item.name}`;
    });
    const message = [
      "Hello Tissy's Tasty Platters, I'd like to request a quotation.",
      '',
      `Name: ${value('fullName')}`,
      `Phone: ${value('phone')}`,
      `Event date: ${value('date')}`,
      `Guests: ${value('guests')}`,
      `Event type: ${value('eventType')}`,
      `Location: ${value('location') || 'To be confirmed'}`,
      '',
      'Requested services:',
      ...requestedServices,
      '',
      `Special requests: ${value('notes') || 'None'}`,
      '',
      'Please confirm menu options, pricing and availability.'
    ].join('\n');

    const whatsappUrl =
      `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(message)}`;
    const whatsappWindow = window.open(whatsappUrl, '_blank');

    if (whatsappWindow) {
      whatsappWindow.opener = null;
      status.textContent = 'WhatsApp opened. Review your message and press Send.';
      return;
    }

    status.replaceChildren(
      document.createTextNode('Your browser blocked the WhatsApp window. '),
      Object.assign(document.createElement('a'), {
        href: whatsappUrl,
        target: '_blank',
        rel: 'noopener noreferrer',
        textContent: 'Open WhatsApp'
      }),
      document.createTextNode(' and press Send to submit your enquiry.')
    );
  });
}

getElement('clearBasket').addEventListener('click', () => {
  basket.clear();
  drawBasket();
});

setUpNavigation();
setUpOrderForm();
drawFilters();
drawCatalogue();
drawBasket();
