let roleOptions = ['Werwolf', 'Bürger', 'Wahrsager', 'Hexe', 'Jäger'];
let players = [];
let roles = {};
let currentPlayerIndex = 0;
let expandedPlayer = null;  // Speichert den aktuell vergrößerten Spieler

function setupRoleSelection() {
    let roleSelectionDiv = document.getElementById('role-selection');
    roleSelectionDiv.innerHTML = '';

    roleOptions.forEach(role => {
        let label = document.createElement('label');
        label.innerText = role;

        let input = document.createElement('input');
        input.type = 'number';
        input.min = 0;
        input.value = 1;
        input.id = `role-${role.replace(' ', '-')}`;
        input.oninput = updateRoleCount;

        roleSelectionDiv.appendChild(label);
        roleSelectionDiv.appendChild(input);
        roleSelectionDiv.appendChild(document.createElement('br'));
    });

    loadGameState();
}

function updateRoleCount() {
    let total = 0;
    roleOptions.forEach(role => {
        total += parseInt(document.getElementById(`role-${role.replace(' ', '-')}`).value) || 0;
    });
    document.getElementById('total-role-count').innerText = `Anzahl Spieler: ${total}`;
}

function startGame() {
    players = [];
    roles = {};

    let totalRoles = 0;
    roleOptions.forEach(role => {
        let count = parseInt(document.getElementById(`role-${role.replace(' ', '-')}`).value) || 0;
        roles[role] = count;
        totalRoles += count;
    });

    if (totalRoles < 3) {
        alert('Mindestens 3 Rollen erforderlich!');
        return;
    }

    let assignedRoles = [];
    for (let role in roles) {
        for (let i = 0; i < roles[role]; i++) {
            assignedRoles.push(role);
        }
    }

    assignedRoles = assignedRoles.sort(() => Math.random() - 0.5);

    for (let i = 0; i < totalRoles; i++) {
        players.push({ id: i + 1, role: assignedRoles[i], eliminated: false });
    }

    currentPlayerIndex = 0;
    expandedPlayer = null;  // Setze vergrößerte Ansicht zurück
    saveGameState();  

    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    updatePlayerView();
}

function updatePlayerView() {
    if (currentPlayerIndex >= players.length) {
        document.getElementById('game-screen').style.display = 'none';
        document.getElementById('admin-screen').style.display = 'block';
        displayAdminView();
        return;
    }

    document.getElementById('player-name').innerText = `Spieler ${currentPlayerIndex + 1}, schau deine Rolle an`;
    document.getElementById('role-display').style.display = 'none';
    document.querySelector("button[onclick='hideRole()']").style.display = 'none';
    document.querySelector("button[onclick='revealRole()']").style.display = 'block';

    saveGameState();  
}

function revealRole() {
    document.getElementById('role-display').innerText = players[currentPlayerIndex].role;
    document.getElementById('role-display').style.display = 'block';
    document.querySelector("button[onclick='hideRole()']").style.display = 'block';
    document.querySelector("button[onclick='revealRole()']").style.display = 'none';

    saveGameState();  
}

function hideRole() {
    currentPlayerIndex++;
    saveGameState();  
    updatePlayerView();
}

function displayAdminView() {
    let adminScreen = document.getElementById('admin-screen');
    adminScreen.innerHTML = `
        <h2>Spielübersicht</h2>
        <div id="player-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; text-align: center;"></div>
        <button onclick="resetGame()">Neues Spiel</button>
    `;

    let grid = document.getElementById('player-grid');
    grid.innerHTML = '';

    players.forEach(player => {
        let div = document.createElement('div');
        div.style.border = "1px solid black";
        div.style.padding = "10px";
        div.style.backgroundColor = "#f9f9f9";

        if (player.eliminated) {
            div.style.textDecoration = "line-through";
            div.style.color = "gray";
        }

        div.innerHTML = `Spieler ${player.id}: ${player.role} <br>
            <button onclick="expandPlayerView(${player.id})">
                ${player.eliminated ? 'Wiederherstellen' : 'Eliminieren'}
            </button>`;

        grid.appendChild(div);
    });

    saveGameState();
}

function expandPlayerView(id) {
    expandedPlayer = id;
    let player = players.find(p => p.id === expandedPlayer);
    let adminScreen = document.getElementById('admin-screen');
    
    adminScreen.innerHTML = `
        <h2 style="font-size: 32px; color: red;">Spieler ${player.id} wurde eliminiert!</h2>
        <p style="font-size: 28px; font-weight: bold;">Rolle: ${player.role}</p>
        <button onclick="toggleElimination(${player.id})" style="font-size: 24px; padding: 10px;">
            ${player.eliminated ? 'Wiederherstellen' : 'Eliminieren'}
        </button>
        <button onclick="collapsePlayerView()" style="font-size: 24px; padding: 10px;">Zurück zur Übersicht</button>
    `;
}

function collapsePlayerView() {
    expandedPlayer = null;
    displayAdminView();
}

function toggleElimination(id) {
    players = players.map(player => 
        player.id === id ? { ...player, eliminated: !player.eliminated } : player
    );
    saveGameState();
    displayAdminView();
}

function resetGame() {
    localStorage.removeItem("werwolfGameState");
    location.reload();
}

function saveGameState() {
    localStorage.setItem("werwolfGameState", JSON.stringify({
        players,
        currentPlayerIndex,
        expandedPlayer
    }));
}

function loadGameState() {
    let savedState = localStorage.getItem("werwolfGameState");
    if (savedState) {
        let gameState = JSON.parse(savedState);
        players = gameState.players;
        currentPlayerIndex = gameState.currentPlayerIndex;
        expandedPlayer = gameState.expandedPlayer || null;

        document.getElementById('setup-screen').style.display = 'none';
        document.getElementById('admin-screen').style.display = 'block';
        displayAdminView();
    }
}

document.addEventListener("DOMContentLoaded", setupRoleSelection);
