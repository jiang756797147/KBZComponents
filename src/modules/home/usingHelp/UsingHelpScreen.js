import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import TableView, {PullRefreshMode} from '../../../components/tableView';
import Adapter from '../../../components/tableView/Adapter';
import BaseScreen from '../../../base/BaseScreen';
import KBHeader from '../../../components/KBHeader';
import KBButton from '../../../components/KBButton';
import ItemModel from "../../../components/tableView/ItemModel";
import UsingHelpHolder from "./view/UsingHelpHolder";

export default class UsingHelpScreen extends BaseScreen {
    settingData = [
        {itemName: '个人资料', pressTag: 'MineData'},
        {itemName: '移除缓存', pressTag: ''},
        {itemName: '消息推送', pressTag: ''},

    ];

    constructor(props) {
        super(props);
        this.state = Object.assign({
            cacheSize: '',
        }, this.state);

        this.page = 1;
        this.totalPage = 0;
        this.tableKey = 0;
        this.adapter = new Adapter();
    }

    onSuccess(responseData) {
        //  super.onSuccess(responseData);
        if (responseData) {
            console.log('11111');
        }

        for (let comment of this.settingData) {
            console.log('onSuccess', comment, this.tableKey);
            let itemModel = new ItemModel(this.tableKey, UsingHelpHolder);
            itemModel.setAttribute('data', comment);
            itemModel.setAttribute('index', this.tableKey);
            itemModel.setAttribute('itemClick', this.itemClick);
            this.adapter.addItem(itemModel);
            this.tableKey++;
        }
        if (this.tableView) {
            this.tableView.notifyDataSetChanged();
            this.tableView.onRefreshComplete();
        }
    }


    renderData() {
        return (
            <View style={this.styles.container}>
                <TableView
                    ref={(c) => {
                        this.tableView = c
                    }}
                    mode={PullRefreshMode.BOTH}
                    isShowDivider={false}
                    adapter={this.adapter}
                    footText={' '}
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

    render() {
        let renderView = super.render();
        return (
            <View style={this.styles.container}>
                <KBHeader isLeft={true} headerStyle={'dark'} {...this.props} title="使用帮助手册"
                          rightComponent={() => this.renderRightButton()}
                />

                {renderView}
            </View>
        );
    }


    itemClick = (item) => {

        console.log(item);
    }
    renderRightButton = () => {
        return (
            <KBButton onPress={() => {
                const {navigate} = this.props.navigation;
                navigate('UsingHelpSearch');
            }}>
                <View style={{}}>
                    <Image style={{width: 15, height: 15}}
                           source={require('../../../assets/class/ic_search.png')}
                    >

                    </Image>
                </View>
            </KBButton>);
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
            backgroundColor: 'white',
            flex: 1,
        },
    });
}
