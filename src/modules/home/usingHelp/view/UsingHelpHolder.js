import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Holder from '../../../../components/tableView/Holder';
import colors from '../../../../constants/colors';
import Divider from "../../../../components/Divider";
import KBButton from "../../../../components/KBButton";
export default class UsingHelpHolder extends Holder {


    build(itemModel) {
        let data = itemModel.getAttrbute('data');

        let index = itemModel.getAttrbute('index');
        this.itemClick = itemModel.getAttrbute('itemClick');

        return (
            <View style={{
                backgroundColor: colors.white,
                paddingVertical: 5,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14,
            }}>
                <KBButton key={index} onPress={() => {
                    this.itemClick(data)
                }}>
                    <View style={{backgroundColor: colors.white}}>
                        <View style={{
                            flexDirection: 'row',
                            paddingHorizontal: 15,
                            justifyContent: 'space-between',
                            paddingVertical: 10,
                        }}>
                            <Text style={{fontSize: 15, color: colors.text333}}>{data?.itemName}</Text>
                            <View style={{paddingHorizontal:15}}>
                                {
                                    <Image source={require('../../../../assets/icon_right.png')} resizeMode={'contain'}
                                           style={{width: 14, height: 14}}/>
                                }
                            </View>
                        </View>

                        <Divider isMargin={false} customHeight={(index == 1) ? 0 : 1}/>
                    </View>
                </KBButton>
            </View>
        );
    };
}
