import React from 'react';
import {StyleSheet, Text, View, DeviceEventEmitter, Image} from 'react-native';
import BaseScreen from '../../../../base/BaseScreen';

import theme from '../../../../constants/theme';
import colors from '../../../../constants/colors';
import {UPDATE_CONTACT} from '../../../../constants/notify';
import fetchUrl from '../../../../constants/fetchUrl';
import image from '../../../../constants/image';

import ToastUtils from '../../../../utils/ToastUtils';
import HttpUtils from '../../../../utils/HttpUtils';
import Utils from '../../../../utils/Utils';

import KBHeader from '../../../../components/KBHeader';
import TextInputWithClear from '../../../../components/TextInputWithClear';
import Divider from '../../../../components/Divider';
import KBButton from '../../../../components/KBButton';
import KBScrollView from "../../../../components/KBScrollView";


export default class ParentalPermissionSettingsScreen extends BaseScreen {

    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.classId = params.classId;
        this.rankSwitch = params.rankSwitch;
        this.isMaster = Utils.isNull(params.isMaster) ? false : params.isMaster;
        // if (this.isMaster) {

        // }
        this.score = '';
        this.number = '';
        this.state = Object.assign({
            isEdit: false,
            setScore: false,

            isRefreshing: false,

        }, this.state);
        this.eventEmitter = DeviceEventEmitter;
    }

    componentDidMount() {
        super.componentDidMount();

    }

    onSuccess(responseData) {
        if (responseData.data && responseData.data.length > 0) {
            let data = responseData.data[0];
            this.score = data.accessScore;
            this.number = data.ticketNum;
            this.setState({});
        }
    }

    onFail(responseData) {
        super.onFail(responseData);
        ToastUtils.showToast(responseData.message);
    }

    onEnd() {
        super.onEnd();
        this.setState({isRefreshing: false});
    }



    getApiUrl() {
        return fetchUrl.getAccessScore + 'classId=' + this.classId;
    }

    renderData() {
        return (
            <KBScrollView style={{backgroundColor: colors.white}}>
                <View style={{
                    flexDirection: 'row',
                    paddingHorizontal: 14,
                    justifyContent: 'space-between',
                    paddingVertical: 16,
                }}>
                    <Text style={{fontSize: 15, color: colors.text333}}>家长端显示排名</Text>
                    <View style={{flexDirection: 'row'}}>

                        {
                            <KBButton onPress={() => this.setRankSwitch()}>
                                <Image style={{height: 20, width: 36}}
                                       source={this.rankSwitch === 0 ? require('../../../../assets/notice_close.png') : require('../../../../assets/notice_open.png')}/>
                            </KBButton>
                        }

                    </View>
                </View>
                <Divider customStyle={{height: 15}}/>
                <View style={{
                    paddingLeft: 14,
                    marginTop: 15,
                    paddingTop: 5
                }}>
                    <Text style={{fontSize: 15, color: colors.text333}}>家长积分申请设置</Text>
                    <Divider customStyle={{marginTop: 15, height: 1, width: theme.screenWidth - 16,}}/>
                </View>

                <View style={{marginTop: 10}}>
                    {this.renderDialogContent('家长权限分数', this.score)}
                    {this.renderDialogContent('家长权限次数', this.number)}
                </View>
            </KBScrollView>
        );
    }

    renderBottom() {
        return (
            <View style={{
                width: theme.screenWidth,
                height: 49,
                alignItems: 'center',
                // backgroundColor: colors.empty
            }}>
                <KBButton onPress={() => this.setScorePost()}>
                    <View style={{
                        width: theme.screenWidth - 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor:(this.score.length===0||this.number.length===0)?colors.lightGray:colors.yellowColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Text style={{fontSize: 15, color: colors.text555}}>确认</Text>
                    </View>
                </KBButton>
            </View>
        );
    }

    render() {
        let renderView = super.render();
        return (
            <View style={this.styles.container}>
                <KBHeader isLeft={true}
                          {...this.props}
                          title={'家长端权限设置'}
                />
                {renderView}
                {this.renderBottom()}
            </View>
        );
    }

    renderDialogContent(title, value) {
        return (
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 5,
                    flexDirection: 'row',
                }}>

                <View style={{height: 40, justifyContent: 'center'}}>
                    <Text style={{fontSize: 15, color: colors.text333}}>{`${title}：`}</Text>
                </View>
                <TextInputWithClear
                    inputStyle={{fontSize: 15, color: colors.text333, textAlignVertical: 'center'}}
                    viewStyle={{
                        paddingHorizontal: 5,
                        height: 40,
                        backgroundColor: colors.white,
                    }}

                    keyboardType={'number-pad'}
                    showDriver={false}
                    multiline={true}
                    value={value.toString()}
                    blurOnSubmit={true}
                    clearIconVisible={false}
                    placeholderText={'请输入分数'}
                    onTextChange={(text) => {
                        this.scoreSelected(text,title);

                    }}
                />
            </View>
        );
    }
    /**
     * 分值输入
     */
    scoreSelected(text,title) {

        if (text.length > 0 && text.substr(0, 1) == 0) {
            text = text.substr(1, text.length - 1);
        }

        if (title === '家长权限分数') {
            this.score = text
        } else {
            this.number = text
        }
        this.setState({})
    };
    setRankSwitch = () => {

        let formData = new FormData();
        formData.append('rankSwitch', this.rankSwitch == 1 ? 0 : 1);
        formData.append('classId', this.classId);

        HttpUtils.doPostWithToken(fetchUrl.setRankSwitch, formData, {
            onSuccess: (responseData) => {
                if (this.rankSwitch == 1) {
                    this.rankSwitch = 0;
                } else {
                    this.rankSwitch = 1;
                }
                this.setState({});
            },
            onFail: function (responseData) {
                ToastUtils.showToast(responseData.message);
            },
        });

    };


    /**
     * 设置分数请求(教师端设置权限分）
     */
    setScorePost = () => {
        if (this.score.length===0){
            ToastUtils.showToast('请输入分数');
            return;
        }
        if (this.number.length===0){
            ToastUtils.showToast('请输入次数');
            return;
        }

        let formData = new FormData();
        formData.append('classId', this.classId);
        formData.append('accessScore', this.score);
        formData.append('ticketNum', this.number);


        HttpUtils.doPostWithToken(fetchUrl.addAccessScore, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onNullData: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        });


    };


    styles = StyleSheet.create({
        container: {
            backgroundColor: colors.white,
            flex: 1,
        },
    });

}
