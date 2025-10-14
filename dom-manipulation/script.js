// script.js

// Initial array of quote objects
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "In the middle of difficulty lies opportunity.", category: "Motivation" }
];

// DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteForm = document.getElementById('addQuoteForm');
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');

// Function to show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available. Add one!";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<strong>${quote.text}</strong><br><em>(Category: ${quote.category})</em>`;
}

// Function to add a new quote via the form
function addQuote(event) {
  event.preventDefault(); // Prevent form from submitting and refreshing

  const text = newQuoteTextInput.value.trim();
  const category = newQuoteCategoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  // Add the new quote to the quotes array
  quotes.push({ text, category });

  // Clear the input fields
  newQuoteTextInput.value = '';
  newQuoteCategoryInput.value = '';

  // Show success message (optional)
  alert("Quote added successfully!");

  // Optionally show the new quote right away
  showRandomQuote();
}

// Event Listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteForm.addEventListener('submit', addQuote);

// Show a quote on page load (optional)
window.addEventListener('DOMContentLoaded', () => {
  showRandomQuote();
});