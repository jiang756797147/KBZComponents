import React from "react"
import {Container} from 'native-base'
import {Image, StyleSheet, Text, View, TextInput} from "react-native";
import BaseScreen from "../../../base/BaseScreen";
import KBHeader from "../../../components/KBHeader";
import colors from "../../../constants/colors";
import Divider from "../../../components/Divider";
import KBButton from "../../../components/KBButton";
import KBDisplayImages from "../../../components/KBDisplayImages";
import ToastUtils from "../../../utils/ToastUtils";
import fetchUrl from "../../../constants/fetchUrl";
import HttpUtils from "../../../utils/HttpUtils";
import Utils from "../../../utils/Utils";
import theme from "../../../constants/theme";

export default class MineTicketDetailsScreen extends BaseScreen {

    constructor(props) {
        super(props);

        // 奖票类型 1 ：奖票录入 2 ：积分申请
        this.state = {
            ...this.state,

            scoreType: 0,  //0:扣除   1：奖励
        };
        const {params} = this.props.navigation.state;
        this.id = params.id;
        this.refresh = params.refresh;  //刷新方法

        this.oldScore = 0;
        this.data = {};
    }


    getApiUrl() {
        return fetchUrl.getTicketData + 'ticket_id=' + this.id;
    }

    onSuccess(responseData) {
        this.data = responseData.data;
        let imageArray = [];
        if (!Utils.isNull(this.data.image)) {
            imageArray = this.data.image.split(',');
        }

        this.imageArray = imageArray;
        this.oldScore = this.data.score;
        this.setState({
            scoreType: this.data.score > 0 ? 1 : 0
        });
    }

