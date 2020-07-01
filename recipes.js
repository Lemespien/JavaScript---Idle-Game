let ALL_RECIPES = new Map();

class Recipe {
    constructor(name, resource, cost, cost_increase = 1.01, value = 1, drain = null) {
        this.name = name;
        this.resource = resource;
        this.cost = cost;
        this.drain = drain;
        this.cost_increase = cost_increase;
        this.value = value;
        this.building_count = 0;
        this.unlocked = false;
        this.button_id = name.toLowerCase() + "_button";
        this.automate_id = name.toLowerCase() + "_automate";
        this.automated = false;
        this.building_button = null;
        this.building_count_element = null;
        this.building_div = null;
        this.defaultTooltip = null;
        this.drainTooltip = null;
        this.costText = null;
        this.tooltip_span = null;
        this.automate_button = null;
        this.special_action = null;
        this.special_action_is_triggered = false;
        ALL_RECIPES.set(this.name, this);
        // ALL_RECIPES[resource] = this;
    }

    createBuildingButton() {
        /* 
            building
        */
        let resource = this.resource;

        let building_div = document.createElement("div");
        building_div.classList.add("building_button", "column", "tooltip");
        this.building_div = building_div;

        let building_count = document.createElement("p");
        building_count.append(document.createTextNode(this.building_count + " X"));
        this.building_count_element = building_count;
        let building_button = document.createElement("button");
        building_button.setAttribute("id", this.button_id);
        building_button.addEventListener('click', () => {
            // ALL_RECIPES[resource.name].build();
            this.build();
        }, false);
        this.building_button = building_button;
        let tooltip_span = this.createTooltip();

        building_button.append(document.createTextNode(`Build ${this.name}`));
        building_div.append(building_count);
        building_div.append(building_button);
        building_div.append(tooltip_span);
        return building_div;
    }

    createTooltip() {
        let tooltip_span = document.createElement("span");
        tooltip_span.classList.add("tooltiptext");

        let defaultTooltip = document.createElement("p");
        defaultTooltip.append(document.createTextNode(""));
        this.defaultTooltip = defaultTooltip;

        let drainTooltip = document.createElement("p");
        drainTooltip.append(document.createTextNode(""));
        this.drainTooltip = drainTooltip;

        let costText = document.createElement("p");
        costText.append(document.createTextNode(""));
        this.costText = costText;
        this.updateTooltip();
        tooltip_span.append(defaultTooltip);
        tooltip_span.append(drainTooltip);
        tooltip_span.append(costText);
        this.tooltip_span = tooltip_span;
        return tooltip_span;
    }

    updateTooltip() {
        if (this.drain) {
            let drainsText = "Drains:\n";
            this.drain.forEach((value, key) => {
                drainsText += `${(value * this.building_count).toFixed(2)} ${key.name}\n`;
            });
            this.drainTooltip.innerHTML = drainsText;
        }

        let functionalityText = `Produces ${this.value} of ${this.resource.name} per building
                                Total: ${(this.value * this.building_count).toFixed(2)}`;
        this.defaultTooltip.innerHTML = functionalityText;

        let resourceCostText = "";
        for (let element in this.cost) {
            resourceCostText += `${element}: ${this.cost[element].toFixed(2)}\n`;
        }
        this.costText.innerHTML = resourceCostText;
    }

    createBuildingCard() {
        let resource_element = document.getElementById("buildings");
        let building_div = this.createBuildingButton();
        resource_element.append(building_div);
        this.resource.resource_element = resource_element;
    }

    haveResources() {
        let count = 0;
        for (let element in this.cost) {
            if (ALL_RESOURCES.get(element).value >= this.cost[element]) {
                count++;
            }
        }
        if (count >= Object.keys(this.cost).length) {
            return true;
        } else {
            return false;
        }
    }

    unlockResource() {
        if (!this.unlocked) {
            this.createBuildingCard();
            this.unlocked = true;
        }
        // this.resource.unlocked = true;
    }

