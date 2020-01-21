import React from "react"
import {Image, View, Text, StyleSheet, DeviceEventEmitter, Alert} from "react-native";

import lodash from 'lodash';
import moment from "moment"
import KBHeader from "../../components/KBHeader";
import KBButton from "../../components/KBButton";
import KBScrollView from '../../components/KBScrollView';
import colors from '../../constants/colors';
import fetchUrl from "../../constants/fetchUrl";
import HttpUtils from "../../utils/HttpUtils";
import ToastUtils from "../../utils/ToastUtils";
import UserData from "../../constants/UserData";
import theme from "../../constants/theme";
import TimeUtils from '../../utils/TimeUtils'

import {WINDOWS_LOG, MESSAGE_UPDATE, UPDATE_CONTACT} from "../../constants/notify";

import InstaceMessageView from '../message/view/InstaceMessageView';
import KBDropPopMenu from '../../components/popMenu/KBDropPopMenu';
import image from "../../constants/image";
import "moment/locale/zh-cn"

import StorageUtils from "../../utils/StorageUtils";
import SQLite from '../../utils/SQLite';
import BaseScreen from "../../base/BaseScreen";
import KBAlertDialog from '../../components/dialog/KBAlertDialog';

export default class IndexScreen extends BaseScreen {
    sqLite = new SQLite();
    commonFuncationArr = ['编辑分组', '家长端设置', '班级报表', '编辑事项', '打印奖票', '查看排名', '固定分', '任务分',];
    date = '';
    week = '';
    month = '';
    mOrAOrY = '';
    currentTimeStamp = moment().format('X');
    headerData = [
        // "创建班级",
        "加入班级",
        // "扫一扫",
    ];
    headerIcon = [
        // require('../../assets/class/home_class_create.png'),
        require('../../assets/class/home_class_add.png'),
        // require('../../assets/class/home_class_scan.png'),
    ];
    classData = '';

    constructor(props) {
        super(props);
        this.state = Object.assign({
            statictis: 0,  //0: 没有查看图表的功能，1：查看图表功能  默认：0
            isRefreshing: false,
            isWindowsLogin: false,

            allClassData: [],
            allClassItem: [],
            classBuild: [],
            classJoin: [],
            classLook: [],  //有权查看的班级列表
            auth: [],  //班级权限列表

            isTextInput: false,
            dialogContent: '',

        }, this.state);
        this.eventEmitter = DeviceEventEmitter;
        this.matter = [];
        this.selectedClassId = '';
    }

    componentDidMount() {
        super.componentDidMount();
        this.eventEmitter.addListener(WINDOWS_LOG, this.windowsLog.bind(this));
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.eventEmitter.removeListener(WINDOWS_LOG, this.windowsLog);
    }

    windowsLog = (isLogin) => {
        this.setState({
            isWindowsLogin: isLogin,
        })
    };


    getApiUrl() {
        return fetchUrl.getClassListNew;
    }

    onSuccess(responseData) {

        // if (!Utils.isNull(responseData) && !Utils.isNull(responseData.data)) {
        //     UserData.getInstance().setClass(responseData.data);
        //     for (let classData of responseData.data) {
        //         if (classData.teacherId === UserData.getInstance().getId()) {
        //             classData.isMaster = true;
        //             classBuild.push(classData);
        //         } else {
        //             classData.isMaster = false;
        //             classJoin.push(classData);
        //         }
        //     }
        //     this.setState({
        //         isNullData: false,
        //         classBuild: classBuild,
        //         classJoin: classJoin,
        //         allClassData: responseData.data,
        //     })
        // }

        if (responseData && responseData.data) {

            let managerClass = responseData.data.managerClasses;
            let joinClass = responseData.data.joinClasses;
            let visibleClass = responseData.data.visibleClasses;
            managerClass.forEach((item, index, i) => {
                item.isMaster = true;
            });
            joinClass.forEach((item, index, i) => {
                item.isMaster = false;
            });
            visibleClass.forEach((item, index, i) => {
                item.isMaster = false;
            });
            let allClassData = joinClass.concat(managerClass).concat(visibleClass);

            let resultAllClass = lodash.uniqBy(allClassData, 'id');

            // let resultAllClass=[];
            // let obj={};
            //
            // for(let i=0;i<allClassData.length;i++){
            //     if(!obj[allClassData[i].id]){
            //         resultAllClass.push(allClassData[i]);
            //         obj[allClassData[i].id]=true;
            //     }
            // }

            UserData.getInstance().setClass(resultAllClass);
            this.setState({
                isRefreshing: false,
                statictis: responseData.data.statictis,
                classBuild: managerClass,
                classJoin: joinClass,
                classLook: visibleClass,
                allClassData: resultAllClass,

            })

            console.log("============alllll=======", this.state.allClassData);
            this.classData = resultAllClass[0];

            if (resultAllClass.length == 0) {
                super.onNullData();
            }

        }


    }


