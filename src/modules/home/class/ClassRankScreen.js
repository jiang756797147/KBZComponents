import React, {Component} from "react"
import {StyleSheet, View, Text, Image, BackHandler} from "react-native";
import BaseScreen from "../../../base/BaseScreen";
import Drawer from "react-native-drawer";

import KBHeader from "../../../components/KBHeader";
import colors from "../../../constants/colors";
import TableView, {PullRefreshMode} from "../../../components/tableView";
import Adapter from "../../../components/tableView/Adapter";
import KBDropPopMenu from "../../../components/popMenu/KBDropPopMenu";
import ItemModel from "../../../components/tableView/ItemModel";
import Divider from "../../../components/Divider";
import theme from "../../../constants/theme";
import fetchUrl from "../../../constants/fetchUrl";
import Utils from "../../../utils/Utils";
import HttpUtils from "../../../utils/HttpUtils";
import ToastUtils from "../../../utils/ToastUtils";
import TimeUtils from "../../../utils/TimeUtils";

import ClassRankHolder from "./holder/ClassRankHolder";
import ClassRankDrawerScreen from "./view/ClassRankDrawerScreen";


export default class ClassRankScreen extends BaseScreen {
    timeScreenArray = [
        {
            text: '今天',
            value: 1,
        },
        {
            text: '本周',
            value: 2,
        },
        {
            text: '上周',
            value: 3,
        },
        {
            text: '本月',
            value: 4,
        },
        {
            text: '上月',
            value: 5,
        },
    ];
    personScreenArray = [
        {
            text: '个人',
            value: 0,
        },
        {
            text: '小组',
            value: 1,
        },
    ];
    scorePersonArray = [
        {
            text: '总分',
            value: 0,
        },
        {
            text: '表扬分',
            value: 1,
        },
        {
            text: '待改进分',
            value: 2,
        },
    ];
    scoreGroupArray = [
        {
            text: '总分',
            value: 0,
        },
        {
            text: '表扬分',
            value: 1,
        },
        {
            text: '待改进分',
            value: 2,
        },
        {
            text: '小组平均分',
            value: 3,
        },
    ];

    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.classId = params.classId;
        this.adapter = new Adapter();
        this.tableKey = 0;
        this.timeType = 0;
        this.rankType = params.isGroup ? 1 : 0;
        this.sortType = 0;
        this.startTime = null;
        this.endTime = null;
        this.onlySelf = 0;
        this.kindIds = null;
        this.groupIds = null;
        this.isFilterTime = false;//判断取筛选时间(true)还是下拉时间(false)
        this.state = Object.assign({
            timeScreenText: '今天',
            personScreenText: params.isGroup ? '小组' : '个人',
            scoreScreenText: '总分',
            holderStatus: {
                isShowImage: true,
                isTeam: false,
                scoreType: 0,
            },
            studentMatterArray: [],
            groupMatterArray: [],
            teamData: [],
            isDrawerOpen: false,//判断筛选抽屉是否打开
            startTimes: '',
            endTimes: '',
            isCheckMine: false,
            isTimeDown: false,  //用于控制时间向下箭头状态
            isPersonDown: false //用于控制人员向下箭头状态
        }, this.state);

