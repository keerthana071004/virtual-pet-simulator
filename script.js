let happiness = 100;
let hunger = 0;

const happinessElement = document.getElementById('happiness');
const hungerElement = document.getElementById('hunger');
const feedButton = document.getElementById('feedButton');
const playButton = document.getElementById('playButton');

// Function to update the pet's status
function updateStatus() {
    happinessElement.textContent = `Happiness: ${happiness}`;
    hungerElement.textContent = `Hunger: ${hunger}`;
}

// Function to feed the pet
function feedPet() {
    if (hunger > 0) {
        hunger -= 10;
        happiness += 5;
        if (happiness > 100) happiness = 100; // Cap happiness at 100
        updateStatus();
    } else {
        alert("Your pet is not hungry!");
    }
}

// Function to play with the pet
function playWithPet() {
    happiness += 10;
    hunger += 5; // Playing makes the pet a bit hungry
    if (happiness > 100) happiness = 100; // Cap happiness at 100
    updateStatus();
}

// Event listeners for buttons
feedButton.addEventListener('click', feedPet);
playButton.addEventListener('click', playWithPet);

// Simulate hunger increase over time
setInterval(() => {
    hunger += 1;
    if (hunger > 100) hunger = 100; // Cap hunger at 100
    updateStatus();
}, 5000); // Increase hunger every 5 seconds

// Initial status update
updateStatus();