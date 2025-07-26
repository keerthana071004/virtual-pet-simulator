// Pet State
const pet = document.getElementById('pet');
let hunger = 50, happiness = 50, energy = 50;
let isDead = false;

// Achievement System Elements
const achievementsBtn = document.getElementById('achievements-btn');
const achievementsPanel = document.getElementById('achievements-panel');
const achievementsList = document.getElementById('achievements-list');
const closeAchievementsBtn = document.getElementById('close-achievements');

// Achievement Data
let achievements = [
    {
        id: 'feed-10',
        title: 'Feeder',
        description: 'Feed your pet 10 times',
        reward: '+10 Happiness',
        progress: 0,
        target: 10,
        completed: false,
        rewardClaimed: false
    },
    {
        id: 'play-5',
        title: 'Playtime',
        description: 'Play with your pet 5 times',
        reward: '+10 Energy',
        progress: 0,
        target: 5,
        completed: false,
        rewardClaimed: false
    },
    {
        id: 'sleep-3',
        title: 'Sleepyhead',
        description: 'Put your pet to sleep 3 times',
        reward: '+10 Hunger Reduction',
        progress: 0,
        target: 3,
        completed: false,
        rewardClaimed: false
    }
];

// Render achievements UI
function renderAchievements() {
    achievementsList.innerHTML = '';

    achievements.forEach(a => {
        const li = document.createElement('li');
        li.className = a.completed ? 'completed' : '';

        let rewardHtml = '';
        if (a.completed && !a.rewardClaimed) {
            rewardHtml = `<button class="reward-btn" data-id="${a.id}">Claim ${a.reward}</button>`;
        } else if (a.rewardClaimed) {
            rewardHtml = `<span style="color: #4CAF50; font-size: 20px;">✔️</span>`;
        } else {
            rewardHtml = `<span class="reward">${a.reward}</span>`;
        }

        li.innerHTML = `
            <div>
                <strong>${a.title}</strong><br>
                <small>${a.description}</small>
            </div>
            <div>${rewardHtml}</div>
        `;

        achievementsList.appendChild(li);
    });

    // Reward claim listeners
    document.querySelectorAll('.reward-btn').forEach(btn => {
        btn.addEventListener('click', e => claimReward(e.target.dataset.id));
    });
}

// Apply achievement reward
function claimReward(id) {
    const ach = achievements.find(a => a.id === id);
    if (!ach || !ach.completed || ach.rewardClaimed) return;

    ach.rewardClaimed = true;

    // Apply stat bonus
    switch (id) {
        case 'feed-10': happiness = Math.min(100, happiness + 10); break;
        case 'play-5': energy = Math.min(100, energy + 10); break;
        case 'sleep-3': hunger = Math.max(0, hunger - 10); break;
    }

    updateBars();
    renderAchievements();
}

// Track achievement progress
function updateAchievementProgress(id) {
    const ach = achievements.find(a => a.id === id);
    if (!ach || ach.completed) return;

    ach.progress++;
    if (ach.progress >= ach.target) ach.completed = true;

    renderAchievements();
}

// Achievement panel toggle
achievementsBtn.addEventListener('click', () => {
    achievementsPanel.classList.toggle('hidden');
    renderAchievements();
});

closeAchievementsBtn.addEventListener('click', () => {
    achievementsPanel.classList.add('hidden');
});

// Day/Night Cycle
const phases = ['day', 'evening', 'night'];
const emojis = { day: '☀️', evening: '🌇', night: '🌙' };
let currentPhase = 0;

const layers = {
    day: document.querySelector('.gradient-day'),
    evening: document.querySelector('.gradient-evening'),
    night: document.querySelector('.gradient-night')
};

const indicator = document.getElementById('phase-indicator');

function updateDayNightCycle() {
    const prev = phases[(currentPhase + 2) % 3];
    const next = phases[currentPhase];

    layers[prev].classList.remove('active');
    layers[next].classList.add('active');
    indicator.textContent = emojis[next];

    currentPhase = (currentPhase + 1) % 3;
}

updateDayNightCycle();
setInterval(updateDayNightCycle, 10000);

// Update pet attributes over time
function updatePetAttributes() {
    if (isDead) return;

    let hungerRate = 1, happinessRate = -1, energyRate = -1;
    const phase = phases[(currentPhase + 2) % 3]; // visible phase

    if (phase === 'evening') {
        energyRate = -0.5;
        happinessRate = -1.5;
    } else if (phase === 'night') {
        hungerRate = 0.3;
        energyRate = -0.2;

        if (energy < 30) putToSleep(); // auto sleep
    }

    hunger = Math.min(100, hunger + hungerRate);
    happiness = Math.max(0, happiness + happinessRate);
    energy = Math.max(0, energy + energyRate);

    updateBars();
    checkGameOver();
}

setInterval(updatePetAttributes, 3000);

// Visual progress bars
function updateBars() {
    document.getElementById('hunger-fill').style.width = hunger + '%';
    document.getElementById('happiness-fill').style.width = happiness + '%';
    document.getElementById('energy-fill').style.width = energy + '%';
    updatePetState();
}

// Pet visuals per action
const petImages = {
    idle: 'https://cdn.pixabay.com/photo/2018/03/18/18/06/australian-shepherd-3237735_960_720.jpg',
    eating: 'https://cdn.pixabay.com/photo/2015/08/15/19/17/dog-889991_1280.jpg',
    playing: 'https://cdn.pixabay.com/photo/2017/04/08/16/07/fun-2213606_960_720.jpg',
    sleeping: 'https://cdn.pixabay.com/photo/2022/01/13/10/24/dog-6934895_1280.jpg'
};

// Switch image and status temporarily
function changePetImage(action) {
    pet.style.backgroundImage = `url(${petImages[action]})`;

    const messages = {
        eating: 'Your pet is eating...',
        playing: 'Your pet is playing!',
        sleeping: 'Your pet is sleeping...'
    };
    document.getElementById('status-message').textContent = messages[action] || '';

    const buttons = document.querySelectorAll('.controls button');
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.classList.add('cooling');
    });

    setTimeout(() => {
        pet.style.backgroundImage = `url(${petImages.idle})`;
        updatePetState();
        buttons.forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('cooling');
        });
    }, 2000);
}

// Display pet state message
function updatePetState() {
    let msg = 'Your pet is doing okay.';
    if (hunger >= 100) msg = 'Your pet is starving!';
    else if (happiness <= 0) msg = 'Your pet is sad and lonely...';
    else if (energy <= 0) msg = 'Your pet collapsed from exhaustion!';
    document.getElementById('status-message').textContent = msg;
}

// Check game over state
function checkGameOver() {
    if (hunger >= 100 || happiness <= 0 || energy <= 0) {
        isDead = true;
        alert('Game Over! Your pet couldn’t make it...');
        document.querySelectorAll('.controls button').forEach(btn => btn.disabled = true);
    }
}

// Player Actions
function feedPet() {
    hunger = Math.max(0, hunger - 20);
    energy = Math.min(100, energy + 10);
    updateBars();
    changePetImage('eating');
    updateAchievementProgress('feed-10');
}

function playWithPet() {
    happiness = Math.min(100, happiness + 20);
    energy = Math.max(0, energy - 15);
    hunger = Math.min(100, hunger + 10);
    updateBars();
    changePetImage('playing');
    updateAchievementProgress('play-5');
}

function putToSleep() {
    energy = Math.min(100, energy + 30);
    happiness = Math.max(0, happiness - 10);
    updateBars();
    changePetImage('sleeping');
    updateAchievementProgress('sleep-3');
}

// Init
updateBars();