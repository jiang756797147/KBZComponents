import React from 'react';
import {Image, StyleSheet, Text, View, DeviceEventEmitter, TextInput} from 'react-native';

import BaseScreen from '../../../base/BaseScreen';
import KBHeader from '../../../components/KBHeader';
import ItemModel from '../../../components/tableView/ItemModel';
import Adapter from '../../../components/tableView/Adapter';
import TableView from '../../../components/tableView';
import KBAlertDialog from '../../../components/dialog/KBAlertDialog';
import Divider from '../../../components/Divider';
import KBButton from '../../../components/KBButton';

import colors from '../../../constants/colors';
import fetchUrl from '../../../constants/fetchUrl';

import Utils from '../../../utils/Utils';
import TimeUtils from '../../../utils/TimeUtils';
import HttpUtils from '../../../utils/HttpUtils';

import TaskRecordHolder from './view/TaskRecordHolder';
import ToastUtils from '../../../utils/ToastUtils';
import theme from '../../../constants/theme';
import StorageUtils from '../../../utils/StorageUtils';

export default class TaskSearchScreen extends BaseScreen {


    constructor(props) {

        super(props);
        let showFoot = 0;
        this.TASKKEY = 'taskhistory';
        this.page = 1;
        this.totalPage = 0;
        this.tableKey = 0;
        this.state = Object.assign({
            searchResult: false,
            data: [],
            oldData: [],
            startTime: '',
            endTime: '',
            firstDate: null,
            secondDate: null,
            lineNumber: null,
            isRefreshing: false,
            showFoot: showFoot, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            searchName: '',

        }, this.state);

        this.adapter = new Adapter();

        this.auditType = 0; //0: 未审核 1：通过 2：拒绝 3： 终止
        this.taskData = {}; //当前任务

        StorageUtils._load(this.TASKKEY, (data) => {
            if (data) {
                this.state.oldData = data;
            }
        }, () => {
            console.log('获取存储数据失败');
        });
    }

    renderData() {
        return (
            this.state.searchResult ?
                <TableView
                    ref={(c) => this.tableView = c}
                    adapter={this.adapter} isShowDivider={true}
                    onEndReach={this._onEndReached}
                    showFoot={this.state.showFoot}
                    loadAgain={() => {
                        //如果当前页大于或等于总页数，那就是到最后一页了，返回
                        if ((this.page !== 1) && (this.page >= this.totalPage)) {
                            return;
                        }
                        //底部显示正在加载更多数据
                        this.setState({showFoot: 2});
                        //获取数据
                        super.componentDidMount();
                    }}
                    isRefreshing={this.state.isRefreshing}
                    refresh={this.onRefresh}/>
                :
                <View style={{flex: 1, backgroundColor: colors.white}}>
                    <View style={styles.container}>
                        <Text style={styles.text}>历史搜索</Text>
                        <KBButton onPress={() => this.clearHistory()}>
                            <Image source={require('../../../assets/fixed/new_icon_trash.png')}
                                   style={styles.trash}
                                   resizeMode={'contain'}/>
                        </KBButton>
                    </View>
                    <Divider style={{marginTop: 5}}/>
                    <View style={styles.matter}>
                        {this.state.oldData.map((item, index) => {
                            return (
                                <KBButton
                                    key={index}
                                    onPress={() => {

                                        this.setState({text: item.name, isRefreshing: true, searchResult: true}, () => {
                                            this.dateSearch(item.name);
                                        });

                                        // this.state.text = item.name;
                                        // this.dateSearch(item.name);
                                    }}>
                                    <View style={styles.matterNO}>
                                        <Text style={styles.matterNOText}>{item.name}</Text>
                                    </View>
                                </KBButton>
                            );
                        })}
                    </View>
                </View>
        );
    }

    clearHistory = () => {
        StorageUtils._remove(this.TASKKEY);
        this.setState({oldData: []});
    };


