class ItemModel {

    constructor(key, holder) {
        this.holder = holder;
        this.key = key.toString();
        this.attribute = [];
    }

    setAttribute(key, value) {
        this.attribute[key] = value;
    }

    getAttrbute(key) {
        return this.attribute[key];
    }

    getHolder() {
        return this.holder;
    }

    getKey() {
        return this.key;
    }
}

export default ItemModel;