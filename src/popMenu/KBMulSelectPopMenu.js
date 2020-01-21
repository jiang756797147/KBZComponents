import React, {Component} from 'react';
import {View, StyleSheet, Text, Image, ScrollView, ViewPropTypes, DeviceEventEmitter} from 'react-native';
import PropTypes from 'prop-types'
import {Menu, MenuTrigger, MenuOptions, MenuOption} from 'react-native-popup-menu'
import reject from 'lodash/reject';
import lodash from 'lodash';


import theme from "../../constants/theme";
import colors from "../../constants/colors";
import {UPDATE_OPACITY} from "../../constants/notify";
import KBButton from "../KBButton";
import Divider from "../Divider";

import {renderers} from './src';

export default class KBMulSelectPopMenu extends Component {

    static defaultProps = {
        menuTriggerStyle: null,
        menuStyle: null,
        optionsStyle: null,
        optionStyle: null,
        textStyle: null,
        onSelect: function () {
        },
        renderer: renderers.ContextMenu,
        rendererProps: {anchorStyle: {backgroundColor: colors.white}},

        renderItem: null,
        optionHeight: 45,

        defaultText: '默认显示内容',
        menuTriggerTextLength: 5,
        onSubmit: function () {

        },

        hasUpDownIcon: false,
        menuTriggerDisable: false,
    };

    static propTypes = {
        menuTriggerStyle: ViewPropTypes.style,
        menuTriggerTextStyle: PropTypes.any,
        menuStyle: ViewPropTypes.style,
        optionsStyle: ViewPropTypes.style,
        optionStyle: ViewPropTypes.style,
        textStyle: ViewPropTypes.style,
        onSelect: PropTypes.func,
        renderer: PropTypes.oneOf([renderers.ContextMenu, renderers.ContextMenu1, renderers.SlideInMenu, renderers.NotAnimatedContextMenu, renderers.Popover, renderers.PopoverNew]),
        rendererProps: PropTypes.any,
        renderItem: PropTypes.func,
        optionHeight: PropTypes.number,
        dataArray: PropTypes.array.isRequired,
        uniqueKey: PropTypes.string.isRequired,
        displayKey: PropTypes.string.isRequired,
        selectedArray: PropTypes.array,
        defaultText: PropTypes.string,
        menuTriggerTextLength: PropTypes.number, //显示文本长度
        onSubmit: PropTypes.func,

        hasUpDownIcon: PropTypes.bool,
        menuTriggerDisable: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.optionHeight = this.props.optionHeight;
        this.defaultHeight = this.optionHeight * 5;

        this.state = Object.assign({
            selectedArray: this.props.selectedArray,
            menuTriggerText: this._getLabel(this.props.selectedArray) || this.props.defaultText,

            isOpen: false,
        }, this.state);

        this.eventEmitter = DeviceEventEmitter;
    }