    renderData() {
        return (
            <KBScrollView
                style={{flex: 1, backgroundColor: colors.white}}
                isRefreshControl={true}
                isRefreshing={this.state.isRefreshing}

                onRefresh={this.onRefresh}>
                <View style={{flex: 1}}>
                    <View style={{
                        flexDirection: 'row',
                        paddingHorizontal: 15
                    }}>
                        <View style={{}}>
                            <View style={{
                                height: 80,
                                width: theme.screenWidth / 2 - 15,
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <Text style={{fontSize: 30, fontWeight: "500"}}>{this.date}</Text>
                                <Text style={{fontSize: 16, marginLeft: 5}}>{`${this.week}\n${this.month}月`}</Text>
                            </View>
                            <View style={{
                                height: 80,
                                width: theme.screenWidth / 2 - 15,
                            }}>
                                <KBButton style={{
                                    width: theme.screenWidth / 2 - 30 + 7.5,
                                    backgroundColor: colors.blue,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 70,
                                    borderRadius: 10
                                }}
                                          onPress={() => {

                                              const {navigate} = this.props.navigation;
                                              navigate('ReleaseHomeWork');
                                          }}
                                >

                                    <Text style={{color: colors.white, fontSize: 15}}>{'发布作业'}</Text>

                                </KBButton>
                            </View>
                        </View>
                        <View style={{width: theme.screenWidth / 2 - 15}}>
                            <View style={{
                                height: 80,
                                width: theme.screenWidth / 2 - 15,
                                justifyContent: 'center',
                                alignItems: 'flex-end'
                            }}>
                                <Text style={{fontSize: 16}}>{'晴转多云'}</Text>
                                <Text style={{fontSize: 16}}>{'0℃~6℃'}</Text>
                            </View>
                            <View style={{
                                height: 80,
                                width: theme.screenWidth / 2 - 15,
                                alignItems: 'flex-end'
                            }}>
                                <KBButton style={{
                                    width: theme.screenWidth / 2 - 30 + 7.5,
                                    backgroundColor: colors.green,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 70,
                                    borderRadius: 10
                                }}
                                          onPress={() => {
                                              const {navigate} = this.props.navigation;
                                              navigate('ReleaseNotice');
                                          }}
                                >

                                    <Text style={{color: colors.white, fontSize: 15}}>{'发布公告'}</Text>

                                </KBButton>
                            </View>
                        </View>

                    </View>
                    <View style={{marginLeft: 15, marginTop: 15}}>
                        <Text style={{fontSize: 15, fontWeight: '500'}}>{'常用功能'}</Text>
                    </View>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15}}>
                        {this.commonFuncationArr.map((item, index) => this.renderCommonView(item, index))}
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

    renderCommonView(item, index) {
        return (
            <KBButton style={{
                marginTop: 15, width: (theme.screenWidth - 30) / 4,
                height: (theme.screenWidth - 30) / 4, alignItems: 'center'
            }}
                      key={index}
                      onPress={() => this.commonFuncOnClick(this.commonFuncationArr[index])}

            >
                <View>
                    <Image style={{
                        width: (theme.screenWidth - 120) / 4,
                        height: (theme.screenWidth - 120) / 4,
                        backgroundColor: colors.bossgreen,
                        borderRadius: (theme.screenWidth - 120) / 8
                    }}>

                    </Image>
                    <Text style={{marginTop: 5, textAlign: 'center'}}>
                        {this.commonFuncationArr[index]}
                    </Text>
                </View>
            </KBButton>
        );
    }

    commonFuncOnClick(value) {
        console.log("ddddddccccccc", value);
        console.log(this.classData, this.classData.id);
        const {navigate} = this.props.navigation;
        switch (value) {
            case '编辑分组': {
                // navigate("ClassEdit", {classId: this.classData.id,isMaster:this.classData.isMaster || this.classAuth.includes(this.EDIT_CLASS)});

                navigate("EditGroup", {
                    classId: this.classData.id,
                    classTitle: this.classData.name,
                    classData: this.classData,
                    isMaster: this.classData.isMaster,
                });
            }
                break;
            case '家长端设置': {
                navigate("ClassReport", {
                    classId: this.classData.id,
                    classTitle: this.classData.name,
                    isMaster: this.classData.isMaster,
                });
            }
                break;
            case '班级报表': {
                navigate("ClassReport", {
                    classId: this.classData.id,
                    classTitle: this.classData.name,
                    isMaster: this.classData.isMaster,
                });
            }
                break;
            case '编辑事项': {
                navigate("ClassOption", {
                    classId: this.classData.id,
                    entryType: -1,
                    onRefresh: this.refresh,
                    initialPage: 0,
                });
            }
                break;
            case '打印奖票':
                navigate("TicketPrint", {
                    classId: this.classData.id,
                    isMaster: this.classData.isMaster,
                    // isChange: true,
                    // refresh: true,
                });
                break;
            case '查看排名':
                // const {navigate} = this.props.navigation;
                navigate("ClassRank", {classId: this.classData.id});
                break;
            case '固定分':
                navigate("AddFixedScore", {
                    classId: this.classData.id,
                    isMaster: this.classData.isMaster,
                    // isChange: true,
                    // refresh: true,
                });
                break;
            case '任务分':
                navigate("Task", {
                    classId: this.classData.id,
                    isMaster: this.classData.isMaster,
                    // isChange: true,
                    // refresh: true,
                });
                break;
        }

    }

    render() {
        const renderView = super.render();
        moment.locale('zh-cn');
        this.month = moment().format('MM');
        this.date = moment().format('DD');
        this.week = moment().format('dddd');
        this.mOrAOrY = TimeUtils.getTimeFormat(moment().format('HH'));
        return (
            <View style={{flex: 1}}>
                <KBHeader backgroundColor={colors.white}
                          {...this.props}
                          titleLeft={50}
                          leftComponent={() => this.renderLeftView()}

                          rightComponent={() => this.renderRightView()}
                />
                {/*//扫码登陆提示*/}
                {
                    this.state.isWindowsLogin ?
                        <KBButton onPress={() => {
                            this.eventEmitter.emit(WINDOWS_LOG, true);
                        }}>
                            <View style={{
                                width: theme.screenWidth,
                                height: 45,
                                paddingHorizontal: 14,
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: colors.divider
                            }}>
                                <Image style={{width: 20, height: 18, marginRight: 10}}
                                       source={require('../../assets/class/home_computer.png')}/>
                                <Text style={{fontSize: 13, color: colors.text888}}>Windows家校积分通已登陆</Text>
                            </View>
                        </KBButton>
                        : null
                }

                {renderView}
                <KBAlertDialog
                    ref={(c) => this.rejectPop = c}
                    content={this.state.dialogContent}
                    rightPress={() => this.dealAuditRequest()}
                    isTextInput={this.state.isTextInput}
                />
                {/*<CustomDialog*/}
                {/*ref={(c) => this.rejectPop = c}*/}
                {/*content={this.state.dialogContent}*/}
                {/*rightPress={() => this.dealAuditRequest()}*/}
                {/*isTextInput={this.state.isTextInput}*/}
                {/*/>*/}

                {/*<CustomDialog*/}
                {/*ref={(c) => this.bindPop = c}*/}
                {/*content={'确定解除龙虎榜绑定吗？'}*/}
                {/*rightPress={() => this.dealBoardRequest()}*/}
                {/*/>*/}

            </View>
        );
    }

    renderLeftView = () => {
        return (<View style={{position: 'absolute', left: 15, width: 200}}>
            <Text style={{fontSize: 17}}>{`亲爱的老师，${this.mOrAOrY}好`}</Text>
        </View>)
    }

    renderRightView = () => {
        console.log(this.state.allClassData);
        if (this.state.allClassData.length > 0) {
            return (
                <View style={{position: 'absolute', right: 15, }}>
                    <KBDropPopMenu
                        rendererProps={{
                            placement: 'bottom',
                            preferredPlacement: 'top',
                        }}
                        optionsStyle={{
                            backgroundColor: colors.white,
                            width: theme.screenWidth,
                            marginTop: theme.headerHeight - theme.statusHeight,
                        }}
                        optionStyle={{paddingHorizontal: 14}}
                        dataArray={this.state.allClassData}
                        uniqueKey={'name'}
                        menuTriggerStyle={{paddingHorizontal: 5, height: theme.withoutStatusHeight}}
                        menuTrigger={() => {
                            return (
                                <View style={{
                                    paddingHorizontal: 5,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingLeft: 5,
                                    height: 44,
                                }}>
                                    <Text style={{fontSize: 17, width: 120, textAlign: 'right'}}
                                          numberOfLines={1}
                                          ellipsizeMode={'middle'}
                                    >{this.classData.name}</Text>
                                    <Image style={{width: 15, height: 6, marginLeft: 5}}
                                           source={image.navTitleOPen}
                                           resizeMode={'contain'}/>
                                </View>
                            );
                        }}
                        onSelect={(value) => this.classChanged(value)}
                    />
                </View>
            );
        } else {
            return null;
        }
    }

    /**
     * 标题班级选择
     * @param index
     */
    classChanged(value) {

        console.log(value);
        let obj = value.item;
        if (this.classData.id === obj?.id) {
            return;
        }
        this.classData = obj;
        this.classAuth = [];
        if (this.classData.auth) {
            this.classAuth = this.classData.auth;
        }
        //权限
        //this._setAuthData();
        //首页待办事项未更新

        this.setState({}, () => {
            this.getClassOptions(); //添加班级事项刷新
            // this.refresh();
        });
    }

//请求所有事项加进本地数据库里
    getClassOptions() {
        let url = fetchUrl.getClassOptionList + 'classId=' + this.classData.id + '&type=' + -1;
        HttpUtils.doGetWithToken(url, {
            onSuccess: (responseData) => {
                let classOptions = [];
                for (let obj of responseData.data) {
                    if (obj.kindType < 3) {
                        classOptions.push(obj);
                    }
                }
                //清空数据
                this.sqLite.deleteAllData('OPTIONTABLE');
                //插入数据
                this.sqLite.insertOptionData(classOptions);
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onNullData: (responseData) => {
            }
        })
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
                           style={{width: 200, height: 150,}} resizeMode={'cover'}/>
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
                            justifyContent: 'center'
                        }}>
                            <Text style={{color: colors.text333, fontSize: 14}}>加入班级</Text>
                        </View>
                    </KBButton>
                </View>
            </KBScrollView>
        )
    }

