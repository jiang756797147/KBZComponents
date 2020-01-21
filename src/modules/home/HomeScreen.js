import React from 'react';
import {Image, View, Text, StyleSheet, DeviceEventEmitter} from 'react-native';
import lodash from 'lodash';

import BaseScreen from '../../base/BaseScreen';
import KBHeader from '../../components/KBHeader';
import KBButton from '../../components/KBButton';
import KBScrollView from '../../components/KBScrollView';

import KBDropPopMenu from '../../components/popMenu/KBDropPopMenu';
import Divider from '../../components/Divider';
import KBAlertDialog from '../../components/dialog/KBAlertDialog';

import colors from '../../constants/colors';
import fetchUrl from '../../constants/fetchUrl';
import Utils from '../../utils/Utils';
import HttpUtils from '../../utils/HttpUtils';
import ToastUtils from '../../utils/ToastUtils';
import UserData from '../../constants/UserData';
import theme from '../../constants/theme';

import {renderers} from '../../components/popMenu/src';

import {MESSAGE_UPDATE, UPDATE_CONTACT} from '../../constants/notify';
import CircleImage from '../../components/CircleImage';

import InstaceMessageView from '../message/view/InstaceMessageView';

export default class HomeScreen extends BaseScreen {

    headerArray = [
        {
            icon: require('../../assets/class/home_class_add.png'),
            text: '加入班级',
            target: 'JoinClass',
        },
    ];

    constructor(props) {
        super(props);
        this.state = Object.assign({
            isRefreshing: false,

            allClassData: [],
            classBuild: [],
            classJoin: [],
            classLook: [],  //有权查看的班级列表
            auth: [],  //班级权限列表

            isTextInput: false,
            dialogContent: '',

        }, this.state);
        this.eventEmitter = DeviceEventEmitter;
        this.matter = [];
    }

    getApiUrl() {
        return fetchUrl.getClassListNew;
    }

    onSuccess(responseData) {

        if (responseData.data) {

            let managerClass = responseData.data.managerClasses;
            let joinClass = responseData.data.joinClasses;
            let visibleClass = responseData.data.visibleClasses;
            managerClass.forEach((item) => {
                item.isMaster = true;
            });
            joinClass.forEach((item) => {
                item.isMaster = false;
            });
            visibleClass.forEach((item) => {
                item.isMaster = false;
            });
            let allClassData = [...managerClass, ...joinClass, ...visibleClass];

            let resultAllClass = lodash.uniqBy(allClassData, 'id');

            UserData.getInstance().setClass(resultAllClass);
            this.setState({
                isRefreshing: false,
                statictis: responseData.data.statictis,
                classBuild: managerClass,
                classJoin: joinClass,
                classLook: visibleClass,
                allClassData: resultAllClass,

            });

            if (resultAllClass.length == 0) {
                super.onNullData();
            }
        }
    }

