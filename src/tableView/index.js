import React, {Component} from 'react'
import {
    FlatList,
    SectionList,
    View,
    Text,
    ActivityIndicator,
    RefreshControl,
    Animated,
    ScrollView,
    Image, ViewPropTypes
} from 'react-native'

import Adapter from "./Adapter";
import SectionAdapter from "./SectionAdapter";
import colors from "../../constants/colors"
import PropTypes from "prop-types";
import Divider from "../Divider";
import theme from "../../constants/theme";
import {Button} from "native-base";
import KBHeader from "../KBHeader";

export const PullRefreshMode = {
    BOTH: 'BOTH',
    PULL_FROM_START: 'PULL_FROM_START', // 上拉刷新
    PULL_FROM_END: 'PULL_FROM_END',     // 下拉加载
    NONE: 'NONE'
}

class TableView extends Component {

    constructor(props) {
        super(props);
        this.self = this;
        this.adapter = this.props.adapter;
        this.state = {
            data: this.adapter,
            showFoot: 0,
            isRefreshing: false,

            scrollY: new Animated.Value(0),
        }
    }

    static defaultProps = {
        isShowDivider: false,
        stickySectionHeadersEnabled: true,
        footText:'没有更多数据了',
        dividerStyle: null,

        mode: PullRefreshMode.NONE,
        onPullDownToRefresh: null,
        onPullUpToRefresh: null,

        opacityHeaderEnabled:false,
        headerHeight: 200,
    };

    static propTypes = {
        isShowDivider: PropTypes.bool,  //是否展示分割线
        dividerStyle: PropTypes.any,    //分割线样式
        stickySectionHeadersEnabled: PropTypes.bool,    //组列表是否固定组头部

        mode: PropTypes.oneOf([PullRefreshMode.BOTH, PullRefreshMode.PULL_FROM_START, PullRefreshMode.PULL_FROM_END, PullRefreshMode.NONE]),
        onPullDownToRefresh: PropTypes.func, // 上拉刷新
        onPullUpToRefresh: PropTypes.func,   // 下拉加载

        opacityHeaderEnabled: PropTypes.bool,
        headerAttr:PropTypes.any,
        footText:PropTypes.string,// footer文字
    };

    _separator = () => {
        return (
            <Divider {...this.props.dividerStyle} />
        );
    };

    // 重新加载数据
    notifyDataSetChanged() {
        this.adapter = this.props.adapter;
        this.setState({data: this.adapter})
    }

    _renderFooter(showFoot, fetchAgain) {
        if (showFoot === 1) {
            return (
                <View style={{
                    height: 24,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    // borderTopWidth: 1,
                    marginBottom: 10,
                }}>
                    <Text style={{color: '#999999', fontSize: 14, marginTop: 5, marginBottom: 5,}}>
                        {this.props.footText}
                    </Text>
                </View>
            );
        } else if (showFoot === 2) {
            return (
                <View style={{
                    flexDirection: 'row',
                    height: 24,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 10,
                    // borderTopWidth: 1
                }}>
                    <ActivityIndicator/>
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        } else if (showFoot === 0) {
            return null;
        }
    }

    scrollToLocation(params) {
        this.sectionList.scrollToLocation(params);
    }

    onRefreshComplete() {
        this.onPullDownRefreshComplete();
        this.onPullUpRefreshComplete();
    }

    onPullDownRefreshComplete() {
        if (this.props.mode === "BOTH" || this.props.mode === "PULL_FROM_START") {
            this.setState({
                isRefreshing: false,
            })
        }

    }

    onPullUpRefreshComplete() {
        if (this.props.mode === "BOTH" || this.props.mode === "PULL_FROM_END") {
            if (this.state.showFoot !== 0) {
                this.setState({
                    showFoot: 0
                })
            }
        }
    }

    setHasMoreData(hasMoreData) {
        if (!hasMoreData && (this.props.mode === "BOTH" || this.props.mode === "PULL_FROM_END")) {
            this.setState({
                showFoot: 1
            })
        }

    }

    render() {
        let tableProps = {};
        if (this.props.opacityHeaderEnabled) {
            tableProps.onScroll = Animated.event([{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]);
            tableProps.scrollEventThrottle=16;
        }


        if (this.props.mode === "BOTH" || this.props.mode === "PULL_FROM_START") {
            tableProps.refreshControl = <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={() => {
                    this.setState({
                        isRefreshing: true
                    }, () => {
                        if (this.props.onPullDownToRefresh)
                            this.props.onPullDownToRefresh(this);
                    })

                }}
                tintColor={colors.text888}
                title="正在刷新"
                titleColor={colors.text888}
                colors={['#ff0000', '#00ff00', '#0000ff']}
            />
        }

        if (this.props.mode === "BOTH" || this.props.mode === "PULL_FROM_END") {
            tableProps.onEndReachedThreshold = 0.5;
            tableProps.onEndReached = () => {
                if (this.state.showFoot !== 0) {
                    return;
                }
                this.setState({
                    showFoot: 2
                });
                if (this.props.onPullUpToRefresh)
                    this.props.onPullUpToRefresh(this);
            };
            tableProps.ListFooterComponent = this._renderFooter(this.state.showFoot, this.props.loadAgain)
        }

        let tableView = null;
        if (this.adapter instanceof Adapter) {

            tableView =  (
                <FlatList
                    style={this.props.style}
                    extraData={[this.state]}
                    {...tableProps}
                    data={this.state.data.getDataScore()}
                    renderItem={this.adapter.getView}
                    ItemSeparatorComponent={!this.props.isShowDivider ? null : this._separator}
                    keyExtractor={this.adapter.getKey}
                    {...this.props}
                />
            );
        }

        else if (this.adapter instanceof SectionAdapter) {
            tableView = (
                <SectionList
                    ref={(c) => this.sectionList = c}
                    style={this.props.style}
                    extraData={[this.state]}
                    {...tableProps}
                    sections={this.state.data.getDataScore()}
                    renderSectionHeader={this.adapter.renderSectionHeader}
                    renderItem={this.adapter.getView}
                    keyExtractor={this.adapter.getKey}
                    ItemSeparatorComponent={!this.props.isShowDivider ? null : this._separator}
                    stickySectionHeadersEnabled={this.props.stickySectionHeadersEnabled}
                    {...this.props}
                />
            );
        }

        if (this.props.opacityHeaderEnabled) {
            return  <View style={{flex:1}}>
                {tableView}
                {this.renderNavigateHeader()}
            </View>;
        }

        return tableView;
    }

    renderNavigateHeader() {
        let {scrollY} = this.state;
        return (
            <Animated.View
                style={{
                    position: 'absolute',
                    top: 0,
                    opacity: scrollY.interpolate({
                        inputRange: [0, this.props.headerHeight - theme.headerHeight],
                        outputRange: [0, 1],
                    }),
                }}
            >
               <KBHeader {...this.props.headerAttr}/>
            </Animated.View>
        )
    }
}


export default TableView;
