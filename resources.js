let ALL_RESOURCES = new Map();

class Resources {
    constructor(name, base_value = 0, value = 0, automated = false) {
        this.name = name;
        this.title_id = name.toLowerCase();
        this.count_id = name.toLowerCase() + "_count";
        this.automated = automated;
        this.base_value = base_value;
        this.value = value;
        this.increase_by = 1;
        this.buildings = {};
        this.drains = new Map();
        this.other_bonuses = {};
        this.multiplier = 1;
        this.title_element = null;
        this.count_element = null;
        this.unlocked = false;
        ALL_RESOURCES.set(this.name, this);
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

    }


    destroyResourceCard() {
        this.automated = false;
        this.resource_card.remove();
    }

    increase() {
        if (this.increase_by < 0) {
            let change = this.value + this.increase_by;
            if (change < 0) {
                this.drains.forEach((value, key) => {
                    key.toggleAutomation();
                });
                this.updateBonuses();
            }
        }
        this.value += this.increase_by;
        this.updateCount();
    }

    updateCount() {
        if (!this.count_element) {
            if (document.getElementById(this.count_id))
                document.getElementById(this.count_id).innerHTML = this.value.toFixed(2);
            return
        }
        this.count_element.innerHTML = `${this.value.toFixed(2)} (${this.increase_by.toFixed(2)}/tick)`;
    }

    updateBonuses() {
        const arrSum = arr => arr.reduce((a, b) => a + b, 0);
        const building_bonuses = arrSum(Object.values(this.buildings));
        let drains = 0;
        for (let value of this.drains.values()) {
            drains += value;
        }
        if (building_bonuses > 0 || drains > 0) {
            this.automated = true;
        } else {
            this.automated = false;
            this.count_element.innerHTML = `${this.value.toFixed(2)}`;
        }
        let other_bonuses = arrSum(Object.values(this.other_bonuses));
        console.log(this.base_value, building_bonuses, other_bonuses);
        let total = (this.base_value + building_bonuses + other_bonuses) * this.multiplier - drains;
        this.increase_by = total;

    }
}

const Wood = new Resources("Wood");
Wood.value = 10;
Wood.multiplier = 10;
const Stone = new Resources("Stone");
Stone.multiplier = 100;
const Water = new Resources("Water");
const Iron = new Resources("Iron");
const Coal = new Resources("Coal");
const Steel = new Resources("Steel");