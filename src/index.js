// index.js

document.addEventListener("DOMContentLoaded", main);

const baseURL = "http://localhost:3000/ramens";

// Fetch and display all ramen images
function displayRamens() {
    fetch(baseURL)
        .then(res => res.json())
        .then(ramenData => {
            const ramenMenu = document.getElementById("ramen-menu");
            ramenMenu.innerHTML = ""; // Clear existing content
            ramenData.forEach(ramen => renderRamenImage(ramen));
            if (ramenData.length > 0) {
                displayRamenDetails(ramenData[0]); // Display first ramen by default
            }
        })
        .catch(error => console.error("Error fetching ramens:", error));
}

// Render ramen images in the ramen-menu div
function renderRamenImage(ramen) {
    const menu = document.getElementById("ramen-menu");
    const img = document.createElement("img");
    img.src = ramen.image;
    img.alt = ramen.name;
    img.addEventListener("click", () => handleClick(ramen));
    menu.appendChild(img);
}

// Handle ramen click to display details
function handleClick(ramen) {
    displayRamenDetails(ramen);
}

// Display details of the selected ramen
function displayRamenDetails(ramen) {
    document.querySelector("#ramen-detail .detail-image").src = ramen.image;
    document.querySelector("#ramen-detail .name").textContent = ramen.name;
    document.querySelector("#ramen-detail .restaurant").textContent = ramen.restaurant;
    document.getElementById("rating-display").textContent = ramen.rating;
    document.getElementById("comment-display").textContent = ramen.comment;
    document.getElementById("edit-ramen").dataset.id = ramen.id;
}

// Handle new ramen submission
function addSubmitListener() {
    document.getElementById("new-ramen").addEventListener("submit", (event) => {
        event.preventDefault();
        const newRamen = {
            name: event.target.name.value,
            restaurant: event.target.restaurant.value,
            image: event.target.image.value,
            rating: event.target.rating.value,
            comment: event.target["new-comment"].value
        };

        fetch(baseURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newRamen)
        })
        .then(res => res.json())
        .then(savedRamen => renderRamenImage(savedRamen))
        .catch(error => console.error("Error adding ramen:", error));

        event.target.reset();
    });
}

// Handle ramen updates
function addEditListener() {
    document.getElementById("edit-ramen").addEventListener("submit", (event) => {
        event.preventDefault();
        const ramenId = event.target.dataset.id;
        const updatedRamen = {
            rating: event.target.rating.value,
            comment: event.target["new-comment"].value
        };

        fetch(`${baseURL}/${ramenId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedRamen)
        })
        .then(() => {
            document.getElementById("rating-display").textContent = updatedRamen.rating;
            document.getElementById("comment-display").textContent = updatedRamen.comment;
        })
        .catch(error => console.error("Error updating ramen:", error));

        event.target.reset();
    });
}

// Handle ramen deletion
function deleteRamen() {
    const ramenId = document.getElementById("edit-ramen").dataset.id;
    
    fetch(`${baseURL}/${ramenId}`, { method: "DELETE" })
        .then(() => {
            const ramenMenu = document.getElementById("ramen-menu");
            const ramenImg = Array.from(ramenMenu.children).find(img => img.alt === ramenId);
            if (ramenImg) ramenImg.remove();
            document.getElementById("ramen-detail").innerHTML = "<p>Select a ramen to view details.</p>";
        })
        .catch(error => console.error("Error deleting ramen:", error));
}

// Add a delete button on DOM load
function addDeleteButton() {
    const ramenDetail = document.getElementById("ramen-detail");
    if (ramenDetail) {
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.id = "delete-ramen";
        deleteBtn.addEventListener("click", deleteRamen);
        ramenDetail.appendChild(deleteBtn);
    }
}

// Main function to start the app
function main() {
    displayRamens();
    addSubmitListener();
    addEditListener();
    addDeleteButton();
}

main();

// Export functions for testing
export {
    displayRamens,
    addSubmitListener,
    handleClick,
    main,
};
