import React from 'react';
import {Image, StyleSheet, Text, View, Keyboard} from 'react-native';
import colors from '../../../constants/colors';
import theme from '../../../constants/theme';
import fetchUrl from '../../../constants/fetchUrl';
import KBButton from '../../../components/KBButton';
import KBHeader from '../../../components/KBHeader';
import CircleImage from '../../../components/CircleImage';
import TextInputWithClear from '../../../components/TextInputWithClear';
import Divider from '../../../components/Divider';
import Utils from '../../../utils/Utils';
import ToastUtils from '../../../utils/ToastUtils';
import HttpUtils from '../../../utils/HttpUtils';


import BaseScreen from '../../../base/BaseScreen';


export default class JoinClassAfterScreen extends BaseScreen {
    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.classData = params.classData;
        this.goBack = params.goBack;
        this.state = {
            isAuditing: false,
            subject: '',
        };
    }

    // componentDidMount() {
    //     this.inputSubjectPop.show();
    // }

    renderData() {
        return (
            <View style={{alignItems: 'center'}}>
                <CircleImage imageUrl={Utils.getClassAvatar(this.classData.header)} customWidth={76}
                             customHeight={76}
                             customStyle={{marginTop: 80}}/>
                <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginTop: 15,
                    color: colors.text333,
                }}>{this.classData.name + (this.state.subject.length > 0 ? this.state.subject + '老师' : '')}</Text>
                <KBButton onPress={() => {
                    this.applyIntoClass();
                }}>
                    <View style={{
                        paddingHorizontal: 25,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: '#FBD962',
                        marginTop: 45,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Text style={{color: colors.text333, fontSize: 14}}>申请加入班级</Text>
                    </View>
                </KBButton>
            </View>
        );
    }

    render() {
        let renderView = super.render();
        return (
            <View style={this.styles.container}>
                <KBHeader isLeft={true} title={'加入班级'} touchBack={() => this.goBack()} {...this.props}/>
                {/*{this.state.isAuditing ?

                    <View style={{alignItems: 'center'}}>
                        <Image source={require('../../../assets/avatar_2.jpeg')}
                               style={{width: 80, height: 60, marginTop: 130}}
                               resizeMode={'cover'}/>
                        <Text style={{
                            fontSize: 16,
                            marginTop: 30,
                            color: colors.text333
                        }}>等待审核中</Text>
                        <Text style={{
                            color: colors.text999,
                            fontSize: 12,
                            marginTop: 10
                        }}>您已申请加入{this.classData.name}，请等待班主任审核</Text>
                    </View>
                    :
                }*/}
                {renderView}
                {/*<PopupDialog*/}
                {/*width={null}*/}
                {/*height={null}*/}
                {/*dismissOnTouchOutside={false}*/}
                {/*onDismissed={() => {*/}
                {/*Keyboard.dismiss();*/}
                {/*}}*/}
                {/*dialogStyle={{backgroundColor: colors.trans}}*/}
                {/*ref={(c) => this.inputSubjectPop = c}>*/}
                {/*{this.renderInputPop()}*/}
                {/*</PopupDialog>*/}
            </View>
        );
    }

    renderInputPop() {
        return (
            <View style={{width: theme.screenWidth * 0.85, alignItems: 'center'}}>
                <View
                    style={{borderRadius: 5, width: theme.screenWidth * 0.85, backgroundColor: colors.white}}>
                    <Text style={{
                        marginLeft: 14,
                        marginTop: 15,
                        fontSize: 13,
                        fontWeight: '400',
                        color: colors.text333,
                    }}>
                        学科名称
                    </Text>
                    <TextInputWithClear
                        ref={(c) => this.subjectInput = c}
                        placeholderText={'请输入执教学科名称'}
                        onFocusUnderlineColor={'#F9DB63'}
                        unFocusUnderlineColor={'#E0E0E0'}
                        maxLength={16}
                        inputStyle={{height: 30}}
                        viewStyle={{
                            marginTop: 20,
                            marginHorizontal: 14,
                            flex: 0,
                        }}/>
                    <Divider customStyle={{marginTop: 25, width: theme.screenWidth * 0.85}}/>
                    <View style={{
                        width: theme.screenWidth * 0.85,
                        height: 45,
                        borderBottomLeftRadius: 5,
                        borderBottomRightRadius: 5,
                        flexDirection: 'row',
                    }}>
                        {/*<KBButton style={{flex: 1}}*/}
                        {/*onPress={() => {*/}
                        {/*this.inputSubjectPop.dismiss();*/}
                        {/*}}>*/}
                        {/*<View style={{*/}
                        {/*flex: 1,*/}
                        {/*borderBottomLeftRadius: 5,*/}
                        {/*backgroundColor: colors.white,*/}
                        {/*alignItems: 'center',*/}
                        {/*justifyContent: 'center',*/}
                        {/*}}>*/}
                        {/*<Text style={{color: colors.text888, fontSize: 14}}>取消</Text>*/}
                        {/*</View>*/}
                        {/*</KBButton>*/}
                        <KBButton style={{flex: 1}} onPress={() => {
                            this.setState({
                                subject: this.subjectInput.getText(),
                            }, () => {
                                if (this.state.subject.length > 0) {
                                    this.inputSubjectPop.dismiss();
                                } else {
                                    ToastUtils.showToast('请先输入执教学科');
                                }
                            });
                        }}>
                            <View style={{
                                flex: 1,
                                borderBottomLeftRadius: 5,
                                borderBottomRightRadius: 5,
                                backgroundColor: '#FFDB49',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Text style={{color: colors.text333, fontSize: 14}}>确定</Text>
                            </View>
                        </KBButton>
                    </View>
                </View>
            </View>
        );
    };

    onClick = () => {
        this.setState({isAuditing: true});
    };

    applyIntoClass = () => {
        let formData = new FormData();
        if (!Utils.isNull(this.classData.id)) {
            formData.append('classId', this.classData.id);
        }
        /* if (!Utils.isNull(this.state.subject)) {
             formData.append('subject', this.state.subject);
         }*/
        HttpUtils.doPostWithToken(fetchUrl.applyIntoClass, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast('申请成功');
                this.goBack();
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
            backgroundColor: 'white',
            flex: 1,
        },
    });
}
