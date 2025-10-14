// script.js (use as a module)
const STORAGE_KEY = 'dynamic-quote-generator:v1';

// --- Sample initial quotes
const initialQuotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "inspiration" },
  { text: "Simplicity is the ultimate sophistication.", category: "wisdom" },
  { text: "If you want to go fast, go alone. If you want to go far, go together.", category: "teamwork" },
  { text: "Learning never exhausts the mind.", category: "wisdom" },
  { text: "Be yourself; everyone else is already taken.", category: "humor" }
];

// --- State (will be persisted)
let state = {
  quotes: [],
  categories: [],
  activeCategory: 'all'
};

// --- Utilities
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const create = (tag, opts = {}) => {
  const el = document.createElement(tag);
  if (opts.className) el.className = opts.className;
  if (opts.text) el.textContent = opts.text;
  if (opts.html) el.innerHTML = opts.html;
  if (opts.attrs) Object.entries(opts.attrs).forEach(([k,v]) => el.setAttribute(k,v));
  return el;
};
const normalizeCategory = s => (s || '').trim().toLowerCase();

// --- Persistence
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state.quotes = parsed.quotes || [];
      state.categories = parsed.categories || [];
      state.activeCategory = parsed.activeCategory || 'all';
      return;
    }
  } catch (e) {
    console.warn('Could not load saved state', e);
  }
  // fallback - initialize
  state.quotes = initialQuotes.map(q => ({ ...q, category: normalizeCategory(q.category) }));
  state.categories = Array.from(new Set(state.quotes.map(q => q.category)));
  state.categories.sort();
  state.activeCategory = 'all';
  saveState();
}
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    quotes: state.quotes,
    categories: state.categories,
    activeCategory: state.activeCategory
  }));
}

// --- DOM roots
const controlsRoot = $('#controls');
const quoteDisplay = $('#quoteDisplay');
const formArea = $('#formArea');

// --- Render category controls (buttons)
function renderCategoryButtons() {
  controlsRoot.innerHTML = ''; // clear
  const frag = document.createDocumentFragment();

  const allBtn = create('button', { className: 'category-btn', text: 'All' });
  allBtn.dataset.category = 'all';
  if (state.activeCategory === 'all') allBtn.classList.add('active');
  frag.appendChild(allBtn);

  state.categories.forEach(cat => {
    const btn = create('button', { className: 'category-btn', text: cat[0].toUpperCase() + cat.slice(1) });
    btn.dataset.category = cat;
    if (state.activeCategory === cat) btn.classList.add('active');
    frag.appendChild(btn);
  });

  const wrapper = create('div', { className: 'controls' });
  wrapper.appendChild(frag);

  controlsRoot.appendChild(wrapper);

  const actionsDiv = create('div', { className: 'actions' });
  const newQuoteBtn = create('button', { className: 'btn', text: 'Show New Quote' });
  newQuoteBtn.id = 'newQuote';
  const toggleFormBtn = create('button', { className: 'btn secondary', text: 'Add Quote' });
  toggleFormBtn.id = 'toggleForm';
  actionsDiv.appendChild(newQuoteBtn);
  actionsDiv.appendChild(toggleFormBtn);
  controlsRoot.appendChild(actionsDiv);
}

// --- Render a random quote (according to active category)
function showRandomQuote() {
  const pool = state.activeCategory === 'all'
    ? state.quotes
    : state.quotes.filter(q => q.category === state.activeCategory);

  quoteDisplay.innerHTML = '';
  if (!pool.length) {
    const empty = create('div', { className: 'quote-card', text: 'No quotes available for this category. Add one!' });
    quoteDisplay.appendChild(empty);
    return;
  }

  const idx = Math.floor(Math.random() * pool.length);
  const q = pool[idx];

  const card = create('div', { className: 'quote-card' });
  const text = create('div', { className: 'quote-text', text: `“${q.text}”` });
  const meta = create('div', { className: 'quote-meta', text: `Category: ${q.category}` });

  const actions = create('div', { className: 'actions' });
  const anotherBtn = create('button', { className: 'btn', text: 'Another' });
  anotherBtn.addEventListener('click', showRandomQuote);
  const copyBtn = create('button', { className: 'btn secondary', text: 'Copy' });
  copyBtn.addEventListener('click', () => {
    navigator.clipboard?.writeText(q.text).then(() => {
      copyBtn.textContent = 'Copied!';
      setTimeout(() => (copyBtn.textContent = 'Copy'), 1200);
    }).catch(() => {
      copyBtn.textContent = 'Unable to copy';
      setTimeout(() => (copyBtn.textContent = 'Copy'), 1200);
    });
  });

  const editBtn = create('button', { className: 'btn secondary', text: 'Edit' });
  editBtn.dataset.idx = idx;
  editBtn.addEventListener('click', () => openEditForm(q, idx));

  const deleteBtn = create('button', { className: 'btn secondary', text: 'Delete' });
  deleteBtn.dataset.idx = idx;
  deleteBtn.addEventListener('click', () => {
    if (!confirm('Delete this quote?')) return;
    const globalIdx = state.quotes.findIndex(sq => sq.text === q.text && sq.category === q.category);
    if (globalIdx > -1) {
      state.quotes.splice(globalIdx, 1);
      recomputeCategories();
      saveState();
      renderCategoryButtons();
      showRandomQuote();
    }
  });

  actions.appendChild(anotherBtn);
  actions.appendChild(copyBtn);
  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  card.appendChild(text);
  card.appendChild(meta);
  card.appendChild(actions);

  quoteDisplay.appendChild(card);
}

