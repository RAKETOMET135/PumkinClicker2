const pumpkin = document.querySelector("#pumpkin")
const mainCurrencyDisplay = document.querySelector("#main-currency")
const expMover = document.querySelector("#exp-mover")
const expLevel = document.querySelector("#exp-level")
const upgradeWindow = document.querySelector("#upgrades-window")
const boostPumpkin = document.querySelector("#boost-pumpkin")

const images = "PumpkinImages/"
const pumpkinUpgradeImages = ["Upgrade1Pumpkin.png", "Upgrade2Pumpkin.png", "Upgrade3Pumpkin.png", "Upgrade4Pumpkin.png", "Upgrade5Pumpkin.png", "Upgrade6Pumpkin.png",
    "Upgrade7Pumpkin.png", "Upgrade8Pumpkin.png"
]

let mainCurrency = 0
let experience = 0
let level = 1

let pumpkinBoost = 0
let pumpkinMulti = 1
let experienceBoost = 0
let experienceMulti = 1
let autoClickBoost = 0
let autoClickSpeed = 200
let autoClickMulti = 2
let baseClickInterval = 1000
let autoClickUpgradeBoost = 1

let upgradesWindowOpen = false

let selectedUpgrades = []
let selectedUpgradeStats = []
function assignUpgrade(upgrade){
    let randomInteger = Math.floor(Math.random() * 4)
    /*while (selectedUpgrades.includes(randomInteger)){
        randomInteger = Math.floor(Math.random() * 1 + 1)
    }*/

    if (randomInteger === 0){
        let boost = 1 + Math.floor(pumpkinBoost/10)

        upgrade[0].innerText = "Clicker master"
        upgrade[1].innerText = "Gain +" + boost.toString() + " more pumpkins per click"
        selectedUpgradeStats.push(["pumpkins", boost])
    }
    else if (randomInteger === 1){
        let boost = Math.floor((experienceBoost/10 + 0.25) * 100) / 100

        upgrade[0].innerText = "Experience master"
        upgrade[1].innerText = "Gain +" + boost.toString() + " more experience per click"
        selectedUpgradeStats.push(["experience", boost])
    }
    else if (randomInteger === 2){
        let boost = Math.floor(1 * autoClickUpgradeBoost * 100)/100

        upgrade[0].innerText = "Autoclicker farmer"
        upgrade[1].innerText = "Gain +" + boost + " pumpkins per auto click"
        selectedUpgradeStats.push(["auto-pumpkins", boost])
    }
    else if (randomInteger === 3){
        if (autoClickSpeed >= 990){
            if (autoClickMulti < 5){
                upgrade[0].innerText = "Multi autoclicker"
                upgrade[1].innerText = "Makes autoclicker gain 10% more then before"
                selectedUpgradeStats.push(["auto-multi", 0.1])
            }
            else{
                upgrade[0].innerText = "Autoclicker support"
                upgrade[1].innerText = "Gain +10% more pumpkins per Autocliker farmer upgrade"
                selectedUpgradeStats.push(["auto-support", 0.1])
            }
        }
        else{
            upgrade[0].innerText = "Speed autoclicker"
            upgrade[1].innerText = "Makes autoclicker run faster"
            selectedUpgradeStats.push(["auto-speed", 100])
        }
    }

    selectedUpgrades.push(randomInteger)
}
function takeUpgrade(upgradeId){
    console.log(selectedUpgradeStats)
    
    const upgradeStats = selectedUpgradeStats[upgradeId]

    if (upgradeStats[0] == "pumpkins"){
        pumpkinBoost += upgradeStats[1]
    }
    else if (upgradeStats[0] == "experience"){
        experienceBoost += upgradeStats[1]
    }
    else if (upgradeStats[0] == "auto-pumpkins"){
        autoClickBoost += upgradeStats[1]
    }
    else if (upgradeStats[0] == "auto-speed"){
        autoClickSpeed += upgradeStats[1]

        setAutoClickerInterval(baseClickInterval - autoClickSpeed)
    }
    else if (upgradeStats[0] == "auto-multi"){
        autoClickMulti += upgradeStats[1]
    }
    else if (upgradeStats[0] == "auto-support"){
        autoClickUpgradeBoost += upgradeStats[1]
    }

    upgradeWindow.style.top = "-5000%"
    upgradesWindowOpen = false
}

