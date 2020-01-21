import React from 'react';
import {View, StyleSheet, Image, Text, Animated} from 'react-native';

import Holder from '../../../../components/tableView/Holder';
import colors from '../../../../constants/colors';
import theme from '../../../../constants/theme';
import image from '../../../../constants/image';
import KBHeadImage from '../../../../components/KBHeadImage';
import KBButton from '../../../../components/KBButton';
import CircleImage from '../../../../components/CircleImage';
import Utils from '../../../../utils/Utils';
import ToastUtils from "../../../../utils/ToastUtils";

export default class ClassCollectionHolder extends Holder {

    build(itemModel) {

        this.data = itemModel.getAttrbute('data');
        this.isEdit = itemModel.getAttrbute("isEdit");
        this.isSelectMore = itemModel.getAttrbute('isSelectMore');
        this.itemClick = itemModel.getAttrbute('itemClick');
        this.add = itemModel.getAttrbute('add');
        this.groupId = itemModel.getAttrbute('groupId');
        this.isMaster = itemModel.getAttrbute('isMaster');
        this.canAddStudent = itemModel.getAttrbute('canAddStudent');
        this.world = itemModel.getAttrbute('world');
        this.disPlayType = itemModel.getAttrbute('disPlayType');
        this.isLast = itemModel.getAttrbute('isLast');

        return (
            <View style={{flexWrap: 'wrap', flexDirection: 'row', paddingBottom: 15}}>
                {
                    this.isSelectMore.getIsSelectMore() ?
                        this.data.map((item, index) => this.renderSelcteItem(item, index))
                        :
                        <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
                            {this.data.map((item, index) => this.renderCollectionItem(item, index))}
                            {this.isLast && (this.isMaster || this.canAddStudent) ?
                                <KBButton onPress={() => this.add(this.groupId)}>
                                    <View style={{
                                        width: theme.screenWidth / 4,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    >
                                        <View style={{
                                            paddingTop: 20,
                                            backgroundColor: colors.white,
                                        }}>
                                            <Image style={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: 30,
                                            }}
                                                   source={image.classAddStudent}
                                            />
                                        </View>
                                        <Text style={{
                                            fontSize: 13,
                                            marginTop: 17,
                                            color: colors.text555,
                                        }}>添加</Text>
                                    </View>
                                </KBButton> : null
                            }
                        </View>
                }
            </View>
        );
    };

    renderSelcteItem(item, index) {

        let header = Utils.getStudentAvatar(item.header, item.sex);
        let selectImg = require('../../../../assets/class/class_btn_choice_s.png');
        let unSelectImg = require('../../../../assets/class/class_btn_choice_d.png');
        return (
            <KBButton key={index}
                      onPress={() => this.selectMoreitemClick(index)}
            >
                <View style={{
                    width: theme.screenWidth / 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                }}>
                    <View>
                        <View style={{alignItems: 'center'}}>
                            <CircleImage
                                customWidth={60}
                                customHeight={60}
                                borderColor={colors.yellowColor}
                                borderWidth={2}
                                imageUrl={header}
                            />
                            <Animated.Text numberOfLines={1} style={{
                                color: colors.white,
                                fontSize: 13,
                                fontWeight: 'bold',
                                position: 'absolute',
                                bottom: item.animBottom,
                                maxWidth: 60,
                                opacity: item.fade,
                            }}>{Utils.isNull(item.optionName) ? '' : item.optionName}</Animated.Text>
                        </View>
                        <Image style={{
                            position: 'absolute',
                            width: 17,
                            height: 17,
                            bottom: 0,
                            right: 0,
                        }}
                               source={item.status == '0' ? unSelectImg : selectImg}
                        />
                    </View>
                    <Text style={{
                        fontSize: 13,
                        marginTop: 10,
                        color: colors.text555,
                    }}>{item.name}</Text>
                </View>
            </KBButton>
        );
    };

    renderCollectionItem(item, index) {
        let header = Utils.getStudentAvatar(item.header, item.sex);
        let rewardScore = Utils.isNull(item.rewardScore) ? 0 : parseFloat(item.rewardScore) === 0 ? 0 : parseFloat(item.rewardScore);
        let punishScore = Utils.isNull(item.punishScore) ? 0 : parseFloat(item.punishScore) === 0 ? 0 : parseFloat(item.punishScore);
        let grade = parseInt(rewardScore - punishScore);
        let sum = rewardScore - punishScore;
        return (
            <KBButton key={index}
                      onPress={() => this.itemClick(item)}>
                <View style={{
                    width: theme.screenWidth / 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {this.isEdit?<Image style={{
                        width: 20,
                        height: 20,
                        backgroundColor: colors.redSubmitBtnColor,
                        position: 'absolute',
                        top: 5,
                        right: 5
                    }}/>:null}

                    <View style={{
                        width: theme.screenWidth / 4,
                        alignItems: 'center',

                    }}>
                        <KBHeadImage
                            grade={grade}
                            borderWidth={2}
                            borderColor={colors.yellowColor}
                            imageUrl={header}
                            TextName={item.optionName}
                            Textfade={item.fade}
                            TextAnimate={item.animBottom}
                            Viewfade={item.Viewfade}
                        />
                    </View>
                    {this.disPlayType == 0 ?
                        <View style={{
                            flexDirection: 'row',
                            width: 81,
                            height: 22,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: colors.yellowColor,
                            marginTop: -10,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: colors.yellowColor,
                        }}>

                            <View style={{
                                width: 40,
                                height: 20,
                                borderBottomLeftRadius: 10,
                                borderTopLeftRadius: 10,
                                backgroundColor: colors.yellowColor,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <Text style={{
                                    fontSize: 10,
                                    textAlign: 'center',
                                    color: colors.text444,
                                }}>{rewardScore}</Text>
                            </View>

                            <View style={{
                                width: 40,
                                height: 20,
                                borderBottomRightRadius: 10,
                                borderTopRightRadius: 10,
                                backgroundColor: colors.white,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <Text style={{
                                    fontSize: 10,
                                    textAlign: 'center',
                                    color: colors.text444,
                                }}>{(punishScore === 0 ? '' : '-') + punishScore}</Text>
                            </View>
                        </View> : null}

                    {this.disPlayType == 1 ?
                        <View style={{
                            width: 70,
                            marginTop: -10,
                            height: 20,
                            borderRadius: 10,
                            backgroundColor: colors.yellowColor,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Text style={{
                                fontSize: 13,
                                textAlign: 'center',
                                color: colors.text444,
                            }}>{Number.isInteger(sum) ? sum : sum.toFixed(1)}</Text>
                        </View>
                        : null
                    }


                    <Text style={{fontSize: 13, marginTop: 5, color: colors.text555}}>
                        {item.name}
                    </Text>
                </View>
            </KBButton>
        );
    };

    selectMoreitemClick = (index) => {
        let status = this.data[index].status;

        this.data[index].status = status == '0' ? '1' : '0';
        this.world.setState({});
    };
}