    /**
     * header右侧按钮
     */
    headRightClick(value) {
        const {navigate} = this.props.navigation;
        switch (value.index) {
            // case 0: {
            //     navigate("CreateClass", {
            //         onRefresh: this.onRefresh,
            //     });
            // }
            //     break;
            case 0: {
                navigate("JoinClass");
            }
                break;
            // case 2: {
            //     navigate("Scan", {
            //         windowsLog: false,
            //     });
            // }
            //     break;
        }
    }

    onRefresh = () => {
        this.setState({isRefreshing: true});
        this.componentDidMount();
    };

    dealRequest = (data, dealType) => {
        // if (data.type.value === 4 || data.type.value === 5) {
        //     this.dealApplyRequest(data);
        // } else {
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
        // }
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
        formData.append("applyId", this.ticket.event_id);
        formData.append('type', this.dealType);
        let url = this.ticket.type.value === 5 ? fetchUrl.agreeParentIntoClass : fetchUrl.agreeIntoClass;
        HttpUtils.doPostWithToken(url, formData, {
            onSuccess: (responseData) => {
                this.eventEmitter.emit(UPDATE_CONTACT);
                ToastUtils.showToast(responseData.message);
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            }
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
            }
        })
    }

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
        })
    }

    dealBoardRequest = () => {

        let formData = new FormData();
        formData.append('classId', this.selectedClassId);
        HttpUtils.doPostWithToken(fetchUrl.decScoreboard, formData, {
            onSuccess: (responseData) => {
                this.onRefresh();
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            }
        })
    }
}
const styles = StyleSheet.create({
    text: {
        fontSize: 12,
        color: colors.text21
    }
})
