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

import {renderers} from '../popMenu/src';
import KBButton from '../../components/KBButton';
import {UPDATE_OPACITY} from '../../constants/notify';

export default class KBDropPopMenu extends Component {

    static defaultProps = {
        dismissOnTouchOutside: true,
        backgroundColor:'rgba(52,52,52,0.5)'
    };

    static propTypes = {
        dismissOnTouchOutside: PropTypes.bool,
        rendererProps: PropTypes.any,
        backgroundColor:PropTypes.any,
    };

    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: this.props.defaultIndex,
            isOpen: false,
        };
        this.eventEmitter = DeviceEventEmitter;
    }

    render() {
        return (
            <Menu ref={(c) => this.menu = c}
                  style={[this.styles.menuStyle]}
                  renderer={renderers.ContextMenu1}
                  onOpen={() => {
                      this.setState({
                          isOpen: true,
                      });
                  }}
                  onClose={() => {
                      this.setState({
                          isOpen: false,
                      });
                  }}
                  rendererProps={this.props.rendererProps}
                  onSelect={(value) => {
                  }}>
                <MenuTrigger>
                    <View/>
                </MenuTrigger>
                <MenuOptions optionsContainerStyle={this.styles.optionsStyle}>
                    <KBButton onPress={() => {
                        if (this.props.dismissOnTouchOutside) {
                            this.dismiss();
                        }
                    }}>
                        <View style={this.styles.dialogView}>
                            {this.props.children}
                        </View>
                    </KBButton>
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
        optionsStyle: {
            width: theme.screenWidth,
            height: theme.screenHeight,
            backgroundColor: colors.trans,
        },
        dialogView: {
            width: theme.screenWidth,
            height: theme.screenHeight,
            backgroundColor: this.props.backgroundColor,  //rgba  a0-1  其余都是16进制数
            justifyContent: 'center',
            alignItems: 'center',
        }
    });
}
