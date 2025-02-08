let openModal;
let selectedCard = null; 
	let editModal;

function openadd() {
    openModal = document.createElement("div");
    openModal.style.position = "fixed";
    openModal.style.top = "0";
    openModal.style.left = "0";
    openModal.style.width = "100%";
    openModal.style.height = "100%";
    openModal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    openModal.style.display = "flex";
    openModal.style.justifyContent = "center";
    openModal.style.alignItems = "center";
    openModal.style.zIndex = "1000";

    const iframe = document.createElement("iframe");
    iframe.src = "openadd.html"; 
    iframe.style.width = "400px";
    iframe.style.height = "450px";
    iframe.style.border = "none";
    iframe.style.borderRadius = "10px";
    iframe.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";

    openModal.appendChild(iframe);
    document.body.appendChild(openModal);
}

function closeAddModal() {
    if (openModal) {
        document.body.removeChild(openModal);
        openModal = null;
    }
}

window.addEventListener("message", function (event) {
    if (event.data.type === "addFlashcard") {
        addFlashcard(event.data.front, event.data.back);
        closeAddModal();
    } else if (event.data.type === "closeModal") {
        closeAddModal();
    }
});

// cardcount
function updateFlashcardCount() {
    const flashcardsList = document.getElementById("flashcardsList");
    const flashcardCount = flashcardsList.querySelectorAll(".flashcard").length;
    document.querySelector(".cardcount").textContent = `Total Number of Flashcards: ${flashcardCount}`;
}

// Flashcard Add Function
function addFlashcard(frontText, backText) {
    const flashcardsList = document.getElementById("flashcardsList");
    const card = document.createElement("div");
    card.className = "flashcard";

    card.innerHTML = `
    <div class="card-inner">
        <div class="front">Q: ${frontText}</div>
        <div class="back">A: ${backText}</div>
    </div>`;

    card.addEventListener('click', function () {
        document.querySelectorAll('.flashcard').forEach(c => c.classList.remove('active-card'));
        card.classList.add('active-card');
        card.classList.toggle('flip'); 
        selectedCard = card;
    });

    flashcardsList.appendChild(card);
    updateFlashcardCount(); 
}

// EDIT FUNCTION
function editCard() {
    if (!selectedCard) {
        alert("Select a flashcard to edit.");
        return;
    }

    // Get the current front and back text of the selected card
    const frontText = selectedCard.querySelector(".front").textContent.replace("Q: ", "");
    const backText = selectedCard.querySelector(".back").textContent.replace("A: ", "");

    // Create the edit modal
    editModal = document.createElement("div");
    editModal.style.position = "fixed";
    editModal.style.top = "0";
    editModal.style.left = "0";
    editModal.style.width = "100%";
    editModal.style.height = "100%";
    editModal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    editModal.style.display = "flex";
    editModal.style.justifyContent = "center";
    editModal.style.alignItems = "center";
    editModal.style.zIndex = "1000";

    const iframe = document.createElement("iframe");
    iframe.src = `openedit.html?front=${encodeURIComponent(frontText)}&back=${encodeURIComponent(backText)}`;
    iframe.style.width = "400px";
    iframe.style.height = "450px";
    iframe.style.border = "none";
    iframe.style.borderRadius = "10px";
    iframe.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";

    editModal.appendChild(iframe);
    document.body.appendChild(editModal);
}

function closeEditModal() {
    if (editModal) {
        document.body.removeChild(editModal);
        editModal = null;
    }
}

window.addEventListener("message", function (event) {
    if (event.data.type === "editFlashcard") {
        selectedCard.querySelector(".front").textContent = "Q: " + event.data.front;
        selectedCard.querySelector(".back").textContent = "A: " + event.data.back;

        closeEditModal(); 
    } else if (event.data.type === "closeModal") {
        closeEditModal(); 
    }
});

// DELETE FUNCTION
function deleteCard() {
    if (!selectedCard) {
        alert("Select a flashcard to delete.");
        return;
    }

    selectedCard.remove();
    selectedCard = null;
    updateFlashcardCount(); 
}

