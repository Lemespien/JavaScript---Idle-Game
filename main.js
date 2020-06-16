let FIRST_GO = setInterval(() => {
    if (Wood.value >= 10) {
        document.querySelector(".main_grid").setAttribute("style", "visibility:show");
        document.querySelector("#wood_gathering").remove()
        // Wood.createBuildingCard();
        clearInterval(FIRST_GO);
    }
})

let MAIN_INTERVAL = setInterval(() => {
    for (resource in ALL_RESOURCES) {
        if (ALL_RESOURCES[resource].automated) {
            ALL_RESOURCES[resource].increase();
        }
    }
    for (recipe in ALL_RECIPES) {
        if (!ALL_RECIPES[recipe].unlocked && ALL_RECIPES[recipe].haveResources()) {
            ALL_RECIPES[recipe].unlockResource();
            console.log("OH MY GOSH IT WORKED");
        }
    }
}, 250);