import React, {Component} from 'react';
import {Image, Text, View} from 'react-native';
import BaseScreen from '../../base/BaseScreen';
import KBHeader from '../../components/KBHeader';
import theme from '../../constants/theme';
import Color from '../../constants/colors';
import KBButton from '../../components/KBButton';
import TableView, {PullRefreshMode} from '../../components/tableView';
import Adapter from '../../components/tableView/Adapter';
import ItemModel from '../../components/tableView/ItemModel';
import FixedHistoryHolder from './View/FixedHistoryHolder';
import fetchUrl from '../../constants/fetchUrl';
import Utils from '../../utils/Utils';

export default class FixedHistoryScreen extends BaseScreen {

    constructor(props) {
        super(props);
        this.page = 1;
        this.totalPage = 0;
        this.tableKey = 0;
        this.state = Object.assign({
            data: [],
            lineNumber: null,
            imageUrls: [],
            imageIndex: 0,
        }, this.state);
        this.adapter = new Adapter();
    }

    getApiUrl() {
        return fetchUrl.indexFixedScore + '&page=' + this.page;
    }

    onSuccess(responseData) {

        if (responseData.data) {
            this.totalPage = responseData.data.totalPage;

            if (responseData.data.data && responseData.data.data.length > 0) {
                for (let item of responseData.data.data) {
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

   render() {
        let renderView = super.render();
       return (
           <View style={{flex: 1}}>
               <KBHeader title={'固定分记录'} isLeft={true} {...this.props}/>
               {this.renderSearch()}
               {renderView}
           </View>
       );
   }

   renderSearch() {
        return(
            <KBButton onPress={() => {
                const {navigate} = this.props.navigation;
                navigate('FixedSearch');
            }}>
                <View style={{
                    width: theme.screenWidth - 40,
                    height: 36,
                    flexDirection: 'row',
                    marginVertical: 10,
                    marginHorizontal: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 18,
                    backgroundColor: Color.white,
                }}>
                    <Image style={{width: 15, height: 15}} source={require('../../assets/search.png')}/>
                    <Text style={{fontSize: 14, color: Color.text666, marginLeft: 5}}>搜索</Text>
                </View>
            </KBButton>
        )
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
                    style={{backgroundColor: Color.divider, marginTop: 10}}
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
        );

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

}
