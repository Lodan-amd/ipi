document.addEventListener('DOMContentLoaded', () => {
    // Элементы игры
    const rocket = document.getElementById('rocket');
    rocket.addEventListener('click', launchRocket);
    rocket.style.pointerEvents = 'auto';
    const rocketFire = document.getElementById('rocket-fire');
    const heightDisplay = document.getElementById('height');
    const speedDisplay = document.getElementById('speed');
    const clicksDisplay = document.getElementById('clicks');
    const recordDisplay = document.getElementById('record');
    const resetButton = document.getElementById('reset');
    const fuelUpgrade = document.getElementById('fuel-upgrade');
    const hullUpgrade = document.getElementById('hull-upgrade');
    
    // Игровые переменные
    let height = 0;
    let speed = 0;
    let clicks = 0;
    let record = 0;
    let isFlying = false;
    let animationId;
    let maxHeightThisFlight = 0;
    
    // Улучшения
    let upgrades = {
        fuel: {
            level: 0,
            effect: 0.9, // 10% меньше потери скорости за уровень
            cost: 500,
            requiredHeight: 500,
            maxLevel: 10,
            name: "Топливные баки",
            nextLevel: 1
        },
        hull: {
            level: 0,
            effect: 1.05, // 5% больше начальной скорости за уровень
            cost: 1000,
            requiredHeight: 1000,
            maxLevel: 10,
            name: "Укреплённый корпус",
            nextLevel: 1
        }
    };
    
    // Инициализация игры
    initGame();
    
    function initGame() {
        updateUpgradesUI();
        gameLoop();
        
        // Обработчик клика по ракете
        rocket.addEventListener('click', launchRocket);
        
        // Обработчик кнопки перезапуска
        resetButton.addEventListener('click', resetGame);
        
        // Обработчики кнопок улучшений
        fuelUpgrade.querySelector('.buy-btn').addEventListener('click', () => buyUpgrade('fuel'));
        hullUpgrade.querySelector('.buy-btn').addEventListener('click', () => buyUpgrade('hull'));
    }
    
    function launchRocket() {
        if (!isFlying) {
            isFlying = true;
            rocket.style.cursor = 'pointer';
            maxHeightThisFlight = 0;
            rocketFire.style.opacity = '1';
            rocketFire.style.animation = 'flame 0.3s infinite';
        }
    
    const hullBonus = Math.pow(upgrades.hull.effect, upgrades.hull.level);
    speed += 5 * hullBonus;
    clicks++;
    clicksDisplay.textContent = clicks;
    
    rocket.style.transform = `translateY(-5px)`;
    setTimeout(() => {
        rocket.style.transform = `translateY(${-height}px)`;
    }, 100);
}
        
        // Увеличиваем скорость с учетом улучшений корпуса
        const hullBonus = Math.pow(upgrades.hull.effect, upgrades.hull.level);
        speed += 5 * hullBonus;
        clicks++;
        clicksDisplay.textContent = clicks;
        
        // Анимация клика
        rocket.style.transform = 'translateY(-5px)';
        setTimeout(() => {
            rocket.style.transform = translateY(`${-height}px`);
        }, 100);
    })
    
    function gameLoop() {
        if (isFlying) {
            // Уменьшаем скорость из-за гравитации с учетом улучшений топлива
            const fuelBonus = Math.pow(upgrades.fuel.effect, upgrades.fuel.level);
            speed -= 0.2 * fuelBonus;
            if (speed < 0) speed = 0;
            
            // Увеличиваем высоту
            height += speed;
            
            // Обновляем максимальную высоту в этом полете
            if (height > maxHeightThisFlight) {
                maxHeightThisFlight = height;
                
                // Обновляем рекорд
                if (maxHeightThisFlight > record) {
                    record = maxHeightThisFlight;
                    recordDisplay.textContent = Math.round(record);
                    recordDisplay.classList.add('highlight');
                    setTimeout(() => {
                        recordDisplay.classList.remove('highlight');
                    }, 1000);
                }
                
                // Проверяем новые доступные улучшения
                checkNewUpgrades();
            }
            
            // Если ракета упала на землю
            if (height <= 0) {
                endFlight();
            }
            
            // Обновляем отображение
            updateDisplay();
            
            updateRocketFire();
        }
        
        animationId = requestAnimationFrame(gameLoop);
    }
    
    function endFlight() {
        height = 0;
        speed = 0;
        isFlying = false;
        rocketFire.style.opacity = '0';
        rocketFire.style.animation = 'none';
        
        // Показываем итоговую высоту
        showFlightResult();
    }
    
    function updateDisplay() {
    heightDisplay.textContent = Math.round(height);
    speedDisplay.textContent = Math.round(speed * 10) / 10;
    rocket.style.transform = `translateY(${-height}px)`;
    }
    
    function updateRocketFire() {
        const fireHeight = 30 + speed * 2;
        rocketFire.style.height = `${fireHeight}px`;
        rocketFire.style.width = `${20 + speed}px`;
    }
    
    function showFlightResult() {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'flight-result';
        resultDiv.innerHTML = `
            <h3>🚀 Полёт завершён!</h3>
            <p>Максимальная высота: <strong>${Math.round(maxHeightThisFlight)}м</strong></p>
            <p>Кликов: <strong>${clicks}</strong></p>
            ${maxHeightThisFlight >= record ? '<p class="new-record">🎉 Новый рекорд!</p>' : ''}
        `;
        
        resultDiv.style.position = 'fixed';
        resultDiv.style.top = '50%';
        resultDiv.style.left = '50%';
        resultDiv.style.transform = 'translate(-50%, -50%)';
        resultDiv.style.background = 'rgba(0, 0, 0, 0.9)';
        resultDiv.style.padding = '20px';
        resultDiv.style.borderRadius = '10px';
        resultDiv.style.border = '2px solid #ffcc00';
        resultDiv.style.zIndex = '1000';
        resultDiv.style.textAlign = 'center';
        resultDiv.style.maxWidth = '80%';
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'OK';
        closeBtn.className = 'result-close-btn';
        
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(resultDiv);
        });
        
        resultDiv.appendChild(closeBtn);
        document.body.appendChild(resultDiv);
    }
    
    function buyUpgrade(type) {
        const upgrade = upgrades[type];
        if (canBuyUpgrade(type)) {
            // Применяем улучшение
            upgrade.level = upgrade.nextLevel;
            upgrade.nextLevel = Math.min(upgrade.nextLevel + 1, upgrade.maxLevel);
            
            // Увеличиваем стоимость
            upgrade.cost = Math.floor(upgrade.cost * 1.5);
            
            // Обновляем UI
            updateUpgradesUI();
            
            // Эффект покупки
            highlightUpgrade(type);
            
            // Сообщение об успехе
            showUpgradeMessage(type);
        }
    }
    
    function canBuyUpgrade(type) {
        const upgrade = upgrades[type];
        return record >= upgrade.requiredHeight && 
               upgrade.nextLevel <= upgrade.maxLevel;
    }
    
    function highlightUpgrade(type) {
        const upgradeElement = document.getElementById(`${type}-upgrade`);
        upgradeElement.classList.add('purchased');
        setTimeout(() => {
            upgradeElement.classList.remove('purchased');
        }, 500);
    }
    
    function showUpgradeMessage(type) {
        const upgrade = upgrades[type];
        const message = document.createElement('div');
        message.className = 'upgrade-message';
        message.textContent = `${upgrade.name} улучшено до уровня ${upgrade.level}!`;
        
        document.body.appendChild(message);
        setTimeout(() => {
            message.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(message);
            }, 500);
        }, 2000);
    }
    
    function updateUpgradesUI() {
        // Для каждого типа улучшения
        Object.keys(upgrades).forEach(type => {
            const upgrade = upgrades[type];
            const upgradeElement = document.getElementById(`${type}-upgrade`);
            const levelElement = upgradeElement.querySelector('.level');
            const btn = upgradeElement.querySelector('.upgrade-btn');
            const progressBar = upgradeElement.querySelector('.progress-bar');
            const requiredHeightElement = upgradeElement.querySelector('.required-height');
            
            // Обновляем уровень
            levelElement.textContent = upgrade.level;
            console.log(progressBar)
            // Обновляем прогресс-бар
            progressBar.style.width = `${(upgrade.level / upgrade.maxLevel) * 100}%`;
            
            // Обновляем кнопку
            if (upgrade.nextLevel > upgrade.maxLevel) {
                btn.textContent = 'МАКС. УРОВЕНЬ';
                btn.disabled = true;
            } else {
                btn.textContent = `Улучшить (${upgrade.cost}м)`;
                btn.disabled = record < upgrade.cost;
            }
            
            // Обновляем текст о требуемой высоте
            if (record >= upgrade.requiredHeight) {
                requiredHeightElement.textContent = '';
                upgradeElement.classList.remove('locked');
            } else {
                requiredHeightElement.textContent = `Требуется: ${upgrade.requiredHeight}м`;
                upgradeElement.classList.add('locked');
            }
        });
    }
    
    function checkNewUpgrades() {
        Object.keys(upgrades).forEach(type => {
            const upgrade = upgrades[type];
            const upgradeElement = document.getElementById(`${type}-upgrade`);
            
            if (record >= upgrade.requiredHeight && upgradeElement.classList.contains('locked')) {
                // Новое улучшение доступно!
                upgradeElement.classList.remove('locked');
                upgradeElement.classList.add('new-upgrade');
                setTimeout(() => {
                    upgradeElement.classList.remove('new-upgrade');
                }, 2000);
            }
        });
    }
    
    function resetGame() {
        // Сбрасываем параметры полета
        height = 0;
        speed = 0;
        isFlying = false;
        maxHeightThisFlight = 0;
        
        // Обновляем отображение
        heightDisplay.textContent = '0';
        speedDisplay.textContent = '0';
        rocket.style.transform = 'translateY(0)';
        rocketFire.style.opacity = '0';
        rocketFire.style.animation = 'none';
    }
    
   
    
    // Добавляем стили для анимаций
    const style = document.createElement('style');
    style.textContent = `
        @keyframes twinkle {
            0% { opacity: 0.2; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.1); }
            100% { opacity: 0.2; transform: scale(0.8); }
        }
        
        .highlight {
            animation: highlight 1s;
        }
        
        @keyframes highlight {
            0% { color: #ffcc00; transform: scale(1); }
            50% { color: #ff6600; transform: scale(1.2); }100% { color: #ffcc00; transform: scale(1); }
        }
        
        .new-upgrade {
            animation: newUpgrade 2s;
        }
        
        @keyframes newUpgrade {
            0% { box-shadow: 0 0 10px gold; }
            50% { box-shadow: 0 0 20px gold; }
            100% { box-shadow: none; }
        }
        
        .purchased {
            transform: scale(1.05);
            box-shadow: 0 0 15px rgba(255, 204, 0, 0.7);
        }
        
        .upgrade-message {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: #ffcc00;
            padding: 10px 20px;
            border-radius: 5px;
            border: 1px solid #ffcc00;
            opacity: 0;
            transition: opacity 0.5s;
            z-index: 1000;
        }
        
        .upgrade-message.show {
            opacity: 1;
        }
        
        .result-close-btn {
            background: #ffcc00;
            color: #333;
            border: none;
            padding: 8px 20px;
            border-radius: 5px;
            margin-top: 15px;
            cursor: pointer;
            font-weight: bold;
        }
        
        .new-record {
            color: #ffcc00;
            font-weight: bold;
            margin-top: 10px;
        }
    `;
    document.head.appendChild(style);
});