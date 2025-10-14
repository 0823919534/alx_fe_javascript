// Global quotes array with text and category
const quotes = [
  { text: 'The only limit to our realization of tomorrow is our doubts of today.', category: 'inspiration' },
  { text: 'Simplicity is the ultimate sophistication.', category: 'wisdom' },
  { text: 'Be yourself; everyone else is already taken.', category: 'humor' }
];

// Function to display a random quote
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const quoteDiv = document.getElementById('quoteDisplay');
  quoteDiv.textContent = "" - ;
}

// Function to add a new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (text === '' || category === '') {
    alert('Please enter both a quote and a category.');
    return;
  }

  quotes.push({ text: text, category: category });
  displayRandomQuote();

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// Event listener for "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', displayRandomQuote);

// Event listener for "Add Quote" button
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);

// Show initial quote on page load
displayRandomQuote();
