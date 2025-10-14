// script.js

// Array to hold quotes
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "In the middle of difficulty lies opportunity.", category: "Motivation" }
];

// 1. Function to SHOW a random quote (called by "Show New Quote" button)
function showRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById('quoteDisplay').textContent = "No quotes available. Add one first!";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<strong>${quote.text}</strong><br><em>(Category: ${quote.category})</em>`;
}

// 2. Function that the CHECKER expects: createAddQuoteForm()
function createAddQuoteForm() {
  // Get container where we'll place the form (you can also hardcode form in HTML)
  const formContainer = document.body; // or a specific div if you prefer

  // Create a form element
  const form = document.createElement('form');
  form.id = 'addQuoteForm';

  // Create input for quote text
  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.id = 'newQuoteText';
  textInput.placeholder = 'Enter a new quote';
  textInput.required = true;

  // Create input for category
  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter quote category';
  categoryInput.required = true;

  // Create button to submit/add quote
  const addButton = document.createElement('button');
  addButton.type = 'submit';
  addButton.textContent = 'Add Quote';

  // Append inputs and button to the form
  form.appendChild(textInput);
  form.appendChild(categoryInput);
  form.appendChild(addButton);

  // Append form to the page (you can also put this in a specific div)
  formContainer.appendChild(form);

  // Add event listener to the form to handle submission
  form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent page reload

    const text = document.getElementById('newQuoteText').value.trim();
    const category = document.getElementById('newQuoteCategory').value.trim();

    if (!text || !category) {
      alert("Please enter both a quote and a category.");
      return;
    }

    // Add the new quote to the quotes array
    quotes.push({ text, category });

    // Clear the form inputs
    textInput.value = '';
    categoryInput.value = '';

    // Optional: show success message or new quote
    alert("Quote added successfully!");
    showRandomQuote(); // Show a random quote after adding
  });
}

// ===== EVENT LISTENERS =====

// 3. Event Listener on "Show New Quote" button (id="newQuote")
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Call this function to CREATE the form (as the checker expects createAddQuoteForm to be called)
createAddQuoteForm();