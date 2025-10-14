// Global quotes array with objects containing text and category
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

// Function to add a new quote
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text === '' || category === '') {
    alert('Please enter both quote and category.');
    return;
  }

  quotes.push({ text: text, category: category });
  displayRandomQuote();

  textInput.value = '';
  categoryInput.value = '';
}

// Event listener on 'Show New Quote' button
document.getElementById('newQuote').addEventListener('click', displayRandomQuote);

// Event listener on 'Add Quote' button
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);

// Display initial quote on page load
displayRandomQuote();
