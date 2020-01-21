import React from "react"
import {Container, Button} from 'native-base'

import {StyleSheet, Text, View, Image, DeviceEventEmitter, Alert} from "react-native";

import KBButton from '../../components/KBButton';

import ScrollableTabView from 'react-native-scrollable-tab-view';

import StudentPage from "../home/class/ClassStudentPage";

import KBHeader from "../../components/KBHeader";

import theme from '../../constants/theme';
import colors from '../../constants/colors';
import image from '../../constants/image';

import UserData from "../../constants/UserData";
import fetchUrl from "../../constants/fetchUrl";
import HttpUtils from "../../utils/HttpUtils";
import ToastUtils from "../../utils/ToastUtils";
import StorageUtils from "../../utils/StorageUtils";
import SQLite from '../../utils/SQLite';
import Utils from "../../utils/Utils";
import {renderers} from "../../components/popMenu/src";


import KBScrollView from "../../components/KBScrollView";
import BaseScreen from "../../base/BaseScreen";
import KBPopupDialog from "../../components/dialog/KBPopupDialog";


export default class EditGroupInfoScreen extends BaseScreen {
    //权限值
    CREATE_STUDENT = 4; //创建学生


    constructor(props) {
        super(props);

        const {params} = this.props.navigation.state;
        this.classData = params.classData;

        this.allClassData = params.allClassData;
        // this.allClassAuth=params.allClassAuth;
        this.classAuth = [];
        if (this.classData.auth) {
            this.classAuth = this.classData.auth;
        }
        //this._setAuthData();  //设置有关权限的数据

        this.state = Object.assign({
            isRefresh: false,
        }, this.state);
        this.eventEmitter = DeviceEventEmitter;
        StorageUtils._load("classSelttlement", (data) => {
            if (Utils.isNull(data)) {
                UserData.getInstance().setScoreFilter('0')
            } else {
                UserData.getInstance().setScoreFilter(data)
            }
        }, (err) => {
            UserData.getInstance().setScoreFilter('0')
        });

    }


    _setAuthData = () => {

        // ToastUtils.showToast('刷新');
    }


    //获取（下拉刷新）权限 网络请求
    getAuthList = () => {
        this.setState({isRefresh: true});
        HttpUtils.doGetWithToken(fetchUrl.getClassListNew, {
            onSuccess: (responseData) => {
                if (responseData.data) {


                    let managerClass = responseData.data.managerClasses;
                    let joinClass = responseData.data.joinClasses;
                    let visibleClass = responseData.data.visibleClasses;

                    let allClassData = joinClass.concat(managerClass).concat(visibleClass);

                    this.classAuth = [];
                    for (let i = 0; i < allClassData.length; i++) {
                        if (allClassData[i].id == this.classData.id && allClassData[i].auth) {
                            this.classAuth = allClassData[i].auth;
                            break;
                        }
                    }
                    this._setAuthData();  //设置有关权限的数据
                }
            },
            onEnd: () => {
                this.setState({isRefresh: false});
            }
        })
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

    render() {

        return (
            <View style={{flex: 1}}>
                {this.renderHeader()}
                <StudentPage
                    ref={(c) => this.studentPage = c}
                    navigation={this.props.navigation}
                    style={styles.content}
                    classId={this.classData.id}
                    isEdit={true}
                    canAddStudent={this.classAuth.includes(this.CREATE_STUDENT)}
                    isMaster={this.classData.isMaster}
                    refresh={this.getAuthList}
                />
            </View>);
    }

    renderHeader() {

        return (
            <KBHeader backgroundColor={colors.yellowColor}
                      title={"编辑小组"}
                      isLeft={true}
                      {...this.props}
            />
        );
    };

    /**
     * 子页刷新
     */
    refreshChildData() {
        if (!Utils.isNull(this.studentPage))
            this.studentPage.refreshData();
    }

    refreshData = () => {
        this.componentDidMount();
    };

    //刷新主页与子页
    refresh = () => {
        this.refreshData();
        this.refreshChildData();
    };

    /**
     * 编辑时取消按钮
     */
    cancle() {
        const {goBack} = this.props.navigation;
        goBack();
    };
}

const styles = StyleSheet.create({

    content: {
        width: theme.screenWidth,
        height: theme.screenHeight - theme.headerHeight,
        backgroundColor: colors.white,
    },
    toolBar: {
        flexDirection: 'row',
        height: 49,
        width: theme.screenWidth,
        borderTopWidth: 0.5,
        backgroundColor: colors.white,
        borderColor: colors.divider,
    },

});
