import React, {Component} from 'react';
import {Image, StyleSheet, Text, View, TextInput, ScrollView} from 'react-native';
import BaseScreen from '../../base/BaseScreen';
import KBHeader from '../../components/KBHeader';
import TableView from '../../components/tableView';
import Adapter from '../../components/tableView/Adapter';
import ItemModel from '../../components/tableView/ItemModel';
import FixedHistoryHolder from './View/FixedHistoryHolder';
import fetchUrl from '../../constants/fetchUrl';
import KBButton from '../../components/KBButton';
import ToastUtils from '../../utils/ToastUtils';
import Utils from '../../utils/Utils';
import HttpUtils from '../../utils/HttpUtils';
import colors from '../../constants/colors';
import StorageUtils from '../../utils/StorageUtils';
import Divider from '../../components/Divider';

export default class FixedSearchScreen extends BaseScreen {

    constructor(props) {
        super(props);
        this.AWARDKEY = 'awardhistory';
        let showFoot = 0;
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
            imageUrls: [],
            imageIndex: 0,
        }, this.state);
        this.adapter = new Adapter();


        StorageUtils._load(this.AWARDKEY, (data) => {
            if (data) {
                this.state.oldData = data;
            }
        }, () => {
            console.log('获取存储数据失败');
        });

    }

    renderData() {
        return (
            <View style={{flex: 1, backgroundColor: colors.white}}>
                <KBHeader title={'固定分搜索'} rightText={'搜索'} rightStyle={{color: colors.text666}}
                          touchRight={() => {
                              this.setState({isRefreshing: true, searchResult: true}, () => {
                                  this.dateSearch(this.state.text);
                              });
                          }
                          }
                          isLeft={true} {...this.props}/>

                <Divider/>

                <View style={styles.search}>

                    <View style={styles.searchInputAll}>
                        <Image style={styles.iconImg} source={require('../../assets/search.png')}/>
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
                                <Image style={styles.iconImg} source={require('../../assets/icon_close.png')}/>
                            </KBButton>
                        }
                    </View>

                    <KBButton onPress={() => this.datePicked()}>
                        <View style={styles.datePick}>
                            <Image style={styles.iconImg}
                                   resizeMode={'contain'}
                                   source={require('../../assets/image3.3/ticket/mine_icon_filter.png')}
                            />
                        </View>
                    </KBButton>
                </View>


                {this.state.searchResult ?
                    <TableView
                        ref={(c) => this.tableView = c}
                        adapter={this.adapter}
                        isShowDivider={true}
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
                    <View>
                        <View style={styles.container}>
                            <Text style={styles.text}>历史搜索</Text>
                            <KBButton onPress={() => this.clearHistory()}>
                                <Image source={require('../../assets/fixed/new_icon_trash.png')}
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

                                            this.setState({
                                                isRefreshing: true,
                                                searchResult: true,
                                                text: item.name,
                                            }, () => {
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
                    </View>

                }

            </View>
        );

    }

    clearHistory = () => {
        StorageUtils._remove(this.AWARDKEY);
        this.setState({oldData: []});
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
                StorageUtils._sava(this.AWARDKEY, this.state.oldData);
            });
            // this.kbSearch.setTextt(text);
        } else {
            ToastUtils.showToast('请输入搜索内容');
            this.setState({isRefreshing: false, searchResult: false});
            return;
        }


        let searchText = '';
        if (!Utils.isNull(text)) {
            searchText = '&searchName=' + text;
        }
        if (!Utils.isNull(this.state.startTime) && !Utils.isNull(this.state.endTime)) {
            searchText += '&startTime=' + this.state.startTime + '&endTime=' + this.state.endTime;
        }

        let url = fetchUrl.indexFixedScore + '&page=' + this.page + searchText;

        HttpUtils.doGetWithToken(url, {
            onSuccess: (responseData) => {

                this.totalPage = responseData.data.totalPage;
                if (this.page === 1) {
                    this.adapter.removeAll();
                    this.state.data = [];
                }
                this.state.data = this.state.data.concat(responseData.data.data);

                for (let item of this.state.data) {
                    let itemModel = new ItemModel(this.tableKey, FixedHistoryHolder);
                    let studentName = '';
                    for (let i = 0; i < item.studentData.length; i++) {
                        if (i == item.studentData.length - 1) {
                            studentName += item.studentData[i].studentName;
                        } else {
                            studentName += item.studentData[i].studentName + ',';
                        }
                    }
                    item.studentName = studentName;
                    itemModel.setAttribute('data', item);
                    itemModel.setAttribute('navigation', this.props.navigation);
                    itemModel.setAttribute('refresh', this.onRefresh);
                    this.adapter.addItem(itemModel);
                    this.tableKey++;
                }

                let foot = 0;
                if (this.page >= this.totalPage) {
                    foot = 1;//listView底部显示没有更多数据了
                }
                this.setState({
                    showFoot: foot,
                    isLoading: false,
                    isRefreshing: false,
                    searchResult: true,
                });

            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
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

                // ToastUtils.showToast('选择时间段：' + startDate.dateString + "~" + endDate.dateString);

            },
        });
    };


    onRefresh = () => {
        this.page = 1;
        this.tableKey = 0;
        this.setState({isRefreshing: true, searchResult: true}, () => {
            // super.componentDidMount();
            this.dateSearch(this.state.text);
        });
    };

    _onEndReached = () => {
        //如果是正在加载中或没有更多数据了，则返回
        if (this.state.showFoot !== 0 || this.state.error) {
            return;
        }
        console.log('1111111111111', this.totalPage);
        //如果当前页大于或等于总页数，那就是到最后一页了，返回
        if ((this.page >= this.totalPage)) {
            return;
        } else {
            this.page++;
        }
        //底部显示正在加载更多数据
        this.setState({showFoot: 2});
        //获取数据
        // super.componentDidMount();
        this.dateSearch(this.state.text);
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
