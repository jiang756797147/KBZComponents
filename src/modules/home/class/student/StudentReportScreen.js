import React, {Component} from "react"
import {Container, Label} from 'native-base'
import {Image, StyleSheet, Text, View, DeviceEventEmitter} from "react-native";

import BaseScreen from "../../../../base/BaseScreen";

import colors from "../../../../constants/colors";
import fetchUrl from "../../../../constants/fetchUrl";
import {STUDENT_SCORE_UPDATE} from "../../../../constants/notify";

import KBButton from "../../../../components/KBButton";
import TableView, {PullRefreshMode} from "../../../../components/tableView";
import Divider from "../../../../components/Divider";
import Adapter from "../../../../components/tableView/Adapter";
import ItemModel from "../../../../components/tableView/ItemModel";
import KBDropPopMenu from "../../../../components/popMenu/KBDropPopMenu";
import {renderers} from "../../../../components/popMenu/src";
import KBHeader from "../../../../components/KBHeader";

import HttpUtils from "../../../../utils/HttpUtils";
import ToastUtils from "../../../../utils/ToastUtils";
import DialogUtils from "../../../../utils/DialogUtils";
import Utils from "../../../../utils/Utils";

import StudentReportHolder from "./holder/StudentReportHolder";


export default class StudentReportScreen extends BaseScreen {


    timeArray = [
        {text: '今天', value: 0},
        {text: '本周', value: 1},
        {text: '上周', value: 2},
        {text: '本月', value: 3},
        {text: '自定义', value: 5},
    ];

    constructor(props) {
        super(props);
        this.adapter = new Adapter();
        const {params} = this.props.navigation.state;
        this.student = params.student;
        this.isMaster = Utils.isNull(params.isMaster) ? false : params.isMaster;
        this.backRefresh = params.backRefresh;
        this.timeType = 0;
        this.onlySelf = 0;  // 0 所有人 1 只看自己
        this.page = 1;
        this.totalPage = 0;
        this.tableKey = 0;
        this.state = {
            data: null,
            screenTime: '今天',
            isCheckMine: false,
            isEdit: false,
            isTimeScreenDown: false,

            startTime: '',
            endTime: '',
        };
        this.eventEmitter = DeviceEventEmitter;
    }

    componentDidMount() {
        super.componentDidMount();
        this.startTM = Utils.isNull(this.state.startTime) ? '' : `&startTime=${this.state.startTime}`;
        this.endTM = Utils.isNull(this.state.endTime) ? '' : `&endTime=${this.state.endTime}`;
        this.getSimpleStudentReport();
        this.getStudentReport();
    }

