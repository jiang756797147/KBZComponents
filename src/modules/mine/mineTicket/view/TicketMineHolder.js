import React from 'react';
import {View, Text, Image, Button, StyleSheet} from 'react-native';
import Holder from '../../../../components/tableView/Holder';
import KBButton from '../../../../components/KBButton';
import ToastUtils from '../../../../utils/ToastUtils';
import colors from '../../../../constants/colors';
import KBDisplayImages from '../../../../components/KBDisplayImages';
import CircleImage from '../../../../components/CircleImage';
import Utils from '../../../../utils/Utils';
import TimeUtils from '../../../../utils/TimeUtils';
import image from '../../../../constants/image';


export default class TicketMineHolder extends Holder {
    build(itemModel) {
        let data = itemModel.getAttrbute('data');
        let gotoClassStar = itemModel.getAttrbute('gotoClassStar');
        let gotoDetails = itemModel.getAttrbute('gotoDetails');
        let index = itemModel.getAttrbute('index');
        let longPress = itemModel.getAttrbute('longPress');
        let cancleLongPress = itemModel.getAttrbute('cancle');
        let deletePost = itemModel.getAttrbute('delete');
        let signIcon = '';
        switch (data.status) {
            case 0:
                signIcon = image.passNoShen;
                break;
            case 1:
                signIcon = image.passOk;
                break;
            case 2:
                signIcon = image.passNoPass;
                break;
            case 3:
                signIcon = image.passDelete;
                break;
        }

        let imageArray = [];
        if (!Utils.isNull(data.image)) {
            imageArray = data.image.split(',');
        }
        return (
            <KBButton onLongPress={() => {
                if (data.status === 0 || data.status === 1) {
                    longPress(data);
                } else {
                    ToastUtils.showToast('操作无效');
                }
            }}
                      onPress={() => gotoDetails(data)}
            >
                <View style={{backgroundColor: colors.white}}>
                    <View style={{
                        flexDirection: 'row',
                        paddingHorizontal: 14,
                        paddingVertical: 7,
                        alignItems: 'center',
                    }}>
                        <CircleImage customWidth={50} customHeight={50} borderWidth={1}
                                     borderColor={'#FFD571'}
                                     imageUrl={Utils.getStudentAvatar(data.headerUrl, data.sex)}/>
                        <View style={{flex: 1, marginLeft: 10}}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{
                                    fontSize: 15,
                                    color: colors.text666,
                                    flex: 1,
                                }}>{data.receptorName}</Text>
                                <Text style={{
                                    fontSize: 15,
                                    color: parseInt(data.score) > 0 ? '#FF4532' : colors.bluesky,
                                }}>{parseInt(data.score) > 0 ? '+' + data.score : data.score}</Text>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 5}}>
                                <Text style={{
                                    fontSize: 13,
                                    color: colors.text999,
                                }}>{TimeUtils.getTimeWithoutYearToM(data.updateAt)}</Text>
                                <Text style={{
                                    marginLeft: 5,
                                    fontSize: 13,
                                    color: colors.text999,
                                }}>{TimeUtils.getWeekWithChina(data.updateAt)}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        paddingHorizontal: 14,
                        paddingVertical: 15,
                    }}>
                        <Text style={{
                            fontSize: 15,
                            color: colors.text333,
                            marginRight: 20,
                            flex: 1,
                        }}>{data.content}</Text>
                    </View>
                    {
                        imageArray.length > 0 ?
                            <KBDisplayImages style={{paddingBottom: 5, paddingTop: 10, marginLeft: 6}}
                                             isNetwork={true}
                                             ticketImgs={imageArray}/> : null
                    }
                    {data.status === 1 ?
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            paddingHorizontal: 14,
                            paddingBottom: 7,
                        }}>
                            <KBButton onPress={() => {
                                if (parseInt(data.starLevel) === 0) {
                                    gotoClassStar(data);
                                } else {
                                    ToastUtils.showToast('已经推荐过了，不能重复推荐哦～');
                                }
                            }}>
                                <View style={{
                                    height: 26,
                                    width: 60,
                                    borderRadius: 13,
                                    backgroundColor: parseInt(data.starLevel) === 0 ? colors.divider : colors.yellowColor,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Text
                                        style={parseInt(data.starLevel) === 0 ? styles.recommendNo : styles.recommend}>{parseInt(data.starLevel) === 0 ? '加星' : '已加星'}</Text>
                                </View>

                            </KBButton>
                        </View>
                        :
                        null
                    }
                    <Image style={{width: 60, height: 47, position: 'absolute', top: 0, right: 70}}
                           resizeMode={'contain'}
                           source={signIcon}/>
                    {this.renderShadowView(index, data, cancleLongPress, deletePost)}
                </View>
            </KBButton>
        );
    };

    renderShadowView = (index, data, cancle, deleteMethord) => {
        return (
            data.delete ?
                <KBButton style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                }} onPress={() => cancle(data)}>
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: colors.black,
                        opacity: 0.5,
                        top: 0,
                        bottom: 0,
                        right: 0,
                        left: 0,
                        position: 'absolute',
                    }}>
                        <KBButton onPress={() => deleteMethord(data)}>
                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                <Image style={{width: 50, height: 50}}
                                       source={require('../../../../assets/cancel.png')}/>
                                <Text style={{fontSize: 17, color: colors.white, marginTop: 5}}>作废</Text>
                            </View>
                        </KBButton>
                    </View>
                </KBButton>
                :
                null
        );
    };
}

const styles = StyleSheet.create({
    recommend: {
        fontSize: 13,
        color: colors.text555,
    },
    recommendNo: {
        fontSize: 13,
        color: colors.text999,
    },
});