// --- Create the Add Quote form dynamically (and Edit)
function createAddQuoteForm() {
  formArea.innerHTML = ''; // clear (we'll re-create)
  const form = create('form');
  form.id = 'addQuoteForm';

  const row = create('div', { className: 'form-row' });
  const inputText = create('input', { attrs: { type: 'text', id: 'newQuoteText', placeholder: 'Enter a new quote' }});
  const inputCategory = create('input', { attrs: { type: 'text', id: 'newQuoteCategory', placeholder: 'Enter quote category (e.g. wisdom)' }});
  row.appendChild(inputText);
  row.appendChild(inputCategory);

  const submit = create('button', { className: 'btn', text: 'Add Quote' });
  submit.type = 'submit';

  const hint = create('small', { text: 'Tip: categories are normalized to lowercase.' });

  form.appendChild(row);
  form.appendChild(submit);
  form.appendChild(hint);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const textVal = inputText.value.trim();
    const catVal = normalizeCategory(inputCategory.value || 'uncategorized');
    if (!textVal) {
      inputText.focus();
      return alert('Please enter a quote text.');
    }
    addQuote({ text: textVal, category: catVal });
    inputText.value = '';
    inputCategory.value = '';
  });

  formArea.appendChild(form);
}

// --- Add a quote to state and update DOM
function addQuote({ text, category }) {
  const normalized = normalizeCategory(category);
  state.quotes.push({ text: text.trim(), category: normalized });
  if (!state.categories.includes(normalized)) {
    state.categories.push(normalized);
    state.categories.sort();
  }
  saveState();
  renderCategoryButtons();
  state.activeCategory = normalized;
  showRandomQuote();
  highlightActiveCategory();
}

// --- Edit existing quote: open a quick edit form in formArea
function openEditForm(q, indexInPool) {
  const idx = state.quotes.findIndex(s => s.text === q.text && s.category === q.category);
  if (idx === -1) return;
  formArea.innerHTML = '';
  const form = create('form');
  const t = create('input', { attrs: { type: 'text', id: 'editQuoteText', value: q.text }});
  const c = create('input', { attrs: { type: 'text', id: 'editQuoteCategory', value: q.category }});
  const saveBtn = create('button', { className: 'btn', text: 'Save' });
  saveBtn.type = 'submit';
  const cancel = create('button', { className: 'btn secondary', text: 'Cancel' });
  cancel.type = 'button';
  cancel.addEventListener('click', () => {
    formArea.innerHTML = '';
    createAddQuoteForm();
  });

  form.appendChild(t);
  form.appendChild(c);
  form.appendChild(saveBtn);
  form.appendChild(cancel);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newText = t.value.trim();
    const newCat = normalizeCategory(c.value || 'uncategorized');
    if (!newText) return alert('Quote text cannot be empty');
    state.quotes[idx] = { text: newText, category: newCat };
    recomputeCategories();
    saveState();
    renderCategoryButtons();
    formArea.innerHTML = '';
    createAddQuoteForm();
    showRandomQuote();
  });

  formArea.appendChild(form);
}

// --- recompute categories from current quotes
function recomputeCategories() {
  state.categories = Array.from(new Set(state.quotes.map(q => q.category)));
  state.categories.sort();
}

// --- highlight active category button (visual)
function highlightActiveCategory() {
  Array.from(controlsRoot.querySelectorAll('.category-btn')).forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === state.activeCategory);
  });
}

// --- Event delegation on controlsRoot for category clicks & actions
controlsRoot.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  if (btn.classList.contains('category-btn')) {
    const cat = btn.dataset.category;
    state.activeCategory = cat;
    highlightActiveCategory();
    showRandomQuote();
    saveState();
    return;
  }
  if (btn.id === 'newQuote') {
    showRandomQuote();
    return;
  }
  if (btn.id === 'toggleForm') {
    if (formArea.innerHTML.trim()) {
      formArea.innerHTML = '';
    } else {
      createAddQuoteForm();
    }
    return;
  }
});

// --- MutationObserver example
const observer = new MutationObserver((mutations) => {
  // example hook: you could animate or log
});
observer.observe(quoteDisplay, { childList: true, subtree: true });

// --- initialize app
function init() {
  loadState();
  renderCategoryButtons();
  createAddQuoteForm();
  highlightActiveCategory();
  showRandomQuote();

  // keyboard shortcut: press "n" for new quote
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'n') showRandomQuote();
  });
}

init();
