// wind.js - "Pick Your Wind" tea recommender for the Home page
// Shows a tea suggestion that matches the mood the visitor picks.

// Each mood maps to a tea name and a short reason.
const recommendations = {
  relaxed: {
    tea: 'Doldrums',
    reason: 'Calm chamomile with honey and lemon, for a slow and quiet moment.'
  },
  adventurous: {
    tea: 'Gale',
    reason: 'Strong hibiscus with ginger and lime, for when you want a little kick.'
  },
  refreshed: {
    tea: 'Sea Breeze',
    reason: 'Green tea with fresh mint and cucumber, light and cool on a hot day.'
  },
  cozy: {
    tea: 'Trade Wind',
    reason: 'Black tea with orange and a pinch of sea salt, steady and comforting.'
  }
};

const moodSelect = document.getElementById('mood');
const suggestion = document.getElementById('wind-suggestion');

// Reads the chosen mood and writes the matching tea into the page.
function showSuggestion() {
  const choice = recommendations[moodSelect.value];

  // The first option is a placeholder with no recommendation.
  if (!choice) {
    suggestion.textContent = 'Pick a mood to find your wind.';
    return;
  }
  suggestion.textContent = 'Your wind is ' + choice.tea + '. ' + choice.reason;
}

// Update the suggestion every time the visitor changes the mood.
moodSelect.addEventListener('change', showSuggestion);

// Show the starting message on page load.
showSuggestion();