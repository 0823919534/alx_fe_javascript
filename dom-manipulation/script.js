// Initialize the quotes array
let quotes = [];

// Load quotes from localStorage or use default data
const savedQuotes = localStorage.getItem('quotes');
if (savedQuotes) {
  quotes = JSON.parse(savedQuotes);
} else {
  quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspirational" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Inspirational" },
    { text: "The best way to predict the future is to create it.", category: "Innovative" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Innovative" },
  ];
}

// Function to update the category dropdown
function updateCategoryDropdown() {
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Function to show a random quote based on selected category
function showRandomQuote() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  let filteredQuotes = quotes;

  if (selectedCategory !== 'all') {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    document.getElementById('quoteDisplay').innerHTML = '<p>No quotes available in this category.</p>';
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  document.getElementById('quoteDisplay').innerHTML = `
    <p>"${quote.text}"</p>
    <p>Category: ${quote.category}</p>
  `;
}

// Function to add a new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    localStorage.setItem('quotes', JSON.stringify(quotes));
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    updateCategoryDropdown();
    showRandomQuote();
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Initialize the app
updateCategoryDropdown();
showRandomQuote();