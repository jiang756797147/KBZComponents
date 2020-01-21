class GroupModel {

    constructor(key, itemData) {
        this.key = key;
        this.data = [];
        this.itemData = itemData;
    }

    addItemModel(itemModel) {
        this.data.push(itemModel);
    }

    getItemModel(index) {
        return this.data[index];
    }
}

export default GroupModel;