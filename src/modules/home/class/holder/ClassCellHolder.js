import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import Holder from '../../../../components/tableView/Holder';
import KBButton from '../../../../components/KBButton';
import Divier from '../../../../components/Divider';
import KBHeadImage from '../../../../components/KBHeadImage';
import theme from '../../../../constants/theme';
import colors from '../../../../constants/colors';
import image from '../../../../constants/image';
import Utils from '../../../../utils/Utils';

export default class ClassCellHolder extends Holder {

    build(itemModel) {

        this.data = itemModel.getAttrbute('data');
        this.isLast = itemModel.getAttrbute('isLast');
        this.isSelectMore = itemModel.getAttrbute('isSelectMore');
        this.itemClick = itemModel.getAttrbute('itemClick');
        this.add = itemModel.getAttrbute('add');
        this.world = itemModel.getAttrbute('world');
        this.isMaster = itemModel.getAttrbute('isMaster');
        this.canAddStudent = itemModel.getAttrbute('canAddStudent');
        this.disPlayType = itemModel.getAttrbute('disPlayType');

        return (
            <View>
                {
                    this.data.map((item, index) => this.renderItemView(item, index))
                }
                {
                    this.isLast && (this.isMaster || this.canAddStudent) ?
                        <View>
                            <Divier customHeight={10}/>
                            <KBButton onPress={() => this.add()}>
                                <View style={{
                                    flexDirection: 'row',
                                    paddingLeft: 14,
                                    alignItems: 'center',
                                    height: 70,
                                    width: theme.screenWidth,
                                    backgroundColor: colors.white,
                                }}
                                >
                                    <Image style={{
                                        width: 60,
                                        height: 60,
                                    }}
                                           source={image.classAddStudent}
                                    />
                                    <Text style={{
                                        marginLeft: 15,
                                        fontSize: 15,
                                        color: colors.orangeRed,
                                    }}>添加学生</Text>
                                </View>
                            </KBButton>
                        </View>
                        :
                        null
                }
            </View>
        );
    };

    renderItemView(item, index) {
        let selectImg = require('../../../../assets/class/class_btn_choice_s.png');
        let unSelectImg = require('../../../../assets/class/class_btn_choice_d.png');
        let grade = item.rewardScore - item.punishScore;

        let header = Utils.getStudentAvatar(item.header, item.sex);
        let rewardScore = Utils.isNull(item.rewardScore) ? 0 : item.rewardScore;
        let punishScore = Utils.isNull(item.punishScore) ? 0 : item.punishScore;
        let sum = parseFloat(rewardScore) + parseFloat(punishScore);
        return (
            <KBButton key={index}
                      onPress={() => {
                          this.isSelectMore.getIsSelectMore() ? this.selectMoreitemClick(item) : this.itemClick(item);
                      }}
            >
                <View style={styles.itemView}>
                    <View style={styles.itemContent}>
                        <View style={styles.itemLeft}>
                            {
                                this.isSelectMore.getIsSelectMore() ?
                                    <Image style={{
                                        width: 17,
                                        height: 17,
                                        marginRight: 10,
                                        marginTop: 10,
                                    }}
                                           source={item.status == '1' ? selectImg : unSelectImg}
                                    />
                                    :
                                    null
                            }
                            <View style={{alignItems: 'center'}}>
                                <KBHeadImage
                                    grade={grade}
                                    borderWidth={2}
                                    borderColor={colors.yellowColor}
                                    length={55}
                                    imageUrl={header}
                                    TextName={item.optionName}
                                    Textfade={item.fade}
                                    TextAnimate={item.animBottom}
                                    Viewfade={item.Viewfade}
                                />
                            </View>

                            <View style={{marginLeft: 10}}>
                                <Text style={styles.itemTitleLabel}>
                                    {item.name}
                                </Text>

                                <View style={{
                                    flexDirection: 'row',
                                    marginTop: 15,
                                    alignItems: 'center',
                                }}
                                >

                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Image style={{
                                            width: 13,
                                            height: 13,
                                        }}
                                               source={require('../../../../assets/class/ic_score.png')}
                                        />
                                        <Text style={{
                                            marginLeft: 5,
                                            fontSize: 12,
                                            color: colors.toolBar,
                                        }}>{rewardScore}</Text>
                                    </View>

                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Image style={{
                                            marginLeft: 10,
                                            width: 13,
                                            height: 13,
                                        }}
                                               source={require('../../../../assets/class/ic_deduction.png')}
                                        />
                                        <Text style={{
                                            marginLeft: 5,
                                            fontSize: 12,
                                            color: colors.orangeRed,
                                        }}>{punishScore}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Image style={{
                                            marginLeft: 10,
                                            width: 13,
                                            height: 13,
                                        }}
                                               resizeMode={'contain'}
                                               source={require('../../../../assets/class/ic_sum_score.png')}
                                        />
                                        <Text style={{
                                            marginLeft: 5,
                                            fontSize: 12,
                                            color: colors.text888,
                                            textAlign: 'center',
                                        }}>{(Number.isInteger(sum) ? sum.toString() : sum.toFixed(1).toString())}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    {
                        index == this.data.length - 1 ?
                            null
                            :
                            <Divier customStyle={{position: 'absolute', bottom: 0}}/>
                    }
                </View>

            </KBButton>
        );
    };

    selectMoreitemClick = (item) => {
        let status = item.status;

        item.status = status == '0' ? '1' : '0';
        this.world.setState({});
    };
}

const styles = StyleSheet.create({

    itemView: {
        width: theme.screenWidth,
        backgroundColor: colors.white,
        paddingLeft: 14,
        paddingRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        // height: 75,
    },

    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,
    },
    itemLeft: {
        flex: 7.5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemTitleLabel: {
        marginTop: 10,
        fontSize: 15,
        color: colors.text555,
    },
});
