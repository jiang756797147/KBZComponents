import React from 'react';
import {View, Text, Image} from 'react-native';
import Holder from '../../../components/tableView/Holder';
import KBButton from '../../../components/KBButton';
import CircleImage from '../../../components/CircleImage';
import KBDisplayImages from '../../../components/KBDisplayImages';
import KBText from '../../../components/KBText';
import theme from '../../../constants/theme';
import colors from '../../../constants/colors';
import image from '../../../constants/image';
import ToastUtils from '../../../utils/ToastUtils';
import Utils from '../../../utils/Utils';

import UserData from '../../../constants/UserData';


export default class MessageNoticeHolder extends Holder {

    build(itemModel) {

        let data = itemModel.getAttrbute('data');
        let itemDeleteClick = itemModel.getAttrbute('itemDeleteClick');
        let imageArray = itemModel.getAttrbute('imageArray');
        this.navigate = itemModel.getAttrbute('navigation').navigate;

        return (
            <View style={{marginTop: 10, paddingTop: 10, backgroundColor: colors.white, paddingHorizontal: 14}}>
                <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                    <CircleImage customWidth={40} customHeight={40} imageUrl={data.headUrl}/>

                    <View style={{marginLeft: 10, flex: 1}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                            <Text style={{fontSize: 15, color: '#565771', flex: 1}}>{data.userName}</Text>
                            {data.createBy === UserData.getInstance().getId() ?
                                <KBButton onPress={() => {
                                    if (!Utils.isNull(itemDeleteClick)) {
                                        itemDeleteClick(itemModel.key, data.id);
                                    }
                                }}>
                                    <View style={{padding: 5}}>
                                        <Image source={require('../../../assets/ic_delete.png')}
                                               style={{width: 17, height: 17}} resizeMode={'contain'}/>
                                    </View>
                                </KBButton> : null}
                        </View>
                        <View style={{marginRight: 10}}>
                            <KBText style={{fontSize: 15, color: colors.text444}}>
                                {data.content}
                            </KBText>
                            {imageArray.length > 0 ?
                                <KBDisplayImages
                                    imgWidth={(theme.screenWidth - 110) / 3 - 10}
                                    ticketImgs={imageArray} isNetwork={true}/> : null}

                            <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 5}}>
                                <Text style={{fontSize: 13, color: colors.text888}}>
                                    {data.date}
                                </Text>
                                <Text style={{marginLeft: 3, fontSize: 13, color: colors.text888}}>
                                    {data.week}
                                </Text>
                            </View>
                        </View>

                    </View>
                </View>
                {data.createBy === UserData.getInstance().getId() ?
                    <View style={{
                        flexDirection: 'row',
                        height: 35,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTopColor: colors.empty,
                        borderTopWidth: 0.5,
                    }}>

                        <KBButton onPress={() => {
                            this.navigate('MessageRangDetail', {
                                classId: data.visibleRang,
                            });
                        }}>
                            <View style={{
                                flexDirection: 'row', alignItems: 'center',
                                height: 35,
                                paddingHorizontal: 14,
                                marginHorizontal: -14,
                            }}>
                                <Image style={{width: 17, height: 14}} source={image.messageRange}/>
                                <Text
                                    style={{fontSize: 13, color: colors.text888, textAlign: 'center', marginLeft: 5}}>可见范围
                                </Text>
                            </View>
                        </KBButton>
                        <KBButton onPress={() => {
                            if (data.createBy === UserData.getInstance().getId()) {
                                this.navigate('MessageConfirm', {
                                    confirmId: data.id,
                                    confirmType: 0,
                                });
                            } else {
                                ToastUtils.showToast('仅发布人可查看详细名单');
                            }
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                height: 35,
                                paddingHorizontal: 14,
                                marginHorizontal: -14,
                                alignItems: 'center',
                            }}>
                                <Image style={{width: 18, height: 13}}
                                       source={require('../../../assets/class/ic_received.png')}/>
                                <Text
                                    style={{fontSize: 13, color: colors.text888, textAlign: 'center', marginLeft: 5}}>
                                    {'确认' + (Utils.isNull(data.confirmNum) ? '0' : data.confirmNum) + '人'}
                                </Text>
                            </View>
                        </KBButton>
                    </View> : null}

            </View>
        );
    };
}
