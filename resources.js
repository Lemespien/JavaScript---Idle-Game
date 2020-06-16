let ALL_RESOURCES = {

}
class Resources {
    constructor(name, base_value = 1, value = 0, automated = false) {
        this.name = name;
        this.title_id = name.toLowerCase();
        this.count_id = name.toLowerCase() + "_count";
        this.button_id = name.toLowerCase() + "_button";
        this.automate_id = name.toLowerCase() + "_automate";
        this.automated = automated;
        this.base_value = base_value;
        this.value = value;
        this.building_count = 0;
        this.increase_by = 1;
        this.buildings = {};
        this.other_bonuses = {};
        this.multiplier = 1;
        this.building_div = null;
        this.building_count_element = null;
        this.building_button = null;
        this.automate_button = null;
        this.title_element = null;
        this.count_element = null;
        this.unlocked = false;
        ALL_RESOURCES[this.name] = this;
    }

    createResourceCard() {
        /* 
        resource list
        */
       
        let resource_title = document.createElement("p");
        resource_title.setAttribute("id", this.title_id);
        resource_title.classList.add("column");
        resource_title.append(document.createTextNode(this.name));
        this.title_element = resource_title;

        let resource_count = document.createElement("p");
        resource_count.setAttribute("id", this.count_id);
        resource_count.classList.add("resource_count");
        resource_count.classList.add("column");

        let count_node = document.createTextNode(this.value);
        resource_count.append(count_node);
        this.count_element = resource_count;

        let resource_div = document.createElement("div");
        resource_div.classList.add("row");
        resource_div.append(resource_title);
        resource_div.append(resource_count);

        let resource_list = document.getElementById("resource_list");
        resource_list.append(resource_div);
        // resource_list.append(resource_title);
        // resource_list.append(resource_count);

    }

    createAutomationButton() {
        let automate_button = document.createElement("button");
        automate_button.setAttribute("id", this.automate_id);
        automate_button.addEventListener('click', () => {
            this.toggleAutomation();
        }, false);
        this.button_element = automate_button;
        automate_button.append(document.createTextNode("Toggle on"))

        this.building_div.append(automate_button);
    }

    destroyResourceCard() {
        this.automated = false;
        this.resource_card.remove();
    }

    increase() {
        this.value += this.increase_by;
        this.updateCount();
    }

    updateCount() {
        if (!this.count_element){
            if (document.getElementById(this.count_id))
                document.getElementById(this.count_id).innerHTML = this.value.toFixed(2);
            return
        }
        this.count_element.innerHTML = `${this.value.toFixed(2)} (${this.increase_by.toFixed(2)}/tick)`;
    }
    
    updateBonuses() {
        const arrSum = arr => arr.reduce((a,b) => a +b, 0);
        let building_bonuses = arrSum(Object.values(this.buildings));
        let other_bonuses = arrSum(Object.values(this.other_bonuses));
        console.log(this.base_value, building_bonuses, other_bonuses);
        
        this.increase_by = (this.base_value + building_bonuses + other_bonuses) * this.multiplier;
        console.log(this.increase_by);
        
    }

    toggleAutomation() {
        this.automated = !this.automated;
        this.button_element.innerHTML = this.automated ? "Toggle off" : "Toggle on";
        this.button_element.classList = (this.automated ? "active" : "inactive");
    }

    // build() {
    //     let count = 0;
    //     console.log(this.cost);
        
    //     Object.keys(this.cost).map(element => {
    //         if (this.cost[element] < ALL_RESOURCES[element].value)
    //             count++;
    //             console.log(element);
    //     });
    //     if (count >= Object.keys(this.cost).length) {
    //         Object.keys(this.cost).map(element => {
    //             ALL_RESOURCES[element].value -= this.cost[element];
    //             ALL_RESOURCES[element].count_element.innerHTML = ALL_RESOURCES[element].value; 
    //             console.log(element);
    //         });
    //         this.building_count++;
    //         this.building_count_element.innerHTML = this.building_count + " X"
    //         if (this.building_count == 1) {
    //             this.createResourceCard();
    //             this.createAutomationButton();
    //         }
    //     }
    // }
}

const Wood = new Resources("Wood", base_value = 0.5);
const Stone = new Resources("Stone", base_value=0.01);
const Water = new Resources("Water");
const Iron = new Resources("Iron");
const Coal = new Resources("Coal");
const Steel = new Resources("Steel");