    UNSAFE_componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        this.setState({
            selectedArray: nextProps.selectedArray,
            menuTriggerText: this._getLabel(),
        })
    }

    _findItem = (itemKey) => {
        const {
            dataArray,
            uniqueKey,
        } = this.props;
        return dataArray.find((item) => item[uniqueKey] === itemKey) || {};
    };

    _getLabel = (array) => {
        const {
            dataArray,
            uniqueKey,
            defaultText,
            displayKey,
        } = this.props;
        let selectedArray = array ? array : this.state.selectedArray;
        // const {selectedArray} = this.state;
        if (!selectedArray
            || selectedArray.length === 0
        // || lodash.isEqual(selectedArray, dataArray)
        ) {
            return defaultText;
        }
        let itemsArray = new Array();
        for (let selectedItem of selectedArray) {
            const foundItem = this._findItem(selectedItem[uniqueKey]);
            let name = foundItem[displayKey];
            itemsArray.push(name);
        }
        let itemsText = itemsArray.join(',');
        if (itemsText.length > this.props.menuTriggerTextLength) {
            itemsText = `${itemsText.substring(0, this.props.menuTriggerTextLength)}...`;
        }

        return `${itemsText}`;
    };

    _toggleItem = (item) => {
        const {
            uniqueKey,
        } = this.props;

        const {selectedArray} = this.state;
        const status = this._itemSelected(item);
        let newItems = [];
        if (status) {
            newItems = reject(selectedArray, singleItem => (
                item[uniqueKey] === singleItem[uniqueKey]
            ));
        } else {
            newItems = [...selectedArray, item];
        }

        this.setState({
            selectedArray: newItems,
        })
        // onSubmit(newItems);
    };

    _itemSelected = (item) => {
        const {uniqueKey} = this.props;
        const {selectedArray} = this.state;
        return (
            !!selectedArray.find(singleItem => item[uniqueKey] === singleItem[uniqueKey])
        );
    };

    renderMenuOption = (item, index) => {
        const {
            displayKey,
            renderItem,
            textStyle,
        } = this.props;
        let isSelected = this._itemSelected(item);
        return (
            <KBButton key={index}
                      onPress={() => {
                          this._toggleItem(item);
                      }}>
                <View>
                    <View style={[this.styles.optionStyle, this.props.optionStyle]}>

                        {renderItem ? renderItem(isSelected, item) :
                            <Text style={[
                                this.styles.optionTextStyle,
                                textStyle,
                            ]}>{item[displayKey]}</Text>}
                        {isSelected ?
                            <Image style={{width: 19, height: 11}} resizeMode={'contain'}
                                   source={require('../../assets/mine/icon_correct.png')}/> : null
                        }
                    </View>
                    {/*<Divider isMargin={true}/>*/}
                </View>
            </KBButton>
        );
    };

    renderBottom() {
        return (
            <View style={{
                flex: 1,
                flexDirection: 'row',
                height: this.optionHeight,
                borderTopColor: colors.divider,
                borderTopWidth: 1
            }}>
                <KBButton style={{flex: 1}}
                          onPress={() => {
                              this.setState({
                                  selectedArray: [],
                              })
                          }}
                >
                    <View style={[this.styles.bottomBtnView]}>
                        <Text style={{fontSize: 15, color: colors.primaryColor}}>重置</Text>
                    </View>
                </KBButton>
                <KBButton style={{flex: 1}}
                          onPress={() => {
                              this.dismiss();
                              this.props.onSubmit(this.state.selectedArray);
                              this.setState({
                                  menuTriggerText: this._getLabel(),
                              })
                          }}
                >
                    <View style={[this.styles.bottomBtnView, {backgroundColor: colors.primaryColor}]}>
                        <Text style={{fontSize: 15, color: colors.white}}>确定</Text>
                    </View>
                </KBButton>
            </View>
        );
    }

    render() {

        let isScroll = this.props.dataArray.length > 5;
        return (
            <Menu ref={(c) => this.menu = c}
                  style={[this.styles.menuStyle, this.props.menuStyle]}
                  renderer={this.props.renderer}
                  rendererProps={this.props.rendererProps}
                  onOpen={() => {
                      // this.eventEmitter.emit(UPDATE_OPACITY, 0.5);
                      this.setState({
                          isOpen: true,
                      })
                  }}
                  onClose={() => {
                      // this.eventEmitter.emit(UPDATE_OPACITY, 0);
                      this.setState({
                          isOpen: false,
                      })
                  }}
            >
                <MenuTrigger style={[this.styles.menuTriggerStyle, this.props.menuTriggerStyle]} customStyles={{
                    triggerTouchable: {
                        underlayColor: "#00000000"
                    }
                }}
                             disabled={this.props.menuTriggerDisable}
                >
                    <Text style={[{color: colors.text333}, this.props.menuTriggerTextStyle]}>
                        {this.state.menuTriggerText}
                    </Text>
                    {this.props.hasUpDownIcon ?
                        this.renderIcon() : null
                    }
                </MenuTrigger>

                <MenuOptions optionsContainerStyle={[this.styles.optionsStyle, this.props.optionsStyle]}>

                    <View style={{flex: 1}}>
                        <ScrollView
                            style={{
                                height: isScroll ? this.defaultHeight : this.props.dataArray.length * this.optionHeight,
                            }}
                            showsVerticalScrollIndicator={false} scrollEnabled={isScroll}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                            }}>
                                {this.props.dataArray.map(this.renderMenuOption)}
                            </View>
                        </ScrollView>

                        {this.renderBottom()}
                    </View>
                </MenuOptions>
            </Menu>

        );
    }

    renderIcon() {
        return (
            <View style={{position: 'absolute', right: 5, top: 0}}>
                <Image style={{width: 8, height: 5, marginTop: 20}}
                       source={this.state.isOpen ? require('../../assets/rank/rank_up_icon.png') : require('../../assets/rank/rank_down_icon.png')}
                       resizeMode={'contain'}/>
            </View>
        );
    }

    show = () => {
        this.menu.open();
    };

    dismiss = () => {
        this.menu.close();
    };

    styles = StyleSheet.create({
        menuStyle: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        menuTriggerStyle: {
            paddingRight: 10,
            width: theme.screenWidth / 3,
            height: 45,
            alignItems: 'center',
            justifyContent: 'center'
        },
        optionsStyle: {
            marginTop: 45,
            width: theme.screenWidth,
        },
        optionStyle: {
            flexDirection: 'row',
            height: 45,
            width: theme.screenWidth,
            paddingHorizontal: 20,
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        optionTextStyle: {
            fontSize: 14,
            color: colors.text888
        },
        bottomBtnView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
}
