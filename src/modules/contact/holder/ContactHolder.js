import React from 'react';
import {View, Text, Image} from 'react-native';
import Holder from '../../../components/tableView/Holder';
import KBButton from '../../../components/KBButton';
import CircleImage from '../../../components/CircleImage';

import theme from '../../../constants/theme';
import colors from '../../../constants/colors';
import Utils from '../../../utils/Utils';


export default class ContactHolder extends Holder {
    build(itemModel) {
        let data = itemModel.getAttrbute('data');
        let customClick = itemModel.getAttrbute('customClick');
        let itemClick = itemModel.getAttrbute('itemClick');
        let listKey = itemModel.getAttrbute('listKey');
        let isShowPhone = itemModel.getAttrbute('isShowPhone');
        isShowPhone = Utils.isNull(isShowPhone) || isShowPhone;
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
                    itemClick(data);
                }}>
                    <View style={{
                        flex: 1,
                        paddingHorizontal: 14,
                        alignItems: 'center',
                        flexDirection: 'row',
                    }}>
                        <CircleImage customWidth={45}
                                     customHeight={45}
                                     imageUrl={Utils.getStudentAvatar(data.header, data.sex)}
                        />
                        <Text style={{
                            fontSize: 14,
                            color: colors.text333,
                            marginLeft: 10,
                            flex: 1,
                        }}>{data[listKey]}</Text>
                    </View>
                </KBButton>
                {isShowPhone ?
                    <KBButton style={{position: 'absolute', right: 35}} isAndroidRipple={false} onPress={() => {
                        if (!Utils.isNull(customClick)) {
                            customClick(data.mobile, itemModel.key);
                        }
                    }}>
                        <View style={[{padding: 5}, theme.isAndroid ? {position: 'absolute', right: 35} : null]}>
                            <Image source={require('../../../assets/class/mail_list_phone.png')}
                                   style={{width: 25, height: 25}}
                                   resizeMode={'contain'}/>
                        </View>
                    </KBButton> : null
                }
            </View>
        );
    }
}
