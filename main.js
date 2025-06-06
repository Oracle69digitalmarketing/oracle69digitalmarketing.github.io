const repoList = document.getElementById('repo-list');

const allowedRepos = new Set([
  "oracle69digitalmarketing.github.io",
  "Harmony_Marketing_Hub-",
  "AI_website_and_funnel_builder",
  "AgroBrand_Fusion_AI-",
  "TessyFarm_smartloop",
  "responsive-landing-page",
  "Express.js-API",
  "REST-API-with-Express.js",
  "nodejs-scalability-analysis",
  "Oracle69-HumanCore-",
  "EduConnect",
  "calculator-app-html-css-js-",
  "My-personal-profile-page",
  "Click-Counter-App",
  "Fetch-and-Display-List-from-an-API",
  "hello-world-vite",
  "github-slideshow"
]);

let reposData = [];

const container = document.createElement('div');
const searchInput = document.createElement('input');
const sortSelect = document.createElement('select');

function createUI() {
  searchInput.type = 'search';
  searchInput.placeholder = 'Search projects...';
  searchInput.style.marginBottom = '15px';
  searchInput.style.padding = '8px';
  searchInput.style.width = '100%';

  sortSelect.innerHTML = `
    <option value="name">Sort by Name (A-Z)</option>
    <option value="stars">Sort by Stars (desc)</option>
    <option value="forks">Sort by Forks (desc)</option>
  `;
  sortSelect.style.marginBottom = '20px';
  sortSelect.style.padding = '8px';
  sortSelect.style.width = '100%';

  repoList.innerHTML = '';
  repoList.appendChild(searchInput);
  repoList.appendChild(sortSelect);
  repoList.appendChild(container);

  searchInput.addEventListener('input', () => renderRepos());
  sortSelect.addEventListener('change', () => renderRepos());
}

function renderRepos() {
  const query = searchInput.value.toLowerCase();
  let filtered = reposData.filter(r => r.name.toLowerCase().includes(query));

  switch (sortSelect.value) {
    case 'stars':
      filtered.sort((a,b) => b.stargazers_count - a.stargazers_count);
      break;
    case 'forks':
      filtered.sort((a,b) => b.forks_count - a.forks_count);
      break;
    default:
      filtered.sort((a,b) => a.name.localeCompare(b.name));
  }

  container.innerHTML = '';

  if (filtered.length === 0) {
    container.innerHTML = '<p>No projects match your search.</p>';
    return;
  }

  filtered.forEach(repo => {
    const repoEl = document.createElement('div');
    repoEl.className = 'repo';
    repoEl.innerHTML = `
      <a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a>
      <div class="desc">${repo.description || 'No description provided.'}</div>
      <div class="stats">
        <span>⭐ ${repo.stargazers_count}</span>
        <span>🍴 ${repo.forks_count}</span>
      </div>
    `;
    container.appendChild(repoEl);
  });
}

async function fetchRepos() {
  try {
    const res = await fetch('https://api.github.com/users/Oracle69digitalmarketing/repos?per_page=100');
    if (!res.ok) throw new Error('Failed to fetch repos');
    const repos = await res.json();

    reposData = repos.filter(r => allowedRepos.has(r.name));

    createUI();
    renderRepos();
  } catch (error) {
    repoList.innerHTML = `<p>Error loading repos: ${error.message}</p>`;
  }
}

fetchRepos();
