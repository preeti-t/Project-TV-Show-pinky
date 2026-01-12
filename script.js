//You can edit ALL of the code here
let allEpisodes = [];

function setup() {
  allEpisodes = getAllEpisodes();

  setupSearch();
  setupEpisodeSelect(allEpisodes);
  displayEpisodes(allEpisodes);
}

/* Rendering Episodes */

function displayEpisodes(episodes) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  episodes.forEach((episode) => {
    rootElem.appendChild(createEpisodeCard(episode));
  });

  updateEpisodeCount(episodes.length, allEpisodes.length);
}

function createEpisodeCard(episode) {
  const episodeCode = formatEpisodeCode(episode.season, episode.number);

  const episodeCard = document.createElement("section");
  episodeCard.className = "episode";
  episodeCard.id = episodeCode;

  episodeCard.innerHTML = `
    <h2>${episode.name} (${episodeCode})</h2>
    <img src="${episode.image.medium}" alt="${episode.name}">
    <div class="summary">
      ${episode.summary}
    </div>
  `;

  return episodeCard;
}

/*  Search Functionality */

function setupSearch() {
  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredEpisodes = allEpisodes.filter((episode) => {
      return (
        episode.name.toLowerCase().includes(searchTerm) ||
        episode.summary.toLowerCase().includes(searchTerm)
      );
    });

    displayEpisodes(filteredEpisodes);
  });
}

/*  Episode Selector */

function setupEpisodeSelect(episodes) {
  const select = document.getElementById("episodeSelect");

  episodes.forEach((episode) => {
    const episodeCode = formatEpisodeCode(episode.season, episode.number);

    const option = document.createElement("option");
    option.value = episodeCode;
    option.textContent = `${episodeCode} - ${episode.name}`;

    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    const selectedEpisodeId = select.value;
    if (!selectedEpisodeId) return;

    document
      .getElementById(selectedEpisodeId)
      .scrollIntoView({ behavior: "smooth" });
  });
}


function formatEpisodeCode(season, number) {
  return `S${String(season).padStart(2, "0")}E${String(number).padStart(
    2,
    "0"
  )}`;
}

function updateEpisodeCount(shown, total) {
  const countElem = document.getElementById("episodeCount");
  countElem.textContent = `Displaying ${shown} / ${total} episodes`;
}

/* Start App */

window.onload = setup;
