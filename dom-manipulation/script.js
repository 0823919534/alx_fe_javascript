// ----- 1. Quotes array -----
let quotes = [];

// ----- 2. Load quotes from localStorage -----
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    // default quotes if none exist
    quotes = [
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "inspiration" },
      { text: "Simplicity is the ultimate sophistication.", category: "wisdom" },
      { text: "Be yourself; everyone else is already taken.", category: "humor" }
    ];
    saveQuotes();
  }
}

// ----- 3. Save quotes to localStorage -----
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ----- 4. Display a random quote -----
function displayRandomQuote() {
  if (quotes.length === 0) return;

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  const index = Math.floor(Math.random() * quotes.length);
  const quote = quotes[index];

  const p = document.createElement("p");
  p.textContent = `"${quote.text}" - ${quote.category}`;
  quoteDisplay.appendChild(p);

  // Save last viewed quote to sessionStorage (optional)
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// ----- 5. Add new quote -----
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Enter both quote and category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);

  saveQuotes(); // update localStorage

  // Display the new quote
  const quoteDisplay = document.getElementById("quoteDisplay");
  const p = document.createElement("p");
  p.textContent = `"${newQuote.text}" - ${newQuote.category}`;
  quoteDisplay.appendChild(p);

  // Clear inputs
  textInput.value = "";
  categoryInput.value = "";
}

// ----- 6. Create Add Quote form dynamically -----
function createAddQuoteForm() {
  const container = document.createElement("div");

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";
  container.appendChild(textInput);

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  container.appendChild(categoryInput);

  const addButton = document.createElement("button");
  addButton.id = "addQuoteBtn";
  addButton.textContent = "Add Quote";
  container.appendChild(addButton);

  document.body.appendChild(container);

  addButton.addEventListener("click", addQuote);
}

// ----- 7. Export quotes as JSON -----
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ----- 8. Import quotes from JSON file -----
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format!");
      }
    } catch (err) {
      alert("Error parsing JSON: " + err.message);
    }
  };
  reader.readAsText(file);
}

// ----- 9. Event listeners -----
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
document.getElementById("exportBtn").addEventListener("click", exportQuotes);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);

// ----- 10. Initialize -----
loadQuotes();
displayRandomQuote();
createAddQuoteForm();
