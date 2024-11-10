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
    "Upgrade7Pumpkin.png", "Upgrade8Pumpkin.png", "Upgrade9Pumpkin.png", "Upgrade10Pumpkin.png", "Upgrade11Pumpkin.png"
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

let extraAutoclickers = 1

let goldenPumpkinMulti = 1
let gainExpFromGolden = false

let upgradesWindowOpen = false
let upgradeTreeWindowOpen = false

let getAllUpgrades = false

//
//

autoClickBoost = 1
autoClickSpeed = 990

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

        if (boost < 1200){
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

function goldenPumpkinHandle(){
    let gol = false
    let dia = false

    if (goldenPumpkin){
        goldenPumpkinMeter += 1

        if (goldenPumpkinMeter >= goldenPumpkinDelay){
            goldenPumpkinMeter = 0

            mainCurrency += (1 + pumpkinBoost * pumpkinMulti * upgradeTreePumpkinBoost) * 50 * goldenPumpkinMulti

            if (gainExpFromGolden){
                experience += ((((1 + experienceBoost) / (level / 25) * experienceMulti)) * upgradeTreeExperienceBoost) * 2.5
            }

            gol = true
        }
    }
    
    if (diamondPumpkin){
        diamondPumpkinMeter += 1

        if (diamondPumpkinMeter >= diamondPumpkinDelay){
            diamondPumpkinMeter = 0
            
            mainCurrency += (1 + pumpkinBoost * pumpkinMulti * upgradeTreePumpkinBoost) * 10000

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

    return d
}

function autoClicker(){
    if (upgradesWindowOpen || upgradeTreeWindowOpen) return
    if (!canAutoclicker) return

    let d = doubleClick()

    mainCurrency += ((0 + (autoClickBoost) * autoClickMulti * pumpkinMulti * upgradeTreePumpkinBoost * autoClickerClicksMulti) * d) * extraAutoclickers
    experience += (((((0.1 + experienceBoost / 10) * autoClickBoost) / (level / 5) * experienceMulti) / level) * upgradeTreeExperienceBoost * autoClickerExpMulti) * extraAutoclickers

    addVals()
}

pumpkin.addEventListener("click", () => {
    if (upgradesWindowOpen || upgradeTreeWindowOpen) return

    let d = doubleClick()

    mainCurrency += (1 + pumpkinBoost * pumpkinMulti * upgradeTreePumpkinBoost) * d
    experience += (((1 + experienceBoost) / (level / 25) * experienceMulti)) * upgradeTreeExperienceBoost

    goldenPumpkinHandle()

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
        desc: "Second autoclicker",
        price: 135000000,
        currency: "pumpkins",
        upgrade: ["autoclicker-extra", 2],
        dependencies: [208],
        x: "-900px",
        y: "-100px",
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
                else if (treeUpgrade.upgrade[0] === "autoclicker-extra"){
                    extraAutoclickers = treeUpgrade.upgrade[1]
                }
                else if (treeUpgrade.upgrade[0] === "autocollect"){
                    getAllUpgrades = true
                }
                else{
                    console.log("incorrect upgrade name")
                }

                treeUpgrade.owned = true
                success = true
            }
        }
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
            renderButton.style.top = treeUpgrade.y
            renderButton.style.left = treeUpgrade.x

            renderButton.innerText = treeUpgrade.desc + "\n\n" + a(treeUpgrade.price) + " " + treeUpgrade.currency

            renderButton.style.backgroundColor = getRenderButtonColor(treeUpgrade)

            renderButton.addEventListener("click", () => {
                let success = buyRenderButton(treeUpgrade)

                if (success){
                    renderUpgradeTree()
                }
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