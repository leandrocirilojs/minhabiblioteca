const githubUser = "leandrocirilojs";

const projectsContainer = document.getElementById("projects");
const statusText = document.getElementById("status");
const searchInput = document.getElementById("searchInput");

let allProjects = [];

async function loadProjects() {
  try {
    const response = await fetch(`https://api.github.com/users/${githubUser}/repos?per_page=100`);

    if (!response.ok) {
      throw new Error("Erro ao buscar repositórios.");
    }

    const repos = await response.json();

    allProjects = repos
      .filter(repo => !repo.fork)
      .map(repo => ({
        name: repo.name,
        description: repo.description || "Aplicação web criada para estudo e aprendizado.",
        github: repo.html_url,
        page: `https://${githubUser}.github.io/${repo.name}/`,
        updated: repo.updated_at
      }));

    renderProjects(allProjects);
    statusText.textContent = `${allProjects.length} projetos encontrados.`;

  } catch (error) {
    statusText.textContent = "Não foi possível carregar os projetos.";
    console.error(error);
  }
}

function renderProjects(projects) {
  projectsContainer.innerHTML = "";

  if (projects.length === 0) {
    projectsContainer.innerHTML = "<p>Nenhum projeto encontrado.</p>";
    return;
  }

  projects.forEach(project => {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <h2>${formatName(project.name)}</h2>
      <p>${project.description}</p>

      <div class="links">
        <a href="${project.page}" target="_blank">Abrir App</a>
        <a href="${project.github}" target="_blank" class="github">Código</a>
      </div>
    `;

    projectsContainer.appendChild(card);
  });
}

function formatName(name) {
  return name
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, letter => letter.toUpperCase());
}

searchInput.addEventListener("input", () => {
  const search = searchInput.value.toLowerCase();

  const filtered = allProjects.filter(project =>
    project.name.toLowerCase().includes(search) ||
    project.description.toLowerCase().includes(search)
  );

  renderProjects(filtered);
});

loadProjects();
