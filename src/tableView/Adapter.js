import React from 'react'
import {View, Text} from 'react-native'

class Adapter {

    constructor() {
        this.dataScore = [];
    }

    addItem(item) {
        this.dataScore.push(item);
    }

    getItem(key) {
        return this.dataScore[key];
    }

    getView({item, index}) {
        let holderClass = item.getHolder();
        let holder = new holderClass();
        return holder.build(item);
    }

    getCount() {
        return this.dataScore.length;
    }

    getDataScore() {
        return this.dataScore;
    }

    remove(key) {
        for (let i = 0; i < this.dataScore.length; i++) {
            if (this.dataScore[i].key === key) {
                this.dataScore.splice(i, 1);
            }
        }
    }

    removeAll() {
        this.dataScore = [];
    }

    removeItem(item) {
        let index = this.indexOf(item);
        if (index >= 0)
            this.remove(index);
    }

    indexOf(item) {
        for (let i in this.dataScore) {
            if (item == this.dataScore[i]) return i;
            else continue;
        }
        return -1;
    }

    getEmptyData() {
        return (
            <View><Text>暂无数据</Text></View>
        );
    }

    getKey(item, index) {
        return item.getKey();
    }

    getSortData(key) {
        return this.dataScore.sort((a, b) => {
            return a[key] - b[key];
        })
    }
}

export default Adapter;
