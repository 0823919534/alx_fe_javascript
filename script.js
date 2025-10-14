// Global quotes array
const quotes = [
  { text: 'The only limit to our realization of tomorrow is our doubts of today.', category: 'inspiration' },
  { text: 'Simplicity is the ultimate sophistication.', category: 'wisdom' },
  { text: 'Be yourself; everyone else is already taken.', category: 'humor' }
];

// Function to display a random quote
function displayRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const p = document.createElement('p');
  p.textContent = '\"' + quote.text + '\" - ' + quote.category;
  quoteDisplay.appendChild(p);
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

  const newQuote = { text: text, category: category };
  quotes.push(newQuote);

  const quoteDisplay = document.getElementById('quoteDisplay');
  const p = document.createElement('p');
  p.textContent = '\"' + newQuote.text + '\" - ' + newQuote.category;
  quoteDisplay.appendChild(p);

  textInput.value = '';
  categoryInput.value = '';
}

// Event listeners
document.getElementById('newQuote').addEventListener('click', displayRandomQuote);
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);

// Display a random quote on page load
displayRandomQuote();
