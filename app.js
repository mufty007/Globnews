const apiKey = '5ac4000ba84640f880be8354bbf8eff9';
const defaultSource = 'bbc-news';
const sourceSelector = document.querySelector('#sources');
const newsArticles = document.querySelector('main');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('sw.js').then(registration => console.log('Service Worker registered')).catch(err => 'SW registration failed'));
}

window.addEventListener('load', e => {
  sourceSelector.addEventListener('change', evt => updateNews(evt.target.value));
  updateNewsSources().then(() => {
    sourceSelector.value = defaultSource;
    updateNews();
  });
});

window.addEventListener('online', () => updateNews(sourceSelector.value));

async function updateNewsSources() {
  const response = await fetch(`https://newsapi.org/v2/sources?apiKey=${apiKey}`);
  const json = await response.json();
  sourceSelector.innerHTML = json.sources.Map(source => `<option value="${source.id}">${source.name}</option>`).join('\n');
}

async function updateNews(source = defaultSource) {
  newsArticles.innerHTML = '';
  const response = await fetch(`https://newsapi.org/v2/top-headlines?sources=${source}&sortBy=top&apiKey=${apiKey}`);
  const json = await response.json();
  newsArticles.innerHTML = json.articles.map(createArticle).join('\n');
}

function createArticle(article) {
  return `
    <div class="article">
        <img src="${article.urlToImage}" alt="${article.title}">
        <div class="details">
          <h2>${article.title}</h2>
          <p>${article.description}</p>
          <a href="${article.url}" target='_blank'>Read More</a>
        </div>
    </div>
  `;
}
