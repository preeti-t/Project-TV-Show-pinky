//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const episodeCode = formatEpisodeCode(episode.season, episode.number);

    const episodeCard = document.createElement("section");
    episodeCard.className = "episode";

    episodeCard.innerHTML = `
      <h2>${episode.name} (${episodeCode})</h2>
      <img src="${episode.image.medium}" alt="${episode.name}">
      <div class="summary">
        ${episode.summary}
      </div>
    `;

    rootElem.appendChild(episodeCard);
  });
}

function formatEpisodeCode(season, number) {
  return `S${String(season).padStart(2, "0")}E${String(number).padStart(
    2,
    "0"
  )}`;
}

window.onload = setup;
