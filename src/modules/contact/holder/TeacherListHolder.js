import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Holder from '../../../components/tableView/Holder';
import KBButton from '../../../components/KBButton';
import CircleImage from '../../../components/CircleImage';

import colors from '../../../constants/colors';
import theme from '../../../constants/theme';
import Utils from '../../../utils/Utils';


export default class TeacherListHolder extends Holder {
    build(itemModel) {
        let data = itemModel.getAttrbute('data');
        let customClick = itemModel.getAttrbute('customClick');
        let isCanEdit = itemModel.getAttrbute('isCanEdit');
        return (
            <View style={{backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center'}}>
                <KBButton style={{flex: 1}} onPress={() => {
                    // ToastUtils.showToast(data.nickname);
                }}>
                    <View style={{
                        flex: 1,
                        paddingHorizontal: 14,
                        height: 65,
                        alignItems: 'center',
                        flexDirection: 'row',
                    }}>
                        <CircleImage customWidth={45} customHeight={45} imageUrl={data.headerUrl}/>
                        <Text style={{
                            fontSize: 14,
                            color: colors.text333,
                            marginLeft: 10,
                            flex: 1,
                        }}>{data.nickname}</Text>
                    </View>
                </KBButton>
                {isCanEdit.value ?
                    <KBButton
                        style={{
                            position: 'absolute',
                            right: 35,
                        }}
                        onPress={() => {
                            if (!Utils.isNull(customClick)) {
                                customClick(data, itemModel.key);
                            }
                        }}>
                        <View style={
                            [{
                                width: 80,
                                height: 30,
                                borderRadius: 15,
                                borderWidth: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderColor: '#F7734B',
                                padding: 5,
                            }, theme.isAndroid ? {position: 'absolute', right: 35} : null]
                        }>
                            <Text style={{color: '#F7734B', fontSize: 14}}>移出班级</Text>
                        </View>
                    </KBButton> : null}

            </View>
        );
    };
}
