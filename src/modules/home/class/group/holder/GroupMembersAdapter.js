import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import GroupMembersModel from "./GroupMembersModel";
import colors from "../../../../../constants/colors"
import theme from "../../../../../constants/theme"
import SectionAdapter from "../../../../../components/tableView/SectionAdapter"


export default class GroupMembersAdapter extends SectionAdapter{

    addItem(index, name, itemModel) {

        // 如果存在key
        if (this.datasModels.hasOwnProperty(index)) {
            let data = this.datasModels[index];
            data.addItemModel(itemModel)
        } else {
            let groupModel = new GroupMembersModel(index, name);
            groupModel.addItemModel(itemModel);
            this.datasModels[index] = groupModel;
            this.groupModels.push(groupModel)
        }
    };
    renderSectionHeader({section}) {
        return (
            <View style={styles.HeaderView}>
                <Text style={styles.HeaderText}>
                    {section.name}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    HeaderView:{
        flexDirection: "row",
        backgroundColor: colors.empty,
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 30,
        height: 30,
        width: theme.screenWidth,
    },
    HeaderText:{
        color: colors.text888,
        textAlign: "center",
        fontSize: 13,
        fontWeight: "normal",
    },
});