const upgradeName1 = document.querySelector("#upgrade-name-1")
const upgradeName2 = document.querySelector("#upgrade-name-2")
const upgradeName3 = document.querySelector("#upgrade-name-3")
const upgradeDesc1 = document.querySelector("#upgrade-desc-1")
const upgradeDesc2 = document.querySelector("#upgrade-desc-2")
const upgradeDesc3 = document.querySelector("#upgrade-desc-3")
const upgradeButton1 = document.querySelector("#upgrade-button-1")
const upgradeButton2 = document.querySelector("#upgrade-button-2")
const upgradeButton3 = document.querySelector("#upgrade-button-3")
let upgrade1 = [upgradeName1, upgradeDesc1, upgradeButton1]
let upgrade2 = [upgradeName2, upgradeDesc2, upgradeButton2]
let upgrade3 = [upgradeName3, upgradeDesc3, upgradeButton3]
let upgrades = [upgrade1, upgrade2, upgrade3]
function renderUpgradeWindow(){
    upgradesWindowOpen = true

    selectedUpgrades = []
    selectedUpgradeStats = []

    upgradeWindow.style.top = "50%"

    for (let i = 0; i < upgrades.length; i++){
        const upgrade = upgrades[i]

        assignUpgrade(upgrade)
    }
}
upgrade1[2].addEventListener("click", () => {
    takeUpgrade(0)
})
upgrade2[2].addEventListener("click", () => {
    takeUpgrade(1)
})
upgrade3[2].addEventListener("click", () => {
    takeUpgrade(2)
})

function addVals(){
    if (experience >= 100){
        experience = 0
        level += 1

        renderUpgradeWindow()
    }

    mainCurrencyDisplay.innerText = "Pumpkins: " + Math.floor(mainCurrency * 100) / 100
    expMover.style.width = experience.toString() + "%"
    expLevel.innerText = "Level: " + level
}

function autoClicker(){
    if (upgradesWindowOpen) return

    mainCurrency += 0 + autoClickBoost * autoClickMulti * pumpkinMulti
    experience += (((0.1 + experienceBoost / 10) * autoClickBoost) / (level / 5) * experienceMulti) / level

    addVals()
}

pumpkin.addEventListener("click", () => {
    if (upgradesWindowOpen) return

    mainCurrency += 1 + pumpkinBoost * pumpkinMulti
    experience += ((1 + experienceBoost) / (level / 10) * experienceMulti)

    addVals()
})

let autoClickerInterval = null
function setAutoClickerInterval(newDelay){
    if (autoClickerInterval){
        clearInterval(autoClickerInterval)
    } 

    autoClickerInterval = setInterval(autoClicker, newDelay)
}

setAutoClickerInterval(baseClickInterval - autoClickSpeed)

function getPricePumpkin(){
    return pumpkinMulti * 1000 * pumpkinMulti * pumpkinMulti * pumpkinMulti * pumpkinMulti * pumpkinMulti
}

boostPumpkin.innerText = "Upgrade pumpkin for " + getPricePumpkin() + " pumpkins"
boostPumpkin.addEventListener("click", () => {
    if (mainCurrency >= getPricePumpkin()){
        mainCurrency -= getPricePumpkin()

        pumpkinMulti += 1
        experienceMulti += 0.1

        pumpkin.src = images + pumpkinUpgradeImages[pumpkinMulti - 2]

        boostPumpkin.innerText = "Upgrade pumpkin for " + getPricePumpkin() + " pumpkins"

        addVals()
    }
})