    renderData() {

        let hasEditScore = this.data.type == 1 && this.data.status == 0;

        return (
            <View style={{backgroundColor: colors.white, flex: 1}}>

                <KBHeader title="奖票详情" isLeft={true} {...this.props}/>
                <Divider/>

                <Text style={{
                    fontSize: 14,
                    color: colors.text444,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    lineHeight: 25
                }}><Text style={{color: colors.yellowColor}}>#自定义内容：</Text>{this.data.content}</Text>


                {this.imageArray && this.imageArray.length > 0 ?
                    <View style={{marginHorizontal: 15,}}>
                        <KBDisplayImages imgWidth={(theme.screenWidth - 130) / 3 - 10}
                                      ticketImgs={this.imageArray} isNetwork={true}/>
                    </View>
                    : null}

                <Divider customColor={colors.divider} customHeight={10}/>

                <View style={styles.itemView}>
                    <Text style={styles.name}>被奖扣人：</Text>
                    <Text style={styles.content}>{this.data.receptor_name}</Text>
                </View>
                <View style={styles.itemView}>
                    <Text style={styles.name}>事件时间：</Text>
                    <Text style={styles.content}>{this.data.create_at}</Text>
                </View>
                <View style={styles.itemView}>
                    <Text style={styles.name}>自定义机制：</Text>
                    <View style={{alignItems: 'center', flexDirection: 'row', flex: 4}}>
                        {
                            hasEditScore ?
                                <KBButton onPress={() => {
                                    this.setState({scoreType: 1})
                                }}>
                                    <View style={{alignItems: 'center', flexDirection: 'row', flex: 1}}>
                                        <Image style={styles.image}
                                               source={this.state.scoreType == 1 ? require('../../../assets/class/class_btn_choice_s.png') : require('../../../assets/class/class_btn_choice_d.png')}/>
                                        <Text style={{marginLeft: 5}}>奖励</Text>
                                    </View>
                                </KBButton>
                                :
                                this.state.scoreType === 0 ? null : <Text style={{marginLeft: 0}}>奖励</Text>
                        }

                        {
                            hasEditScore ?
                                <KBButton onPress={() => {
                                    this.setState({scoreType: 0})
                                }}>
                                    <View style={{alignItems: 'center', flexDirection: 'row', flex: 2}}>
                                        <Image style={[styles.image, {marginLeft: 30}]}
                                               source={this.state.scoreType == 0 ? require('../../../assets/class/class_btn_choice_s.png') : require('../../../assets/class/class_btn_choice_d.png')}/>
                                        <Text style={{marginLeft: 4}}>扣除</Text>
                                    </View>
                                </KBButton>
                                :
                                this.state.scoreType === 0 ? <Text style={{marginLeft: 0}}>扣除</Text> : null
                        }
                    </View>
                </View>


                <View style={styles.itemView}>
                    <Text style={styles.name}>分值：</Text>

                    <View style={{
                        width: 0,
                        flex: 4,
                        flexDirection: 'row',
                    }}>
                        {
                            this.data.type === 1 && this.data.original_score != 0 ?
                                <Text style={{
                                    fontSize: 14,
                                    textDecorationLine: 'line-through',
                                    marginRight: 20,
                                    color: colors.orangeRed
                                }}>{this.data.original_score > 0 ? `+${this.data.original_score}` : this.data.original_score}</Text>
                                :
                                null
                        }
                        {
                            hasEditScore ?
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <TextInput style={{
                                        fontSize: 14,
                                        flex: 1,
                                        color: colors.text444,
                                        textAlignVertical: 'center',
                                    }}
                                               underlineColorAndroid="transparent"
                                               onChangeText={(t) => {
                                                   if (t.length > 3) {
                                                       ToastUtils.showToast('分数不能大于1000分！');
                                                       return;
                                                   }
                                                   if (Utils.isNull(t)) {
                                                       this.data.score = 0;
                                                   } else {
                                                       this.data.score = parseInt(t);
                                                   }
                                                   this.setState({});
                                               }}
                                               keyboardType={'numeric'}
                                               value={Math.abs(this.data.score).toString()}
                                    />
                                    <Text style={{fontSize: 14, color: colors.text888}}>（点击可更改分数）</Text>
                                </View>
                                :
                                <Text style={{
                                    fontSize: 14,
                                    color: colors.text444,
                                }}>{Math.abs(this.data.score)}</Text>
                        }
                    </View>

                </View>

                {
                    this.data.status === 0 ?
                        <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 20}}>

                            <KBButton onPress={() => {
                                if (this.data.score === 0) {
                                    ToastUtils.showToast("无效分数");
                                    return;
                                }
                                this.dealTicket();
                            }}>
                                <View style={{
                                    marginHorizontal: 20,
                                    height: 42,
                                    marginTop: 50,
                                    backgroundColor: '#FFDA48',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 21,
                                }}>
                                    <Text style={{
                                        fontSize: 15,
                                        color: colors.text333
                                    }}>{this.data.type === 2 ? '通过' : '录入'}</Text>

                                </View>
                            </KBButton>

                        </View>
                        :
                        null
                }

            </View>
        )

    }


    dealTicket = () => {

        let score = this.data.score;
        let formData = new FormData();
        formData.append('ticketId', this.id);
        formData.append('type', 1);
        let modifiedScore = this.state.scoreType == 0 ? -Math.abs(score) : Math.abs(score);

        if (modifiedScore !== this.oldScore) {
            formData.append("modifiedScore", modifiedScore);
        }

        console.log('formData ==========', formData);

        HttpUtils.doPostWithToken(fetchUrl.dealTicket, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(responseData.message);
                this.refresh();
                this.props.navigation.goBack();
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onNullData: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        })
    };

}


const styles = StyleSheet.create({
    image: {
        width: 15,
        height: 15,
    },
    name: {
        width: 0,
        flex: 2,
        fontSize: 14,
        color: colors.text444,
    },
    content: {
        width: 0,
        flex: 4,
        fontSize: 14,
        color: colors.text444,
    },
    itemView: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    recommend: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 26,
        borderRadius: 13,
        backgroundColor: colors.yellowColor,
        paddingHorizontal: 15,
    }
});
