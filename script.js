// Global array of quote objects
const quotes = [
  { text: 'The only limit to our realization of tomorrow is our doubts of today.', category: 'inspiration' },
  { text: 'Simplicity is the ultimate sophistication.', category: 'wisdom' },
  { text: 'Be yourself; everyone else is already taken.', category: 'humor' }
];

// Function to display a random quote
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.textContent = '\"' + quote.text + '\" - ' + quote.category;
}

// Event listener for "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', displayRandomQuote);

// Display a random quote on page load
displayRandomQuote();
