import React, {Component} from 'react';
import {View, StyleSheet, Text, Animated, Image} from 'react-native';
import PropTypes from 'prop-types'

import colors from '../../../constants/colors';
import theme from "../../../constants/theme";
import TableView, {PullRefreshMode} from "../../../components/tableView/index";
import ItemModel from "../../../components/tableView/ItemModel";

import SortByNameUtils from "../../../utils/SortByNameUtils";
import Utils from "../../../utils/Utils";

import ContactSectionAdapter from "../holder/ContactSectionAdapter";
import ContactHolder from "../holder/ContactHolder";
import AlphabetPicker from "./AlphabetPicker";
import {getSectionItemLayout} from './SectionListGetItemLayout';

export default class ContactList extends Component {

    static defaultProps = {
        listData: [],
        listKey: 'name',
        customHolder: null,
        letterTop: theme.headerHeight,
        customClick: null,
        itemClick: function () {

        },
        customAttribute: [], //例[{key:'test1',value:'123'},{key:'test2',value:'456'}]
        isRefreshing: false,
        isShowPhone: false,
        refresh: null,
        tableHeaderHeight: 0,
    };

    static propTypes = {
        listData: PropTypes.array,
        listKey: PropTypes.string,
        customHolder: PropTypes.any,
        letterTop: PropTypes.number,
        customClick: PropTypes.func,
        itemClick: PropTypes.func,
        customAttribute: PropTypes.array,
        isRefreshing: PropTypes.bool,
        isShowPhone: PropTypes.bool,
        refresh: PropTypes.func,
        renderTableHeader: PropTypes.any,
        tableHeaderHeight: PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.itemLayout = {
            // The height of the row with rowData at the given sectionIndex and rowIndex
            getItemHeight: (rowData, sectionIndex, rowIndex) => 65,

            // These four properties are optional
            getSeparatorHeight: () => 0, // The height of your separators
            getSectionHeaderHeight: () => 30, // The height of your section headers
            getSectionFooterHeight: () => 0, // The height of your section footers
            listHeaderHeight: this.props.tableHeaderHeight, // The height of your list header
        };
        this.touchLetterTop = 0;
        this.touchLetterHeight = 60;
        this.adapter = new ContactSectionAdapter();
        this.state = {
            letters: [],
            touchLetter: '',
        };
        this.initData(this.props.listData);
}

    initData(data) {
        this.state.letters = [];
        this.listData = SortByNameUtils.getPyData(data, this.props.listKey, 'id');
        let letterItems = Object.keys(this.listData);
        if (!Utils.isNull(letterItems)) {
            for (let letterItem of letterItems) {
                let item = {};
                item.letter = letterItem;
                item.isTouching = false;
                this.state.letters.push(item);
            }
        }
        // //默认第一个为选中
        // this.state.letters[0].isTouching = true;

        if (this.state.letters.length > 0) {
            let i = 0;
            let j = 0;
            this.adapter.removeAll();
            for (let letter of this.state.letters) {
                let items = this.listData[letter.letter];
                if (items.length > 0) {
                    for (let item of items) {
                        let itemModel = new ItemModel(i, this.props.customHolder ? this.props.customHolder : ContactHolder);
                        itemModel.setAttribute('data', item);
                        itemModel.setAttribute('listKey', this.props.listKey);
                        itemModel.setAttribute('customClick', this.props.customClick);
                        itemModel.setAttribute('itemClick', this.props.itemClick);
                        itemModel.setAttribute('isShowPhone', this.props.isShowPhone);
                        if (this.props.customAttribute.length > 0) {
                            for (let attribute of this.props.customAttribute) {
                                itemModel.setAttribute(attribute.key, attribute.value);
                            }
                        }
                        i++;
                        this.adapter.addItem(j, letter.letter, itemModel);
                    }
                    j++;
                }
            }
        } else {
            this.adapter.removeAll();
        }
    }

    reloadData(listData) {
        this.initData(listData);
        // this.tableView.reloadData();
        if (this.tableView) {
            this.tableView.notifyDataSetChanged();
            this.tableView.onRefreshComplete();
        }
    }

