import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import moment from 'moment';
import Holder from '../../../../components/tableView/Holder';
import KBPolygonImage from '../../../../components/KBPolygonImage';
import KBDropPopMenu from '../../../../components/popMenu/KBDropPopMenu';
import {renderers} from '../../../../components/popMenu/src';

import colors from '../../../../constants/colors';
import theme from '../../../../constants/theme';
import Utils from '../../../../utils/Utils';
import TimeUtils from '../../../../utils/TimeUtils';

export default class ClassReportHolder extends Holder {
    popMenu = [
        {
            text: '删除',
        },
    ];

    build(itemModel) {
        let data = itemModel.getAttrbute('data');
        let deleteReport = itemModel.getAttrbute('delete');
        let isMaster = itemModel.getAttrbute('isMaster');

        let createAt = TimeUtils.getTimeWithDay(data.createAt);
        let currentDate = moment().format('YYYY-MM-DD');

        let isDelete = moment(currentDate).diff(moment(createAt), 'week') < 1;

        return (
            <View style={{
                backgroundColor: colors.white,
                paddingVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14,
            }}>
                <KBPolygonImage width={'40'} imageUrl={Utils.getSystemAvatar(data.optionHeader)}/>
                <View style={{flex: 1, marginLeft: 10}}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 1, paddingRight: 20}}>
                            <Text style={{
                                flex: 1,
                                fontSize: 14,
                                color: colors.text333,
                                lineHeight: 20,
                            }}>{data.content}</Text>
                        </View>

                        <Text style={{
                            fontSize: 14,
                            color: parseInt(data.score) > 0 ? '#4986F7' : '#F7734B',
                        }}>{Utils.getScore(data.score)}</Text>
                        {isMaster && isDelete ? this.renderDeleteIcon(deleteReport, data) : null}

                    </View>
                    <View style={{flexDirection: 'row', marginTop: 5}}>
                        <Text style={{
                            fontSize: 13,
                            color: colors.text999,
                        }}>{TimeUtils.getTimeWithMinute(data.createAt)}</Text>
                        <Text style={{
                            fontSize: 13,
                            color: colors.text999,
                            marginLeft: 5,
                        }}>{data.type == 1 ? (data.updaterName + '老师审核' + data.receptorName + '的奖票') : (data.createrName + '老师点评' + data.receptorName)}</Text>
                    </View>
                </View>
            </View>
        );
    };

    renderDeleteIcon = (action, item) => {
        return (
            <KBDropPopMenu
                renderer={renderers.PopoverNew}
                rendererProps={{placement: 'bottom', preferredPlacement: 'top'}}
                // menuStyle={{position: 'absolute', right: 0, top: theme.statusHeight,}}
                menuTriggerStyle={{width: 50, height: 20, justifyContent: 'center'}}
                menuTrigger={() => {
                    return (
                        <View>
                            <Image style={{width: 13, height: 7}}
                                   resizeMode={'contain'}
                                   source={require('../../../../assets/icon_down.png')}
                            />
                        </View>
                    );
                }}
                optionsStyle={{width: theme.screenWidth / 3, marginTop: 0, borderRadius: 5}}
                optionStyle={{paddingLeft: 0, justifyContent: 'center', alignItems: 'center'}}
                dataArray={this.popMenu}
                uniqueKey={'text'}
                textStyle={{color: colors.white, fontSize: 15}}
                onSelect={(value) => action(item)}
            />
        );
    };
}
