import React from 'react'
import {Image, Text, View} from "react-native";

import SectionAdapter from "../../../components/tableView/SectionAdapter";
import GroupModel from "../../../components/tableView/GroupModel";
import colors from "../../../constants/colors";

export default class ContactSectionAdapter extends SectionAdapter{
    addItem = function (index, itemData, itemModel) {
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
    renderSectionHeader = function ({section}) {
        let itemData = section.itemData;
        return (
            <View style={{
                justifyContent: 'center',
                backgroundColor: colors.divider,
                paddingHorizontal: 14,
                paddingVertical: 5,
                height: 30,
            }}>
                <Text style={{
                    fontSize: 13,
                    color: colors.text777,
                }}>{itemData}</Text>
            </View>
        );
    }
}