    UNSAFE_componentWillUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void {
        this.reloadData(nextProps.listData)
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: colors.empty}}>
                <TableView
                    ref={(c) => {
                        this.tableView = c
                    }}
                    mode={PullRefreshMode.PULL_FROM_START}
                    isShowDivider={true}
                    dividerStyle={{customHeight: 1}}
                    style={{backgroundColor: colors.divider}}
                    adapter={this.adapter}
                    onPullDownToRefresh={(tableView) => {
                        this.props.refresh();
                    }}
                    ListHeaderComponent={Utils.isNull(this.props.renderTableHeader) ? null : this.props.renderTableHeader}
                    getItemLayout={(data, index) => getSectionItemLayout(this.itemLayout, data, index)}
                />
                {/*<TableView ref={(c) => this.tableView = c}*/}
                {/*           adapter={this.adapter}*/}
                {/*           refresh={this.props.refresh}*/}
                {/*           ListHeaderComponent={Utils.isNull(this.props.renderTableHeader) ? null : this.props.renderTableHeader}*/}
                {/*           isRefreshing={this.props.isRefreshing}*/}
                {/*           getItemLayout={(data, index) => getSectionItemLayout(this.itemLayout, data, index)}*/}
                {/*           {...this.props}/>*/}
                <View style={{flexDirection: 'row', position: 'absolute', right: 0, top: 0, bottom: 0}}>

                    <View ref={(c) => this.touchLetterView = c}
                          display={Utils.isNull(this.state.touchLetter) ? 'none' : 'flex'} style={{
                        width: this.touchLetterHeight,
                        height: this.touchLetterHeight,
                        marginTop: this.touchLetterTop,
                        justifyContent: 'center',
                    }}>
                        <Image source={require('../../../assets/icon_contact_tip.png')}
                               style={{
                                   position: 'absolute',
                                   width: this.touchLetterHeight,
                                   height: this.touchLetterHeight,
                               }} resizeMode={'contain'}/>
                        <Text style={{
                            fontSize: 29,
                            color: colors.white,
                            marginLeft: 14
                        }}>{this.state.touchLetter}</Text>
                    </View>
                    <View style={this.styles.alphabetSidebar}>
                        <AlphabetPicker alphabet={this.state.letters} topMargin={this.props.letterTop}
                                        onTouchLetter={this._onTouchLetter} onTouchEnd={this.onTouchEnd}/>
                    </View>
                </View>
            </View>
        );
    }

    onTouchEnd = () => {
        this.setState({touchLetter: ''});
    };

    _onTouchLetter = (item, top) => {

        console.log("letter ================", item);
        let realTop = top - this.touchLetterHeight / 2;
        // if (Utils.isNull(this.state.touchLetter)) {
        // this.touchLetterView.setNativeProps({marginTop: realTop});
        // this.touchLetterTop = new Animated.Value(realTop);
        // }
        // for (let letter of this.state.letters){
        //     letter.isTouching = false;
        // }
        // item.isTouching = true;

        this.touchLetterView.setNativeProps({marginTop: realTop});
        this.setState({touchLetter: item.letter});
        // Animated.spring(
        //     this.touchLetterTop,
        //     {
        //         toValue: realTop,
        //     }).start();
        // ToastUtils.showIndexToast(item.letter);

        let index = this.state.letters.findIndex((letter) => letter.letter === item.letter);
        if (index >= 0 && this.tableView) {
            this.tableView.scrollToLocation({itemIndex: -1, sectionIndex: index, animated: true});
        }
        // for (let i = 0; i < this.state.letters.length; i++) {
        //     if (item.letter === this.state.letters[i].letter) {
        //         this.tableView.scrollToLocation({itemIndex: -1, sectionIndex: i, animated: false});
        //         return;
        //     }
        // }
    };

    remove(index, item) {
        for (let i = 0; i < this.props.listData.length; i++) {
            if (this.props.listData[i].id === item.id) {
                this.props.listData.splice(i, 1);
            }
        }
        this.listData = SortByNameUtils.getPyData(this.props.listData, this.props.listKey);
        let letterItems = Object.keys(this.listData);
        this.state.letters = [];
        if (!Utils.isNull(letterItems)) {
            for (let letterItem of letterItems) {
                let item = {};
                item.letter = letterItem;
                item.isTouching = false;
                this.state.letters.push(item);
            }
        }
        this.adapter.remove(index);
        // this.adapter.remove(index);

        // this.tableView.reloadData();
        if (this.tableView) {
            this.tableView.notifyDataSetChanged();
            this.tableView.onRefreshComplete();
        }

        // this.setState({});
    };

    styles = StyleSheet.create({
        divider: {
            backgroundColor: colors.divider,
        },
        alphabetSidebar: {
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
}
