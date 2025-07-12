document.addEventListener("DOMContentLoaded", () => {
    const savedListings = JSON.parse(localStorage.getItem("myListings")) || [];
    savedListings.forEach(addListingCard);
    loadPurchases();
  });
  
  function logout() {
    alert("You have been logged out.");
    location.reload();
  }
  
  document.getElementById("listingForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const name = document.getElementById("listingName").value;
    const pattern = document.getElementById("listingPattern").value;
    const fabric = document.getElementById("listingFabric").value;
    const size = document.getElementById("listingSize").value;
    const fit = document.getElementById("listingFit").value;
    const care = document.getElementById("listingCare").value;
    const contact = document.getElementById("listingContact").value;
    const address = document.getElementById("listingAddress").value;
    const file = document.getElementById("listingImage").files[0];
  
    if (!file) return alert("Please upload an image!");
  
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageURL = e.target.result;
  
      const newListing = {
        name, imageURL, pattern, fabric, size, fit, care, contact, address
      };
  
      saveListing(newListing);
      addListingCard(newListing);
      document.getElementById("listingForm").reset();
    };
  
    reader.readAsDataURL(file);
  });
  
  function saveListing(listing) {
    const listings = JSON.parse(localStorage.getItem("myListings")) || [];
    listings.push(listing);
    localStorage.setItem("myListings", JSON.stringify(listings));
  }
  
  function addListingCard({ name, imageURL, pattern, fabric, size, fit, care, contact, address }) {
    const container = document.getElementById("listingContainer");
  
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl p-2 shadow-lg hover:shadow-xl transition relative";
  
    card.innerHTML = `
      <img src="${imageURL}" alt="${name}" class="rounded-lg w-full h-40 object-cover mb-2" />
      <p class="text-center font-semibold text-sm text-blue-700">${name}</p>
      <div class="text-sm text-gray-600 mt-2 px-1 space-y-1">
        <p><strong>Pattern:</strong> ${pattern}</p>
        <p><strong>Fabric:</strong> ${fabric}</p>
        <p><strong>Size:</strong> ${size}</p>
        <p><strong>Fit:</strong> ${fit}</p>
        <p><strong>Care:</strong> ${care}</p>
        <p><strong>Contact:</strong> ${contact}</p>
        <p><strong>Address:</strong> ${address}</p>
      </div>
      <button class="bg-green-500 text-white px-3 py-1 mt-2 rounded text-sm hover:bg-green-600 buy-btn">🛒 Buy</button>
      <button class="absolute top-2 right-2 text-sm text-red-600 font-bold hover:text-red-800" title="Delete">✖</button>
    `;
  
    card.querySelector("button[title='Delete']").addEventListener("click", () => {
      container.removeChild(card);
      deleteListing(name);
    });
  
    card.querySelector(".buy-btn").addEventListener("click", () => {
      savePurchase({ name, imageURL });
      loadPurchases();
    });
  
    container.appendChild(card);
  }
  
  function deleteListing(nameToRemove) {
    const listings = JSON.parse(localStorage.getItem("myListings")) || [];
    const updated = listings.filter(item => item.name !== nameToRemove);
    localStorage.setItem("myListings", JSON.stringify(updated));
  }
  
  function savePurchase(item) {
    const purchases = JSON.parse(localStorage.getItem("myPurchases")) || [];
    purchases.push(item);
    localStorage.setItem("myPurchases", JSON.stringify(purchases));
  }
  
  function loadPurchases() {
    const container = document.getElementById("purchaseContainer");
    const emptyMsg = document.getElementById("noPurchases");
    container.innerHTML = "";
  
    const purchases = JSON.parse(localStorage.getItem("myPurchases")) || [];
  
    if (purchases.length === 0) {
      emptyMsg.classList.remove("hidden");
      return;
    } else {
      emptyMsg.classList.add("hidden");
    }
  
    purchases.forEach(({ name, imageURL }) => {
      const card = document.createElement("div");
      card.className = "bg-white rounded-xl p-2 shadow-lg hover:shadow-xl transition";
      card.innerHTML = `
        <img src="${imageURL}" alt="${name}" class="rounded-lg w-full h-40 object-cover mb-2" />
        <p class="text-center font-semibold text-sm text-blue-700">${name}</p>
      `;
      container.appendChild(card);
    });
  }
  