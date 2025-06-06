const username = "Oracle69digitalmarketing";
const reposPerPage = 6;
let currentPage = 1;
let allRepos = [];
let filteredRepos = [];
let allTags = new Set();

async function fetchRepos() {
  const res = await fetch(`https://api.github.com/users/${username}/repos`);
  const data = await res.json();
  allRepos = data.filter(repo => !repo.fork);

  autoTagRepos(allRepos);
  populateTagFilter();
  handleSearch();
}

function autoTagRepos(repos) {
  repos.forEach(repo => {
    repo.generatedTags = new Set();

    const desc = (repo.description || "").toLowerCase();
    const name = repo.name.toLowerCase();

    // Define keywords and associated tags
    const tagRules = {
      marketing: ["marketing", "seo", "content", "campaign"],
      ai: ["ai", "artificial intelligence", "machine learning", "automation"],
      agriculture: ["agro", "farm", "agriculture", "fish", "aquaculture", "organic"],
      web: ["website", "web", "frontend", "html", "css", "javascript"],
      api: ["api", "rest", "express", "backend", "nodejs"],
      education: ["edu", "education", "learning", "quiz", "connect"],
      tool: ["tool", "builder", "app", "application"],
    };

    for (const [tag, keywords] of Object.entries(tagRules)) {
      if (
        keywords.some(keyword => desc.includes(keyword) || name.includes(keyword))
      ) {
        repo.generatedTags.add(tag);
        allTags.add(tag);
      }
    }

    // If no tags found, add 'other'
    if (repo.generatedTags.size === 0) {
      repo.generatedTags.add("other");
      allTags.add("other");
    }
  });
}

function populateTagFilter() {
  const topicFilter = document.getElementById("topicFilter");
  topicFilter.innerHTML = `<option value="">All Categories</option>`;
  [...allTags].sort().forEach(tag => {
    const opt = document.createElement("option");
    opt.value = tag;
    opt.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
    topicFilter.appendChild(opt);
  });
}

function handleSearch() {
  const query = document.getElementById("searchBox").value.toLowerCase();
  const selectedTag = document.getElementById("topicFilter").value;

  filteredRepos = allRepos.filter(repo => {
    const matchesName = repo.name.toLowerCase().includes(query);
    const matchesTag = selectedTag
      ? repo.generatedTags.has(selectedTag)
      : true;
    return matchesName && matchesTag;
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
    const tags = [...repo.generatedTags]
      .map(t => `<span class="tag">${t}</span>`)
      .join(" ");

    const div = document.createElement("div");
    div.className = "repo";
    div.innerHTML = `
      <a href="${repo.html_url}" target="_blank">${repo.name}</a>
      <div class="desc">${repo.description || "No description"}</div>
      <div class="tags">${tags}</div>
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
  let html = `<div class="pagination">`;

  if (currentPage > 1) html += `<button onclick="changePage(${currentPage - 1})">◀ Prev</button>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `<button onclick="changePage(${i})" class="${i === currentPage ? "active" : ""}">${i}</button>`;
  }

  if (currentPage < totalPages) html += `<button onclick="changePage(${currentPage + 1})">Next ▶</button>`;
  html += `</div>`;

  let pagination = document.getElementById("pagination");
  if (!pagination) {
    pagination = document.createElement("div");
    pagination.id = "pagination";
    document.body.appendChild(pagination);
  }
  pagination.innerHTML = html;
}

function changePage(page) {
  currentPage = page;
  renderRepos();
  renderPagination();
}

fetchRepos();
