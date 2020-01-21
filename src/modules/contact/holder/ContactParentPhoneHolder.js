import React from 'react';
import {View, Text, Image} from 'react-native';
import Holder from '../../../components/tableView/Holder';
import KBButton from '../../../components/KBButton';
import CircleImage from '../../../components/CircleImage';
import colors from '../../../constants/colors';
import theme from '../../../constants/theme';
import Utils from '../../../utils/Utils';


export default class ContactParentPhoneHolder extends Holder {
    build(itemModel) {
        let data = itemModel.getAttrbute('data');
        let customClick = itemModel.getAttrbute('customClick');
        let isShowPhone = itemModel.getAttrbute('isShowPhone');
        isShowPhone = Utils.isNull(isShowPhone) || isShowPhone;
        let isCanEdit = itemModel.getAttrbute('isCanEdit');
        return (
            <View style={{
                height: 65,
                borderBottomWidth: 1,
                borderColor: colors.divider,
                backgroundColor: colors.white,
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <KBButton style={{flex: 1}} onPress={() => {
                    // ToastUtils.showToast(data.nickname);
                }}>
                    <View style={{
                        flex: 1,
                        paddingHorizontal: 14,
                        alignItems: 'center',
                        flexDirection: 'row',
                    }}>
                        <CircleImage customWidth={45} customHeight={45} imageUrl={data.headerUrl}/>
                        <View style={{marginLeft: 10, flex: 1}}>
                            <Text style={{
                                fontSize: 14,
                                color: colors.text333,
                            }}>{data.name}的{data.familyName}</Text>
                            <Text style={{
                                fontSize: 12,
                                color: colors.text999,
                                marginTop: 10,
                            }}>{data.parentName}</Text>
                        </View>
                    </View>
                </KBButton>
                {isShowPhone ?
                    <KBButton style={{position: 'absolute', right: 35}} isAndroidRipple={false} onPress={() => {
                        if (!Utils.isNull(customClick)) {
                            customClick(data.mobile);
                        }
                    }}>
                        <View style={[{padding: 5}, theme.isAndroid ? {position: 'absolute', right: 35} : null]}>
                            <Image source={require('../../../assets/class/mail_list_phone.png')}
                                   style={{width: 25, height: 25}}
                                   resizeMode={'contain'}/>
                        </View>
                    </KBButton> : null}
                {isCanEdit ? <KBButton
                    style={{
                        position: 'absolute',
                        right: 35,
                    }}
                    onPress={() => {
                        if (!Utils.isNull(customClick)) {
                            customClick(data, itemModel.key);
                        }
                    }}>
                    <View style={[{
                        width: 80,
                        height: 30,
                        borderRadius: 15,
                        borderWidth: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderColor: '#F7734B',
                        padding: 5,
                    }, theme.isAndroid ? {position: 'absolute', right: 35} : null]}>
                        <Text style={{color: '#F7734B', fontSize: 14}}>移出班级</Text>
                    </View>
                </KBButton> : null}

            </View>
        );
    };
}
