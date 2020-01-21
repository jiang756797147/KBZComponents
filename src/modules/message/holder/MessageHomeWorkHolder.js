import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import Holder from '../../../components/tableView/Holder';
import KBButton from '../../../components/KBButton';
import KBText from '../../../components/KBText';
import CircleImage from '../../../components/CircleImage';
import Divider from '../../../components/Divider';
import KBDisplayImages from '../../../components/KBDisplayImages';

import UserData from '../../../constants/UserData';
import theme from '../../../constants/theme';
import colors from '../../../constants/colors';
import image from '../../../constants/image';

import Utils from '../../../utils/Utils';
import ToastUtils from '../../../utils/ToastUtils';
import TimeUtils from '../../../utils/TimeUtils';

export default class MessageHomeWorkHolder extends Holder {
    teacherId = UserData.getInstance().getId();

    build(itemModel) {

        let data = itemModel.getAttrbute('data');
        let itemDeleteClick = itemModel.getAttrbute('itemDeleteClick');
        let navigate = itemModel.getAttrbute('navigation').navigate;
        let imageUrls = itemModel.getAttrbute('imageUrls');
        let date = TimeUtils.getTimeWithSecond(data.createAt) + ' ' + TimeUtils.getWeekWithChina(data.createAt);
        let isAuthor = (this.teacherId == data.createBy) ? true : false;
        let imageHead = Utils.getTeacherAvatar(data.userHeader, data.userSex);
        return (
            <View style={{
                marginTop: 10,
                paddingTop: 10,
                paddingLeft: 15,
                paddingRight: 15,
                width: theme.screenWidth,
                backgroundColor: colors.white,
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                }}>
                    <CircleImage
                        customWidth={40}
                        customHeight={40}
                        imageUrl={imageHead}
                    />
                    <View style={{marginLeft: 10, marginRight: 50}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{fontSize: 15, color: '#565771'}}>
                                {data.userName}
                            </Text>
                        </View>
                        <View style={{marginTop: 10, height: 20}}>
                            <View style={{
                                height: 20,
                                paddingHorizontal: 5,
                                borderTopLeftRadius: 10,
                                borderBottomRightRadius: 10,
                                backgroundColor: colors.pinkBg,
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'absolute',
                            }}>
                                <Text style={{
                                    color: colors.reduceColor,
                                    fontSize: 13,
                                }}>{data.title}</Text>
                            </View>
                        </View>

                        <KBText style={{marginTop: 5, fontSize: 15, color: colors.text555}}>
                            {data.content}
                        </KBText>
                        {imageUrls.length > 0 ?
                            <KBDisplayImages
                                imgWidth={(theme.screenWidth - 110) / 3 - 10}
                                ticketImgs={imageUrls} isNetwork={true}/> : null}

                        <Text style={{marginVertical: 5, fontSize: 13, color: colors.text888}}>
                            {date}
                        </Text>
                    </View>

                    {isAuthor ?
                        <KBButton style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                        }}
                                  onPress={() => {
                                      if (!Utils.isNull(itemDeleteClick)) {
                                          itemDeleteClick(itemModel.key, data.id);
                                      }
                                  }}
                        >
                            <View style={{position: 'absolute', right: 0, top: 0}}>
                                <Image style={{
                                    width: 15,
                                    height: 15,
                                }}
                                       source={image.messageDeleteIcon}
                                />
                            </View>
                        </KBButton>
                        :
                        null
                    }
                </View>
                {isAuthor ?
                    <View style={{
                        // marginTop: 10,
                        flexDirection: 'row',
                        width: theme.screenWidth - 30,
                        height: 35,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTopColor: colors.empty,
                        borderTopWidth: 0.5,
                    }}>
                        <KBButton onPress={() => {
                            if (isAuthor) {
                                navigate('MessageRangDetail', {
                                    classId: data.visibleRang,
                                });
                            } else {
                                ToastUtils.showToast('仅发布人可以查看');
                            }
                        }}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image style={{width: 17, height: 14}}
                                       source={image.messageRange}
                                />

                                <Text
                                    style={{fontSize: 13, color: colors.text888, textAlign: 'center', marginLeft: 5}}>
                                    可见范围
                                </Text>
                            </View>
                        </KBButton>
                        <KBButton onPress={() => {
                            if (isAuthor) {
                                navigate('MessageConfirm', {
                                    confirmId: data.id,
                                    confirmType: 1,
                                });
                            } else {
                                ToastUtils.showToast('仅发布人可以查看');
                            }
                        }}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image style={{width: 18, height: 13}}
                                       source={require('../../../assets/class/ic_received.png')}
                                />
                                <Text
                                    style={{fontSize: 13, color: colors.text888, textAlign: 'center', marginLeft: 5}}>
                                    {'确认' + data.confirmNum + '人'}
                                </Text>
                            </View>
                        </KBButton>
                    </View> : null}

                <Divider/>
            </View>
        );
    };
}
