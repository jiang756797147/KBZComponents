import React, {Component} from 'react';
import {View, StyleSheet, Text, Image, DeviceEventEmitter, ViewPropTypes, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import lodash from 'lodash';

import Menu from 'react-native-popup-menu/src/Menu';
import MenuTrigger from 'react-native-popup-menu/src/MenuTrigger';
import MenuOptions from 'react-native-popup-menu/src/MenuOptions';
import MenuOption from 'react-native-popup-menu/src/MenuOption';

import theme from '../../constants/theme';
import colors from '../../constants/colors';
import Utils from '../../utils/Utils';
import {renderers} from './src';
import {UPDATE_OPACITY} from '../../constants/notify';

export default class KBDropPopMenu extends Component {

    static defaultProps = {
        menuTrigger: function () {

        },
        menuTriggerStyle: null,
        menuStyle: null,
        optionsStyle: null,
        optionStyle: null,
        textStyle: null,
        dataArray: [],
        scrollCount:6,
        onSelect: function () {

        },

        renderer: renderers.ContextMenu,
        isShowDivider: false,
        isShowSelectedIcon: false,
        defaultIndex: 0,
        hasUpDownIcon: false,
    };

    static propTypes = {
        scrollCount:PropTypes.number,
        uniqueKey: PropTypes.string.isRequired,
        menuStyle: ViewPropTypes.style,
        menuTriggerStyle: ViewPropTypes.style,
        optionsStyle: ViewPropTypes.style,
        optionStyle: ViewPropTypes.style,
        menuTrigger: PropTypes.func,
        textStyle: PropTypes.object,
        dataArray: PropTypes.array,
        onSelect: PropTypes.func,

        renderer: PropTypes.oneOf([renderers.ContextMenu, renderers.ContextMenu1, renderers.SlideInMenu, renderers.NotAnimatedContextMenu, renderers.Popover, renderers.PopoverNew]),
        rendererProps: PropTypes.any,
        renderOptionView: PropTypes.object,

        isShowDivider: PropTypes.bool,
        isShowSelectedIcon: PropTypes.bool,
        defaultIndex: PropTypes.number,
        hasUpDownIcon: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: this.props.defaultIndex,
            isOpen: false,
        };
        this.eventEmitter = DeviceEventEmitter;
        this.optionHeight = 40;
        this.defaultHeight = this.optionHeight * this.props.scrollCount;
    }

    // componentWillReceiveProps(nextProps) {
    //     console.log('ddddddd ===========', nextProps.defaultIndex);
    //     console.log('dddddddxxxxx ===========', this.props.defaultIndex);
    //     if (nextProps.defaultIndex !== this.props.defaultIndex) {
    //         this.setState({
    //             selectedIndex: nextProps.defaultIndex,
    //         })
    //     }
    // }

    renderMenuOption1 = (option, index) => {
        let text = option[this.props.uniqueKey];
        let item = {value: option, index: index};
        let isSelected = this.state.selectedIndex === index;
        // let isEqual =
        return (
            <MenuOption key={index} value={item} style={[this.styles.optionStyle, this.props.optionStyle]}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 15,
                    height: 40,
                }}>
                    <Text style={[this.styles.optionTextStyle, this.props.textStyle]}>{text}</Text>
                    {/*{*/}
                    {/*    this.props.isShowSelectedIcon && isSelected ? <Image style={{width: 15, height: 11}}*/}
                    {/*                                                         source={require('../../assets/componentImgs/item_selected.png')}/> : null*/}
                    {/*}*/}
                </View>
                {this.props.isShowDivider && index !== this.props.dataArray.length - 1 ?
                    <View style={{height: 0.5, backgroundColor: colors.text999}}/>
                    :
                    null
                }
            </MenuOption>
        );
    };


    render() {
        let isScroll = this.props.dataArray.length > this.props.scrollCount;
        return (
            <Menu ref={(c) => this.menu = c}
                  style={[this.styles.menuStyle, this.props.menuStyle]} renderer={this.props.renderer}
                  onOpen={() => {
                      // this.eventEmitter.emit(UPDATE_OPACITY, 0.5);
                      this.setState({
                          isOpen: true,
                      });
                  }}
                  onClose={() => {
                      // this.eventEmitter.emit(UPDATE_OPACITY, 0);
                      this.setState({
                          isOpen: false,
                      });
                  }}
                  rendererProps={this.props.rendererProps}
                  onSelect={(value) => {
                      this.setState({
                          selectedIndex: value.index,
                      });
                      this.props.onSelect(value);
                  }}>

                <MenuTrigger style={[this.styles.menuTriggerStyle, this.props.menuTriggerStyle]}>
                    {this.props.menuTrigger()}
                </MenuTrigger>
                <MenuOptions optionsContainerStyle={[this.styles.optionsStyle, this.props.optionsStyle]}>
                    {Utils.isNull(this.props.renderOptionView) ?
                        <ScrollView
                            scrollEnabled={isScroll}
                            style={{height: isScroll ? this.defaultHeight : this.optionHeight * this.props.dataArray.length}}>
                            <View style={{flex: 1}}>
                                {this.props.dataArray.map(this.renderMenuOption1)}
                            </View>
                        </ScrollView> : this.props.renderOptionView}
                </MenuOptions>
            </Menu>

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
            width: theme.screenWidth / 3,
            height: 45,
            alignItems: 'center',
            justifyContent: 'center',
        },
        optionsStyle: {
            marginTop: 45,
            width: theme.screenWidth,
        },
        optionStyle: {
            height: 40,
            paddingLeft: 14,
            justifyContent: 'center',
        },
        optionTextStyle: {
            fontSize: 13,
            color: colors.text888,
        },
    });
}