    build() {
        let count = 0;
        const recipe_resource = this.resource;
        Object.keys(this.cost).map(element => {
            if (this.cost[element] <= ALL_RESOURCES.get(element).value)
                count++;
        });
        if (count >= Object.keys(this.cost).length) {
            if (this.building_count < 1) {
                this.building_count++;
                this.createAutomationButton();
            } else this.building_count++;
            // recipe_resource.buildings[this.name] = this.building_count * this.value;
            if (this.automated) {
                this.resource.buildings[this.name] = this.building_count * this.value;
                this.addDrains();
                recipe_resource.updateBonuses();
            }
            this.building_count_element.innerHTML = this.building_count + " X"
            if (!recipe_resource.unlocked) {
                recipe_resource.createResourceCard();
                recipe_resource.unlocked = true;
            }
            Object.keys(this.cost).map(element => {
                let resource = ALL_RESOURCES.get(element);
                console.log("this cost", this.cost[element]);
                resource.value -= this.cost[element];
                this.cost[element] **= this.cost_increase;
                console.log("new cost", this.cost[element]);
                resource.updateCount();
            });
            if (this.special_action) this.special_action();
            this.updateTooltip();
        }
    }

    createAutomationButton() {
        let automate_button = document.createElement("button");
        automate_button.setAttribute("id", this.automate_id);
        automate_button.addEventListener('click', () => {
            this.toggleAutomation();
        }, false);
        this.automate_button = automate_button;
        automate_button.append(document.createTextNode("Toggle on"))
        this.building_div.append(automate_button);

        this.toggleAutomation();
    }

    toggleAutomation() {
        this.automated = !this.automated;

        if (this.automated) {
            this.resource.buildings[this.name] = this.building_count * this.value;
            this.automate_button.innerHTML = "Toggle off";
            this.automate_button.classList = "active";
            this.addDrains();
        } else {
            this.resource.buildings[this.name] = 0;
            this.automate_button.innerHTML = "Toggle on";
            this.automate_button.classList = "inactive";
            this.removeDrains();
        }
        this.resource.updateBonuses();
    }

    addDrains() {
        if (this.drain) {
            this.drain.forEach((value, key) => {
                key.drains.set(this, value * this.building_count);
                key.updateBonuses();
            });
        }
    }
    removeDrains() {
        if (this.drain) {
            this.drain.forEach((value, key) => {
                key.drains.set(this, 0);
                key.updateBonuses();
            });
        }
    }
}


Wood_Cutter = new Recipe(
    "Wood Cutter",
    Wood,
    cost = {
        Wood: 10,
    },
    cost_increase = 1.1,
    value = 0.5
);

Lumberjacks_Hut = new Recipe(
    "Lumberjacks Hut",
    Wood,
    cost = {
        Wood: 15,
        Stone: 20
    },
    cost_increase = 1.15,
    value = 4
);

Stonemason = new Recipe(
    "Stonemason",
    Stone,
    cost = {
        Wood: 15,
    },
    cost_increase = 1.1,
    value = 0.05,
);

Water_Well = new Recipe(
    "Water Well",
    Water,
    cost = {
        Wood: 10,
        Stone: 5,
    },
    cost_increase = 1.1,
    value = 0.3
);

Iron_Mine = new Recipe(
    "Iron Mine",
    Iron,
    cost = {
        Wood: 50,
        Stone: 15
    },
    cost_increase = 1.1,
    value = 0.02
);

Coal_Mine = new Recipe(
    "Coal Mine",
    Coal,
    cost = {
        Wood: 40,
        Stone: 20,
    },
    cost_increase = 1.1,
    value = 0.01,
    drain = new Map([
        [Wood, 1]
    ])
);

Steel_Foundry = new Recipe(
    "Steel Foundry",
    Steel,
    cost = {
        Wood: 40,
        Stone: 60,
    },
    cost_increase = 1.15,
    value = 0.01,
    drain = new Map([
        [Iron, 1],
        [Coal, 0.2]
    ]),
);

Iron_Refinery = new Recipe(
    "Iron Refinery",
    Iron,
    cost = {
        Wood: 500,
        Steel: 5,
    },
    cost_increase = 1.05,
    value = 0
)

/* SPECIAL ACTIONS */
Steel_Foundry.special_action = function() {
    this.resource.multiplier[this.name] = 1 + this.building_count * 0.01;
}

Iron_Refinery.special_action = function() {
    this.resource.multiplier[this.name] = 1 + this.building_count * 0.2;
}