    render() {
        let renderView = super.render();
        return (
            <View
                style={{width: theme.screenWidth, height: theme.screenHeight, flex: 1, backgroundColor: colors.white}}>
                <KBHeader title={'任务分搜索'} rightText={'搜索'} rightStyle={{color: colors.text666}}
                          touchRight={() => {
                              this.setState({isRefreshing: true, searchResult: true}, () => {
                                  this.dateSearch(this.state.text);
                              });
                          }}
                          isLeft={true} {...this.props}/>

                <Divider/>

                <View style={styles.search}>

                    <View style={styles.searchInputAll}>
                        <Image style={styles.iconImg} source={require('../../../assets/search.png')}/>
                        <TextInput
                            placeholder={'请输入学生姓名搜索'}
                            style={styles.searchInput}
                            underlineColorAndroid={'transparent'}
                            onFocus={() => {
                                this.setState({searchResult: false});
                            }}
                            onChangeText={(text) => {
                                this.setState({text});
                            }}
                            value={this.state.text}
                        />

                        {Utils.isNull(this.state.text) ? null :
                            <KBButton onPress={() => {
                                this.setState({text: '', searchResult: false});
                            }}>
                                <Image style={styles.iconImg} source={require('../../../assets/icon_close.png')}/>
                            </KBButton>
                        }
                    </View>

                    <KBButton onPress={() => this.datePicked()}>
                        <View style={styles.datePick}>
                            <Image style={styles.iconImg}
                                   resizeMode={'contain'}
                                   source={require('../../../assets/image3.3/ticket/mine_icon_filter.png')}
                            />
                        </View>
                    </KBButton>
                </View>
                <View style={{flex: 1, backgroundColor: colors.white}}>
                    {renderView}
                </View>
                <KBAlertDialog
                    ref={(c) => this.dialog = c}
                    title={this.auditType === 3 ? '温馨提示' : ''}
                    contentComponent={() => this.renderDialogContent()}
                    rightPress={() => {
                        this.auditTask();
                    }}/>
            </View>
        );
    };

