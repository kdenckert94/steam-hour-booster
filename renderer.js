const resultText = document.getElementById('result-text');
const startPwBtn = document.getElementById('start-password');
const toggleBtn = document.getElementById('toggle-mode');

const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const twoFactorInput = document.getElementById('twofactor');
const spinner = document.getElementById('spinner');

const loginForm = document.getElementById('login-form');
const dashboard = document.getElementById('dashboard');
const gamesSection = document.getElementById('games');
const customStatusInput = document.getElementById('customStatus');
const startIdle = document.getElementById('startIdle');
const stopIdle = document.getElementById('stopIdle');
const logout = document.getElementById('logout');

let usingQR = true; // for future using steam-session

let loginState = {
  username: '',
  password: '',
  twoFactorRequired: false
};

let show2faInput = false;

// ===== UI stuff =====

// helper to show feedback to the user
function showResult(message) {
  resultText.textContent = message;
}

// render game list
function renderGameList(games) {
  gamesSection.innerHTML = "";

  games.forEach(game => {
    const row = document.createElement("div");
    row.classList.add("game-entry");
    row.setAttribute("data-name", game.name.toLowerCase());
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.marginBottom = "8px";
    row.style.gap = "8px";

    // Image
    const img = document.createElement("img");
    img.src = game.img_icon_url;
    img.alt = game.name;
    img.style.width = "40px";
    img.style.height = "40px";
    img.style.objectFit = "cover";

    // Name (flex-grow to take available space)
    const name = document.createElement("span");
    name.textContent = game.name;
    name.style.flexGrow = "1";
    name.style.overflow = "hidden";
    name.style.textOverflow = "ellipsis";
    name.style.whiteSpace = "nowrap";

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = game.appid;

    row.appendChild(img);
    row.appendChild(name);
    row.appendChild(checkbox);

    gamesSection.appendChild(row);

    // Hook up filter / search
    document.getElementById("gameSearch").addEventListener("input", (e) => {
      filterGames(e.target.value);
    });
  });
}

// filter function
function filterGames(searchTerm) {
  const entries = document.querySelectorAll(".game-entry");
  entries.forEach(entry => {
    const gameName = entry.getAttribute("data-name");
    if (gameName.includes(searchTerm.toLowerCase())) {
      entry.style.display = "flex";
    } else {
      entry.style.display = "none";
    }
  });
}

// show the game list after login
function showGames(games) {
  loginForm.style.display = "none";
  dashboard.style.display = 'block';
  const list = JSON.parse(games);
  renderGameList(list.apps)
}

// get selected appids
function getSelectedAppIds() {
  const games = [];
  if(customStatusInput.value !== "") {
    games.push(customStatusInput.value);
  }
  const checkboxes = gamesSection.querySelectorAll("input[type='checkbox']:checked");
  const checkBoxValues = Array.from(checkboxes).map(cb => parseInt(cb.value));
  return [...games, ...checkBoxValues]
}

// try to login with refreshtoken
async function checkLogin () {
  spinner.style.display = 'inline-block';
  const loginCheck = await window.steamAPI.tryAutoLoginWithToken()
  if(loginCheck.status === 'success') {
    showGames(loginCheck.games)
  }
  spinner.style.display = 'none';
}

// initial call to trigger refreshtoken check
checkLogin()

// ===== IPC bridge calls =====

// start idling
startIdle.addEventListener('click', async () => {
  const games = getSelectedAppIds()
  if(!games.length) {
    showResult("Please select games first!")
  }
  await window.steamAPI.startIdling(games)
})

// stop idling
stopIdle.addEventListener('click', async () => {
  await window.steamAPI.stopIdling()
})

// username + password login
startPwBtn.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  const twoFactor = twoFactorInput.value.trim();

  if (!username || !password) {
    showResult('❌ Username and password and steam id are required.');
    return;
  }

  spinner.style.display = 'inline-block';

  if(show2faInput) {
    const mfaResult = await window.steamAPI.startPasswordLogin({
      username,
      password,
      twoFactor
    });

    if (mfaResult.status === 'success') {
      showResult(`✅ Logged in! SteamID: ${mfaResult.steamid}`); // refreshtokenn, accountName
      showGames(mfaResult.games)
    } else {
       showResult(`❌ Login failed: ${mfaResult.message}`);
    }

    spinner.style.display = 'none';
    return;
  }

  const res = await window.steamAPI.startPasswordLogin({
    username,
    password
  });

  if (res.status === '2fa_required') {
    show2faInput = true;
    twoFactorInput.style.display = 'block';
    showResult('2FA code required. Please enter it.');
  } else if (res.status === 'success') {
   showGames(res.games)
  } else {
    showResult('Login error: ' + res.message);
  }

  spinner.style.display = 'none';
});

// logout
logout.addEventListener('click', async () => {
  const logoutResult = await window.steamAPI.logout();

  if(logoutResult.status === 'success') {
    loginForm.style.display = "block";
    dashboard.style.display = 'none';
  }
});

// playing state
window.steamAPI.onPlayingState((data) => {
  const { blocked, playingApp } = data;
  const statusElement = document.getElementById("playingState");

  if (blocked) {
    statusElement.textContent = "Playing state blocked (family view or similar).";
  } else if (playingApp) {
    statusElement.textContent = `Currently playing AppID: ${playingApp}`;
  } else {
    statusElement.textContent = "Not currently playing.";
  }
});