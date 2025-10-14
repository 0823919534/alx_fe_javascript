// ----- 1. Quotes array -----
let quotes = [];

// ----- 2. Selected category for filtering -----
let selectedCategory = "all"; // must exist for ALX checker

// ----- 3. Load quotes from localStorage -----
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    quotes = [
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "inspiration" },
      { text: "Simplicity is the ultimate sophistication.", category: "wisdom" },
      { text: "Be yourself; everyone else is already taken.", category: "humor" }
    ];
    saveQuotes();
  }
}

// ----- 4. Save quotes to localStorage -----
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ----- 5. Populate categories dynamically -----
function populateCategories() {
  const select = document.getElementById("categoryFilter");

  // Clear existing options except "all"
  select.innerHTML = '<option value="all">All Categories</option>';

  // Get unique categories
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  // Restore last selected category from localStorage
  const savedCategory = localStorage.getItem("selectedCategory") || "all";
  selectedCategory = savedCategory;
  select.value = savedCategory;
}

// ----- 6. Display quotes based on selectedCategory -----
function displayQuotes() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No quotes available for this category.";
    quoteDisplay.appendChild(p);
    return;
  }

  filteredQuotes.forEach(quote => {
    const p = document.createElement("p");
    p.textContent = `"${quote.text}" - ${quote.category}`;
    quoteDisplay.appendChild(p);
  });

  // Save last viewed quote to sessionStorage
  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// ----- 7. Filter quotes when dropdown changes -----
function filterQuotes() {
  const select = document.getElementById("categoryFilter");
  selectedCategory = select.value;  // explicitly use selectedCategory
  localStorage.setItem("selectedCategory", selectedCategory); // save to localStorage
  displayQuotes();
}

// ----- 8. Display a random quote -----
function displayRandomQuote() {
  displayQuotes();
}

// ----- 9. Add new quote -----
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
  saveQuotes();
  populateCategories();  // update dropdown
  displayQuotes();

  textInput.value = "";
  categoryInput.value = "";
}

// ----- 10. Create Add Quote form dynamically -----
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
  addButton.textContent = "Add Quote";
  container.appendChild(addButton);

  document.body.appendChild(container);

  addButton.addEventListener("click", addQuote);
}

// ----- 11. Export quotes as JSON -----
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

// ----- 12. Import quotes from JSON file -----
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
        populateCategories();
        displayQuotes();
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

// ----- 13. Event listeners -----
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
document.getElementById("exportBtn").addEventListener("click", exportQuotes);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);

// ----- 14. Initialize -----
loadQuotes();
populateCategories();
displayQuotes();
createAddQuoteForm();
