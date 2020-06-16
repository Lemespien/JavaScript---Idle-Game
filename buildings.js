let ALL_BUILDINGS = {}
class Buildings {
    constructor(resource, cost) {
        this.resource = resource;
        this.cost = cost;
    }
}

const Stonemason = new Buildings(
    Stone,
    {
        Wood: 5,
    }
);