        this.scoreScreenArray = this.scorePersonArray;
    }

    componentDidMount() {
        super.componentDidMount();

        if (BackHandler) {
            BackHandler.addEventListener('ClassRankScreenPress', this.handleDrawerBackButton);
        }
        this.getOptionKindList();
        this.getGroupList();
        this.getRanking();
    }

    UNSAFE_componentWillMount() {
        super.UNSAFE_componentWillMount();
        if (BackHandler) {
            BackHandler.removeEventListener('ClassRankScreenPress', this.handleDrawerBackButton);
        }
    }

    handleDrawerBackButton = () => {
        // Default handler if true is passed
        if (this.state.isDrawerOpen) {
            this.drawers.close();
            return true;
        }
        return false;
    };
    getRanking = () => {
        let classId = `classId=${this.classId}`;
        let timeType = this.isFilterTime ? "" : ('&timeType=' + this.timeType);
        let rankType = `&rankType=${this.rankType}`;
        let sortType = `&sortType=${this.sortType}`;
        let startTime = Utils.isNull(this.startTime) || !this.isFilterTime ? '' : `&startTime=${this.startTime}`;
        let endTime = Utils.isNull(this.endTime) || !this.isFilterTime ? '' : `&endTime=${this.endTime}`;
        let kinds = Utils.isNull(this.kindIds) ? '' : `&kindIds=${this.kinds}`;
        let groupIds = Utils.isNull(this.groupIds) ? '' : `&groupIds=${this.groupIds}`;

        let url = `${fetchUrl.getRanking}${classId}${timeType}${rankType}${sortType}${startTime}${endTime}&onlySelf=0${kinds}${groupIds}`;
        HttpUtils.doGetWithToken(url, {
            onSuccess: (responseData) => {
                if (responseData.data && responseData.data.length > 0) {
                    for (let rank of responseData.data) {
                        rank.headerUrl = this.rankType === 0 ? Utils.getStudentAvatar(rank.header, rank.sex) : Utils.getTeamAvatar(rank.header);
                        let itemModel = new ItemModel(this.tableKey, ClassRankHolder);
                        itemModel.setAttribute('data', rank);
                        itemModel.setAttribute('holderStatus', this.state.holderStatus);
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
                    super.onNullData();
                }

            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message)
            },
        });
    };

    getOptionKindList = () => {
        HttpUtils.doGetWithToken(fetchUrl.getOptionKindList + 'classId=' + this.classId, {
            onSuccess: (responseData) => {
                if (responseData.data && responseData.data.length > 0) {
                    let studentMatter = [];
                    let groupMatter = [];
                    for (let matter of responseData.data) {
                        if (matter.type == 0 || matter.type == 2 || matter.type == 3 || matter.type == 4) {
                            studentMatter.push(matter)
                        }
                        if (matter.type == 1 || matter.type == 2 || matter.type == 3) {
                            groupMatter.push(matter)
                        }
                    }

                    this.setState({
                        studentMatterArray: studentMatter,
                        groupMatterArray: groupMatter,
                    });
                }

            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message)
            },
            onEnd: () => {

            },
            onNullData: (responseData) => {
                // ToastUtils.showToast(responseData.message)
            }
        });
    };
    getGroupList = () => {
        HttpUtils.doGetWithToken(fetchUrl.getGroupList + 'classId=' + this.classId, {
            onSuccess: (responseData) => {
                this.setState({teamData: responseData.data});
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message)
            },
            onEnd: () => {

            },
            onNullData: (responseData) => {
                // ToastUtils.showToast(responseData.message)
            }
        });
    };

    renderHeaderRight = () => {
        return (
            <Image style={{width: 17, height: 17}} resizeMode={'contain'}
                   source={require('../../../assets/class/ranking_ic_screen.png')}/>
        );
    };

    renderScreenView = (screenText, isDown) => {
        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center', justifyContent: 'center',
            }}>
                <Text style={{fontSize: 13, color: colors.text888}}>{screenText}</Text>
                <Image
                    style={{width: Utils.isNull(isDown) ? 12 : 8, height: Utils.isNull(isDown) ? 12 : 8, marginLeft: 5}}
                    resizeMode={'contain'}
                    source={Utils.isNull(isDown) ? require('../../../assets/class/ranking_ic_rank.png') :
                        isDown ? require('../../../assets/class/ranking_ic_take_up.png') :
                            require('../../../assets/class/ranking_ic_pull.png')}/>
            </View>
        );
    };

    renderData() {
        return (
            <TableView
                ref={(c) => {
                    this.tableView = c
                }}
                style={{backgroundColor: colors.white}}
                mode={PullRefreshMode.PULL_FROM_START}
                isShowDivider={true}
                adapter={this.adapter}
                onPullDownToRefresh={(tableView) => {
                    this.onDownRefresh();
                }}
            />
        )
    }

    render() {
        let renderView = super.render();
        return (
            <Drawer
                ref={(c) => this.drawers = c}
                onOpenStart={() => {
                    this.setState({
                        isDrawerOpen: true
                    });
                }}
                onCloseStart={() => {
                    this.setState({
                        isDrawerOpen: false
                    });
                }}
                type="overlay"
                content={
                    <ClassRankDrawerScreen
                        drawer={this.drawers}
                        onConfirm={() => {
                            let startTime = '', endTime = '';
                            if (!Utils.isNull(this.state.startTimes)) { //筛选开始时间
                                this.startTime = this.state.startTimes;
                                startTime = TimeUtils.getTimeWithDayWithYear(this.state.startTimes);
                            }
                            if (!Utils.isNull(this.state.endTimes)) { //筛选结束时间
                                this.endTime = this.state.endTimes;
                                endTime = TimeUtils.getTimeWithDayWithYear(this.state.endTimes);
                            }
                            this.onlySelf = this.state.isCheckMine ? 1 : 0; //筛选是否只查看自己

                            let checkImprove = [];
                            let data = this.state.personScreenText == "个人" ? this.state.studentMatterArray : this.state.groupMatterArray;
                            for (let improve of data) {
                                if (improve.isChecked) {
                                    checkImprove.push(improve);
                                }
                            }
                            this.kindIds = Utils.getArrayName(checkImprove, 'id'); //筛选事项分类

                            let checkTeam = [];
                            for (let team of this.state.teamData) {
                                if (team.isChecked) {
                                    checkTeam.push(team);
                                }
                            }
                            this.groupIds = Utils.getArrayName(checkTeam, 'id');    //筛选小组
                            let screenText = '';
                            if (Utils.isNull(startTime) && Utils.isNull(endTime)) {
                                screenText = this.state.timeScreenText;
                                this.isFilterTime = false;
                            } else {
                                screenText = startTime + '-' + endTime;
                                this.isFilterTime = true;

                            }
                            this.setState({
                                timeScreenText: screenText,
                            }, () => {
                                this.onDownRefresh();
                            });
                        }}
                        setStateFlag={(flag) => {
                            this.setState(flag, () => {
                                this.startTime = this.state.startTimes;
                                this.endTime = this.state.endTimes;
                            })
                        }}
                        startTimes={this.state.startTimes}
                        endTimes={this.state.endTimes}
                        improveData={this.state.personScreenText == "个人" ? this.state.studentMatterArray : this.state.groupMatterArray}
                        subtitle={this.state.personScreenText == "个人" ? "小组内排名" : "小组排名"}
                        teamData={this.state.teamData}
                        {...this.props}/>
                }
                tweenHandler={(ratio) => ({
                    mainOverlay: {
                        opacity: ratio / 2,
                        backgroundColor: 'black',
                    },
                })}
                acceptTap={true}
                acceptPan={true}
                negotiatePan={true}
                panOpenMask={.4}
                openDrawerOffset={theme.screenWidth * 0.15}
                side={'right'}
                tweenDuration={350}
                tweenEasing={'easeOutQuad'}
            >
                <View style={this.styles.container}>
                    <KBHeader title={"排名"} isLeft={true} headerStyle={'dark'}
                              rightComponent={() => this.renderHeaderRight()} {...this.props}
                              touchRight={() => {
                                  this.drawers.open();
                              }}/>
                    <View style={{flexDirection: 'row', paddingHorizontal: 14,}}>
                        <KBDropPopMenu dataArray={this.timeScreenArray}
                                       uniqueKey={'text'}
                                       onOpen={() => this.setState({isTimeDown: true})}
                                       onClose={() => this.setState({isTimeDown: false})}
                                       menuTrigger={() => this.renderScreenView(this.state.timeScreenText, this.state.isTimeDown)}
                                       onSelect={(item) => {
                                           this.timeType = item.value.value;
                                           this.isFilterTime = false;
                                           this.setState({
                                               timeScreenText: item.value.text,
                                           }, () => {
                                               this.onDownRefresh();
                                           });
                                       }}/>
                        <KBDropPopMenu dataArray={this.personScreenArray}
                                       uniqueKey={'text'}
                                       onOpen={() => this.setState({isPersonDown: true})}
                                       onClose={() => this.setState({isPersonDown: false})}
                                       menuTrigger={() => this.renderScreenView(this.state.personScreenText, this.state.isPersonDown)}
                                       onSelect={(item) => {  //0个人  1小组
                                           let value = item.value.value;
                                           if (value === 0) {
                                               this.scoreScreenArray = this.scorePersonArray;
                                           } else {
                                               this.scoreScreenArray = this.scoreGroupArray;
                                           }
                                           this.rankType = value;
                                           this.state.holderStatus.isTeam = value === 1;

                                           this.setState({personScreenText: item.value.text}, () => {
                                               this.onDownRefresh()
                                           });
                                       }}/>
                        <KBDropPopMenu dataArray={this.scoreScreenArray}
                                       uniqueKey={'text'}
                                       menuTrigger={() => this.renderScreenView(this.state.scoreScreenText)}
                                       optionsStyle={{
                                           marginLeft: -15,
                                       }}
                                       onSelect={(item) => { //0总分 1表扬分 2待改进分 3 小组平均分
                                           let value = item.value.value;
                                           this.sortType = value;
                                           this.state.holderStatus.isShowImage = !(value === 2);
                                           this.state.holderStatus.scoreType = value;
                                           this.setState({
                                               scoreScreenText: item.value.text,
                                               scoreType: value,
                                           }, () => {
                                               this.onDownRefresh();
                                           });
                                       }}/>
                    </View>
                    <Divider/>
                    {renderView}
                </View>
            </Drawer>
        );
    }

    //下拉刷新
    onDownRefresh = () => {
        this.tableKey = 0;
        this.adapter.removeAll();
        this.componentDidMount();
    };

    styles = StyleSheet.create({
        container: {
            backgroundColor: colors.white,
            flex: 1
        }
    });
}