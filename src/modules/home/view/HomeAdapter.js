import React from 'react'
import {Image, Text, View} from "react-native";

import SectionAdapter from "../../../components/tableView/SectionAdapter";
import GroupModel from "../../../components/tableView/GroupModel";
import colors from "../../../constants/colors";

export default class HomeAdapter extends SectionAdapter {

    addItem (index, itemData, itemModel) {
        if (arguments.length === 2) {
            itemModel = itemData;
            itemData = {};
        }
        // 如果存在key
        if (this.datasModels.hasOwnProperty(index)) {
            let data = this.datasModels[index];
            data.addItemModel(itemModel)
        } else {
            let groupModel = new GroupModel(index, itemData);
            groupModel.addItemModel(itemModel);
            this.datasModels[index] = groupModel;
            this.groupModels.push(groupModel)
        }
    };
   renderSectionHeader ({section}) {
        let itemData = section.itemData;
        return (
            <View style={{
                flexDirection: 'row',
                backgroundColor: colors.white,
                paddingHorizontal: 14,
                paddingVertical: 10,
                alignItems: 'center'
            }}>
                <Image
                    style={{width: 18, height: 18}}
                    resizeMode={'contain'}
                    source={itemData.isJoin ? require('../../../assets/class/class_ic_join.png') : require('../../../assets/class/class_ic_found.png')}/>
                <Text style={{
                    color: colors.text333,
                    fontSize: 15,
                    fontWeight: '500',
                    marginLeft: 10
                }}>{itemData.isJoin ? '我加入的班级' : '我管理的班级'}</Text>
            </View>
        );
    }
}


