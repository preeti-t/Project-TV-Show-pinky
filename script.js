const root = document.getElementById("root");
const searchInput = document.getElementById("searchInput");
const episodeSelect = document.getElementById("episodeSelect");
const showSelect = document.getElementById("showSelect");
const episodeCount = document.getElementById("episodeCount");
const loadingSpinner = document.getElementById("loadingSpinner");

/*  Global State & Cache */

let allShows = [];
let allEpisodes = [];

// Cache to avoid re-fetching
const episodeCache = {};

/* App Start */

window.onload = () => {
  fetchShows();
  setupSearch();
};

/* Fetch Shows (ONCE) */

async function fetchShows() {
  try {
    showLoading(true);

    const response = await fetch("https://api.tvmaze.com/shows");
    if (!response.ok) throw new Error("Failed to fetch shows");

    const data = await response.json();

    // Sort alphabetically, case-insensitive
    allShows = data.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );

    populateShowSelect(allShows);
    showLoading(false);
  } catch (error) {
    root.innerHTML =
      "<p>Error loading shows. Please refresh the page.</p>";
    showLoading(false);
  }
}

/* Fetch Episodes (Per Show) */

async function fetchEpisodesForShow(showId) {
  if (episodeCache[showId]) {
    allEpisodes = episodeCache[showId];
    displayEpisodes(allEpisodes);
    setupEpisodeSelect(allEpisodes);
    return;
  }

  try {
    showLoading(true);

    const response = await fetch(
      `https://api.tvmaze.com/shows/${showId}/episodes`
    );

    if (!response.ok) throw new Error("Failed to fetch episodes");

    const data = await response.json();

    episodeCache[showId] = data;
    allEpisodes = data;

    displayEpisodes(allEpisodes);
    setupEpisodeSelect(allEpisodes);
    showLoading(false);
  } catch (error) {
    root.innerHTML =
      "<p>Error loading episodes. Please try another show.</p>";
    showLoading(false);
  }
}

/*  UI Setup */

function populateShowSelect(shows) {
  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelect.appendChild(option);
  });
}

showSelect.addEventListener("change", () => {
  const showId = showSelect.value;
  if (!showId) return;

  // Reset UI
  searchInput.value = "";
  episodeSelect.innerHTML =
    '<option value="">Jump to episode...</option>';
  root.innerHTML = "";

  fetchEpisodesForShow(showId);
});

/*  Rendering */

function displayEpisodes(episodes) {
  root.innerHTML = "";

  episodes.forEach((episode) => {
    root.appendChild(createEpisodeCard(episode));
  });

  updateEpisodeCount(episodes.length, allEpisodes.length);
}

function createEpisodeCard(episode) {
  const episodeCode = formatEpisodeCode(
    episode.season,
    episode.number
  );

  const episodeCard = document.createElement("section");
  episodeCard.className = "episode";
  episodeCard.id = episodeCode;

  episodeCard.innerHTML = `
    <h2>${episode.name} (${episodeCode})</h2>
    <img src="${episode.image ? episode.image.medium : ""}" alt="${
    episode.name
  }">
    <div class="summary">
      ${episode.summary || "No summary available."}
    </div>
  `;

  return episodeCard;
}

/*  Search */

function setupSearch() {
  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();

    const filtered = allEpisodes.filter((episode) => {
      return (
        episode.name.toLowerCase().includes(term) ||
        episode.summary.toLowerCase().includes(term)
      );
    });

    displayEpisodes(filtered);
  });
}

/*  Episode Selector */

function setupEpisodeSelect(episodes) {
  episodeSelect.innerHTML =
    '<option value="">Jump to episode...</option>';

  episodes.forEach((episode) => {
    const code = formatEpisodeCode(episode.season, episode.number);
    const option = document.createElement("option");

    option.value = code;
    option.textContent = `${code} - ${episode.name}`;

    episodeSelect.appendChild(option);
  });
}

episodeSelect.addEventListener("change", () => {
  const id = episodeSelect.value;
  if (!id) return;

  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
  });
});

/* Helpers */

function formatEpisodeCode(season, number) {
  return `S${String(season).padStart(2, "0")}E${String(number).padStart(
    2,
    "0"
  )}`;
}

function updateEpisodeCount(shown, total) {
  episodeCount.textContent = `Displaying ${shown} / ${total} episodes`;
}

function showLoading(isLoading) {
  loadingSpinner.style.display = isLoading ? "block" : "none";
}
