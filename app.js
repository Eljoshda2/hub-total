const items = [
  { id:'supertuxkart', title:'SuperTuxKart', type:'Juegos', category:'juegos', description:'Carreras arcade open source con mucho contenido.', meta:'Gratis y legal para descargar.', tags:['Open Source','Carreras','PC'], url:'https://supertuxkart.net/', image:'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80' },
  { id:'0ad', title:'0 A.D.', type:'Juegos', category:'juegos', description:'RTS histórico gratuito inspirado en los clásicos.', meta:'Ideal si te gusta Age of Empires.', tags:['RTS','Estrategia','PC'], url:'https://play0ad.com/', image:'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80' },
  { id:'gutenberg', title:'Project Gutenberg', type:'Libros', category:'libros', description:'Miles de libros clásicos gratis en ePub, Kindle y HTML.', meta:'Dominio público.', tags:['Libros','Clásicos','ePub'], url:'https://www.gutenberg.org/', image:'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80' },
  { id:'openlibrary', title:'Open Library', type:'Libros', category:'libros', description:'Biblioteca abierta con millones de registros y préstamos digitales.', meta:'Buscar por autor, tema o ISBN.', tags:['Biblioteca','Gratis','Lectura'], url:'https://openlibrary.org/', image:'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80' },
  { id:'youtube', title:'YouTube', type:'Videos', category:'videos', description:'Tutoriales, documentales, entretenimiento y aprendizaje.', meta:'Prácticamente cualquier tema.', tags:['Video','Tutoriales','Streaming'], url:'https://www.youtube.com/', image:'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80' },
  { id:'ted', title:'TED Talks', type:'Videos', category:'videos', description:'Charlas cortas sobre ciencia, creatividad, sociedad y tecnología.', meta:'Ideal para aprender rápido.', tags:['Charlas','Educación','Ideas'], url:'https://www.ted.com/talks', image:'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80' },
  { id:'coursera', title:'Coursera', type:'Cursos', category:'cursos', description:'Cursos de universidades y empresas; muchos se pueden auditar gratis.', meta:'Muy útil para formación online.', tags:['Cursos','MOOC','Universidad'], url:'https://www.coursera.org/', image:'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80' },
  { id:'khan', title:'Khan Academy', type:'Cursos', category:'cursos', description:'Lecciones gratis de matemáticas, ciencia y computación.', meta:'Muy buena para estudiar.', tags:['Educación','Gratis','Ejercicios'], url:'https://www.khanacademy.org/', image:'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80' },
  { id:'spotifypod', title:'Spotify Podcasts', type:'Podcasts', category:'podcasts', description:'Podcasts de noticias, tecnología, cultura y entretenimiento.', meta:'Centro de audio bajo demanda.', tags:['Podcast','Audio','Streaming'], url:'https://open.spotify.com/genre/podcasts-web', image:'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80' },
  { id:'archive', title:'Internet Archive', type:'Biblioteca', category:'biblioteca', description:'Libros, audio, video, software y archivos históricos.', meta:'Una joya para explorar contenido público.', tags:['Archivo','Libros','Video','Audio'], url:'https://archive.org/', image:'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80' }
];

const searchInput = document.getElementById('searchInput');
const typeFilter = document.getElementById('typeFilter');
const favoritesToggle = document.getElementById('favoritesToggle');
const resultsCount = document.getElementById('resultsCount');
const contentGrid = document.getElementById('contentGrid');
const cardTemplate = document.getElementById('cardTemplate');
const quickFilters = document.getElementById('quickFilters');

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
    const searchOk = !q || item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.meta.toLowerCase().includes(q) || item.tags.some(tag => tag.toLowerCase().includes(q));
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
    item.tags.forEach(tag => {
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

initFilters();
render();
