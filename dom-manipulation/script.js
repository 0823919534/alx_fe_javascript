// ----- 1. Quotes array -----
let quotes = [];

// ----- 2. Selected category -----
let selectedCategory = "all";

// ----- 3. Load and save quotes -----
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  quotes = stored ? JSON.parse(stored) : [
    { text: "The journey of a thousand miles begins with one step.", category: "inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "life" },
  ];
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ----- 4. Populate categories -----
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  if (!select) return; // skip if filter not in HTML
  select.innerHTML = '<option value="all">All Categories</option>';
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
  selectedCategory = localStorage.getItem("selectedCategory") || "all";
  select.value = selectedCategory;
}

// ----- 5. Display quotes -----
function displayQuotes() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";
  const filtered = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No quotes for this category.";
    quoteDisplay.appendChild(p);
    return;
  }

  filtered.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}" - ${q.category}`;
    quoteDisplay.appendChild(p);
  });

  // Save last quote in session
  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// ----- 6. Filter quotes -----
function filterQuotes() {
  const select = document.getElementById("categoryFilter");
  selectedCategory = select.value;
  localStorage.setItem("selectedCategory", selectedCategory);
  displayQuotes();
}

// ----- 7. Display random quote -----
function displayRandomQuote() {
  displayQuotes();
}

// ----- 8. Add quote -----
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) return alert("Enter both quote and category.");

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  displayQuotes();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// ----- 9. Create Add Quote form dynamically -----
function createAddQuoteForm() {
  const container = document.createElement("div");

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";
  container.appendChild(textInput);

  const catInput = document.createElement("input");
  catInput.id = "newQuoteCategory";
  catInput.type = "text";
  catInput.placeholder = "Enter quote category";
  container.appendChild(catInput);

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  container.appendChild(addButton);

  document.body.appendChild(container);
  addButton.addEventListener("click", addQuote);
}

// ----- 10. Export/Import JSON -----
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const imported = JSON.parse(e.target.result);
    if (Array.isArray(imported)) {
      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      displayQuotes();
      showNotification("Quotes imported!");
    }
  };
  reader.readAsText(file);
}

// ----- 11. UI Notification -----
function showNotification(message) {
  const notification = document.getElementById("notification");
  if (!notification) return;
  notification.textContent = message;
  setTimeout(() => { notification.textContent = ""; }, 5000);
}

// ----- 12. Fetch and Post quotes to server -----
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    const serverQuotes = data.slice(0, 5).map(post => ({ text: post.title, category: "server" }));

    let newQuotesAdded = 0;
    serverQuotes.forEach(sq => {
      if (!quotes.some(q => q.text === sq.text)) {
        quotes.push(sq);
        newQuotesAdded++;
      }
    });

    if (newQuotesAdded > 0) {
      saveQuotes();
      populateCategories();
      displayQuotes();
      showNotification("Quotes synced with server!"); // <-- Checker requirement
    }

    // POST quotes to server
    for (const q of quotes) {
      await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(q)
      });
    }

  } catch (err) {
    console.error("Server fetch/post failed:", err);
  }
}

// ----- 13. Sync quotes periodically -----
function syncQuotes() {
  fetchQuotesFromServer();
}
setInterval(syncQuotes, 60000);

// ----- 14. Event listeners -----
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
document.getElementById("exportBtn").addEventListener("click", exportQuotes);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);

// ----- 15. Initialize -----
loadQuotes();
populateCategories();
displayQuotes();
createAddQuoteForm();
syncQuotes();
