# NestTO 🏡

**Find a Toronto neighbourhood that fits your budget and your lifestyle.**

NestTO is a neighbourhood recommendation tool that helps renters explore where to live in Toronto. Instead of comparing rent prices, transit access, and nearby amenities separately, users can enter their housing requirements and choose what matters most to them. NestTO then scores eligible neighbourhoods and presents the **top 10 matches**.

**[🌐 Try NestTO live](https://evaa.github.io/NestTO/)** · **[View the GitHub repository](https://github.com/EVAA/NestTO)**

## Overview

Finding a place to live involves more than choosing the cheapest apartment. A neighbourhood may be affordable but poorly connected to transit, or conveniently located but outside a renter's budget. NestTO brings several neighbourhood-level indicators together in a transparent, adjustable ranking system.

Built as a data visualization and decision-support project, NestTO combines housing affordability with transit and amenity scores to make neighbourhood comparisons more accessible.

## Live demo

**[Launch the NestTO website →](https://evaa.github.io/NestTO/)**

Use the form to select your income, rental budget, preferred bedroom count, and the relative importance of transit and local hotspots. Click **Find My Match** to compare your top neighbourhood recommendations.

## Screenshots

### Neighbourhood recommendations

![NestTO desktop interface showing the preference form and top ranked Toronto neighbourhood recommendations](assets/screenshots/nestto-results.png)

### Preference form

<img src="assets/screenshots/nestto-preferences.png" alt="Close-up of NestTO's preference form with annual income, transit and hotspot importance, bedroom selection, and rental budget inputs" width="400">

## Features

- **Personalized housing criteria:** Set an annual income, monthly rental budget range, and preferred unit size (studio, one bedroom, two bedrooms, or three-plus bedrooms).
- **Adjustable lifestyle priorities:** Use sliders to express the importance of public transit and nearby hotspots/amenities.
- **Budget-aware filtering:** Only consider neighbourhoods with an available rent estimate for the selected unit type that falls within the specified budget.
- **Weighted recommendation engine:** Balance transit, hotspots, and relative affordability in a single match score.
- **Ranked results:** View up to 10 recommended neighbourhoods, including estimated monthly rent and a breakdown of their scores.
- **Browser-based experience:** Run the recommender directly in a web browser without creating an account or installing software.

## How it works

### 1. Enter your preferences

Choose your annual income, desired number of bedrooms, minimum and maximum monthly rent, and how important transit and hotspots are to you (each on a 0–10 scale).

### 2. Filter eligible neighbourhoods

The app selects the rent field corresponding to the chosen unit size and excludes neighbourhoods with missing estimates or estimated rent outside the selected budget range.

### 3. Calculate affordability fit

For each eligible neighbourhood, annualized rent is compared with the user's annual income:

```text
Rent-to-income ratio = (Estimated monthly rent × 12) / Annual income
```

These ratios are min–max scaled across the eligible neighbourhoods, then inverted so that a higher **affordability fit** represents a lower rent burden relative to the other candidates.

### 4. Combine lifestyle priorities

The transit and hotspot slider values are converted into relative weights:

```text
Transit weight = Transit importance / (Transit importance + Hotspot importance)
Hotspot weight = Hotspot importance / (Transit importance + Hotspot importance)

Preference score = (Transit weight × Transit score)
                 + (Hotspot weight × Hotspot score)
```

If both importance sliders are set to zero, NestTO assigns equal weights to transit and hotspots.

### 5. Rank the matches

The final recommendation score combines lifestyle preferences and relative affordability:

```text
Match score = 0.60 × Preference score + 0.40 × Affordability fit
```

Eligible neighbourhoods are sorted from highest to lowest score, and the top 10 are displayed alongside estimated rent, transit score, hotspot score, and affordability fit.

> **Note:** The match score is a comparative decision-support metric, not a prediction of rental availability or a probability that a neighbourhood is the “right” fit. Affordability fit is normalized within the filtered results, so it may change when the budget or bedroom selection changes.

## Tech stack

| Technology | Purpose |
| --- | --- |
| HTML5 | Page structure and preference form |
| CSS3 | Layout and visual styling |
| JavaScript (vanilla) | Filtering, scoring, sorting, and results rendering |
| JSON | Preprocessed neighbourhood-level data |
| GitHub Pages | Static website hosting |

The current repository contains the browser-based implementation. The broader project also involved preparing and analysing Toronto housing, transit, and neighbourhood data.

## Project structure

```text
NestTO/
├── index.html                 # Interface and input controls
├── style.css                  # Page and results styling
├── script.js                  # Recommendation and ranking logic
├── data/
│   └── neighbourhoods.json   # Neighbourhood indicators and rent estimates
├── assets/
│   └── screenshots/
│       ├── nestto-results.png       # Desktop results screenshot
│       └── nestto-preferences.png   # Preference form screenshot
└── README.md                  # Project documentation
```

## Run locally

No JavaScript framework, package installation, or build step is required.

1. Clone the repository:

   ```bash
   git clone https://github.com/EVAA/NestTO.git
   cd NestTO
   ```

2. Start a local web server from the project directory:

   ```bash
   python -m http.server 8000
   ```

   On systems where Python is invoked as `python3`, use `python3 -m http.server 8000`.

3. Open **http://localhost:8000** in your browser.

A local server is recommended because the app loads `data/neighbourhoods.json` using `fetch()`, which may be blocked when opening `index.html` directly from the file system.

## Data

The application uses the prepared dataset in [`data/neighbourhoods.json`](data/neighbourhoods.json). Its fields include:

| Field | Description |
| --- | --- |
| `Neighbourhood` | Toronto neighbourhood name |
| `Studio`, `One_Bedroom`, `Two_Bedroom`, `Three_Bedroom_Plus` | Estimated monthly rent by unit size |
| `Transit_Score` | Precomputed neighbourhood transit indicator |
| `Hotspot_Score` | Precomputed indicator of nearby hotspots/amenities |
| `Population`, `Median_Household_Income` | Additional neighbourhood context |
| `n_stops`, `n_hotspots` | Underlying transit-stop and hotspot counts |

The dataset also contains supplementary affordability, accessibility, and value indicators. The live recommendation algorithm specifically uses the selected bedroom rent, `Transit_Score`, and `Hotspot_Score`, together with the user's income, budget, and slider preferences.

The project draws on Toronto neighbourhood, rental housing, transit, and points-of-interest data. The JSON file is a processed analytical dataset, **not** a live rental listing feed.

## Limitations

- Rental figures and neighbourhood indicators are estimates based on the underlying dataset; they may not reflect current market prices or service changes.
- A missing rent estimate excludes a neighbourhood for that selected unit type; it does not establish that no rentals exist there.
- Transit and hotspot scores are simplified neighbourhood-level indicators. They do not replace address-level commute or amenity checks.
- Annual income informs relative affordability scoring but does not automatically remove all neighbourhoods above a fixed rent-to-income threshold.
- Results are intended to help users compare areas, not to replace apartment searches or on-the-ground research.

## Project context

NestTO was developed as part of **DS8007: Advanced Data Visualization** in the **MSc Data Science & Analytics** program at Toronto Metropolitan University. It explores how public and neighbourhood-level data can be translated into a practical, user-centred decision-support tool.

## Author

Developed by **[EVAA](https://github.com/EVAA)**.
