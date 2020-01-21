class ClassCellModel {

    constructor(key, name) {
        this.key = key;
        this.data = [];
        this.name = name;
    }

    addItemModel(itemModel) {
        this.data.push(itemModel);
    }

    getItemModel(index) {
        return this.data[index];
    }
}

export default ClassCellModel;