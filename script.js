// Global quotes array with objects containing text and category
var quotes = [
  { text: 'The only limit to our realization of tomorrow is our doubts of today.', category: 'inspiration' },
  { text: 'Simplicity is the ultimate sophistication.', category: 'wisdom' },
  { text: 'Be yourself; everyone else is already taken.', category: 'humor' }
];

// Function to display a random quote
function displayRandomQuote() {
  var randomIndex = Math.floor(Math.random() * quotes.length);
  var quote = quotes[randomIndex];
  var quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.textContent = '\"' + quote.text + '\" - ' + quote.category;
}

// Function to add a new quote
function addQuote() {
  var textInput = document.getElementById('newQuoteText');
  var categoryInput = document.getElementById('newQuoteCategory');
  var text = textInput.value.trim();
  var category = categoryInput.value.trim();

  if (text === '' || category === '') {
    alert('Please enter both quote and category.');
    return;
  }

  quotes.push({ text: text, category: category });
  displayRandomQuote();

  textInput.value = '';
  categoryInput.value = '';
}

// Event listener for “Show New Quote” button
var newQuoteButton = document.getElementById('newQuote');
newQuoteButton.addEventListener('click', displayRandomQuote);

// Event listener for "Add Quote" button
var addQuoteButton = document.getElementById('addQuoteBtn');
addQuoteButton.addEventListener('click', addQuote);

// Display initial quote on page load
displayRandomQuote();
