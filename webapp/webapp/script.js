// Telegram WebApp
let tg = window.Telegram?.WebApp;
if (tg) tg.expand();

let balance = 350;
let cases = 8;

function updateUI() {
    document.getElementById('balance').innerText = balance;
    document.getElementById('casesCount').innerText = cases;
}

function addMessage(text, isWin = false) {
    const resultDiv = document.createElement('div');
    resultDiv.className = 'game-result-toast';
    resultDiv.innerText = text;
    resultDiv.style.position = 'fixed';
    resultDiv.style.bottom = '20px';
    resultDiv.style.left = '20px';
    resultDiv.style.right = '20px';
    resultDiv.style.background = isWin ? '#1f5a3a' : '#3c1e1e';
    resultDiv.style.padding = '12px';
    resultDiv.style.borderRadius = '40px';
    resultDiv.style.textAlign = 'center';
    resultDiv.style.zIndex = '999';
    resultDiv.style.fontWeight = 'bold';
    document.body.appendChild(resultDiv);
    setTimeout(() => resultDiv.remove(), 2000);
}

function gameLive() {
    cases += 2;
    updateUI();
    addMessage(`🎁 Вы получили 2 БЕСПЛАТНЫХ кейса! Всего кейсов: ${cases}`, true);
}

function gameRoulette() {
    if (cases < 20) {
        addMessage(`❌ Для рулетки нужно 20 кейсов. У вас ${cases}`, false);
        return;
    }
    cases -= 20;
    const win = Math.random() > 0.6;
    if (win) {
        const winCases = 40 + Math.floor(Math.random() * 30);
        cases += winCases;
        updateUI();
        addMessage(`🎡 ВЫИГРЫШ! +${winCases} кейсов!`, true);
    } else {
        updateUI();
        addMessage(`🎡 ПРОИГРЫШ. -20 кейсов.`, false);
    }
}

function gamePvP() {
    addMessage(`⚔️ Режим PvP временно в разработке. Скоро сможешь сражаться с другими!`, false);
}

function gameCrash() {
    if (cases < 10) {
        addMessage(`❌ Для краша нужно минимум 10 кейсов`, false);
        return;
    }
    const bet = 10;
    cases -= bet;
    const multiplier = (Math.random() * 9 + 1).toFixed(1);
    const crashed = Math.random() < 0.3;
    if (!crashed) {
        const win = Math.floor(bet * multiplier);
        cases += win;
        updateUI();
        addMessage(`💥 КРАШ: x${multiplier} — УСПЕХ! Выиграл ${win} кейсов!`, true);
    } else {
        updateUI();
        addMessage(`💥 КРАШ: раунд сгорел. Потеряно ${bet} кейсов.`, false);
    }
}

function gameSlots() {
    if (cases < 5) {
        addMessage(`❌ Нужно 5 кейсов для игры в слоты`, false);
        return;
    }
    cases -= 5;
    const win = Math.random() > 0.55;
    if (win) {
        const prize = 12 + Math.floor(Math.random() * 20);
        cases += prize;
        updateUI();
        addMessage(`🎰 СЛОТЫ! ВЫИГРЫШ +${prize} кейсов!`, true);
    } else {
        updateUI();
        addMessage(`🎰 СЛОТЫ: проигрыш. -5 кейсов.`, false);
    }
}

function gameEggs() {
    if (cases < 6) {
        addMessage(`❌ Нужно 6 кейсов`, false);
        return;
    }
    cases -= 6;
    const eggWin = Math.random() > 0.5;
    if (eggWin) {
        const reward = 15 + Math.floor(Math.random() * 15);
        cases += reward;
        updateUI();
        addMessage(`🥚 ЯЙЦА! Ты открыл редкий подарок! +${reward} кейсов`, true);
    } else {
        updateUI();
        addMessage(`🥚 Обычное яйцо… повезёт в следующий раз. -6 кейсов`, false);
    }
}

function upgrade() {
    if (cases < 20) {
        addMessage(`❌ Для апгрейда подарков нужно 20 кейсов.`, false);
        return;
    }
    cases -= 20;
    updateUI();
    addMessage(`✨ АПГРЕЙД! Твои будущие подарки стали лучше (увеличены множители) ✨`, true);
}

document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', (e) => {
        const game = card.dataset.game;
        if (game === 'live') gameLive();
        if (game === 'roulette') gameRoulette();
        if (game === 'pvp') gamePvP();
        if (game === 'crash') gameCrash();
        if (game === 'slots') gameSlots();
        if (game === 'eggs') gameEggs();
    });
});

document.getElementById('upgradeMainBtn')?.addEventListener('click', upgrade);

updateUI();
