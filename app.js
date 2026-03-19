const searchInput = document.getElementById('searchInput');
const typeFilter = document.getElementById('typeFilter');
const favoritesToggle = document.getElementById('favoritesToggle');
const resultsCount = document.getElementById('resultsCount');
const contentGrid = document.getElementById('contentGrid');
const cardTemplate = document.getElementById('cardTemplate');
const quickFilters = document.getElementById('quickFilters');

let items = [];
let quickCategory = 'todos';
let onlyFavorites = false;
let favorites = JSON.parse(localStorage.getItem('hub-total-favorites') || '[]');

const quickOptions = [
  ['todos','Todo'],
  ['juegos','Juegos'],
  ['libros','Libros'],
  ['videos','Videos'],
  ['cursos','Cursos'],
  ['podcasts','Podcasts'],
  ['biblioteca','Biblioteca']
];

async function loadData() {
  const files = ['books.json', 'games.json', 'videos.json', 'courses.json', 'podcasts.json', 'libraries.json'];
  const groups = await Promise.all(files.map(file => fetch(`data/${file}`).then(r => r.json())));
  items = groups.flat();
  initFilters();
  render();
}

function initFilters() {
  const types = ['Todos', ...new Set(items.map(i => i.type))];
  typeFilter.innerHTML = types.map(t => `<option value="${t}">${t}</option>`).join('');
  quickFilters.innerHTML = quickOptions.map(([key,label]) => `<button class="quick-filter ${key==='todos'?'active':''}" data-category="${key}">${label}</button>`).join('');
  quickFilters.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      quickCategory = btn.dataset.category;
      quickFilters.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render();
    });
  });
}

function saveFavorites() {
  localStorage.setItem('hub-total-favorites', JSON.stringify(favorites));
}

function toggleFavorite(id) {
  favorites = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
  saveFavorites();
  render();
}

function filteredItems() {
  const q = searchInput.value.trim().toLowerCase();
  const type = typeFilter.value;
  return items.filter(item => {
    const haystack = [item.title, item.description, item.meta, ...(item.tags || [])].join(' ').toLowerCase();
    const searchOk = !q || haystack.includes(q);
    const typeOk = type === 'Todos' || item.type === type;
    const catOk = quickCategory === 'todos' || item.category === quickCategory;
    const favOk = !onlyFavorites || favorites.includes(item.id);
    return searchOk && typeOk && catOk && favOk;
  });
}

function render() {
  const data = filteredItems();
  resultsCount.textContent = data.length;
  if (!data.length) {
    contentGrid.innerHTML = '<div class="empty">No encontré contenido con esos filtros.</div>';
    return;
  }
  contentGrid.innerHTML = '';
  data.forEach(item => {
    const node = cardTemplate.content.cloneNode(true);
    node.querySelector('.card-image').src = item.image;
    node.querySelector('.card-image').alt = item.title;
    node.querySelector('.type').textContent = item.type;
    node.querySelector('.title').textContent = item.title;
    node.querySelector('.description').textContent = item.description;
    node.querySelector('.meta').textContent = item.meta;
    node.querySelector('.open-btn').href = item.url;
    const favBtn = node.querySelector('.favorite-btn');
    favBtn.textContent = favorites.includes(item.id) ? '★' : '☆';
    favBtn.addEventListener('click', () => toggleFavorite(item.id));
    const tags = node.querySelector('.tags');
    tags.innerHTML = '';
    (item.tags || []).forEach(tag => {
      const span = document.createElement('span');
      span.textContent = tag;
      tags.appendChild(span);
    });
    contentGrid.appendChild(node);
  });
}

searchInput.addEventListener('input', render);
typeFilter.addEventListener('change', render);
favoritesToggle.addEventListener('click', () => {
  onlyFavorites = !onlyFavorites;
  favoritesToggle.textContent = onlyFavorites ? 'Ver todo' : 'Ver guardados';
  render();
});

loadData();
