import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

import Holder from '../../../components/tableView/Holder';
import KBButton from '../../../components/KBButton';
import CircleImage from '../../../components/CircleImage';

import theme from '../../../constants/theme';
import colors from '../../../constants/colors';
import Utils from '../../../utils/Utils';

export default class MessageApplyHolder extends Holder {

    build(itemModel) {

        let data = itemModel.getAttrbute('data');
        let itemClick = itemModel.getAttrbute('itemClick');
        let longPress = itemModel.getAttrbute('longPress');
        let index = itemModel.getAttrbute('index');
        let isMultiple = itemModel.getAttrbute('isMultiple').getIsMultiple();
        let changStatus = itemModel.getAttrbute('changStatus');

        let selectImg = require('../../../assets/class/class_btn_choice_s.png');
        let unSelectImg = require('../../../assets/class/class_btn_choice_d.png');

        let headImage = Utils.getTeacherAvatar(data.header, data.sex);
        let className = data.isParent ? data.belongClassName : data.applyClassName;
        let tip = data.isParent ? data.studentName + '的' + Utils.getFamilyName(data.type) : data.nickname + '老师';

        return (
            <KBButton key={index}
                      onLongPress={() => longPress(index)}
                      onPress={() => changStatus(data)}
            >
                <View style={{paddingLeft: 15, paddingRight: 15}}>
                    <View style={{
                        flexDirection: 'row',
                        height: 65,
                        alignItems: 'center',
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
                        <CircleImage
                            customWidth={45}
                            customHeight={45}
                            imageUrl={headImage}/>

                        <View style={{
                            marginLeft: 10,
                            justifyContent: 'center',
                            flex: 1,
                        }}>
                            <Text style={{
                                fontSize: 15,
                                color: colors.text444,
                            }}>{tip}</Text>
                            <Text style={{
                                marginTop: 10,
                                fontSize: 13,
                                color: colors.text888,
                            }}>{'申请加入' + className}</Text>

                        </View>

                        {isMultiple ? null :
                            this.renderButtons(itemClick, data)
                        }

                    </View>
                    <View style={{width: theme.screenWidth - 30, height: 1, backgroundColor: colors.divider}}/>
                </View>
            </KBButton>

        );
    };

    renderButtons = (action, data) => {
        return (
            <View style={{flexDirection: 'row'}}>
                <KBButton onPress={() => action(data, 2)}>
                    <View style={{
                        justifyContent: 'center',
                        width: 55,
                        height: 30,
                        marginRight: 10,
                        // borderWidth: 1,
                        // borderColor: colors.btnColor,
                        borderRadius: 5,
                        backgroundColor: colors.btnColor,
                    }}>
                        <Text style={{
                            textAlign: 'center',
                            color: colors.white,
                        }}>{'不同意'}</Text>
                    </View>
                </KBButton>
                <KBButton onPress={() => action(data, 1)}>
                    <View style={{
                        justifyContent: 'center',
                        width: 55,
                        height: 30,
                        borderWidth: 1,
                        borderColor: colors.btnColor,
                        borderRadius: 5,
                    }}>
                        <Text style={{
                            textAlign: 'center',
                            color: colors.btnColor,
                        }}>{'同意'}</Text>
                    </View>
                </KBButton>
            </View>
        );
    };
}
