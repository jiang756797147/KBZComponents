import React, {Component} from 'react';
import {View, StyleSheet, Text, Image, DeviceEventEmitter} from 'react-native';
import PropTypes from 'prop-types'

import Menu from "react-native-popup-menu/src/Menu";
import MenuTrigger from "react-native-popup-menu/src/MenuTrigger";
import MenuOptions from "react-native-popup-menu/src/MenuOptions";
import MenuOption from "react-native-popup-menu/src/MenuOption";
import {renderers} from "react-native-popup-menu";
import ImageCropPicker from "react-native-image-crop-picker";

import {UPDATE_OPACITY} from "../constants/notify";
import colors from "../constants/colors";
import theme from "../constants/theme";

export default class KBImagePicker extends Component {

    MULTIPLE_OPTIONS = {
        compressImageQuality: 0.4,
        compressImageMaxWidth: 750,
        compressImageMaxHeight: 1334,
        cropping: false,
    };

    SINGLE_OPRIONS = {
        width: 100,
        height: 100,
        cropping: true,
        cropperChooseText: '选择',
        cropperCancelText: '取消',
    };

    static defaultProps = {
        menuTriggerView: function () {

        },
        title: '请选择',
        menuTriggerStyle: null,
        menuStyle: null,
        menuOptionsStyle: null,
        menuOptionStyle: null,
        menuOptionTextStyle: null,
        optionData: ["相机", "从相册中选择", "取消"],

        imagePicked: function () {
        },

        isSingle: true,
        maxFiles: 3,
    };

    static propTypes = {
        menuStyle: PropTypes.object,
        menuTriggerView: PropTypes.func,
        menuTriggerStyle: PropTypes.object,
        menuOptionsStyle: PropTypes.object,
        menuOptionStyle: PropTypes.object,
        menuOptionTextStyle: PropTypes.object,
        optionData: PropTypes.array,

        imagePicked: PropTypes.func,
        rendererProps: PropTypes.any,
        title: PropTypes.string,

        isSingle: PropTypes.bool,  // 是否单选
        maxFiles: PropTypes.number, // 多选最大数量

    };

    constructor(props) {
        super(props);
        this.eventEmitter = DeviceEventEmitter;
    }

    renderMenuOption = (text, index, data) => {
        let item = {value: text, index: index};
        return (
            <MenuOption key={index} value={item} style={[this.styles.optionStyle, this.props.menuOptionStyle]}>
                <Text style={[this.styles.optionTextStyle, this.props.menuOptionTextStyle]}>{text}</Text>
            </MenuOption>
        );
    };

    render() {
        return (
            <Menu ref={(c) => this.menu = c} style={[this.styles.menuStyle, this.props.menuStyle]}
                  renderer={renderers.SlideInMenu}
                  onOpen={() => {
                      this.eventEmitter.emit(UPDATE_OPACITY, 0.5);
                  }}
                  onClose={() => {
                      this.eventEmitter.emit(UPDATE_OPACITY, 0);
                  }}
                  rendererProps={this.props.rendererProps}
                  onSelect={(item) => {
                      if (item.index == 0) {
                          ImageCropPicker.openCamera(
                              this._getCameraOptions()
                          ).then((image) => {
                              this.props.imagePicked(image, item.index);
                          }).catch((message) => {
                              console.log('image message  =========', message);
                          })
                      }
                      if (item.index == 1) {
                          ImageCropPicker.openPicker(
                              this._getPickerOptions()
                          ).then((image) => {
                              this.props.imagePicked(image, item.index);
                          }).catch((message) => {
                              console.log('image message  =========', message);
                          })
                      }
                      this.menu.close();
                  }}
            >
                <MenuTrigger style={[this.styles.triggerStyle, this.props.menuTriggerStyle]}>
                    {this.props.menuTriggerView()}
                </MenuTrigger>
                <MenuOptions optionsContainerStyle={[this.styles.optionsStyle, this.props.menuOptionsStyle]}>
                    <View style={[this.styles.optionStyle, this.props.menuOptionStyle]}>
                        <Text style={{fontSize: 15, color: colors.text666}}>{this.props.title}</Text>
                    </View>
                    {this.props.optionData.map(this.renderMenuOption)}
                </MenuOptions>
            </Menu>
        );
    }

    _getCameraOptions = () => {
        return this.props.isSingle ? this.SINGLE_OPRIONS : this.MULTIPLE_OPTIONS;
    };
    _getPickerOptions = () => {
        let pickerOptions = {
            ...this.MULTIPLE_OPTIONS,
            multiple: true,
            maxFiles: this.props.maxFiles,
        };

        return this.props.isSingle ? this.SINGLE_OPRIONS : pickerOptions;
    };

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
        triggerStyle: {
            width: theme.screenWidth / 3,
            height: 0,
            alignItems: 'center',
            justifyContent: 'center'
        },
        optionsStyle: {
            width: theme.screenWidth
        },
        optionStyle: {
            height: 55,
            paddingLeft: 14,
            justifyContent: 'center'
        },
        optionTextStyle: {
            fontSize: 15,
            color: colors.text333
        }
    });
}