// DELETE ALL
document.getElementById('deleteAllBtn').addEventListener('click', function () {
    const flashcardsList = document.getElementById("flashcardsList");
    flashcardsList.querySelectorAll(".flashcard").forEach(card => card.remove());
    selectedCard = null;
    updateFlashcardCount();
});

updateFlashcardCount();

// SHUFFLE FUNCTION
function shuffCard() {
    let flashcardsList = document.getElementById("flashcardsList");
    let cards = Array.from(flashcardsList.getElementsByClassName("flashcard"));
    let resetFlip = document.getElementById("resetFlipToggle").checked; 

    cards.forEach(card => {
        card.classList.add("shuffle");

        if (resetFlip && card.classList.contains("flip")) {
            setTimeout(() => card.classList.remove("flip"), 150); 
        }
		
        card.classList.remove("active-card");

        setTimeout(() => card.classList.remove("shuffle"), 300); 
    });

    selectedCard = null;

    // Shuffle (Fisher-Yates algorithm)
    setTimeout(() => {
        for (let i = cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            flashcardsList.appendChild(cards[j]); 
        }
    }, 300);
	
}

// Download flashcard
function downloadFlashcards() {
    const flashcards = [];
    document.querySelectorAll(".flashcard").forEach(card => {
        const frontText = card.querySelector(".front").textContent.replace("Q: ", "");
        const backText = card.querySelector(".back").textContent.replace("A: ", "");
        flashcards.push({ frontText, backText });
    });

    const fileName = prompt("Enter a name for your flashcards:", "flashcards"); 
    if (fileName !== null && fileName.trim() !== "") { 
        const blob = new Blob([JSON.stringify(flashcards)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName.trim()}.json`; 
        link.click();
    } else {
        alert("Download canceled. No file name provided."); 
    }
}

// Function to upload flashcards from a file
function uploadFlashcards() {
    const fileInput = document.getElementById("uploadFile");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file to upload.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const flashcards = JSON.parse(event.target.result);
        const flashcardsList = document.getElementById("flashcardsList");
        
        flashcards.forEach(flashcard => {
            const card = document.createElement("div");
            card.className = "flashcard";
            card.innerHTML = `
                <div class="card-inner">
                    <div class="front">Q: ${flashcard.frontText}</div>
                    <div class="back">A: ${flashcard.backText}</div>
                </div>`;

            card.addEventListener('click', function () {
                document.querySelectorAll('.flashcard').forEach(c => c.classList.remove('active-card'));
                card.classList.add('active-card');
                card.classList.toggle('flip');
                selectedCard = card;
            });

            flashcardsList.appendChild(card);
        });

        updateFlashcardCount(); // Update count after importing
    };

    reader.readAsText(file);
}

// header
// Toggle Header Visibility
function toggleHeader() {
    const header = document.getElementById("headerofflashcard");
    const show = document.getElementById("showheader");
    const toggleBtn = document.getElementById("toggleHeaderBtn");
    const createFcardTitle = document.getElementById("createFcardTitle");
    const flashcardContainer = document.getElementById("flashcardsList");

    if (header.classList.contains("hidden-header")) {
        // Show the header
        header.classList.remove("hidden-header");
        show.style.visibility = "hidden"; // Hide the 'Show' button
    } else {
        // Hide the header
        header.classList.add("hidden-header");
        flashcardContainer.style.transform = "translateY(-250px)";
        show.style.visibility = "visible"; // Show the 'Show' button
    }
}

function showHeader() {
    const header = document.getElementById("headerofflashcard");
    const show = document.getElementById("showheader");
    const flashcardContainer = document.getElementById("flashcardsList");

    // Show the header and reset the flashcard position
    header.classList.remove("hidden-header");
    flashcardContainer.style.transform = "translateY(10px)";
    show.style.visibility = "hidden"; // Hide the 'Show' button again
}
