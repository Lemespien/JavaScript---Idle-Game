let ALL_RECIPES = {}

class Recipe {
    constructor(name, resource, cost, cost_increase = 1.01, value = 1) {
        this.name = name;
        this.resource = resource;
        this.cost = cost;
        this.cost_increase = cost_increase;
        this.value = value;
        this.building_count = 0;
        this.unlocked = false;
        ALL_RECIPES[this.resource.name] = this;        
    }

    createBuildingButton() {
        /* 
            building
        */        
        let resource = this.resource;
        
        let building_div = document.createElement("div");
        building_div.classList.add("building_button", "column");
        resource.building_div = building_div;

        let building_count = document.createElement("p");
        building_count.append(document.createTextNode(resource.building_count + " X"));
        resource.building_count_element = building_count;
        let building_button = document.createElement("button");
        building_button.setAttribute("id", resource.button_id);
        building_button.addEventListener('click', () => {
            // ALL_RECIPES[resource.name].build();
            this.build();
        }, false);
        resource.building_button = building_button;
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
            if (ALL_RESOURCES[element].value >= this.cost[element]) {
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
            if (this.cost[element] <= ALL_RESOURCES[element].value)
                count++;
                console.log(element);
        });
        if (count >= Object.keys(this.cost).length) {
            recipe_resource.unlocked = true;
            this.building_count++;
            recipe_resource.buildings[this.name] = this.building_count * this.value;
            recipe_resource.updateBonuses();
            recipe_resource.building_count++;
            recipe_resource.building_count_element.innerHTML = recipe_resource.building_count + " X"
            if (recipe_resource.building_count == 1) {
                recipe_resource.createResourceCard();
                recipe_resource.createAutomationButton();
            }
            Object.keys(this.cost).map(element => {
                let resource = ALL_RESOURCES[element];
                console.log("this cost", this.cost[element]);
                resource.value -= this.cost[element];
                this.cost[element] **= this.cost_increase;
                console.log("new cost", this.cost[element]);
                resource.updateCount();
                console.log(element);
            });
        }
    }
}
Lumberjacks_Hut = new Recipe(
    "Lumberjacks Hut",
    Wood,
    cost = {
        Wood: 9,
    },
    cost_increase = 1.05,
    value=2
)

stone_recipe = new Recipe(
    "Stonemason",
    Stone,
    cost={
        Wood: 15,
    },
    cost_increase = 1.05,
    value=0.01,
)

water_recipe = new Recipe(
    "Water Well",
    Water,
    cost={
        Wood: 5,
        Stone: 10,
    },
    cost_increase = 1.05,

)

iron_recipe = new Recipe(
    "Iron Mine",
    Iron,
    cost={
        Wood: 50,
        Stone: 15
    },
    cost_increase = 1.05,

)