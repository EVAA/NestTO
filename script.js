let neighbourhoods = [];

fetch("data/neighbourhoods.json")
  .then(response => response.json())
  .then(data => {
    neighbourhoods = data;
    document.getElementById("status").textContent =
      "Data loaded. Add your preferences and run the recommender.";
  })
  .catch(error => {
    document.getElementById("status").textContent =
      "Data file not found yet. Add data/neighbourhoods.json next.";
    console.error(error);
  });

const form = document.getElementById("recommenderForm");
const results = document.getElementById("results");

const transitInput = document.getElementById("transit");
const hotspotInput = document.getElementById("hotspot");

transitInput.addEventListener("input", () => {
  document.getElementById("transitValue").textContent = transitInput.value;
});

hotspotInput.addEventListener("input", () => {
  document.getElementById("hotspotValue").textContent = hotspotInput.value;
});

form.addEventListener("submit", event => {
  event.preventDefault();
  recommendNeighbourhoods();
});

function getBedroomCol(nBedrooms) {
  if (nBedrooms <= 0) return "Studio";
  if (nBedrooms === 1) return "One_Bedroom";
  if (nBedrooms === 2) return "Two_Bedroom";
  return "Three_Bedroom_Plus";
}

function minMaxScale(values) {
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);

  if (maxVal === minVal) {
    return values.map(() => 100);
  }

  return values.map(v => 100 * (v - minVal) / (maxVal - minVal));
}

function recommendNeighbourhoods() {
  const statusText = document.getElementById("status");

  if (neighbourhoods.length === 0) {
    statusText.textContent = "No data loaded yet. Add neighbourhoods.json first.";
    return;
  }

  const income = Number(document.getElementById("income").value);
  const transitWeight = Number(document.getElementById("transit").value);
  const hotspotWeight = Number(document.getElementById("hotspot").value);
  const nBedrooms = Number(document.getElementById("bedrooms").value);
  const minBudget = Number(document.getElementById("minBudget").value);
  const maxBudget = Number(document.getElementById("maxBudget").value);

  const rentCol = getBedroomCol(nBedrooms);

  let filtered = neighbourhoods
    .filter(n => n[rentCol] !== null && !Number.isNaN(Number(n[rentCol])))
    .filter(n => Number(n[rentCol]) >= minBudget && Number(n[rentCol]) <= maxBudget);

  if (filtered.length === 0) {
    results.innerHTML = "";
    statusText.textContent = "No neighbourhoods found in this budget range.";
    return;
  }

  const rentRatios = filtered.map(n => (Number(n[rentCol]) * 12) / income);
  const scaledRatios = minMaxScale(rentRatios);

  const totalWeight = transitWeight + hotspotWeight;
  const tw = totalWeight === 0 ? 0.5 : transitWeight / totalWeight;
  const hw = totalWeight === 0 ? 0.5 : hotspotWeight / totalWeight;

  const scored = filtered.map((n, i) => {
    const affordabilityFit = 100 - scaledRatios[i];

    const preferenceScore =
      tw * Number(n.Transit_Score) +
      hw * Number(n.Hotspot_Score);

    const recommendationScore =
      0.6 * preferenceScore +
      0.4 * affordabilityFit;

    return {
      ...n,
      affordabilityFit,
      preferenceScore,
      recommendationScore
    };
  });

  scored.sort((a, b) => b.recommendationScore - a.recommendationScore);

  showResults(scored.slice(0, 10), rentCol);
}

function showResults(top, rentCol) {
  const statusText = document.getElementById("status");

  statusText.textContent = `Showing ${top.length} best matches.`;

  results.innerHTML = top.map((n, i) => `
    <article class="card">
      <div class="rank">${i + 1}</div>

      <div class="card-content">
        <h3>${n.Neighbourhood}</h3>

        <div class="score-row">
          <span>Match Score</span>
          <strong>${n.recommendationScore.toFixed(2)}</strong>
        </div>

        <div class="details">
          <p><strong>Estimated Rent:</strong> $${Number(n[rentCol]).toLocaleString()}</p>
          <p><strong>Transit Score:</strong> ${Number(n.Transit_Score).toFixed(2)}</p>
          <p><strong>Hotspot Score:</strong> ${Number(n.Hotspot_Score).toFixed(2)}</p>
          <p><strong>Affordability Fit:</strong> ${n.affordabilityFit.toFixed(2)}</p>
        </div>
      </div>
    </article>
  `).join("");
}