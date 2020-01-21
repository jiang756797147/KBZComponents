import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
    DeviceEventEmitter,
    TouchableWithoutFeedback,
    TextInput,
    Keyboard
} from 'react-native';

import BaseScreen from '../../../base/BaseScreen';
import KBHeader from '../../../components/KBHeader';
import ItemModel from '../../../components/tableView/ItemModel';
import Adapter from '../../../components/tableView/Adapter';
import TableView from '../../../components/tableView';
import Divider from '../../../components/Divider';
import KBButton from '../../../components/KBButton';

import colors from '../../../constants/colors';
import fetchUrl from '../../../constants/fetchUrl';

import Utils from '../../../utils/Utils';
import TimeUtils from '../../../utils/TimeUtils';
import HttpUtils from '../../../utils/HttpUtils';


import ToastUtils from '../../../utils/ToastUtils';
import theme from '../../../constants/theme';
import StorageUtils from '../../../utils/StorageUtils';
import TaskRecordHolder from "../../ticket/task/view/TaskRecordHolder";

export default class UsingHelpSearchScreen extends BaseScreen {


    constructor(props) {

        super(props);
        let showFoot = 0;
        this.TASKKEY = 'usinghelphistory';
        this.page = 1;
        this.totalPage = 0;
        this.tableKey = 0;
        this.isReload = false;
        this.hotSearch = [{name: '假如班级'}, {name: '录入奖票'}, {name: '申请积分'}, {name: '扫一扫奖票'},];
        this.state = Object.assign({
            searchResult: false,
            data: [],
            oldData: [],
            isRefreshing: false,
            showFoot: showFoot, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            searchName: '',
        }, this.state);
        this.adapter = new Adapter();

    }

    componentDidMount() {
        super.componentDidMount();
        this.getHistory();
        console.log(this.state.isNullData)
        if (this.isReload && this.state.text.length > 0) {
            this.onRefresh();
        }
    }


    renderData() {
        return (
            <TouchableWithoutFeedback style={{flex: 1, backgroundColor: colors.white}}
                                      onPress={() => {
                                          Keyboard.dismiss()
                                      }}
            >
                {this.state.searchResult ?
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
                    : this.renderHotSearch()}
            </TouchableWithoutFeedback>
        );
    }

    renderHotSearch = () => {
        return (<View style={{flex: 1, backgroundColor: colors.white}}>
            <View style={{
                paddingTop: 18,
                paddingHorizontal: 15,
                backgroundColor: colors.white,
                alignItems: 'center',
                flexDirection: 'row',
            }}>
                <Text style={styles.text}>热门搜索</Text>
            </View>
            {/*<Divider style={{marginTop: 5}}/>*/}
            <View style={styles.matter}>
                {this.hotSearch.map((item, index) => {
                    return (
                        <KBButton
                            key={index}
                            onPress={() => {

                                this.setState({text: item.name, isRefreshing: true, searchResult: true}, () => {
                                    this.dateSearch(item.name);
                                });
                            }}>
                            <View style={styles.matterNO}>
                                <Text style={styles.matterNOText}>{item.name}</Text>
                            </View>
                        </KBButton>
                    );
                })}
            </View>

            <View style={{
                paddingTop: 25,
                paddingHorizontal: 15,
                backgroundColor: colors.white,
                alignItems: 'center',
                flexDirection: 'row',
            }}>
                <Text style={styles.text}>历史搜索</Text>
                <KBButton onPress={() => this.clearHistory()}>
                    <Image source={require('../../../assets/fixed/new_icon_trash.png')}
                           style={styles.trash}
                           resizeMode={'contain'}/>
                </KBButton>
            </View>
            {/*<Divider style={{marginTop: 5}}/>*/}
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
        </View>);
    }


    getHistory = () => {
        console.log('获取存储数据失败');
        StorageUtils._load(this.TASKKEY, (data) => {
            if (data) {
                this.setState({oldData: data});
            }
        }, () => {
            console.log('获取存储数据失败');
        });
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
                <KBHeader
                    titleComponent={this.renderTitleView}
                    isLeft={true} {...this.props}/>

                <Divider/>
                <View style={{flex: 1, backgroundColor: colors.white}}>
                    {renderView}
                </View>
            </View>
        );
    };

    renderTitleView = () => {
        return (<View style={styles.search}>
            <View style={styles.searchInputAll}>
                <Image style={styles.iconImg} source={require('../../../assets/class/ic_search.png')}/>
                <TextInput
                    ref={(c) => this.textInput = c}
                    placeholder={'录入奖票'}
                    style={styles.searchInput}
                    underlineColorAndroid={'transparent'}
                    onFocus={() => {
                        this.setState({searchResult: false});
                    }}

                    enablesReturnKeyAutomatically={true}
                    returnKeyType={"search"}
                    onEndEditing={this.state.text?.length > 0 ? () => this.dateSearch(this.state.text) : null}
                    onChangeText={(text) => {
                        this.setState({text});
                    }}
                    value={this.state.text}
                />

                {Utils.isNull(this.state.text) ? null :
                    <KBButton onPress={() => {
                        this.isReload = false;
                        this.adapter.removeAll();
                        this.setState({text: '', searchResult: false, isNullData: false,});
                    }}>
                        <Image style={styles.iconImg} source={require('../../../assets/icon_close.png')}/>
                    </KBButton>
                }
            </View>
        </View>);
    }


    onRefresh = () => {
        this.page = 1;
        this.tableKey = 0;
        this.totalPage = 0;
        this.setState({isRefreshing: true, showFoot: 0, isNullData: false}, () => {
            this.dateSearch(this.state.text);
        });
    };
    dateSearch = (text) => {
        this.isReload = false;
        Keyboard.dismiss();

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
                if (responseData?.data?.data.length > 0) {
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
                    this.isReload = true;
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

    taskAudit = (auditType, data) => {

    };

}
const styles = StyleSheet.create({
    search: {
        flexDirection: 'row',
        //padding: 10,
        backgroundColor: colors.white,
    },
    searchInputAll: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        height: 31,
        borderRadius: 20,
        backgroundColor: colors.divider,
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
    container: {
        padding: 7,
        backgroundColor: colors.white,
        alignItems: 'center',
        flexDirection: 'row',
    },
    text: {
        marginLeft: 7,
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: colors.text21,
    },
    trash: {
        width: 15,
        height: 15,
        marginRight: 15,
    },
    matter: {
        marginHorizontal: 10,
        paddingTop: 6,

        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    matterNO: {
        marginHorizontal: 7,
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 7,
        height: 25,
        backgroundColor: colors.empty,
        borderRadius: 12.5,
        borderWidth: 1,
        borderColor: colors.empty,
        justifyContent: 'center',
        alignItems: 'center'
    },
    matterNOText: {
        fontSize: 14,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: colors.text21,
    },
});
