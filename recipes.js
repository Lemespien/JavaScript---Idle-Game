let ALL_RECIPES = new Map();

class Recipe {
    constructor(name, resource, cost, cost_increase = 1.01, value = 1) {
        this.name = name;
        this.resource = resource;
        this.cost = cost;
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
        this.automate_button = null;
        ALL_RECIPES.set(this.name, this);
        // ALL_RECIPES[resource] = this;
    }

    createBuildingButton() {
        /* 
            building
        */
        let resource = this.resource;

        let building_div = document.createElement("div");
        building_div.classList.add("building_button", "column");
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
        building_button.append(document.createTextNode(`Build ${this.name}`));
        building_div.append(building_count);
        building_div.append(building_button);

        return building_div;
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
            console.log(element);
        });
        if (count >= Object.keys(this.cost).length) {
            if (this.building_count < 1) {
                this.building_count++;
                this.createAutomationButton();
            } else this.building_count++;
            // recipe_resource.buildings[this.name] = this.building_count * this.value;
            if (this.automated) {
                this.resource.buildings[this.name] = this.building_count * this.value;
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
                console.log(element);
            });
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
        } else {
            this.resource.buildings[this.name] = 0;
            this.automate_button.innerHTML = "Toggle on";
            this.automate_button.classList = "inactive";
        }
        this.resource.updateBonuses();
    }
}

Lumberjacks_Hut = new Recipe(
    "Lumberjacks Hut",
    Wood,
    cost = {
        Wood: 15,
    },
    cost_increase = 1.05,
    value = 2
)

Wood_Cutter = new Recipe(
    "Wood Cutter",
    Wood,
    cost = {
        Wood: 6,
    },
    cost_increase = 1.01,
    value = 0.5
)

Stonemason = new Recipe(
    "Stonemason",
    Stone,
    cost = {
        Wood: 15,
    },
    cost_increase = 1.05,
    value = 0.01,
)

Water_Well = new Recipe(
    "Water Well",
    Water,
    cost = {
        Wood: 5,
        Stone: 10,
    },
    cost_increase = 1.05,

)

Iron_Mine = new Recipe(
    "Iron Mine",
    Iron,
    cost = {
        Wood: 50,
        Stone: 15
    },
    cost_increase = 1.05,

)