    renderDialogContent = () => {
        let passTitle = '确定通过任务吗？';
        let rejectTitle = '确定不通过任务吗？';
        let passContent = '本周期结束后，若未进行该操作，将自动给予任务通过并给学生加分。';
        let rejectContent = '若未通过，参与本任务的学生将无法在本周期获得加分。';

        let title = this.auditType === 1 ? passTitle : this.auditType === 2 ? rejectTitle : null;
        let content = this.auditType === 1 ? passContent : this.auditType === 2 ? rejectContent : null;

        return (
            this.auditType === 3 ?
                <Text style={[{
                    marginHorizontal: 14,
                    marginTop: 15,
                    lineHeight: 20,
                    color: colors.text333,
                }]}>{'确定终止任务吗？'}</Text>
                :
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                    paddingVertical: 40,
                    paddingHorizontal: 20,
                }}>
                    <Text style={{fontSize: 17, color: colors.text333}}>{title}</Text>
                    <Text style={{
                        fontSize: 15,
                        marginVertical: 20,
                        color: colors.text555,
                        lineHeight: 20,
                    }}>{content}</Text>
                </View>
        );
    };

    taskAudit = (auditType, data) => {
        this.taskData = data;
        if (auditType < 4) {
            this.auditType = auditType;
            this.setState({}, () => {
                this.dialog.show();
            });
        } else {
            ToastUtils.showToast('复制');
            const {navigate} = this.props.navigation;
            navigate('Task', {
                classId: this.classId,
                taskData: data,
            });
        }
    };

    dateSearch = (text) => {

        if (!Utils.isNull(text)) {
            //去除重复的关键词
            let olddata = this.state.oldData;
            for (let i = 0; i < olddata.length; i++) {
                if (olddata[i].name === text) {
                    olddata.splice(i, 1);
                    break;
                }
            }
            this.setState(prevState => ({
                oldData: [{name: text}, ...olddata],
            }), () => {
                StorageUtils._sava(this.TASKKEY, this.state.oldData);
            });
        } else {
            this.setState({isRefreshing: false, searchResult: false});
            ToastUtils.showToast('请输入搜索内容');
            return;
        }

        let searchText = Utils.isNull(this.state.text) ? '' : `&searchName=${this.state.text}`;
        let startTime = Utils.isNull(this.state.startTime) ? '' : `&startTime=${this.state.startTime}`;
        let endTime = Utils.isNull(this.state.endTime) ? '' : `&endTime=${this.state.endTime}`;


        let url = `${fetchUrl.indexTaskScore}page=${this.page}${searchText}${startTime}${endTime}`;

        HttpUtils.doGetWithToken(url, {
            onSuccess: (responseData) => {

                this.totalPage = responseData.data.totalPage;
                if (this.page === 1) {
                    this.adapter.removeAll();
                }
                if (!Utils.isNull(responseData.data)) {
                    for (let item of responseData.data.data) {

                        item.date = TimeUtils.getTimeWithSecond(item.create_at);
                        item.week = TimeUtils.getWeekWithChina(item.create_at);
                        item.headUrl = Utils.getTeacherAvatar(item.header, item.sex);
                        let itemModel = new ItemModel(this.tableKey, TaskRecordHolder);
                        itemModel.setAttribute('data', item);
                        itemModel.setAttribute('audit', this.taskAudit);
                        itemModel.setAttribute('navigation', this.props.navigation);
                        this.adapter.addItem(itemModel);
                        this.tableKey++;
                    }
                    let foot = 0;
                    if (this.page >= this.totalPage) {
                        foot = 1;//listView底部显示没有更多数据了
                    }
                    this.setState({
                        showFoot: foot,
                        isNullData: false,
                        searchResult: true,
                    });
                } else {
                    this.setState({
                        isNullData: true,
                    });
                }

            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onLoad: () => {
                super.onLoad();
            },
            onEnd: () => {
                this.setState({isRefreshing: false});
            },
            onNullData: (responseData) => {
                if (this.page === 1) {
                    this.adapter.removeAll();
                    this.setState({
                        showFoot: 0,
                        isNullData: true,
                    });
                    // ToastUtils.showToast(responseData.message);
                }
            },
        });

    };
    datePicked = () => {


        const {navigate} = this.props.navigation;
        navigate('KBDate', {
            isSingle: false,
            firstDate: this.state.firstDate,
            secondDate: this.state.secondDate,
            getDate: (startDate, endDate) => {
                console.log('startDate ================', startDate);
                this.state.firstDate = startDate;
                this.state.secondDate = endDate;
                this.state.startTime = startDate.timestamp / 1000;
                this.state.endTime = endDate.timestamp / 1000;
                ToastUtils.showToast('选择时间段：' + startDate.dateString + '~' + endDate.dateString);

            },
        });

    };

    onRefresh = () => {
        this.page = 1;
        this.tableKey = 0;
        this.totalPage = 0;
        this.setState({isRefreshing: true, showFoot: 0, isNullData: false}, () => {
            this.dateSearch(this.state.text);
        });
    };
    _onEndReached = () => {
        //如果是正在加载中或没有更多数据了，则返回
        if (this.state.showFoot !== 0 || this.state.error) {
            return;
        }
        //如果当前页大于或等于总页数，那就是到最后一页了，返回
        if ((this.page >= this.totalPage)) {
            return;
        } else {
            this.page++;
        }
        //底部显示正在加载更多数据
        this.setState({showFoot: 2});
        //获取数据
        this.dateSearch(this.state.text);
    };


    auditTask = () => {

        this.dialog.dismiss();
        let formData = new FormData();
        formData.append('taskId', this.taskData.id);
        formData.append('classId', this.classId);
        formData.append('status', this.auditType);

        HttpUtils.doPostWithToken(fetchUrl.auditTaskScore, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(responseData.message);
                this.onRefresh();
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        });
    };
}
const styles = StyleSheet.create({
    search: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: colors.divider,
    },
    searchInputAll: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.white,
        paddingHorizontal: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        padding: 0,
        marginStart: 5,
    },
    iconImg: {
        width: 15,
        height: 15,
    },
    datePick: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        padding: 7,
        backgroundColor: colors.white,
        alignItems: 'center',
        flexDirection: 'row',
    },
    text: {
        marginLeft: 7,
        flex: 1,
        fontSize: 14,
        color: colors.text777,
    },
    trash: {
        width: 15,
        height: 15,
        marginRight: 15,
    },
    matter: {
        marginHorizontal: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    matterNO: {
        marginHorizontal: 15,
        marginTop: 10,
        padding: 7,
        backgroundColor: colors.empty,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: colors.empty,
    },
    matterNOText: {
        fontSize: 12,
        color: colors.searchText,
    },
});