    renderClassTitleView(name, image, dataArray) {
        return (
            dataArray && dataArray.length > 0 ?
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: colors.white,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    alignItems: 'center',
                }}>
                    <Image
                        style={{width: 18, height: 18}}
                        resizeMode={'contain'}
                        // source={isMaster ? require('../../assets/class/class_ic_found.png') : require('../../assets/class/class_ic_join.png')}/>
                        source={image}/>
                    <Text style={{
                        color: colors.text333,
                        fontSize: 15,
                        fontWeight: '500',
                        marginLeft: 10,
                    }}>{name}</Text>
                </View> : null
        );
    }

    renderClassItem(item, index, isMaster) {
        return (
            <View key={index} style={{backgroundColor: colors.white}}>
                <KBButton onPress={() => {
                    const {navigate} = this.props.navigation;
                    navigate('Class', {
                        classData: item,
                        allClassData: this.state.allClassData,
                        allClassAuth: this.state.classAuth,
                        onRefresh: this.componentDidMount(),
                    });
                }}>
                    <View style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingHorizontal: 14,
                        paddingVertical: 12,
                        justifyContent: 'space-between',
                    }}>
                        <View style={{alignItems: 'center', flexDirection: 'row'}}>
                            <CircleImage imageUrl={Utils.getClassAvatar(item.headUrl)}
                                         customHeight={50}
                                         customWidth={50}
                            />
                            <View style={{marginLeft: 14}}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{
                                        fontSize: 15,
                                        color: colors.text333,
                                    }}>{item.name}</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                                    <Text style={{
                                        fontSize: 14,
                                        color: colors.text999,
                                    }}>班级号: {item.inviteCode}</Text>
                                    {Utils.isNull(item.masterName) ?
                                        null : <Text style={{
                                            fontSize: 14,
                                            color: colors.text777,
                                            marginTop: 10,
                                        }}>班主任: {item.masterName}</Text>}
                                </View>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image resizeMode={'contain'} style={{marginLeft: 15, width: 13, height: 13}}
                                   source={require('../../assets/icon_right.png')}/>
                        </View>

                    </View>
                </KBButton>
                <Divider isMargin={true}/>
            </View>
        );
    };

    renderData() {
        return (
            <KBScrollView
                style={{flex: 1}}
                isRefreshControl={true}
                isRefreshing={this.state.isRefreshing}
                onRefresh={this.onRefresh}>
                <View style={{flex: 1}}>
                    <View>
                        {this.renderClassTitleView('我管理的班级', require('../../assets/class/class_ic_found.png'), this.state.classBuild)}
                        {this.state.classBuild.map((item, index) => this.renderClassItem(item, index, true))}
                        {this.renderClassTitleView('我加入的班级', require('../../assets/class/class_ic_join.png'), this.state.classJoin)}
                        {this.state.classJoin.map((item, index) => this.renderClassItem(item, index, false))}
                        {this.renderClassTitleView('我有权查看的班级', require('../../assets/image3.5/class_ic_look.png'), this.state.classLook)}
                        {this.state.classLook.map((item, index) => this.renderClassItem(item, index, false))}

                    </View>

                    <InstaceMessageView
                        instanceType={'0'}
                        request={this.dealRequest}
                        isRefreshing={this.state.isRefreshing}
                    />
                </View>
            </KBScrollView>

        );
    }

    render() {
        const renderView = super.render();
        return (
            <View style={{flex: 1}}>
                <KBHeader backgroundColor={colors.yellowColor}
                          {...this.props}
                          rightComponent={() => {
                              return (
                                  <KBButton style={{
                                      marginRight: 30,
                                      backgroundColor: colors.reduceColor
                                  }}
                                            onPress={()=>{
                                                const {navigate} = this.props.navigation;
                                                navigate('UsingHelp');
                                            }}
                                  >
                                      <Image style={{width: 25, height: 25}}/>
                                  </KBButton>);
                          }}
                          title="班班通"/>

                <KBDropPopMenu
                    renderer={renderers.PopoverNew}
                    rendererProps={{placement: 'bottom', preferredPlacement: 'top'}}
                    menuStyle={{position: 'absolute', right: 0, top: theme.statusHeight}}
                    menuTriggerStyle={{
                        width: 50,
                        height: theme.withoutStatusHeight,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    menuTrigger={() => {
                        return (
                            <Image style={{width: 25, height: 25}}
                                   resizeMode={'contain'}
                                   source={require('../../assets/icon_add.png')}
                            />
                        );
                    }}
                    optionsStyle={{width: theme.screenWidth / 3, marginTop: 0}}
                    uniqueKey={'text'}
                    dataArray={this.headerArray}
                    isShowDivider={true}
                    textStyle={{color: colors.white, fontSize: 15}}
                    onSelect={(value) => this.headRightClick(value)}
                />
                {renderView}
                <KBAlertDialog
                    ref={(c) => this.rejectPop = c}
                    content={this.state.dialogContent}
                    rightPress={() => this.dealAuditRequest()}
                    isTextInput={this.state.isTextInput}
                />

                {this.state.classLook.length > 0 ?
                    <KBButton onPress={() => {
                        this.props.navigation.navigate('ClassStatistics');
                    }}>
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            bottom: 100,
                            right: 20,
                            width: 50,
                            height: 50,
                            backgroundColor: colors.yellowColor,
                            borderRadius: 25,
                        }}>
                            <Text style={styles.text}>查 看</Text>
                            <Text style={styles.text}>统 计</Text>
                        </View>
                    </KBButton> : null}

            </View>
        );
    }

    renderNullDataView() {
        return (
            <KBScrollView
                style={{flex: 1}}
                isRefreshControl={true}
                isRefreshing={this.state.isRefreshing}
                onRefresh={this.onRefresh}>
                <View style={{
                    width: theme.screenWidth,
                    height: theme.screenHeight - theme.headerHeight - theme.tabBarStyle.height,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Image source={require('../../assets/class/image_no_class.png')}
                           style={{width: 200, height: 150}} resizeMode={'cover'}/>
                    <Text style={{color: colors.text999, fontSize: 13}}>您尚未加入任何班级</Text>
                    <KBButton onPress={() => {
                        const {navigate} = this.props.navigation;
                        navigate('JoinClass');
                    }}>
                        <View style={{
                            paddingHorizontal: 45,
                            height: 40,
                            borderRadius: 20,
                            marginTop: 40,
                            backgroundColor: '#FBD962',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Text style={{color: colors.text333, fontSize: 14}}>加入班级</Text>
                        </View>
                    </KBButton>
                </View>
            </KBScrollView>
        );
    }

    /**
     * header右侧按钮
     */
    headRightClick(value) {
        console.log('value ===================', value.value.target);
        const {navigate} = this.props.navigation;
        navigate(value.value.target);
    }

    onRefresh = () => {
        this.setState({isRefreshing: true});
        this.componentDidMount();
    };

    dealRequest = (data, dealType) => {
        let toast = '';
        if (dealType === 1) { // 通过提示
            toast = data.type.value === 4 || data.type.value === 5 ? '您确定同意加入班级的申请吗?' : '您确定要通过吗?';
        } else { // 驳回提示
            toast = data.type.value === 4 || data.type.value === 5 ? '您确定驳回加入班级的申请吗?' : data.type.value === 7 ? '您确定不通过吗?' : '您确定要删除吗?';
        }
        this.ticket = data;
        this.dealType = dealType;
        this.setState({
            dialogContent: toast,
            isTextInput: dealType === 2 && (data.type.value === 3 || data.type.value === 6),
        }, () => {
            this.rejectPop.show();
        });
    };

    dealAuditRequest = () => {

        if (this.ticket.type.value === 7) {
            this.dealTask();
        } else if (this.ticket.type.value === 4 || this.ticket.type.value === 5) {
            this.dealApplyRequest();
        } else {
            this.dealTicket();
        }
    };

    dealApplyRequest = () => {
        let formData = new FormData();
        formData.append('applyId', this.ticket.event_id);
        formData.append('type', this.dealType);
        let url = this.ticket.type.value === 5 ? fetchUrl.agreeParentIntoClass : fetchUrl.agreeIntoClass;
        HttpUtils.doPostWithToken(url, formData, {
            onSuccess: (responseData) => {
                this.eventEmitter.emit(UPDATE_CONTACT);
                ToastUtils.showToast(responseData.message);
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        });
    };

    dealTask = () => {
        let toastText = this.dealType === 1 ? '任务通过成功' : '任务驳回成功';
        let formData = new FormData();
        formData.append('taskId', this.ticket.event_id);
        formData.append('status', this.dealType);

        HttpUtils.doPostWithToken(fetchUrl.auditTaskScore, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(toastText);
                this.eventEmitter.emit(MESSAGE_UPDATE);
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        });
    };

    dealTicket = () => {
        let toastText = this.dealType === 1 ? '通过成功' : '驳回成功';
        let formData = new FormData();
        formData.append('ticketId', this.ticket.event_id);
        formData.append('type', this.dealType);
        // 添加驳回理由
        if (this.dealType === 2) {
            let rejectText = this.rejectPop.getText();
            formData.append('comment', rejectText);
        }
        console.log('formdata ================', formData);
        HttpUtils.doPostWithToken(fetchUrl.dealTicket, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(toastText);
                this.eventEmitter.emit(MESSAGE_UPDATE);
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onNullData: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        });
    };
}
const styles = StyleSheet.create({
    text: {
        fontSize: 12,
        color: colors.text21,
    },
});
