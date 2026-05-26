const username = "leandrocirilojs";
const projectsContainer = document.getElementById("projects");
const searchInput = document.getElementById("searchInput");

let reposData = [];

async function loadRepos() {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100`
  );

  const repos = await response.json();

  reposData = repos.filter(repo => !repo.fork);

  renderRepos(reposData);
}

function renderRepos(repos) {
  projectsContainer.innerHTML = "";

  repos.forEach(repo => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="card-image"></div>

      <div class="card-content">
        <h3>${formatName(repo.name)}</h3>

        <p>
          ${repo.description || "Aplicação desenvolvida para estudos e aprendizado."}
        </p>

        <div class="card-buttons">
          <a href="https://${username}.github.io/${repo.name}/" target="_blank">
            Abrir
          </a>

          <a href="${repo.html_url}" target="_blank">
            Código
          </a>
        </div>
      </div>
    `;

    projectsContainer.appendChild(card);
  });
}

function formatName(name) {
  return name
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, l => l.toUpperCase());
}

searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase();

  const filtered = reposData.filter(repo =>
    repo.name.toLowerCase().includes(value)
  );

  renderRepos(filtered);
});

loadRepos();
