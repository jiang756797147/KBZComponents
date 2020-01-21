import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import colors from '../../../../constants/colors';
import theme from '../../../../constants/theme';
import SectionAdapter from '../../../../components/tableView/SectionAdapter';
import KBButton from '../../../../components/KBButton';
import Utils from '../../../../utils/Utils';
import ClassCellModel from './ClassCellModel';

export default class ClassAdapter extends SectionAdapter {
    selectImg = require('../../../../assets/class/class_btn_choice_s.png');
    unSelectImg = require('../../../../assets/class/class_btn_choice_d.png');
     headerClick=null;
     isEdit = null;
    addItem(index, name,itemModel) {
        this.headerClick = itemModel.getAttrbute("headerClick");
        this.isEdit = itemModel.getAttrbute("isEdit");
        // 如果存在key
        if (this.datasModels.hasOwnProperty(index)) {
            let data = this.datasModels[index];
            data.addItemModel(itemModel);
        } else {
            let groupModel = new ClassCellModel(index, name);
            groupModel.addItemModel(itemModel);
            this.datasModels[index] = groupModel;
            this.groupModels.push(groupModel);
        }
    };

    renderSectionHeader=({section})=> {
        if (Utils.isNull(section.name)) {
            return;
        }
        let data = section.data[0].getAttrbute('data');
        for (let obj of data) {
            if (obj.status == '0') {
                section.isSelected = false;
                break;
            } else {
                section.isSelected = true;
            }
        }
        return (
            <KBButton onPress={() => {
                if (this.isEdit&&section.name!=='未分组'){
                    this.headerClick(section)
                } else {
                    if (!section.data[0].getAttrbute("isSelectMore").getIsSelectMore()) {
                        return;
                    }
                    section.isSelected = !section.isSelected;
                    let data = section.data[0].getAttrbute("data");
                    for(let obj of data) {
                        obj.status = section.isSelected ? "1" : "0";
                    }
                    section.data[0].getAttrbute("world").setState({});
                }
            }}>
                <View style={styles.HeaderView}>
                    {section.data[0].getAttrbute('isSelectMore').getIsSelectMore() ?
                        <Image style={{
                            width: 17,
                            height: 17,
                            marginRight: 10,
                        }}
                               source={section.isSelected ? this.selectImg : this.unSelectImg}
                        /> : null}
                    <Text style={styles.HeaderText}>
                        {section.name}
                    </Text>
                </View>
            </KBButton>
        );
    };

    headerHasSelected(sectionData) {
        let data = sectionData.data[0].getAttrbute('data');
        for (let obj of data) {
            if (obj.status == '0') {
                sectionData.isSelected = false;
                break;
            }
        }
        sectionData.isSelected = true;
    };
}


const styles = StyleSheet.create({
    HeaderView: {
        flexDirection: 'row',
        backgroundColor: colors.empty,
        alignItems: 'center',
        paddingHorizontal: 14,
        height: 30,
        width: theme.screenWidth,
    },
    HeaderText: {
        color: colors.text888,
        textAlign: 'center',
        fontSize: 13,
        fontWeight: 'normal',
    },
});
