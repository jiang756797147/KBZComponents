import React from 'react'
import {View, Text} from 'react-native'
import GroupModel from "./GroupModel";

class SectionAdapter {
    constructor() {
        this.groupModels = [];
        this.datasModels = [];
    }

    addItem(index, itemData, itemModel) {
        if (arguments.length === 2) {
            itemModel = itemData;
            itemData = '';
        }
        // 如果存在key
        if (this.datasModels.hasOwnProperty(index)) {
            let data = this.datasModels[index];
            data.addItemModel(itemModel)
        } else {
            let gruopModel = new GroupModel(index, itemData);
            gruopModel.addItemModel(itemModel);
            this.datasModels[index] = gruopModel;
            this.groupModels.push(gruopModel)
        }
    }
    remove(key) {
        for (let i = this.groupModels.length - 1; i >= 0; i--) {
            for (let j = this.groupModels[i].data.length - 1; j >= 0; j--) {
                if (this.groupModels[i].data[j].key === key) {
                    this.groupModels[i].data.splice(j, 1);
                    if (this.groupModels[i].data.length === 0) {
                        this.groupModels.splice(i, 1);
                    }
                }
            }
        }
        console.log("2222222", this.groupModels);
        for (let i = this.datasModels.length - 1; i >= 0; i--) {
            if (this.datasModels[i].key === key) {
                console.log("111111111", this.datasModels[i]);
                this.datasModels.splice(i, 1);
            }
        }
    };
    removeAll() {
        this.groupModels = [];
        this.datasModels = [];
    };
    getDataScore() {
        return this.groupModels;
    };
    getItemModelList(index) {
        return this.groupModels[index] === undefined ? [] : this.groupModels[index].data;
    };
    getItem(index) {
        return this.datasModels[index] === undefined ? [] : this.datasModels[index];
    };
    getGroupOfIndex(index) {
        return this.groupModels[index].name;
    };
    getCount() {
        return this.groupModels.length;
    };
    renderSectionHeader({section}) {
        console.log('sssssss =======', section)
        if (section.name && section.name !== '') {
            return (
                <Text style={{paddingLeft: 10, paddingTop: 10, paddingBottom: 10}}>{section.name}</Text>
            );
        }
        return null;
    };
    getView({item}) {
        // console.log(item);
        let holderClass = item.getHolder();
        let holder = new holderClass();
        return holder.build(item);
    };
    getEmptyData() {
        return (
            <View><Text>暂无数据</Text></View>
        );
    };
    getKey(item, index) {
        return item.getKey();
    }
}

export default SectionAdapter;
