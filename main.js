let FIRST_GO = setInterval(() => {
    if (Wood.value >= 10) {
        document.querySelector(".main_grid").style.visibility = "visible";
        document.querySelector("#wood_gathering").remove()
        clearInterval(FIRST_GO);
    }
})

let MAIN_INTERVAL = setInterval(() => {
    ALL_RESOURCES.forEach((resource) => {
        if (resource.automated) resource.increase();
    });

    ALL_RECIPES.forEach((x) => {
        if (!x.unlocked && x.haveResources()) {
            x.unlockResource();
        }
    });

}, 250);