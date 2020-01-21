import React from 'react';
import {View, Text, Image} from 'react-native';
import Holder from '../../../components/tableView/Holder';
import KBButton from '../../../components/KBButton';
import colors from '../../../constants/colors';
import Utils from '../../../utils/Utils';
import Divider from '../../../components/Divider';
import CircleImage from '../../../components/CircleImage';
import TimeUtils from '../../../utils/TimeUtils';
import theme from '../../../constants/theme';
import KBDisplayImages from '../.././../components/KBDisplayImages';

export default class MessageAuditHolder extends Holder {

    build(itemModel) {
        let data = itemModel.getAttrbute('data');
        let dealClick = itemModel.getAttrbute('dealClick');
        let imageArray = itemModel.getAttrbute('imageArray');
        let isMultiple = itemModel.getAttrbute('isMultiple').getIsMultiple();
        let changStatus = itemModel.getAttrbute('changStatus');

        let selectImg = require('../../../assets/class/class_btn_choice_s.png');
        let unSelectImg = require('../../../assets/class/class_btn_choice_d.png');

        let typeStr = data.type === 1 ? '奖票' : '积分申请';

        return (
            <View style={{backgroundColor: colors.white, marginTop: 10}}>
                <KBButton onPress={() => {
                    changStatus(data);
                }}>
                    <View style={{
                        paddingTop: 10,
                        paddingHorizontal: 10,
                        alignItems: 'flex-start',
                        flexDirection: 'row',
                    }}>
                        {
                            isMultiple ?
                                <Image style={{
                                    width: 20,
                                    height: 20,
                                    marginRight: 10,
                                    marginTop: 10,
                                }}
                                       source={data.isSelected ? selectImg : unSelectImg}
                                />
                                :
                                null
                        }
                        <CircleImage customWidth={40} customHeight={40}
                                     imageUrl={Utils.getStudentAvatar(data.headerUrl)}/>
                        <View style={{flex: 1}}>

                            <View style={{marginLeft: 10, flexDirection: 'row', alignItems: 'center', flex: 1}}>
                                <View style={{flex: 1}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={{fontSize: 15, color: '#565771'}}>{data.createrName}</Text>
                                        <Text style={{
                                            fontSize: 14,
                                            color: colors.text999,
                                            marginLeft: 3,
                                        }}>({data.receptorName}的{Utils.getFamilyName(data.parentType)})</Text>
                                        <Text style={{marginLeft: 10, color: colors.themeColor}}>{typeStr}</Text>
                                    </View>

                                </View>
                                <Text style={{
                                    fontSize: 15,
                                    color: Utils.isNull(data.score) ? colors.trans : parseInt(data.score) > 0 ? '#40CB64' : '#F7734B',
                                }}>{Utils.getScore(data.score)}</Text>
                            </View>

                            <Text style={{
                                fontSize: 15,
                                color: colors.text444,
                                marginTop: 5,
                                marginHorizontal: 10,
                            }}>{data.content}</Text>

                            <View style={{marginHorizontal: 10}}>
                                {imageArray.length > 0 ?
                                    <KBDisplayImages imgWidth={(theme.screenWidth - 130) / 3 - 10}
                                                     ticketImgs={imageArray} isNetwork={true}/> : null}
                            </View>

                            <Text style={{
                                fontSize: 13,
                                color: colors.text888,
                                marginTop: 5,
                                marginHorizontal: 10,
                            }}>{Utils.isNull(data.submitAt) ? '' : TimeUtils.getTimeWithSecond(data.submitAt)}</Text>

                        </View>

                    </View>
                </KBButton>

                <Divider customStyle={{width: theme.screenWidth - 14, marginTop: 10}}/>
                {
                    isMultiple ? null
                        :
                        <View style={{flexDirection: 'row'}}>
                            <KBButton style={{flex: 1}} onPress={() => dealClick(data.id, itemModel.key, 2)}>
                                <View style={{flex: 1, height: 40, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{fontSize: 14, color: '#565771'}}>驳回</Text>
                                </View>
                            </KBButton>
                            <View style={{width: 1, marginVertical: 10, backgroundColor: colors.divider}}/>
                            <KBButton style={{flex: 1}} onPress={() => dealClick(data.id, itemModel.key, 1)}>
                                <View style={{flex: 1, height: 40, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{fontSize: 14, color: '#565771'}}>通过</Text>
                                </View>
                            </KBButton>
                        </View>
                }
            </View>
        );
    }
}
