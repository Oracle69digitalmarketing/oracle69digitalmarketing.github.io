const username = "Oracle69digitalmarketing";
const reposPerPage = 6;
let currentPage = 1;
let allRepos = [];
let filteredRepos = [];

async function fetchRepos() {
  const res = await fetch(`https://api.github.com/users/${username}/repos`);
  const data = await res.json();
  allRepos = data.filter(repo => !repo.fork);
  extractTopics(allRepos);
  handleSearch(); // also initializes filteredRepos
}

function extractTopics(repos) {
  const topicSet = new Set();
  repos.forEach(repo => {
    if (repo.topics) {
      repo.topics.forEach(t => topicSet.add(t));
    }
  });
  const topicFilter = document.getElementById("topicFilter");
  topicSet.forEach(topic => {
    const opt = document.createElement("option");
    opt.value = topic;
    opt.textContent = topic;
    topicFilter.appendChild(opt);
  });
}

function handleSearch() {
  const query = document.getElementById("searchBox").value.toLowerCase();
  const topic = document.getElementById("topicFilter").value;

  filteredRepos = allRepos.filter(repo => {
    const matchesName = repo.name.toLowerCase().includes(query);
    const matchesTopic = topic ? (repo.topics && repo.topics.includes(topic)) : true;
    return matchesName && matchesTopic;
  });

  currentPage = 1;
  renderRepos();
  renderPagination();
}

function renderRepos() {
  const repoList = document.getElementById("repo-list");
  repoList.innerHTML = "";

  const start = (currentPage - 1) * reposPerPage;
  const end = start + reposPerPage;
  const paginated = filteredRepos.slice(start, end);

  paginated.forEach(repo => {
    const div = document.createElement("div");
    div.className = "repo";
    div.innerHTML = `
      <a href="${repo.html_url}" target="_blank">${repo.name}</a>
      <div class="desc">${repo.description || "No description"}</div>
      <div class="stats">
        <span>⭐ ${repo.stargazers_count}</span>
        <span>🍴 ${repo.forks_count}</span>
        <span>📅 ${new Date(repo.updated_at).toLocaleDateString()}</span>
      </div>
    `;
    repoList.appendChild(div);
  });

  if (paginated.length === 0) {
    repoList.innerHTML = "<p style='text-align:center;'>No projects found.</p>";
  }
}

function renderPagination() {
  const totalPages = Math.ceil(filteredRepos.length / reposPerPage);
  let html = `<div style="text-align:center;margin-top:30px;">`;

  if (currentPage > 1) html += `<button onclick="changePage(${currentPage - 1})">◀ Prev</button>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `<button onclick="changePage(${i})" style="margin:0 5px;${i === currentPage ? 'font-weight:bold;background:#0366d6;color:white;' : ''}">${i}</button>`;
  }

  if (currentPage < totalPages) html += `<button onclick="changePage(${currentPage + 1})">Next ▶</button>`;
  html += `</div>`;

  const pagination = document.getElementById("pagination");
  if (pagination) pagination.innerHTML = html;
  else {
    const div = document.createElement("div");
    div.id = "pagination";
    div.innerHTML = html;
    document.body.appendChild(div);
  }
}

function changePage(page) {
  currentPage = page;
  renderRepos();
  renderPagination();
}

fetchRepos();
