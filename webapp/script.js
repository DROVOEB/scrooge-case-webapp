// Telegram WebApp инициализация
let tg = window.Telegram?.WebApp;
if (tg) tg.expand();

let userId = null;
let balance = 0;
let luck = 1;
let currentGame = null;
let betAmount = 10;

// Функции работы с балансом
async function fetchUserData() {
  try {
    // Для демонстрации используем заглушку (в реальном проекте вызываем API бота)
    // Здесь нужно будет получать данные через запрос к серверу
    balance = 250;
    luck = 2;
    updateUI();
  } catch(e) { console.log(e); }
}

function updateUI() {
  document.getElementById('balance').innerText = balance;
  document.getElementById('luck').innerText = luck;
}

async function updateBalanceOnServer(delta) {
  // Заглушка: реально надо отправлять запрос на бэкенд
  balance += delta;
  if(balance < 0) balance = 0;
  updateUI();
  return delta;
}

// Игровая логика
function showGameUI(gameId) {
  const container = document.getElementById('game-content');
  currentGame = gameId;
  
  if(gameId === 'racket') {
    container.innerHTML = `
      <div class="info-panel">🎾 Угадай высоту отскока (1-100). Множитель до x5</div>
      <div class="bet-control"><input type="number" id="betInput" value="10" step="5"><button class="play-btn" id="playRacket">Играть</button></div>
      <div class="result-area" id="gameResult"></div>
    `;
    document.getElementById('playRacket')?.addEventListener('click', () => {
      const bet = parseInt(document.getElementById('betInput').value);
      if(bet > balance) return alert('Недостаточно звёзд');
      const guess = Math.floor(Math.random() * 100) + 1;
      const hit = Math.floor(Math.random() * 100) + 1;
      const diff = Math.abs(guess - hit);
      let mult = 0;
      if(diff <= 5) mult = 5;
      else if(diff <= 15) mult = 3;
      else if(diff <= 30) mult = 2;
      else mult = 0;
      
      if(mult > 0) {
        const win = bet * mult;
        updateBalanceOnServer(win - bet);
        document.getElementById('gameResult').innerHTML = `🎉 Выигрыш! ${win} ⭐ (множитель x${mult})`;
        document.getElementById('gameResult').classList.add('win-animation');
      } else {
        updateBalanceOnServer(-bet);
        document.getElementById('gameResult').innerHTML = `😭 Проигрыш: выпало ${hit}, вы загадали ${guess}`;
      }
    });
  }
  else if(gameId === 'mines') {
    container.innerHTML = `
      <div class="info-panel">💣 Выбери клетку (1-10). Не попади на мину! Множитель x2-x10</div>
      <div class="bet-control"><input type="number" id="betInputMines" value="15" step="5"><button class="play-btn" id="playMines">Играть</button></div>
      <div class="result-area" id="gameResultMines"></div>
    `;
    document.getElementById('playMines')?.addEventListener('click', () => {
      const bet = parseInt(document.getElementById('betInputMines').value);
      if(bet > balance) return alert('Недостаточно звёзд');
      const bombPos = Math.floor(Math.random() * 10) + 1;
      const chosen = Math.floor(Math.random() * 10) + 1;
      if(chosen !== bombPos) {
        let multiplier = 2 + Math.floor(Math.random() * 9);
        const win = bet * multiplier;
        updateBalanceOnServer(win - bet);
        document.getElementById('gameResultMines').innerHTML = `🎉 Взрыва нет! Выигрыш ${win} ⭐`;
        document.getElementById('gameResultMines').classList.add('win-animation');
      } else {
        updateBalanceOnServer(-bet);
        document.getElementById('gameResultMines').innerHTML = `💥 БАБАХ! Мина на клетке ${bombPos}. Проигрыш.`;
      }
    });
  }
  else if(gameId === 'roulette') {
    container.innerHTML = `
      <div class="info-panel">🎡 Ставка на красное или чёрное (выигрыш x2)</div>
      <div class="bet-control"><input type="number" id="betRoulette" value="20"><select id="colorSelect"><option>красное</option><option>чёрное</option></select><button class="play-btn" id="playRoulette">Крутить</button></div>
      <div class="result-area" id="resultRoulette"></div>
    `;
    document.getElementById('playRoulette')?.addEventListener('click', () => {
      const bet = parseInt(document.getElementById('betRoulette').value);
      if(bet > balance) return alert('Недостаточно');
      const color = Math.random() > 0.5 ? 'красное' : 'чёрное';
      const playerChoice = document.getElementById('colorSelect').value;
      if(color === playerChoice) {
        const win = bet * 2;
        updateBalanceOnServer(win - bet);
        document.getElementById('resultRoulette').innerHTML = `✨ Выпало ${color}. +${win} ⭐`;
        document.getElementById('resultRoulette').classList.add('win-animation');
      } else {
        updateBalanceOnServer(-bet);
        document.getElementById('resultRoulette').innerHTML = `❌ Выпало ${color}. Проигрыш.`;
      }
    });
  }
  else if(gameId === 'upgrade') {
    container.innerHTML = `
      <div class="info-panel">⬆️ Повысь уровень удачи навсегда (увеличивает множители во всех играх).</div>
      <div class="bet-control"><button class="play-btn" id="upgradeLuckBtn">Апгрейд за 100 ⭐</button></div>
      <div class="result-area" id="upgradeResult"></div>
    `;
    document.getElementById('upgradeLuckBtn')?.addEventListener('click', async () => {
      if(balance >= 100) {
        await updateBalanceOnServer(-100);
        luck++;
        document.getElementById('luck').innerText = luck;
        document.getElementById('upgradeResult').innerHTML = `🍀 Удача повышена до ${luck} уровня!`;
        // В реальном проекте отправить запрос боту на повышение уровня
      } else {
        alert(`Не хватает звезд: нужно 100, у вас ${balance}`);
      }
    });
  }
}

document.querySelectorAll('.game-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    showGameUI(btn.dataset.game);
  });
});

fetchUserData();