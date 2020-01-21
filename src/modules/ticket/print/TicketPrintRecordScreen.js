import React from "react"
import {Image, StyleSheet, Text, View, DeviceEventEmitter} from "react-native";

import BaseScreen from "../../../base/BaseScreen";
import KBHeader from "../../../components/KBHeader";
import ItemModel from "../../../components/tableView/ItemModel";
import Adapter from "../../../components/tableView/Adapter";
import TableView, {PullRefreshMode} from "../../../components/tableView";
import KBButton from "../../../components/KBButton";
import KBDropPopMenu from "../../../components/popMenu/KBDropPopMenu";
import {renderers} from "../../../components/popMenu/src";

import colors from "../../../constants/colors";
import fetchUrl from "../../../constants/fetchUrl";
import theme from "../../../constants/theme";
import image from "../../../constants/image";
import UserData from "../../../constants/UserData";

import Utils from "../../../utils/Utils";
import TimeUtils from "../../../utils/TimeUtils";

import TicketPrintRecordHolder from './view/TicketPrintRecordHolder';

export default class TicketPrintRecordScreen extends BaseScreen {


    constructor(props) {
        super(props);
        this.page = 1;
        this.totalPage = 0;
        this.tableKey = 0;
        this.state = Object.assign({
            data: [],
            isRefreshing: false,

            searchClass: {}, //筛选class
            searchTime: '',  //筛选时间 20190809-20190810
        }, this.state);

        this.adapter = new Adapter();
        this.classData = UserData.getInstance().getClass();
    }

    getApiUrl() {

        let searchClassStr = Utils.isNull(this.state.searchClass.id) ? '' : `&search_class=${this.state.searchClass.id}`;
        let searchTimeStr = Utils.isNull(this.state.searchTime) ? '' : `&search_time=${this.state.searchTime}`;
        return `${fetchUrl.getPrintList}page=${this.page}${searchClassStr}${searchTimeStr}`;
    }

    onSuccess(responseData) {
        if (responseData.data) {
            this.totalPage = responseData.data.totalPage;

            if (responseData.data.data && responseData.data.data.length > 0) {
                for (let item of  responseData.data.data) {

                    item.date = TimeUtils.getTimeWithSecond(item.create_at);
                    let itemModel = new ItemModel(this.tableKey, TicketPrintRecordHolder);
                    itemModel.setAttribute("data", item);
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
                if (this.page === 1) {
                    super.onNullData();
                }
            }
        }

    }

    renderData() {
        return (
            <View style={{flex: 1}}>
                <TableView
                    ref={(c) => {
                        this.tableView = c
                    }}
                    mode={PullRefreshMode.BOTH}
                    isShowDivider={true}
                    dividerStyle={{customHeight: 1}}
                    style={{backgroundColor: colors.divider, marginTop: 10}}
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
                />
            </View>
        )
    }

    renderFilterView() {
        return (
            <View style={{flexDirection: 'row',}}>
                <KBDropPopMenu
                    renderer={renderers.PopoverNew}
                    rendererProps={{
                        placement: 'bottom',
                        preferredPlacement: 'top',
                        anchorStyle: {backgroundColor: colors.white}
                    }}
                    optionsStyle={{
                        marginTop: -10,
                        backgroundColor: colors.white,
                        width: theme.screenWidth - 20,
                        borderRadius: 5,
                    }}
                    optionStyle={{paddingHorizontal: 14}}
                    dataArray={UserData.getInstance().getClass()}
                    uniqueKey={'name'}
                    menuTriggerStyle={{width: theme.screenWidth / 2, height: 40, justifyContent: 'center'}}
                    menuTrigger={() => {
                        return (
                            <View style={{flexDirection: 'row',}}>
                                <Text style={{fontSize: 14, color: colors.text666}}>{Utils.isNull(this.state.searchClass.id) ? '全部班级' : this.state.searchClass.name}</Text>
                                <Image style={{marginTop: 5, marginLeft: 10, width: 14, height: 8}}
                                       source={image.itemArrowDownImage}
                                />
                            </View>
                        )
                    }}
                    onSelect={(value) => this.classChanged(value)}
                />
                <KBButton onPress={() => this.datePicked()}>
                    <View style={{
                        flexDirection: 'row',
                        width: theme.screenWidth / 2,
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Text style={{fontSize: 14, color: colors.text666}}>{Utils.isNull(this.state.searchTime)? '时间筛选' : this.state.searchTime}</Text>
                        <Image style={{marginTop: 5, marginLeft: 10, width: 14, height: 8}}
                               source={image.itemArrowDownImage}
                        />
                    </View>
                </KBButton>
            </View>
        )
    }
    render(): * {
        let renderView = super.render();

        return(
            <View style={{flex: 1}}>
                <KBHeader
                    isLeft={true}
                    title={"打印申请记录"}
                    headerStyle={'dark'}
                    {...this.props}
                />
                {this.renderFilterView()}
                {renderView}
            </View>
        )
    }


    classChanged = (value) => {
        if (!Utils.isNull(this.state.searchClass.id) && this.state.searchClass.id === value.value.id) {
            this.setState({
                searchClass: {},
            }, () => this.onDownRefresh())
        }else {
            this.setState({
                searchClass: value.value,
            },  () => this.onDownRefresh())
        }
    };

    datePicked = () => {
        const {navigate} = this.props.navigation;
        navigate('KBDate', {
            isSingle: false,
            hasAllDate: true,
            getDate: (startDate, endDate) => {
                let searchTimeStr = '';
                if (startDate && endDate) {
                    let startStr = startDate.dateString.split('-').join('');
                    let endStr = endDate.dateString.split('-').join('');
                    searchTimeStr = `${startStr}-${endStr}`;
                } else if (startDate && !endDate) {
                    let startStr = startDate.dateString.split('-').join('');
                    let endStr = startDate.dateString.split('-').join('');
                    searchTimeStr = `${startStr}-${endStr}`;
                } else {
                   searchTimeStr = '';
                }

                this.setState({
                    searchTime: searchTimeStr,
                }, () => this.onDownRefresh())
            }
        })
    }

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


    styles = StyleSheet.create({
        container: {
            backgroundColor: colors.empty,
            flex: 1
        },
    });
}
