const repoList = document.getElementById('repo-list');
const pagination = document.getElementById('pagination');

let projects = [];
let currentPage = 1;
const projectsPerPage = 6;

async function fetchProjects() {
  try {
    // Replace this URL with your actual API or data source
    const response = await fetch('https://api.example.com/projects'); 
    projects = await response.json();

    if (!Array.isArray(projects) || projects.length === 0) {
      repoList.innerHTML = '<p>No projects found.</p>';
      return;
    }

    renderPage(currentPage);
    renderPagination();
  } catch (error) {
    repoList.innerHTML = `<p>Error loading projects.</p>`;
  }
}

function renderPage(page) {
  repoList.innerHTML = '';
  const start = (page - 1) * projectsPerPage;
  const end = start + projectsPerPage;
  const pageProjects = projects.slice(start, end);

  pageProjects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'repo';

    card.innerHTML = `
      <a href="${project.url}" target="_blank" rel="noopener">${project.name}</a>
      <p class="desc">${project.description || 'No description available.'}</p>
      <div class="stats">
        <span>⭐ ${project.stars ?? 0}</span>
        <span>🍴 ${project.forks ?? 0}</span>
      </div>
    `;

    repoList.appendChild(card);
  });
}

function renderPagination() {
  pagination.innerHTML = '';
  const pageCount = Math.ceil(projects.length / projectsPerPage);

  for (let i = 1; i <= pageCount; i++) {
    const btn = document.createElement('button');
    btn.className = 'page-btn';
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('active');

    btn.addEventListener('click', () => {
      currentPage = i;
      renderPage(currentPage);
      updatePagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    pagination.appendChild(btn);
  }
}

function updatePagination() {
  Array.from(pagination.children).forEach((btn, idx) => {
    btn.classList.toggle('active', idx + 1 === currentPage);
  });
}

fetchProjects();
