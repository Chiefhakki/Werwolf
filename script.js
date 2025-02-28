let roleOptions = ['Werwolf', 'Bürger', 'Wahrsager', 'Hexe', 'Jäger'];
let players = [];
let roles = {};

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

    let totalCount = document.createElement('p');
    totalCount.id = 'total-role-count';
    totalCount.innerText = 'Gesamt gewählte Rollen: 0';
    roleSelectionDiv.appendChild(totalCount);
}

function updateRoleCount() {
    let total = 0;
    roleOptions.forEach(role => {
        total += parseInt(document.getElementById(`role-${role.replace(' ', '-')}`).value) || 0;
    });
    document.getElementById('total-role-count').innerText = `Gesamt gewählte Rollen: ${total}`;
}

function startGame() {
    let numPlayers = parseInt(document.getElementById('players').value);
    if (numPlayers < 3) {
        alert('Mindestens 3 Spieler erforderlich');
        return;
    }

    players = [];
    roles = {};

    let totalRoles = 0;
    roleOptions.forEach(role => {
        let count = parseInt(document.getElementById(`role-${role.replace(' ', '-')}`).value) || 0;
        roles[role] = count;
        totalRoles += count;
    });

    if (totalRoles !== numPlayers) {
        alert('Die Anzahl der Rollen muss genau der Anzahl der Spieler entsprechen!');
        return;
    }

    let assignedRoles = [];
    for (let role in roles) {
        for (let i = 0; i < roles[role]; i++) {
            assignedRoles.push(role);
        }
    }

    assignedRoles = assignedRoles.sort(() => Math.random() - 0.5);

    for (let i = 0; i < numPlayers; i++) {
        players.push({ id: i + 1, role: assignedRoles[i], eliminated: false });
    }

    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    updatePlayerView();
}

let currentPlayerIndex = 0;

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
}

function revealRole() {
    document.getElementById('role-display').innerText = players[currentPlayerIndex].role;
    document.getElementById('role-display').style.display = 'block';
    document.querySelector("button[onclick='hideRole()']").style.display = 'block';
    document.querySelector("button[onclick='revealRole()']").style.display = 'none';
}

function hideRole() {
    currentPlayerIndex++;
    updatePlayerView();
}

function displayAdminView() {
    let list = document.getElementById('player-list');
    list.innerHTML = '';

    players.forEach(player => {
        let li = document.createElement('li');
        li.innerHTML = `Spieler ${player.id}: ${player.role} 
            <button onclick="toggleElimination(${player.id})">
                ${player.eliminated ? 'Wiederherstellen' : 'Eliminieren'}
            </button>`;

        if (player.eliminated) {
            li.style.textDecoration = "line-through";
            li.style.color = "gray";
        }
        list.appendChild(li);
    });
}

function toggleElimination(id) {
    players = players.map(player => 
        player.id === id ? { ...player, eliminated: !player.eliminated } : player
    );
    displayAdminView();
}

function resetGame() {
    location.reload();
}

document.addEventListener("DOMContentLoaded", setupRoleSelection);
