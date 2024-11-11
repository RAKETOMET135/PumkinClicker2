const pumpkin = document.querySelector("#pumpkin")
const mainCurrencyDisplay = document.querySelector("#main-currency")
const expMover = document.querySelector("#exp-mover")
const expLevel = document.querySelector("#exp-level")
const upgradeWindow = document.querySelector("#upgrades-window")
const boostPumpkin = document.querySelector("#boost-pumpkin")
const upgradeTree = document.querySelector("#upgrade-tree")
const exitUpgrades = document.querySelector("#exit-upgrades")
const buttonHolder = document.querySelector("#button-holder")

const images = "PumpkinImages/"
const pumpkinUpgradeImages = ["Upgrade1Pumpkin.png", "Upgrade2Pumpkin.png", "Upgrade3Pumpkin.png", "Upgrade4Pumpkin.png", "Upgrade5Pumpkin.png", "Upgrade6Pumpkin.png",
    "Upgrade7Pumpkin.png", "Upgrade8Pumpkin.png", "Upgrade9Pumpkin.png", "Upgrade10Pumpkin.png", "Upgrade11Pumpkin.png", "Upgrade12Pumpkin.png", "Upgrade13Pumpkin.png",
    "Upgrade14Pumpkin.png", "Upgrade15Pumpkin.png"
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

let goldenPumpkin = false
let goldenPumpkinDelay = 20
let goldenPumpkinMeter = 0

let diamondPumpkin = false
let diamondPumpkinDelay = 500
let diamondPumpkinMeter = 0

let canAutoclicker = false
let autoClickerClicksMulti = 1
let autoClickerExpMulti = 1

let upgradeTreePumpkinBoost = 1
let upgradeTreeExperienceBoost = 1

let doubleClickChance = 0
let tripleClickChance = 0
let quadClickChance = 0

let extraAutoclickers = 1

let goldenPumpkinMulti = 1
let gainExpFromGolden = false

let goldenMulti = 1
let diamondMulti = 1

let autoclickGoldDiamondAllow = false
let autoclickGoldDiamondBoost = 1

let upgradesWindowOpen = false
let upgradeTreeWindowOpen = false

let getAllUpgrades = false

//
//

/*
autoClickBoost = 1
autoClickSpeed = 990
*/

//mainCurrency = 10000000

//
//

function AbbreviateNumber(number, abbreviations_list, numbers_after_dot){
    let converted_number
    let front_symbol = ""
    let number_string = number.toString()

    number = Math.round(number)
    number = number.toString()
    if (number.slice(0, 1) == "-"){
        front_symbol = "-"
        number = number.slice(1, number.length)
    } 

    let digits = number.length
    let num_diff_list = []
    for (let i = 1; i < 100; i++){
        let num_diff = 3 * i

        num_diff_list.push(num_diff)
    }

    if (digits > 3){
        let picked_num_diff
        number = Math.round(number)
        number = number.toString()
        digits = number.length

        for (let num_diff of num_diff_list){
            if (digits < num_diff +4 && digits > num_diff){
                picked_num_diff = num_diff
            }
        }

        let digits_to_display = digits - picked_num_diff

        converted_number = number.slice(0, digits_to_display) + "." + number.slice(digits_to_display, digits_to_display+numbers_after_dot)
        if (numbers_after_dot <= 0) converted_number = converted_number.slice(0, converted_number.length-1)

        converted_number += abbreviations_list[picked_num_diff/3 -1]
        converted_number = front_symbol + converted_number
    } else{
        converted_number = front_symbol + number_string
    }

    return converted_number
}

function a(number){
    let abbr_list = [
        "K", "M", "B", "T", "Qd", "Qi", "Sx", "Sp", "Oc", "No", "Dc", "Ud", "Dd", "Td", "Qad", "Qid", "Sxd", "Spd", "Ocd", "Nod", "Vg", "Uvg"
    ]    

    let converted_number = AbbreviateNumber(number, abbr_list, 2)

    return converted_number
}


function upgradeAction(upgradeStats0, upgradeStats1){
    if (upgradeStats0 == "pumpkins"){
        pumpkinBoost += upgradeStats1
    }
    else if (upgradeStats0 == "experience"){
        experienceBoost += upgradeStats1
    }
    else if (upgradeStats0 == "auto-pumpkins"){
        autoClickBoost += upgradeStats1
    }
    else if (upgradeStats0 == "auto-speed"){
        autoClickSpeed += upgradeStats1

        setAutoClickerInterval(baseClickInterval - autoClickSpeed)
    }
    else if (upgradeStats0 == "auto-multi"){
        autoClickMulti += upgradeStats1
    }
    else if (upgradeStats0 == "auto-support"){
        autoClickUpgradeBoost += upgradeStats1
    }
    else if (upgradeStats0 == "golden-pumpkins"){
        goldenPumpkinMulti += upgradeStats1
    }
    else if (upgradeStats0 == "golden-experience"){
        gainExpFromGolden = true
    }
}

let selectedUpgrades = []
let selectedUpgradeStats = []
function assignUpgrade(upgrade){
    let randomInteger = Math.floor(Math.random() * 4)
    /*while (selectedUpgrades.includes(randomInteger)){
        randomInteger = Math.floor(Math.random() * 1 + 1)
    }*/

    if (randomInteger === 0){
        let boost = 1 + Math.floor(pumpkinBoost/3)

        if (boost < 250){
            upgrade[0].innerText = "Clicker master"
            upgrade[1].innerText = "Gain +" + a(boost) + " more pumpkins per click"
            selectedUpgradeStats.push(["pumpkins", boost])
        }
        else{
            upgrade[0].innerText = "Clicker veteran"
            upgrade[1].innerText = "Gain 0.1% more pumpkins per golden pumpkin click"
            selectedUpgradeStats.push(["golden-pumpkins", 0.1])
        }
    }
    else if (randomInteger === 1){
        let boost = Math.floor((experienceBoost/10 + 0.25) * 100) / 100

        if (boost < 15){
            upgrade[0].innerText = "Experience master"
            upgrade[1].innerText = "Gain +" + a(boost) + " more experience per click"
            selectedUpgradeStats.push(["experience", boost])
        }
        else{
            upgrade[0].innerText = "Experience veteran"
            upgrade[1].innerText = "Gain experience from golden pumpkins"
            selectedUpgradeStats.push(["golden-experience"])
        }
    }
    else if (randomInteger === 2){
        let boost = Math.floor(1 * autoClickUpgradeBoost * 100)/100

        upgrade[0].innerText = "Autoclicker farmer"
        upgrade[1].innerText = "Gain +" + a(boost) + " pumpkins per auto click"
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
            selectedUpgradeStats.push(["auto-speed", 50])
        }
    }

    selectedUpgrades.push(randomInteger)
}
function takeUpgrade(upgradeId){
    const upgradeStats = selectedUpgradeStats[upgradeId]

    upgradeAction(upgradeStats[0], upgradeStats[1])

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
function getUpgrades(){
    selectedUpgrades = []
    selectedUpgradeStats = []
    for (let i = 0; i < upgrades.length; i++){
        const upgrade = upgrades[i]

        assignUpgrade(upgrade)
    }

    for (let i = 0; i < selectedUpgradeStats.length; i++){
        const upgradeStats = selectedUpgradeStats[i]

        upgradeAction(upgradeStats[0], upgradeStats[1])
    }
}

function addVals(){
    if (experience >= 100){
        experience = 0
        level += 1

        if (getAllUpgrades){
            getUpgrades()
        }
        else{
            renderUpgradeWindow()
        }
    }

    let displayNumber = a(mainCurrency)
    if (mainCurrency < 1000){
        displayNumber = Math.floor(mainCurrency * 100) / 100
    }

    mainCurrencyDisplay.innerText = displayNumber
    expMover.style.width = experience.toString() + "%"
    expLevel.innerText = "Level: " + level

    /*
    if (upgradeTreeWindowOpen){
        renderUpgradeTree()
    }
    */
}

function goldenPumpkinHandle(isAutoclicker){
    let gol = false
    let dia = false

    let e = getLevelE()

    if (goldenPumpkin){
        if (goldenPumpkinMeter === -1) goldenPumpkinMeter = 0
        goldenPumpkinMeter += 1

        if (goldenPumpkinMeter >= goldenPumpkinDelay){
            goldenPumpkinMeter = -1

            mainCurrency += ((1 + pumpkinBoost * pumpkinMulti * upgradeTreePumpkinBoost) * 50 * goldenPumpkinMulti * goldenMulti) * (autoclickGoldDiamondBoost + extraAutoclickers/3)

            if (gainExpFromGolden && !isAutoclicker){
                experience += (((((1 + experienceBoost) / (level / 25) * experienceMulti)) * upgradeTreeExperienceBoost) * 2.5) / e
            }

            gol = true
        }
    }
    
    if (diamondPumpkin){
        if (diamondPumpkinMeter === -1) diamondPumpkinMeter = 0
        diamondPumpkinMeter += 1

        if (diamondPumpkinMeter >= diamondPumpkinDelay){
            diamondPumpkinMeter = -1
            
            mainCurrency += ((1 + pumpkinBoost * pumpkinMulti * upgradeTreePumpkinBoost) * 10000 * diamondMulti) * (autoclickGoldDiamondBoost + extraAutoclickers/3)

            dia = true
        }
    }

    if (gol && dia){
        pumpkin.style.filter = "invert(1) sepia(1)"
    }
    else if (dia){
        pumpkin.style.filter = "invert(1)"
    }
    else if (gol){
        pumpkin.style.filter = "sepia(1)"
    }
    else{
        pumpkin.style.filter = "none"
    }
}

function doubleClick(){
    let d = 1

    if (doubleClickChance > 0){
        let rn = Math.floor(Math.random() * 100) + 1

        if (rn <= doubleClickChance){
            d *= 2
        }
    }

    if (tripleClickChance > 0){
        let rn = Math.floor(Math.random() * 100) + 1

        if (rn <= tripleClickChance){
            d *= 3
        }
    }

    if (quadClickChance > 0){
        let rn = Math.floor(Math.random() * 100) + 1

        if (rn <= quadClickChance){
            d *= 4
        }
    }

    return d
}

function getLevelE(){
    let e = 1

    if (level < 100){
        e = 1
    }
    else if (level < 1000){
        e = 100
    }
    else if (level < 10000){
        e = 10000
    }
    else if (level < 100000){
        e = 1000000
    }

    return e
}

function autoClicker(){
    if (upgradesWindowOpen || upgradeTreeWindowOpen) return
    if (!canAutoclicker) return

    let d = doubleClick()

    let e = getLevelE()

    mainCurrency += ((0 + (autoClickBoost) * autoClickMulti * pumpkinMulti * upgradeTreePumpkinBoost * autoClickerClicksMulti) * d) * extraAutoclickers
    experience += ((((((0.1 + experienceBoost / 10) * autoClickBoost) / (level / 5) * experienceMulti) / level) * upgradeTreeExperienceBoost * autoClickerExpMulti) * extraAutoclickers) / e

    if (autoclickGoldDiamondAllow){
        goldenPumpkinHandle(true)
    }

    addVals()
}

pumpkin.addEventListener("click", () => {
    if (upgradesWindowOpen || upgradeTreeWindowOpen) return

    let d = doubleClick()

    let e = getLevelE()

    mainCurrency += (1 + pumpkinBoost * pumpkinMulti * upgradeTreePumpkinBoost) * d
    experience += ((((1 + experienceBoost) / (level / 25) * experienceMulti)) * upgradeTreeExperienceBoost) / e

    goldenPumpkinHandle(false)

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

/*
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
*/

boostPumpkin.addEventListener("click", () => {
    upgradeTree.style.top = "0%"
    upgradeTreeWindowOpen = true

    renderUpgradeTree()
})
exitUpgrades.addEventListener("click", () => {
    upgradeTree.style.top = "-1000%"
    upgradeTreeWindowOpen = false
})

const treeUpgrades = [
    {
        id: 1,
        desc: "x1.1 pumpkins per click",
        price: 75,
        currency: "pumpkins",
        upgrade: ["pumpkins-multi", 1.1],
        dependencies: [],
        x: "0px",
        y: "0px",
        owned: false
    },
    {
        id: 2,
        desc: "x1.25 pumpkins per click",
        price: 500,
        currency: "pumpkins",
        upgrade: ["pumpkins-multi", 1.25],
        dependencies: [1],
        x: "0px",
        y: "-100px",
        owned: false
    },
    {
        id: 3,
        desc: "x1.5 pumpkins per click",
        price: 3750,
        currency: "pumpkins",
        upgrade: ["pumpkins-multi", 1.5],
        dependencies: [2],
        x: "0px",
        y: "-200px",
        owned: false
    },
    {
        id: 4,
        desc: "x1.75 pumpkins per click",
        price: 12000,
        currency: "pumpkins",
        upgrade: ["pumpkins-multi", 1.75],
        dependencies: [3],
        x: "0px",
        y: "-300px",
        owned: false
    },
    {
        id: 5,
        desc: "x2 pumpkins per click",
        price: 35000,
        currency: "pumpkins",
        upgrade: ["pumpkins-multi", 2],
        dependencies: [4],
        x: "0px",
        y: "-400px",
        owned: false
    },
    {
        id: 5000,
        desc: "5% chance for double clicks",
        price: 100000,
        currency: "pumpkins",
        upgrade: ["double-click", 5],
        dependencies: [5],
        x: "100px",
        y: "-400px",
        owned: false
    },
    {
        id: 5001,
        desc: "10% chance for double clicks",
        price: 300000,
        currency: "pumpkins",
        upgrade: ["double-click", 10],
        dependencies: [5000],
        x: "200px",
        y: "-400px",
        owned: false
    },
    {
        id: 5001000,
        desc: "5% chance for triple clicks",
        price: 500000,
        currency: "pumpkins",
        upgrade: ["triple-click", 5],
        dependencies: [5001],
        x: "200px",
        y: "-300px",
        owned: false
    },
    {
        id: 5001001,
        desc: "10% chance for triple clicks",
        price: 2000000,
        currency: "pumpkins",
        upgrade: ["triple-click", 10],
        dependencies: [5001000],
        x: "200px",
        y: "-200px",
        owned: false
    },
    {
        id: 5001002,
        desc: "15% chance for triple clicks",
        price: 5000000,
        currency: "pumpkins",
        upgrade: ["triple-click", 15],
        dependencies: [5001001],
        x: "300px",
        y: "-200px",
        owned: false
    },
    {
        id: 5001003,
        desc: "20% chance for triple clicks",
        price: 10000000,
        currency: "pumpkins",
        upgrade: ["triple-click", 20],
        dependencies: [5001002],
        x: "400px",
        y: "-200px",
        owned: false
    },
    {
        id: 5001004,
        desc: "25% chance for triple clicks",
        price: 25000000,
        currency: "pumpkins",
        upgrade: ["triple-click", 25],
        dependencies: [5001003],
        x: "500px",
        y: "-200px",
        owned: false
    },
    {
        id: 5001005,
        desc: "50% chance for triple clicks",
        price: 90000000,
        currency: "pumpkins",
        upgrade: ["triple-click", 50],
        dependencies: [5001004],
        x: "600px",
        y: "-200px",
        owned: false
    },
    {
        id: 5001006,
        desc: "75% chance for triple clicks",
        price: 175000000,
        currency: "pumpkins",
        upgrade: ["triple-click", 75],
        dependencies: [5001005],
        x: "700px",
        y: "-200px",
        owned: false
    },
    {
        id: 5001007,
        desc: "100% chance for triple clicks",
        price: 350000000,
        currency: "pumpkins",
        upgrade: ["triple-click", 100],
        dependencies: [5001006],
        x: "800px",
        y: "-200px",
        owned: false
    },
    {
        id: 5002,
        desc: "15% chance for double clicks",
        price: 700000,
        currency: "pumpkins",
        upgrade: ["double-click", 15],
        dependencies: [5001],
        x: "300px",
        y: "-400px",
        owned: false
    },
    {
        id: 5003,
        desc: "20% chance for double clicks",
        price: 1350000,
        currency: "pumpkins",
        upgrade: ["double-click", 20],
        dependencies: [5002],
        x: "400px",
        y: "-400px",
        owned: false
    },
    {
        id: 5004,
        desc: "25% chance for double clicks",
        price: 3000000,
        currency: "pumpkins",
        upgrade: ["double-click", 25],
        dependencies: [5003],
        x: "500px",
        y: "-400px",
        owned: false
    },
    {
        id: 5005,
        desc: "50% chance for double clicks",
        price: 10000000,
        currency: "pumpkins",
        upgrade: ["double-click", 50],
        dependencies: [5004],
        x: "600px",
        y: "-400px",
        owned: false
    },
    {
        id: 5006,
        desc: "75% chance for double clicks",
        price: 25000000,
        currency: "pumpkins",
        upgrade: ["double-click", 75],
        dependencies: [5005],
        x: "700px",
        y: "-400px",
        owned: false
    },
    {
        id: 5007,
        desc: "100% chance for double clicks",
        price: 90000000,
        currency: "pumpkins",
        upgrade: ["double-click", 100],
        dependencies: [5006],
        x: "800px",
        y: "-400px",
        owned: false
    },
    {
        id: 6,
        desc: "x2.5 pumpkins per click",
        price: 135000,
        currency: "pumpkins",
        upgrade: ["pumpkins-multi", 2.5],
        dependencies: [5],
        x: "0px",
        y: "-500px",
        owned: false
    },
    {
        id: 7,
        desc: "x3 pumpkins per click",
        price: 999999,
        currency: "pumpkins",
        upgrade: ["pumpkins-multi", 3],
        dependencies: [6],
        x: "0px",
        y: "-600px",
        owned: false
    },
    {
        id: 8,
        desc: "x4 pumpkins per click",
        price: 7500000,
        currency: "pumpkins",
        upgrade: ["pumpkins-multi", 4],
        dependencies: [7],
        x: "0px",
        y: "-700px",
        owned: false
    },
    {
        id: 9,
        desc: "x5 pumpkins per click",
        price: 22500000,
        currency: "pumpkins",
        upgrade: ["pumpkins-multi", 5],
        dependencies: [8],
        x: "0px",
        y: "-800px",
        owned: false
    },
    {
        id: 10,
        desc: "x6 pumpkins per click",
        price: 125000000,
        currency: "pumpkins",
        upgrade: ["pumpkins-multi", 6],
        dependencies: [9],
        x: "0px",
        y: "-900px",
        owned: false
    },
    {
        id: 11,
        desc: "x7 pumpkins per click",
        price: 999999999,
        currency: "pumpkins",
        upgrade: ["pumpkins-multi", 7],
        dependencies: [10],
        x: "0px",
        y: "-1000px",
        owned: false
    },
    {
        id: 12,
        desc: "x8 pumpkins per click",
        price: 3250000000,
        currency: "pumpkins",
        upgrade: ["pumpkins-multi", 8],
        dependencies: [11],
        x: "0px",
        y: "-1100px",
        owned: false
    },
    {
        id: 13,
        desc: "x9 pumpkins per click",
        price: 9999999999,
        currency: "pumpkins",
        upgrade: ["pumpkins-multi", 9],
        dependencies: [12],
        x: "0px",
        y: "-1200px",
        owned: false
    },
    {
        id: 14,
        desc: "x10 pumpkins per click",
        price: 75000000000,
        currency: "pumpkins",
        upgrade: ["pumpkins-multi", 10],
        dependencies: [13],
        x: "0px",
        y: "-1300px",
        owned: false
    },
    {
        id: 15,
        desc: "x12 pumpkins per click",
        price: 2000000000000,
        currency: "pumpkins",
        upgrade: ["pumpkins-multi", 12],
        dependencies: [14],
        x: "0px",
        y: "-1400px",
        owned: false
    },
    {
        id: 15000,
        desc: "2% chance for quad clicks",
        price: 3000000000000,
        currency: "pumpkins",
        upgrade: ["quad-click", 2],
        dependencies: [15],
        x: "100px",
        y: "-1400px",
        owned: false
    },
    {
        id: 15001,
        desc: "5% chance for quad clicks",
        price: 9000000000000,
        currency: "pumpkins",
        upgrade: ["quad-click", 5],
        dependencies: [15000],
        x: "200px",
        y: "-1400px",
        owned: false
    },
    {
        id: 15002,
        desc: "10% chance for quad clicks",
        price: 45000000000000,
        currency: "pumpkins",
        upgrade: ["quad-click", 10],
        dependencies: [15001],
        x: "300px",
        y: "-1400px",
        owned: false
    },
    {
        id: 15003,
        desc: "15% chance for quad clicks",
        price: 150_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["quad-click", 15],
        dependencies: [15002],
        x: "400px",
        y: "-1400px",
        owned: false
    },
    {
        id: 15004,
        desc: "20% chance for quad clicks",
        price: 375_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["quad-click", 20],
        dependencies: [15003],
        x: "500px",
        y: "-1400px",
        owned: false
    },
    {
        id: 15005,
        desc: "25% chance for quad clicks",
        price: 1_000_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["quad-click", 25],
        dependencies: [15004],
        x: "600px",
        y: "-1400px",
        owned: false
    },
    {
        id: 15006,
        desc: "50% chance for quad clicks",
        price: 15_000_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["quad-click", 50],
        dependencies: [15005],
        x: "700px",
        y: "-1400px",
        owned: false
    },
    {
        id: 16,
        desc: "x15 pumpkins per click",
        price: 15000000000000,
        currency: "pumpkins",
        upgrade: ["pumpkins-multi", 15],
        dependencies: [15],
        x: "0px",
        y: "-1500px",
        owned: false
    },
    {
        id: 17,
        desc: "x20 pumpkins per click",
        price: 325_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["pumpkins-multi", 20],
        dependencies: [16],
        x: "0px",
        y: "-1600px",
        owned: false
    },
    {
        id: 18,
        desc: "x25 pumpkins per click",
        price: 1_000_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["pumpkins-multi", 25],
        dependencies: [17],
        x: "0px",
        y: "-1700px",
        owned: false
    },
    {
        id: 19,
        desc: "x35 pumpkins per click",
        price: 9_000_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["pumpkins-multi", 35],
        dependencies: [18],
        x: "0px",
        y: "-1800px",
        owned: false
    },
    {
        id: 20,
        desc: "x50 pumpkins per click",
        price: 50_000_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["pumpkins-multi", 50],
        dependencies: [19],
        x: "0px",
        y: "-1900px",
        owned: false
    },
    {
        id: 100,
        desc: "Evil pumpkin",
        price: 1250,
        currency: "pumpkins",
        upgrade: ["pumpkin-skin"],
        dependencies: [1],
        x: "100px",
        y: "0px",
        owned: false
    },
    {
        id: 101,
        desc: "Suspicious pumpkin",
        price: 7500,
        currency: "pumpkins",
        upgrade: ["pumpkin-skin"],
        dependencies: [100],
        x: "200px",
        y: "0px",
        owned: false
    },
    {
        id: 101000,
        desc: "Golden pumpkin every 50 clicks",
        price: 12000,
        currency: "pumpkins",
        upgrade: ["pumpkin-golden", 50],
        dependencies: [101],
        x: "200px",
        y: "100px",
        owned: false
    },
    {
        id: 101001,
        desc: "Golden pumpkin every 25 clicks",
        price: 75000,
        currency: "pumpkins",
        upgrade: ["pumpkin-golden", 25],
        dependencies: [101000],
        x: "200px",
        y: "200px",
        owned: false
    },
    {
        id: 101001000,
        desc: "Gain 1.5x from golden pumpkins",
        price: 8000000,
        currency: "pumpkins",
        upgrade: ["golden-multi", 1.5],
        dependencies: [101001],
        x: "200px",
        y: "300px",
        owned: false
    },
    {
        id: 101001001,
        desc: "Gain 2x from golden pumpkins",
        price: 100000000,
        currency: "pumpkins",
        upgrade: ["golden-multi", 2],
        dependencies: [101001000],
        x: "200px",
        y: "400px",
        owned: false
    },
    {
        id: 101001002,
        desc: "Gain 3x from golden pumpkins",
        price: 1000000000,
        currency: "pumpkins",
        upgrade: ["golden-multi", 3],
        dependencies: [101001001],
        x: "200px",
        y: "500px",
        owned: false
    },
    {
        id: 101001003,
        desc: "Gain 4x from golden pumpkins",
        price: 10000000000,
        currency: "pumpkins",
        upgrade: ["golden-multi", 4],
        dependencies: [101001002],
        x: "200px",
        y: "600px",
        owned: false
    },
    {
        id: 101001004,
        desc: "Gain 5x from golden pumpkins",
        price: 100000000000,
        currency: "pumpkins",
        upgrade: ["golden-multi", 5],
        dependencies: [101001003],
        x: "200px",
        y: "700px",
        owned: false
    },
    {
        id: 101001005,
        desc: "Gain 10x from golden pumpkins",
        price: 2_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["golden-multi", 10],
        dependencies: [101001004],
        x: "200px",
        y: "800px",
        owned: false
    },
    {
        id: 101001006,
        desc: "Gain 15x from golden pumpkins",
        price: 15_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["golden-multi", 15],
        dependencies: [101001005],
        x: "200px",
        y: "900px",
        owned: false
    },
    {
        id: 101001007,
        desc: "Gain 20x from golden pumpkins",
        price: 400_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["golden-multi", 20],
        dependencies: [101001006],
        x: "200px",
        y: "1000px",
        owned: false
    },
    {
        id: 101001008,
        desc: "Gain 35x from golden pumpkins",
        price: 2_000_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["golden-multi", 35],
        dependencies: [101001007],
        x: "200px",
        y: "1100px",
        owned: false
    },
    {
        id: 101001009,
        desc: "Gain 50x from golden pumpkins",
        price: 30_000_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["golden-multi", 50],
        dependencies: [101001008],
        x: "200px",
        y: "1200px",
        owned: false
    },
    {
        id: 101002,
        desc: "Golden pumpkin every 10 clicks",
        price: 300000,
        currency: "pumpkins",
        upgrade: ["pumpkin-golden", 10],
        dependencies: [101001],
        x: "300px",
        y: "200px",
        owned: false
    },
    {
        id: 101003,
        desc: "Golden pumpkin every 5 clicks",
        price: 2000000,
        currency: "pumpkins",
        upgrade: ["pumpkin-golden", 5],
        dependencies: [101002],
        x: "400px",
        y: "200px",
        owned: false
    },
    {
        id: 101004,
        desc: "Golden pumpkin every 2 clicks",
        price: 5000000,
        currency: "pumpkins",
        upgrade: ["pumpkin-golden", 2],
        dependencies: [101003],
        x: "500px",
        y: "200px",
        owned: false
    },
    {
        id: 101004000,
        desc: "Diamond pumpkin every 500 clicks",
        price: 85000000,
        currency: "pumpkins",
        upgrade: ["pumpkin-diamond", 500],
        dependencies: [101004],
        x: "500px",
        y: "300px",
        owned: false
    },
    {
        id: 101004001,
        desc: "Diamond pumpkin every 350 clicks",
        price: 450000000,
        currency: "pumpkins",
        upgrade: ["pumpkin-diamond", 350],
        dependencies: [101004000],
        x: "500px",
        y: "400px",
        owned: false
    },
    {
        id: 101004001000,
        desc: "Gain 1.5x from diamond pumpkins",
        price: 12_000_000_000,
        currency: "pumpkins",
        upgrade: ["diamond-multi", 1.5],
        dependencies: [101004001],
        x: "500px",
        y: "500px",
        owned: false
    },
    {
        id: 101004001001,
        desc: "Gain 2x from diamond pumpkins",
        price: 25_000_000_000,
        currency: "pumpkins",
        upgrade: ["diamond-multi", 2],
        dependencies: [101004001000],
        x: "500px",
        y: "600px",
        owned: false
    },
    {
        id: 101004001002,
        desc: "Gain 3x from diamond pumpkins",
        price: 90_000_000_000,
        currency: "pumpkins",
        upgrade: ["diamond-multi", 3],
        dependencies: [101004001001],
        x: "500px",
        y: "700px",
        owned: false
    },
    {
        id: 101004001003,
        desc: "Gain 4x from diamond pumpkins",
        price: 150_000_000_000,
        currency: "pumpkins",
        upgrade: ["diamond-multi", 4],
        dependencies: [101004001002],
        x: "500px",
        y: "800px",
        owned: false
    },
    {
        id: 101004001004,
        desc: "Gain 5x from diamond pumpkins",
        price: 350_000_000_000,
        currency: "pumpkins",
        upgrade: ["diamond-multi", 5],
        dependencies: [101004001003],
        x: "500px",
        y: "900px",
        owned: false
    },
    {
        id: 101004001005,
        desc: "Gain 10x from diamond pumpkins",
        price: 5_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["diamond-multi", 10],
        dependencies: [101004001004],
        x: "500px",
        y: "1000px",
        owned: false
    },
    {
        id: 101004001006,
        desc: "Gain 15x from diamond pumpkins",
        price: 5_000_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["diamond-multi", 15],
        dependencies: [101004001005],
        x: "500px",
        y: "1100px",
        owned: false
    },
    {
        id: 101004001007,
        desc: "Gain 20x from diamond pumpkins",
        price: 30_000_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["diamond-multi", 20],
        dependencies: [101004001006],
        x: "500px",
        y: "1200px",
        owned: false
    },
    {
        id: 101004002,
        desc: "Diamond pumpkin every 150 clicks",
        price: 1000000000,
        currency: "pumpkins",
        upgrade: ["pumpkin-diamond", 150],
        dependencies: [101004001],
        x: "600px",
        y: "400px",
        owned: false
    },
    {
        id: 101004003,
        desc: "Diamond pumpkin every 75 clicks",
        price: 3000000000,
        currency: "pumpkins",
        upgrade: ["pumpkin-diamond", 75],
        dependencies: [101004002],
        x: "700px",
        y: "400px",
        owned: false
    },
    {
        id: 101004004,
        desc: "Diamond pumpkin every 40 clicks",
        price: 2000000000000,
        currency: "pumpkins",
        upgrade: ["pumpkin-diamond", 40],
        dependencies: [101004003],
        x: "800px",
        y: "400px",
        owned: false
    },
    {
        id: 101004005,
        desc: "Diamond pumpkin every 15 clicks",
        price: 20000000000000,
        currency: "pumpkins",
        upgrade: ["pumpkin-diamond", 15],
        dependencies: [101004004],
        x: "900px",
        y: "400px",
        owned: false
    },
    {
        id: 101004006,
        desc: "Diamond pumpkin every 8 clicks",
        price: 135_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["pumpkin-diamond", 8],
        dependencies: [101004005],
        x: "1000px",
        y: "400px",
        owned: false
    },
    {
        id: 101004007,
        desc: "Diamond pumpkin every 3 clicks",
        price: 1_000_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["pumpkin-diamond", 3],
        dependencies: [101004006],
        x: "1100px",
        y: "400px",
        owned: false
    },
    {
        id: 101004008,
        desc: "Diamond pumpkin every click",
        price: 7_500_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["pumpkin-diamond", 1],
        dependencies: [101004007],
        x: "1200px",
        y: "400px",
        owned: false
    },
    {
        id: 101005,
        desc: "Golden pumpkin every click",
        price: 25000000,
        currency: "pumpkins",
        upgrade: ["pumpkin-golden", 1],
        dependencies: [101004],
        x: "600px",
        y: "200px",
        owned: false
    },
    {
        id: 102,
        desc: "Shocked pumpkin",
        price: 45000,
        currency: "pumpkins",
        upgrade: ["pumpkin-skin"],
        dependencies: [101],
        x: "300px",
        y: "0px",
        owned: false
    },
    {
        id: 103,
        desc: "Sad pumpkin",
        price: 350000,
        currency: "pumpkins",
        upgrade: ["pumpkin-skin"],
        dependencies: [102],
        x: "400px",
        y: "0px",
        owned: false
    },
    {
        id: 104,
        desc: "Shy pumpkin",
        price: 2500000,
        currency: "pumpkins",
        upgrade: ["pumpkin-skin"],
        dependencies: [103],
        x: "500px",
        y: "0px",
        owned: false
    },
    {
        id: 105,
        desc: "Insane pumpkin",
        price: 7500000,
        currency: "pumpkins",
        upgrade: ["pumpkin-skin"],
        dependencies: [104],
        x: "600px",
        y: "0px",
        owned: false
    },
    {
        id: 106,
        desc: "Crazy pumpkin",
        price: 25000000,
        currency: "pumpkins",
        upgrade: ["pumpkin-skin"],
        dependencies: [105],
        x: "700px",
        y: "0px",
        owned: false
    },
    {
        id: 107,
        desc: "Smile pumpkin",
        price: 325000000,
        currency: "pumpkins",
        upgrade: ["pumpkin-skin"],
        dependencies: [106],
        x: "800px",
        y: "0px",
        owned: false
    },
    {
        id: 108,
        desc: "Witch pumpkin",
        price: 1500000000,
        currency: "pumpkins",
        upgrade: ["pumpkin-skin"],
        dependencies: [107],
        x: "900px",
        y: "0px",
        owned: false
    },
    {
        id: 109,
        desc: "Farmer pumpkin",
        price: 15000000000,
        currency: "pumpkins",
        upgrade: ["pumpkin-skin"],
        dependencies: [108],
        x: "1000px",
        y: "0px",
        owned: false
    },
    {
        id: 110,
        desc: "Wizard pumpkin",
        price: 135000000000,
        currency: "pumpkins",
        upgrade: ["pumpkin-skin"],
        dependencies: [109],
        x: "1100px",
        y: "0px",
        owned: false
    },
    {
        id: 111,
        desc: "Scary pumpkin",
        price: 15000000000000,
        currency: "pumpkins",
        upgrade: ["pumpkin-skin"],
        dependencies: [110],
        x: "1200px",
        y: "0px",
        owned: false
    },
    {
        id: 112,
        desc: "Demon pumpkin",
        price: 400_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["pumpkin-skin"],
        dependencies: [111],
        x: "1300px",
        y: "0px",
        owned: false
    },
    {
        id: 113,
        desc: "Sinister pumpkin",
        price: 2_500_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["pumpkin-skin"],
        dependencies: [112],
        x: "1400px",
        y: "0px",
        owned: false
    },
    {
        id: 114,
        desc: "Halloween pumpkin",
        price: 32_500_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["pumpkin-skin"],
        dependencies: [113],
        x: "1500px",
        y: "0px",
        owned: false
    },
    {
        id: 200,
        desc: "Autoclicker",
        price: 250,
        currency: "pumpkins",
        upgrade: ["autoclicker-unlock"],
        dependencies: [1],
        x: "-100px",
        y: "0px",
        owned: false
    },
    {
        id: 201,
        desc: "x1.1 autoclicker clicks",
        price: 750,
        currency: "pumpkins",
        upgrade: ["autoclicker-clicks", 1.1],
        dependencies: [200],
        x: "-200px",
        y: "0px",
        owned: false
    },
    {
        id: 201000,
        desc: "x1.1 autoclicker experience",
        price: 4000,
        currency: "pumpkins",
        upgrade: ["autoclicker-experience", 1.1],
        dependencies: [201],
        x: "-200px",
        y: "-100px",
        owned: false
    },
    {
        id: 201001,
        desc: "x1.2 autoclicker experience",
        price: 9999,
        currency: "pumpkins",
        upgrade: ["autoclicker-experience", 1.2],
        dependencies: [201000],
        x: "-200px",
        y: "-200px",
        owned: false
    },
    {
        id: 201002,
        desc: "x1.35 autoclicker experience",
        price: 77777,
        currency: "pumpkins",
        upgrade: ["autoclicker-experience", 1.35],
        dependencies: [201001],
        x: "-300px",
        y: "-200px",
        owned: false
    },
    {
        id: 201003,
        desc: "x1.5 autoclicker experience",
        price: 888888,
        currency: "pumpkins",
        upgrade: ["autoclicker-experience", 1.5],
        dependencies: [201002],
        x: "-400px",
        y: "-200px",
        owned: false
    },
    {
        id: 201004,
        desc: "x1.75 autoclicker experience",
        price: 1444444,
        currency: "pumpkins",
        upgrade: ["autoclicker-experience", 1.75],
        dependencies: [201003],
        x: "-500px",
        y: "-200px",
        owned: false
    },
    {
        id: 201005,
        desc: "x2 autoclicker experience",
        price: 3333333,
        currency: "pumpkins",
        upgrade: ["autoclicker-experience", 2],
        dependencies: [201004],
        x: "-600px",
        y: "-200px",
        owned: false
    },
    {
        id: 201006,
        desc: "x2.5 autoclicker experience",
        price: 1000000000000,
        currency: "pumpkins",
        upgrade: ["autoclicker-experience", 2.5],
        dependencies: [201005],
        x: "-700px",
        y: "-200px",
        owned: false
    },
    {
        id: 201007,
        desc: "x3 autoclicker experience",
        price: 9000000000000,
        currency: "pumpkins",
        upgrade: ["autoclicker-experience", 3],
        dependencies: [201006],
        x: "-700px",
        y: "-300px",
        owned: false
    },
    {
        id: 201008,
        desc: "x10 autoclicker experience",
        price: 75_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["autoclicker-experience", 10],
        dependencies: [201007],
        x: "-700px",
        y: "-400px",
        owned: false
    },
    {
        id: 201009,
        desc: "x20 autoclicker experience",
        price: 1_000_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["autoclicker-experience", 20],
        dependencies: [201008],
        x: "-700px",
        y: "-500px",
        owned: false
    },
    {
        id: 202,
        desc: "x1.2 autoclicker clicks",
        price: 3500,
        currency: "pumpkins",
        upgrade: ["autoclicker-clicks", 1.2],
        dependencies: [201],
        x: "-300px",
        y: "0px",
        owned: false
    },
    {
        id: 203,
        desc: "x1.3 autoclicker clicks",
        price: 45000,
        currency: "pumpkins",
        upgrade: ["autoclicker-clicks", 1.3],
        dependencies: [202],
        x: "-400px",
        y: "0px",
        owned: false
    },
    {
        id: 204,
        desc: "x1.4 autoclicker clicks",
        price: 666666,
        currency: "pumpkins",
        upgrade: ["autoclicker-clicks", 1.4],
        dependencies: [203],
        x: "-500px",
        y: "0px",
        owned: false
    },
    {
        id: 205,
        desc: "x1.5 autoclicker clicks",
        price: 3333333,
        currency: "pumpkins",
        upgrade: ["autoclicker-clicks", 1.5],
        dependencies: [204],
        x: "-600px",
        y: "0px",
        owned: false
    },
    {
        id: 206,
        desc: "x1.75 autoclicker clicks",
        price: 11111111,
        currency: "pumpkins",
        upgrade: ["autoclicker-clicks", 1.75],
        dependencies: [205],
        x: "-700px",
        y: "0px",
        owned: false
    },
    {
        id: 207,
        desc: "x2 autoclicker clicks",
        price: 44444444,
        currency: "pumpkins",
        upgrade: ["autoclicker-clicks", 2],
        dependencies: [206],
        x: "-800px",
        y: "0px",
        owned: false
    },
    {
        id: 207000,
        desc: "Autocollect all 3 level upgrades",
        price: 777777777,
        currency: "pumpkins",
        upgrade: ["autocollect"],
        dependencies: [207],
        x: "-800px",
        y: "100px",
        owned: false
    },
    {
        id: 208,
        desc: "x2.5 autoclicker clicks",
        price: 99999999,
        currency: "pumpkins",
        upgrade: ["autoclicker-clicks", 2.5],
        dependencies: [207],
        x: "-900px",
        y: "0px",
        owned: false
    },
    {
        id: 208000,
        desc: "2nd autoclicker",
        price: 135000000,
        currency: "pumpkins",
        upgrade: ["autoclicker-extra", 2],
        dependencies: [208],
        x: "-900px",
        y: "-100px",
        owned: false
    },
    {
        id: 208001,
        desc: "3rd autoclicker",
        price: 10_000_000_000,
        currency: "pumpkins",
        upgrade: ["autoclicker-extra", 3],
        dependencies: [208000],
        x: "-900px",
        y: "-200px",
        owned: false
    },
    {
        id: 208001000,
        desc: "Autoclickers are stronger",
        price: 25_000_000_000,
        currency: "pumpkins",
        upgrade: ["autoclicker-gold-diamond"],
        dependencies: [208001],
        x: "-1000px",
        y: "-200px",
        owned: false
    },
    {
        id: 208001001,
        desc: "Autoclickers are more stronger",
        price: 125_000_000_000,
        currency: "pumpkins",
        upgrade: ["autoclicker-gold-diamond-boost", 1.5],
        dependencies: [208001000],
        x: "-1100px",
        y: "-200px",
        owned: false
    },
    {
        id: 208001002,
        desc: "Autoclickers are more powerfull",
        price: 1_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["autoclicker-gold-diamond-boost", 2],
        dependencies: [208001001],
        x: "-1200px",
        y: "-200px",
        owned: false
    },
    {
        id: 208001003,
        desc: "Autoclickers are insane",
        price: 7_500_000_000_000,
        currency: "pumpkins",
        upgrade: ["autoclicker-gold-diamond-boost", 3],
        dependencies: [208001002],
        x: "-1300px",
        y: "-200px",
        owned: false
    },
    {
        id: 208001004,
        desc: "Autoclickers are more insane",
        price: 25_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["autoclicker-gold-diamond-boost", 4],
        dependencies: [208001003],
        x: "-1400px",
        y: "-200px",
        owned: false
    },
    {
        id: 208001005,
        desc: "Autoclickers are unreal",
        price: 75_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["autoclicker-gold-diamond-boost", 5],
        dependencies: [208001004],
        x: "-1500px",
        y: "-200px",
        owned: false
    },
    {
        id: 208001006,
        desc: "Autoclickers are godlike",
        price: 300_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["autoclicker-gold-diamond-boost", 6],
        dependencies: [208001005],
        x: "-1600px",
        y: "-200px",
        owned: false
    },
    {
        id: 208001007,
        desc: "Autoclickers are more godlike",
        price: 5_000_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["autoclicker-gold-diamond-boost", 8],
        dependencies: [208001006],
        x: "-1700px",
        y: "-200px",
        owned: false
    },
    {
        id: 208001008,
        desc: "Autoclickers are superior",
        price: 30_000_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["autoclicker-gold-diamond-boost", 10],
        dependencies: [208001007],
        x: "-1800px",
        y: "-200px",
        owned: false
    },
    {
        id: 208002,
        desc: "4th autoclicker",
        price: 50_000_000_000,
        currency: "pumpkins",
        upgrade: ["autoclicker-extra", 4],
        dependencies: [208001],
        x: "-900px",
        y: "-300px",
        owned: false
    },
    {
        id: 208003,
        desc: "5th autoclicker",
        price: 1_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["autoclicker-extra", 5],
        dependencies: [208002],
        x: "-900px",
        y: "-400px",
        owned: false
    },
    {
        id: 208004,
        desc: "6th autoclicker",
        price: 100_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["autoclicker-extra", 6],
        dependencies: [208003],
        x: "-900px",
        y: "-500px",
        owned: false
    },
    {
        id: 208005,
        desc: "7th autoclicker",
        price: 7_500_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["autoclicker-extra", 7],
        dependencies: [208004],
        x: "-900px",
        y: "-600px",
        owned: false
    },
    {
        id: 208006,
        desc: "8th autoclicker",
        price: 27_500_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["autoclicker-extra", 8],
        dependencies: [208005],
        x: "-900px",
        y: "-700px",
        owned: false
    },
    {
        id: 209,
        desc: "x3 autoclicker clicks",
        price: 999999999,
        currency: "pumpkins",
        upgrade: ["autoclicker-clicks", 3],
        dependencies: [208],
        x: "-1000px",
        y: "0px",
        owned: false
    },
    {
        id: 210,
        desc: "x3.5 autoclicker clicks",
        price: 9999999999,
        currency: "pumpkins",
        upgrade: ["autoclicker-clicks", 3.5],
        dependencies: [209],
        x: "-1100px",
        y: "0px",
        owned: false
    },
    {
        id: 211,
        desc: "x4 autoclicker clicks",
        price: 99999999999,
        currency: "pumpkins",
        upgrade: ["autoclicker-clicks", 4],
        dependencies: [210],
        x: "-1200px",
        y: "0px",
        owned: false
    },
    {
        id: 212,
        desc: "x5 autoclicker clicks",
        price: 4000000000000,
        currency: "pumpkins",
        upgrade: ["autoclicker-clicks", 5],
        dependencies: [211],
        x: "-1300px",
        y: "0px",
        owned: false
    },
    {
        id: 213,
        desc: "x6 autoclicker clicks",
        price: 50_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["autoclicker-clicks", 6],
        dependencies: [212],
        x: "-1400px",
        y: "0px",
        owned: false
    },
    {
        id: 214,
        desc: "x20 autoclicker clicks",
        price: 5_000_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["autoclicker-clicks", 20],
        dependencies: [213],
        x: "-1500px",
        y: "0px",
        owned: false
    },
    {
        id: 300,
        desc: "x1.25 experience per click",
        price: 350,
        currency: "pumpkins",
        upgrade: ["experience-multi", 1.25],
        dependencies: [1],
        x: "0px",
        y: "100px",
        owned: false
    },
    {
        id: 301,
        desc: "x1.5 experience per click",
        price: 999,
        currency: "pumpkins",
        upgrade: ["experience-multi", 1.5],
        dependencies: [300],
        x: "0px",
        y: "200px",
        owned: false
    },
    {
        id: 302,
        desc: "x1.75 experience per click",
        price: 3333,
        currency: "pumpkins",
        upgrade: ["experience-multi", 1.75],
        dependencies: [301],
        x: "0px",
        y: "300px",
        owned: false
    },
    {
        id: 303,
        desc: "x2 experience per click",
        price: 44444,
        currency: "pumpkins",
        upgrade: ["experience-multi", 2],
        dependencies: [302],
        x: "0px",
        y: "400px",
        owned: false
    },
    {
        id: 304,
        desc: "x2.5 experience per click",
        price: 555555,
        currency: "pumpkins",
        upgrade: ["experience-multi", 2.5],
        dependencies: [303],
        x: "0px",
        y: "500px",
        owned: false
    },
    {
        id: 305,
        desc: "x3 experience per click",
        price: 6666666,
        currency: "pumpkins",
        upgrade: ["experience-multi", 3],
        dependencies: [304],
        x: "0px",
        y: "600px",
        owned: false
    },
    {
        id: 306,
        desc: "x3.5 experience per click",
        price: 777777777,
        currency: "pumpkins",
        upgrade: ["experience-multi", 3.5],
        dependencies: [305],
        x: "0px",
        y: "700px",
        owned: false
    },
    {
        id: 307,
        desc: "x4 experience per click",
        price: 5000000000000,
        currency: "pumpkins",
        upgrade: ["experience-multi", 4],
        dependencies: [306],
        x: "0px",
        y: "800px",
        owned: false
    },
    {
        id: 308,
        desc: "x5 experience per click",
        price: 50000000000000,
        currency: "pumpkins",
        upgrade: ["experience-multi", 5],
        dependencies: [307],
        x: "0px",
        y: "900px",
        owned: false
    },
    {
        id: 309,
        desc: "x6 experience per click",
        price: 500_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["experience-multi", 6],
        dependencies: [308],
        x: "0px",
        y: "1000px",
        owned: false
    },
    {
        id: 310,
        desc: "x7 experience per click",
        price: 1_000_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["experience-multi", 7],
        dependencies: [309],
        x: "0px",
        y: "1100px",
        owned: false
    },
    {
        id: 311,
        desc: "x10 experience per click",
        price: 9_000_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["experience-multi", 10],
        dependencies: [310],
        x: "0px",
        y: "1200px",
        owned: false
    },
    {
        id: 312,
        desc: "x15 experience per click",
        price: 25_000_000_000_000_000,
        currency: "pumpkins",
        upgrade: ["experience-multi", 15],
        dependencies: [311],
        x: "0px",
        y: "1300px",
        owned: false
    },
]

function canRenderUpgrade(treeUpgrade){
    if (treeUpgrade.dependencies == []) return true

    let can = true
    treeUpgrade.dependencies.forEach(dependUpgrade => {
        treeUpgrades.forEach(_treeUpgrade => {
            if (_treeUpgrade.id === dependUpgrade){
                if (!_treeUpgrade.owned) can = false
            }
        })
    })

    return can
}

function getRenderButtonColor(treeUpgrade){
    let color = "rgb(255, 0, 0)"

    if (treeUpgrade.owned){
        color = "rgb(255, 255, 255)"
    }
    else{
        if (treeUpgrade.currency === "pumpkins"){
            if (mainCurrency >= treeUpgrade.price) color = "rgb(0, 255, 0)"
        }
    }

    return color
}

function buyRenderButton(treeUpgrade){
    let success = false

    if (!treeUpgrade.owned){
        if (treeUpgrade.currency === "pumpkins"){
            if (mainCurrency >= treeUpgrade.price){
                mainCurrency -= treeUpgrade.price

                if (treeUpgrade.upgrade[0] === "pumpkins-multi"){
                    upgradeTreePumpkinBoost = treeUpgrade.upgrade[1]
                }
                else if (treeUpgrade.upgrade[0] === "pumpkin-skin"){
                    pumpkinMulti += 1
                    experienceMulti += 0.1

                    pumpkin.src = images + pumpkinUpgradeImages[pumpkinMulti - 2]
                }
                else if (treeUpgrade.upgrade[0] === "autoclicker-unlock"){
                    canAutoclicker = true
                    autoClickBoost += 1
                }
                else if (treeUpgrade.upgrade[0] === "experience-multi"){
                    upgradeTreeExperienceBoost = treeUpgrade.upgrade[1]
                }
                else if (treeUpgrade.upgrade[0] === "pumpkin-golden"){
                    goldenPumpkinDelay = treeUpgrade.upgrade[1]
                    goldenPumpkin = true
                }
                else if (treeUpgrade.upgrade[0] === "pumpkin-diamond"){
                    diamondPumpkinDelay = treeUpgrade.upgrade[1]
                    diamondPumpkin = true
                }
                else if (treeUpgrade.upgrade[0] === "autoclicker-clicks"){
                    autoClickerClicksMulti = treeUpgrade.upgrade[1]
                }
                else if (treeUpgrade.upgrade[0] === "autoclicker-experience"){
                    autoClickerExpMulti = treeUpgrade.upgrade[1]
                }
                else if (treeUpgrade.upgrade[0] === "double-click"){
                    doubleClickChance = treeUpgrade.upgrade[1]
                }
                else if (treeUpgrade.upgrade[0] === "triple-click"){
                    tripleClickChance = treeUpgrade.upgrade[1]
                }
                else if (treeUpgrade.upgrade[0] === "quad-click"){
                    quadClickChance = treeUpgrade.upgrade[1]
                }
                else if (treeUpgrade.upgrade[0] === "autoclicker-extra"){
                    extraAutoclickers = treeUpgrade.upgrade[1]
                }
                else if (treeUpgrade.upgrade[0] === "autocollect"){
                    getAllUpgrades = true
                }
                else if (treeUpgrade.upgrade[0] === "golden-multi"){
                    goldenMulti = treeUpgrade.upgrade[1]
                }
                else if (treeUpgrade.upgrade[0] === "diamond-multi"){
                    diamondMulti = treeUpgrade.upgrade[1]
                }
                else if (treeUpgrade.upgrade[0] === "autoclicker-gold-diamond"){
                    autoclickGoldDiamondAllow = true
                }
                else if (treeUpgrade.upgrade[0] === "autoclicker-gold-diamond-boost"){
                    autoclickGoldDiamondBoost = treeUpgrade.upgrade[1]
                }
                else{
                    console.log("incorrect upgrade name")
                }

                treeUpgrade.owned = true
                success = true
            }
        }

        saveData()
    }

    addVals()

    return success
}

let currentRenderButtons = []
function renderUpgradeTree(){
    currentRenderButtons.forEach(renderButton => {
        renderButton.remove()
    })
    currentRenderButtons = []

    treeUpgrades.forEach(treeUpgrade => {
        let canRender = canRenderUpgrade(treeUpgrade)

        if (canRender){
            let renderButton = document.createElement("button")
            buttonHolder.append(renderButton)
            currentRenderButtons.push(renderButton)

            renderButton.classList = "tree-button"
            renderButton.style.top = (parseFloat(treeUpgrade.y.slice(0, treeUpgrade.y.length - 2)) * 1.5).toString() + "px"
            renderButton.style.left = (parseFloat(treeUpgrade.x.slice(0, treeUpgrade.x.length - 2)) * 1.5).toString() + "px"

            renderButton.innerText = treeUpgrade.desc + "\n\n"

            let span = document.createElement("span")
            renderButton.append(span)
            span.innerText = a(treeUpgrade.price) + " " + treeUpgrade.currency
            span.style.color = "rgb(255, 94, 0)"
            //span.style.fontFamily = "Anton SC"
            span.style.fontSize = "20px"

            renderButton.style.backgroundColor = getRenderButtonColor(treeUpgrade)

            renderButton.addEventListener("click", () => {
                let success = buyRenderButton(treeUpgrade)

                if (success){
                    renderUpgradeTree()
                }
            })

            renderButton.addEventListener("mouseenter", () => {
                renderButton.style.zIndex = 10
            })

            renderButton.addEventListener("mouseleave", () => {
                renderButton.style.zIndex = 0
            })
        }
    })
}

let isMouseDown = false
let prevMouseX
let prevMouseY
upgradeTree.addEventListener("mousedown", (e) => {
    isMouseDown = true

    prevMouseX = e.clientX
    prevMouseY = e.clientY
})
upgradeTree.addEventListener("mouseup", () => {
    isMouseDown = false
})
document.addEventListener("mousemove", (e) => {
    if (isMouseDown){
        const mouseX = e.clientX
        const mouseY = e.clientY

        let moveX = mouseX - prevMouseX
        let moveY = mouseY - prevMouseY

        /*
        if (moveX > 0) moveX = 1
        if (moveX < 0) moveX = -1
        if (moveY > 0) moveY = 1
        if (moveY < 0) moveY = -1
        */

        prevMouseX = mouseX
        prevMouseY = mouseY

        const computedButtonHolderStyle = window.getComputedStyle(buttonHolder)

        let left = parseFloat(computedButtonHolderStyle.left.slice(0, computedButtonHolderStyle.left.length - 2)) || 0
        let top = parseFloat(computedButtonHolderStyle.top.slice(0, computedButtonHolderStyle.top.length - 2)) || 0

        buttonHolder.style.left = (left + moveX).toString() + "px"
        buttonHolder.style.top = (top + moveY).toString() + "px"
    }
})

loadData()
addVals()

function saveData(){
    let upgradesData = []

    treeUpgrades.forEach(treeUpgrade => {
        let object = {
            _id: treeUpgrade.id,
            _owned: treeUpgrade.owned
        }

        upgradesData.push(object)
    })

    let dataObject = {
        _mainCurrency: mainCurrency,
        _experience: experience,
        _level: level,
        _pumpkinBoost: pumpkinBoost,
        _pumpkinMulti: pumpkinMulti,
        _experienceBoost: experienceBoost,
        _experienceMulti: experienceMulti,
        _autoClickBoost: autoClickBoost,
        _autoClickSpeed: autoClickSpeed,
        _autoClickMulti: autoClickMulti,
        _autoClickUpgradeBoost: autoClickUpgradeBoost,
        _goldenPumpkin: goldenPumpkin,
        _goldenPumpkinDelay: goldenPumpkinDelay,
        _goldenPumpkinMeter: goldenPumpkinMeter,
        _diamondPumpkin: diamondPumpkin,
        _diamondPumpkinDelay: diamondPumpkinDelay,
        _diamondPumpkinMeter: diamondPumpkinMeter,
        _canAutoclicker: canAutoclicker,
        _autoClickerClicksMulti: autoClickerClicksMulti,
        _autoClickerExpMulti: autoClickerExpMulti,
        _upgradeTreePumpkinBoost: upgradeTreePumpkinBoost,
        _upgradeTreeExperienceBoost: upgradeTreeExperienceBoost,
        _doubleClickChance: doubleClickChance,
        _tripleClickChance: tripleClickChance,
        _quadClickChance: quadClickChance,
        _extraAutoclickers: extraAutoclickers,
        _goldenPumpkinMulti: goldenPumpkinMulti,
        _gainExpFromGolden: gainExpFromGolden,
        _goldenMulti: goldenMulti,
        _diamondMulti: diamondMulti,
        _autoclickGoldDiamondAllow: autoclickGoldDiamondAllow,
        _autoclickGoldDiamondBoost: autoclickGoldDiamondBoost,
        _getAllUpgrades: getAllUpgrades,
        _upgradesData: upgradesData,
        _upgradeSelection: upgradesWindowOpen
    }

    localStorage.setItem("pumpkinClicker2Data", JSON.stringify(dataObject))
}

function loadData(){
    const storedData = JSON.parse(localStorage.getItem("pumpkinClicker2Data"))

    if (!storedData) return

    mainCurrency = storedData._mainCurrency
    experience = storedData._experience
    level = storedData._level
    pumpkinBoost = storedData._pumpkinBoost
    pumpkinMulti = storedData._pumpkinMulti
    experienceBoost = storedData._experienceBoost
    experienceMulti = storedData._experienceMulti
    autoClickBoost = storedData._autoClickBoost
    autoClickSpeed = storedData._autoClickSpeed
    autoClickMulti = storedData._autoClickMulti
    autoClickUpgradeBoost = storedData._autoClickUpgradeBoost
    goldenPumpkin = storedData._goldenPumpkin
    goldenPumpkinDelay = storedData._goldenPumpkinDelay
    goldenPumpkinMeter = storedData._goldenPumpkinMeter
    diamondPumpkin = storedData._diamondPumpkin
    diamondPumpkinDelay = storedData._diamondPumpkinDelay
    diamondPumpkinMeter = storedData._diamondPumpkinMeter
    canAutoclicker = storedData._canAutoclicker
    autoClickerClicksMulti = storedData._autoClickerClicksMulti
    autoClickerExpMulti = storedData._autoClickerExpMulti
    upgradeTreePumpkinBoost = storedData._upgradeTreePumpkinBoost
    upgradeTreeExperienceBoost = storedData._upgradeTreeExperienceBoost
    doubleClickChance = storedData._doubleClickChance
    tripleClickChance = storedData._tripleClickChance
    quadClickChance = storedData._quadClickChance
    extraAutoclickers = storedData._extraAutoclickers
    goldenPumpkinMulti = storedData._goldenPumpkinMulti
    gainExpFromGolden = storedData._gainExpFromGolden
    goldenMulti = storedData._goldenMulti
    diamondMulti = storedData._diamondMulti
    autoclickGoldDiamondAllow = storedData._autoclickGoldDiamondAllow
    autoclickGoldDiamondBoost = storedData._autoclickGoldDiamondBoost
    getAllUpgrades = storedData._getAllUpgrades

    storedData._upgradesData.forEach(upgradeDataObject => {
        if (upgradeDataObject._owned){
            treeUpgrades.forEach(upgradeTree => {
                if (upgradeTree.id === upgradeDataObject._id){
                    upgradeTree.owned = true
                }
            })
        }
    })

    if (storedData._upgradeSelection){
        renderUpgradeWindow()
    }

    if (pumpkinMulti > 1){
        pumpkin.src = images + pumpkinUpgradeImages[pumpkinMulti - 2]
    }

    setAutoClickerInterval(baseClickInterval - autoClickSpeed)
}

window.addEventListener("beforeunload", saveData)