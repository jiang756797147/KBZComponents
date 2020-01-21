import React, {Component} from 'react';
import {View, StyleSheet, Text, CameraRoll} from 'react-native';
import PropTypes from 'prop-types'
import {ImageViewer} from "react-native-image-zoom-viewer";
import Menu from "react-native-popup-menu/src/Menu";
import MenuTrigger from "react-native-popup-menu/src/MenuTrigger";
import MenuOptions from "react-native-popup-menu/src/MenuOptions";
import {renderers} from './popMenu/src';

import theme from "../constants/theme";
import colors from "../constants/colors";
import ToastUtils from "../utils/ToastUtils";

export default class KBImagePlusView extends Component {

    static defaultProps = {
        imageUrls: [],
        imageIndex: 0,
        dropDownView: function () {

        },
        renderer: renderers.ContextMenu1,
    };

    static propTypes = {
        imageUrls: PropTypes.array,
        imageIndex: PropTypes.number,
        dropDownView: PropTypes.func,
        renderer: PropTypes.oneOf([renderers.ContextMenu, renderers.ContextMenu1, renderers.SlideInMenu, renderers.NotAnimatedContextMenu, renderers.Popover, renderers.PopoverNew]),
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Menu ref={(c) => this.menu = c} style={{
                alignItems: 'center',
                justifyContent: 'center',
            }}
                  renderer={this.props.renderer}
                  onOpen={() => {
                  }}
                  onClose={() => {

                  }}
                  rendererProps={this.props.rendererProps}
                  onSelect={(item) => {
                      this.menu.close();
                  }}
            >
                <MenuTrigger>
                    {this.props.dropDownView()}
                </MenuTrigger>
                <MenuOptions
                    optionsContainerStyle={this.styles.optionsStyle}>
                    <ImageViewer
                        style={{width: theme.screenWidth, height: theme.screenHeight}}
                        imageUrls={this.props.imageUrls}
                        index={this.props.imageIndex}
                        menuContext={{saveToLocal: '保存', cancel: '取消'}}
                        saveToLocalByLongPress={true}
                        onSave={(url) => {
                            this.saveToLocal(url);
                        }}
                        onClick={() => {
                            this.dismiss();
                        }} {...this.props}/>
                </MenuOptions>
            </Menu>
        );
    }

    saveToLocal(imageUrl) {

        let promise = CameraRoll.saveToCameraRoll(imageUrl);
        promise.then(function (result) {
            ToastUtils.showToast("保存到相册成功");
        }).catch(function (error) {
            console.log('保存失败！\n' + error);
        });
    }


    show = () => {
        this.menu.open();
    };
    dismiss = () => {
        this.menu.close();
    };

    styles = StyleSheet.create({
        optionsStyle: {
            width: theme.screenWidth, height: theme.screenHeight,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.trans,
        },
    });
};