    getSimpleStudentReport = () => {
        let url = `${fetchUrl.getSimpleStudentReport}studentId=${this.student.id}&timeType=${this.timeType}&onlySelf=${this.onlySelf}${this.startTM}${this.endTM}`;
        HttpUtils.doGetWithToken(url, {
            onSuccess: (responseData) => {
                if (responseData.data) {
                    this.setState({data: responseData.data, isRefreshing: false});
                }
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onEnd: () => {
                this.setState({isRefreshing: false});
                DialogUtils.getInstance().hideProgress();
            },
            onNullData: (responseData) => {
                this.setState({data: null})
            }
        })
    };

    getStudentReport = () => {
        // let url = fetchUrl.getStudentReport + 'studentId=' + this.student.id + '&timeType=' + this.timeType + '&onlySelf=' + this.onlySelf + '&page=' + this.page;
        let url = `${fetchUrl.getStudentReport}studentId=${this.student.id}&timeType=${this.timeType}&onlySelf=${this.onlySelf}&page=${this.page}${this.startTM}${this.endTM}`;
        HttpUtils.doGetWithToken(url, {
            onSuccess: (responseData) => {
                if (responseData.data) {
                    this.totalPage = responseData.data.totalPage;
                    if (responseData.data.data && responseData.data.data.length > 0) {
                        for (let comment of responseData.data.data) {
                            let itemModel = new ItemModel(this.tableKey, StudentReportHolder);
                            itemModel.setAttribute('data', comment);
                            itemModel.setAttribute('delete', this.deleteReport);
                            itemModel.setAttribute('isMaster', this.isMaster);

                            this.adapter.addItem(itemModel);
                            this.tableKey++;
                        }
                        if (this.tableView) {
                            this.tableView.notifyDataSetChanged();
                            this.tableView.onRefreshComplete();
                        }
                    } else {
                        if (this.tableView) {
                            this.tableView.onRefreshComplete();
                            this.tableView.setHasMoreData(false);
                        }
                    }
                }
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        })
    };

    renderTableHeader() {
        let data = this.state.data;
        return (
            <View>
                <View style={{paddingHorizontal: 14, backgroundColor: '#F7734B'}}>
                    <Text style={{color: colors.white, fontSize: 13, opacity: 0.7, marginTop: 25}}>累计得分</Text>
                    <Text
                        style={{
                            color: colors.white,
                            fontSize: 35,
                        }}>{Utils.isNull(data) ? '--' : Utils.getFloatScore(parseFloat(data.rewardScore) - parseFloat(data.punishScore))}</Text>
                    <View style={{flexDirection: 'row', marginBottom: 20, marginTop: 10, alignItems: 'center'}}>
                        <Text style={{
                            color: colors.white,
                            fontSize: 14,
                            opacity: 0.9
                        }}>表扬:{Utils.isNull(data) ? ' --' : '+' + (Utils.getFloatScore(parseFloat(data.rewardScore))
                            + ' (' + Utils.getFloatScore(parseFloat(data.rewardScore) / (parseFloat(data.rewardScore) + parseFloat(data.punishScore)) * 100) + '%)')}</Text>
                        <Text style={{
                            marginLeft: 15,
                            color: colors.white,
                            fontSize: 14,
                            opacity: 0.9
                        }}>待改进:{Utils.isNull(data) ? ' --' : '-' + (Utils.getFloatScore(parseFloat(data.punishScore))
                            + ' (' + Utils.getFloatScore(parseFloat(data.punishScore) / (parseFloat(data.rewardScore) + parseFloat(data.punishScore)) * 100) + '%)')}</Text>
                    </View>


                    <KBDropPopMenu
                        onOpen={() => {
                            this.setState({isTimeScreenDown: true})
                        }}
                        onClose={() => {
                            this.setState({isTimeScreenDown: false})
                        }}
                        menuTriggerStyle={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: 70,
                            height: 26,
                            borderRadius: 13,
                            backgroundColor: '#FF8A66',
                            justifyContent: 'center'
                        }}
                        onSelect={(item) => {
                            this.timeType = item.value.value;
                            if (this.timeType === 5) {
                                const {navigate} = this.props.navigation;
                                navigate('KBDate', {
                                    isSingle: false,
                                    getDate: (startDate, endDate) => {
                                        this.setState({
                                            startTime: (startDate.timestamp / 1000).toString(),
                                            endTime: (endDate.timestamp / 1000).toString(),
                                            screenTime: item.value.text,
                                        }, () => {
                                            this.onDownRefresh();
                                        })
                                    }
                                });
                            } else {
                                this.setState({
                                    screenTime: item.value.text,
                                    startTime: '',
                                    endTime: '',
                                });

                                this.onDownRefresh();
                            }

                        }}
                        renderer={renderers.PopoverNew}
                        rendererProps={{
                            placement: 'bottom',
                            preferredPlacement: 'top',
                            anchorStyle: {backgroundColor: colors.white}
                        }}
                        optionsStyle={{
                            marginTop: 0,
                            width: 100,
                            backgroundColor: colors.white,
                            borderRadius: 5,
                            marginRight: 14
                        }}
                        menuStyle={{position: 'absolute', top: 20, right: 14,}}
                        menuTrigger={() =>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{fontSize: 13, color: colors.white}}>{this.state.screenTime}</Text>
                                <Image
                                    source={this.state.isTimeScreenDown ? require('../../../../assets/class/report_ic_up.png') :
                                        require('../../../../assets/class/report_ic_pull.png')}
                                    style={{width: 8, height: 8, marginLeft: 5}} resizeMode={'contain'}/>
                            </View>}
                        dataArray={this.timeArray}
                        uniqueKey={'text'}
                    />
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,}}>
                    <Text style={{
                        flex: 1,
                        fontWeight: '400',
                        fontSize: 15,
                        color: colors.text333,
                        marginLeft: 14
                    }}>{this.state.screenTime}</Text>
                    <KBButton onPress={() => {
                        this.setState({isCheckMine: !this.state.isCheckMine}, () => {
                            DialogUtils.getInstance().showProgress();
                            this.onlySelf = this.state.isCheckMine ? 1 : 0;
                            this.onDownRefresh();
                        });
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            paddingVertical: 15,
                            paddingHorizontal: 14,
                            alignItems: 'center'
                        }}>
                            <Image
                                source={this.state.isCheckMine ? require('../../../../assets/class/class_ic_selected.png') :
                                    require('../../../../assets/class/class_btn_choice_d.png')}
                                style={{width: 15, height: 15}}/>
                            <Text style={{
                                color: colors.text999,
                                fontSize: 13,
                                marginLeft: 5,
                            }}>只查看自己的点评</Text>
                        </View>
                    </KBButton>
                </View>
                <Divider/>
            </View>
        );
    };

    renderHeaderRight = () => {
        return (
            <Text style={{fontSize: 14, color: colors.white}}>学生资料</Text>
        );
    };

    renderData() {
        return (
            <TableView
                ref={(c) => {
                    this.tableView = c
                }}
                mode={PullRefreshMode.BOTH}
                isShowDivider={true}
                adapter={this.adapter}
                onPullDownToRefresh={(tableView) => {
                    this.onDownRefresh();
                }}
                onPullUpToRefresh={(tableView) => {
                    if (this.page >= this.totalPage) {
                        tableView.onRefreshComplete();
                        tableView.setHasMoreData(false);
                        return;
                    }
                    this.onUpRefresh();
                }}
                ListHeaderComponent={this.renderTableHeader()}
            />
        )
    }

    render() {
        let renderView = super.render();
        return (
            <View style={this.styles.container}>
                <KBHeader isLeft={true} {...this.props}
                          backgroundColor={'#F7734B'}
                          headerStyle={'light'}
                          title={this.student.name}
                          driverColor={'#F16338'}
                          rightComponent={this.renderHeaderRight}
                          touchRight={() => {
                              const {navigate} = this.props.navigation;
                              navigate('StudentInfo', {
                                  student: this.student,
                                  isMaster: this.isMaster,
                                  backRefresh: this.backFresh
                              });
                          }}/>
                {renderView}
            </View>
        );
    }

    deleteReport = (value) => {
        let formData = new FormData();
        formData.append('ticketId', value.id);
        HttpUtils.doPostWithToken(fetchUrl.delScore, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast('删除成功！');
                this.onDownRefresh();
                this.eventEmitter.emit(STUDENT_SCORE_UPDATE);
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            }
        });
    };

    //下拉刷新
    onDownRefresh = () => {
        this.page = 1;
        this.tableKey = 0;
        this.adapter.removeAll();
        this.componentDidMount();
    };

    //上拉加载
    onUpRefresh = () => {
        ++this.page;
        this.componentDidMount();
    };

    backFresh = () => {
        const {goBack} = this.props.navigation;
        if (!Utils.isNull(this.backRefresh)) {
            this.backRefresh();
        }
        goBack();
    };

    styles = StyleSheet.create({
        container: {
            backgroundColor: colors.white,
            flex: 1
        },
    });
}