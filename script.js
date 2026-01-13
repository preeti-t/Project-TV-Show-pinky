let allEpisodes = [];

function setup() {
  fetchData();
}

async function fetchData() {
  try {
    document.getElementById("root").innerHTML = "<p>Loading episodes...</p>";

    const response = await fetch("https://api.tvmaze.com/shows/82/episodes");

    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }

    const data = await response.json();
    allEpisodes = data;

    displayEpisodes(allEpisodes);
    setupSearch();
    setupEpisodeSelect(allEpisodes);
  } catch (error) {
    document.getElementById(
      "root"
    ).innerHTML = `<p>Error: ${error.message}. Please try again later.</p>`;
  }
}

function displayEpisodes(episodes) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  episodes.forEach((episode) => {
    rootElem.appendChild(createEpisodeCard(episode));
  });

  // Update the episode count display
  updateEpisodeCount(episodes.length, allEpisodes.length);
}

function createEpisodeCard(episode) {
  const episodeCode = formatEpisodeCode(episode.season, episode.number);

  const episodeCard = document.createElement("section");
  episodeCard.className = "episode";
  episodeCard.id = episodeCode;

  episodeCard.innerHTML = `
    <h2>${episode.name} (${episodeCode})</h2>
    <img src="${episode.image ? episode.image.medium : ""}" alt="${
    episode.name
  }">
    <div class="summary">
      ${episode.summary ? episode.summary : "No summary available."}
    </div>
  `;

  return episodeCard;
}

function setupSearch() {
  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();

    // Filter the episodes based on the search input
    const filteredEpisodes = allEpisodes.filter((episode) => {
      return (
        episode.name.toLowerCase().includes(searchTerm) ||
        episode.summary.toLowerCase().includes(searchTerm)
      );
    });

    displayEpisodes(filteredEpisodes);
  });
}

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

window.onload = setup;
