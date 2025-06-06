const username = 'Oracle69digitalmarketing';
const repoListEl = document.getElementById('repo-list');

fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`)
  .then(res => res.json())
  .then(repos => {
    if (!Array.isArray(repos)) {
      repoListEl.innerHTML = 'Failed to load repos.';
      return;
    }

    // Filter only the 18 repos you want to show by name (optional)
    const wantedRepos = [
      'oracle69digitalmarketing.github.io',
      'Harmony_Marketing_Hub-',
      'AI_website_and_funnel_builder',
      'AgroBrand_Fusion_AI-',
      'TessyFarm_smartloop',
      'responsive-landing-page',
      'Express.js-API',
      'REST-API-with-Express.js',
      'nodejs-scalability-analysis',
      'Oracle69-HumanCore-',
      'EduConnect',
      'calculator-app-html-css-js-',
      'My-personal-profile-page',
      'Click-Counter-App',
      'Fetch-and-Display-List-from-an-API',
      'hello-world-vite',
      'github-slideshow'
    ];

    const filteredRepos = repos.filter(repo => wantedRepos.includes(repo.name));

    if (filteredRepos.length === 0) {
      repoListEl.innerHTML = 'No projects found.';
      return;
    }

    repoListEl.innerHTML = filteredRepos.map(repo => `
      <div class="repo">
        <a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a>
        <div class="desc">${repo.description || 'No description provided.'}</div>
        <div class="stats">
          <span>⭐ ${repo.stargazers_count}</span>
          <span>🍴 ${repo.forks_count}</span>
          <span>🛠 ${repo.language || 'N/A'}</span>
        </div>
      </div>
    `).join('');
  })
  .catch(() => {
    repoListEl.innerHTML = 'Error loading projects.';
  });
