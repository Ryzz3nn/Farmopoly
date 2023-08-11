document.addEventListener('DOMContentLoaded', function() {
    let balance = 1000;
    const buyButtons = document.querySelectorAll('.buy-button');
    const balanceDisplay = document.getElementById("balance");

    // Income generators
    const incomeGenerators = {
        'wheat-plot': { income: 5, interval: null, intervalDuration: 3000 }, // 3 seconds
        'carrot-plot': { income: 10, interval: null, intervalDuration: 3000 },
        'potato-plot': { income: 15, interval: null, intervalDuration: 3000 },
        'forest-plot': { income: 20, interval: null, intervalDuration: 3000 }
    };

    // Total generated
    const totalGenerated = {
        'wheat-plot': 0,
        'carrot-plot': 0,
        'potato-plot': 0,
        'forest-plot': 0
    };

    const upgrades = {
        1: { incomeMultiplier: 2, cost: 100 },
        2: { incomeMultiplier: 3, cost: 200 }
        // Add more upgrades as needed
    };

    const upgradeButtons = document.querySelectorAll('.upgrade-button');
    upgradeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const upgradeId = button.getAttribute('data-upgrade');
            const upgrade = upgrades[upgradeId];
            const cost = upgrade.cost;

            if (balance >= cost) {
                balance -= cost;
                updateBalance();
                applyUpgrade(upgradeId);
            } else {
                alert('Insufficient balance!');
            }
        });
    });

    function applyUpgrade(upgradeId) {
        const upgrade = upgrades[upgradeId];
        if (upgrade) {
            incomeGenerators['wheat-plot'].income *= upgrade.incomeMultiplier;
            incomeGenerators['carrot-plot'].income *= upgrade.incomeMultiplier;
            incomeGenerators['forest-plot'].income *= upgrade.incomeMultiplier;
            updateIncomeDisplay();
        }
    }

    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cost = parseInt(button.getAttribute('data-cost'));
            const plot = button.parentElement;
            const plotId = plot.id;

            if (balance >= cost) {
                balance -= cost;
                updateBalance();

                plot.classList.add('owned');
                button.disabled = true;

                startGeneratingIncome(plotId);
            } else {
                alert('Insufficient balance!');
            }
        });
    });

    function startGeneratingIncome(plotId) {
        const generator = incomeGenerators[plotId];

        if (generator && !generator.interval) {
            generator.interval = setInterval(() => {
                balance += generator.income;
                totalGenerated[plotId] += generator.income;
                updateBalance();
                updateIncomeDisplay();
            }, generator.intervalDuration);
        }
    }

    function updateBalance() {
        balanceDisplay.innerText = "Balance: $" + balance;
    }

    function updateIncomeDisplay() {
        const plots = ['wheat-plot', 'carrot-plot', 'potato-plot', 'forest-plot'];
    
        plots.forEach(plotId => {
            const generator = incomeGenerators[plotId];
            const incomeDisplay = document.getElementById(`${plotId}-per-second`);
            const totalDisplay = document.getElementById(`${plotId}-total`);
            const intervalInSeconds = generator.intervalDuration / 1000;
    
            if (generator.interval) {
                incomeDisplay.innerText = `${generator.income} / ${intervalInSeconds}s`;
            } else {
                incomeDisplay.innerText = `0 / ${intervalInSeconds}s`;
            }
    
            totalDisplay.innerText = totalGenerated[plotId]; // Set the total value
        });
    }
    setInterval(updateIncomeDisplay, 1000); // Update every second
});
