import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import PropTypes from 'prop-types';

import colors from '../../../../../constants/colors';
import theme from '../../../../../constants/theme';
import KBButton from '../../../../../components/KBButton';
import KBPopupDialogg from '../../../../../components/dialog/KBPopupDialog';
import TextInputWithClear from '../../../../../components/TextInputWithClear';
import Divider from '../../../../../components/Divider';


export default class CustomInputDialog extends Component {

    static defaultProps = {
        rightBtnText: '确认',
        leftBtnText: '取消',
        rightPress: null,
        leftPress: null,
        isSingleBtn: false,

        alertTitle: '温馨提示',
        placeholderText: '请填写',
    };

    static propTypes = {
        rightBtnText: PropTypes.string,
        leftBtnText: PropTypes.string,
        rightPress: PropTypes.func,
        leftPress: PropTypes.func,
        content: PropTypes.string,
        isSingleBtn: PropTypes.bool,

        onTextChange: PropTypes.func,

        alertTitle: PropTypes.string,
        placeholderText: PropTypes.string,

    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <KBPopupDialogg
                ref={(c) => this.customPop = c}
                {...this.props}>
                {this.renderInputPop()}
            </KBPopupDialogg>
        );
    }

    renderInputPop() {
        return (
            <View style={{width: theme.screenWidth * 0.85, alignItems: 'center'}}>
                <View
                    style={{borderRadius: 5, width: theme.screenWidth * 0.85, backgroundColor: colors.white}}>
                    <Text style={{
                        marginLeft: 14,
                        marginTop: 15,
                        fontSize: 13,
                        fontWeight: '400',
                        color: colors.text333,
                    }}>{this.props.alertTitle}</Text>
                    <TextInputWithClear
                        ref={(c) => this.input = c}
                        placeholderText={this.props.placeholderText}
                        onFocusUnderlineColor={'#F9DB63'}
                        unFocusUnderlineColor={'#E0E0E0'}
                        maxLength={16}
                        inputStyle={{height: 30}}
                        viewStyle={{
                            marginTop: 20,
                            marginHorizontal: 14,
                            flex: 0,
                        }}/>
                    <Divider customStyle={{marginTop: 25, width: theme.screenWidth * 0.85}}/>
                    <View style={{
                        width: theme.screenWidth * 0.85,
                        height: 40,
                        borderBottomLeftRadius: 5,
                        borderBottomRightRadius: 5,
                        flexDirection: 'row',
                    }}>
                        <KBButton style={{flex: 1}}
                                  onPress={() => {
                                      this.dismiss();
                                      if (this.props.leftPress) {
                                          this.props.leftPress();
                                      }
                                  }}>
                            <View style={{
                                flex: 1,
                                borderBottomLeftRadius: 5,
                                backgroundColor: colors.white,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Text style={{color: colors.text888, fontSize: 14}}>{this.props.leftBtnText}</Text>
                            </View>
                        </KBButton>
                        <KBButton style={{flex: 1}}
                                  onPress={() => this.props.rightPress()}>
                            <View style={{
                                flex: 1,
                                borderBottomRightRadius: 5,
                                backgroundColor: '#FFDB49',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Text style={{color: colors.text333, fontSize: 14}}>{this.props.rightBtnText}</Text>
                            </View>
                        </KBButton>
                    </View>
                </View>
            </View>
        );
    };

    getInputText = () => {
        return this.input.getText();
    };

    show = () => {
        this.customPop.show();
    };
    dismiss = () => {
        this.customPop.dismiss();
    };
};
