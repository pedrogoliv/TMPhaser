const STORAGE_KEY = 'highscores';
const MAX_ENTRIES = 5;

export function saveHighScore(name, score) {
  const highscores = getHighScores();

  highscores.push({ name, score });
  highscores.sort((a, b) => b.score - a.score);

  const topScores = highscores.slice(0, MAX_ENTRIES);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(topScores));
}

export function getHighScores() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}
