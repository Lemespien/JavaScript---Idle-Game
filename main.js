let FIRST_GO = setInterval(() => {
    if (Wood.value >= 10) {
        document.querySelector(".main_grid").setAttribute("style", "visibility:show");
        document.querySelector("#wood_gathering").remove()
        // Wood.createBuildingCard();
        clearInterval(FIRST_GO);
    }
})

let MAIN_INTERVAL = setInterval(() => {
    ALL_RESOURCES.forEach((resource) => {
        if (resource.automated) resource.increase();
    });

    ALL_RECIPES.forEach((x) => {
        if (!x.unlocked && x.haveResources()) {
            console.log(x.resource);

            x.unlockResource();
            console.log("OH MY GOD IT WORKED");

        }
    });

}, 250);