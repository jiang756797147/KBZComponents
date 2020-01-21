import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import PropTypes from 'prop-types';

import colors from '../../constants/colors';
import theme from '../../constants/theme';
import Utils from '../../utils/Utils';

import KBButton from '../KBButton';
import Divider from '../Divider';
import TextInputWithClear from '../TextInputWithClear';
import KBPopupDialog from './KBPopupDialog';

export default class KBAlertDialog extends Component {

    static defaultProps = {
        rightBtnText: '确认',
        leftBtnText: '取消',
        rightPress: null,
        leftPress: null,
        content: '您确定要删除吗?',
        isSingleBtn: false,
        
        isTextInput: false,
        contentComponent: null,
        title: '温馨提示'
    };

    static propTypes = {
        title: PropTypes.string,
        rightBtnText: PropTypes.string,
        leftBtnText: PropTypes.string,
        rightPress: PropTypes.func,
        leftPress: PropTypes.func,
        content: PropTypes.string,
        isSingleBtn: PropTypes.bool,

        isTextInput: PropTypes.bool,
        onTextChange: PropTypes.func,
        contentComponent: PropTypes.func,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <KBPopupDialog
                ref={(c) => this.customPop = c}
                {...this.props}>
                <View style={{width: theme.screenWidth * 0.85, alignItems: 'center'}}>
                    <View
                        style={{borderRadius: 5, width: theme.screenWidth * 0.85, backgroundColor: colors.white}}>
                        <Text style={[{
                            marginHorizontal: 14,
                            marginTop: 15,
                        }]}>{this.props.title}</Text>
                        {this.props.contentComponent ?
                            this.props.contentComponent() :
                            this.props.isTextInput ?
                                <View style={{marginTop: 10, height: 70, paddingHorizontal: 14, paddingVertical: 5}}>
                                    <TextInputWithClear
                                        inputStyle={{height: 60}}
                                        viewStyle={{
                                            paddingHorizontal: 5,
                                            height: 60,
                                            borderRadius: 5,
                                            backgroundColor: colors.divider,
                                        }}
                                        showDriver={false}
                                        multiline={true}
                                        blurOnSubmit={true}
                                        clearIconVisible={false}
                                        placeholderText={'请输入驳回原因'}
                                        onTextChange={(text) => {
                                            this.props.onTextChange(text);
                                        }}
                                    />
                                </View>
                                :
                                <Text style={[{
                                    marginHorizontal: 14,
                                    marginTop: 15,
                                    lineHeight: 20,
                                    color: colors.text333,
                                }]}>{this.props.content}</Text>
                        }

                        <Divider customStyle={{marginTop: 25, width: theme.screenWidth * 0.85}}/>
                        <View style={{
                            width: theme.screenWidth * 0.85,
                            height: 40,
                            borderBottomLeftRadius: 5,
                            borderBottomRightRadius: 5,
                            flexDirection: 'row',
                            justifyContent: this.props.isSingleBtn ? 'flex-end' : 'flex-start',
                        }}>
                            {this.props.isSingleBtn ? null : <KBButton style={{flex: 1}}
                                                                       onPress={() => {
                                                                           if (!Utils.isNull(this.props.leftPress)) {
                                                                               this.props.leftPress();
                                                                               return;
                                                                           }
                                                                           this.customPop.dismiss();
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
                            </KBButton>}
                            <KBButton style={{flex: 1}} onPress={() => {
                                if (!Utils.isNull(this.props.rightPress)) {
                                    this.props.rightPress();
                                }
                            }}>
                                <View style={{
                                    flex: 1,
                                    borderBottomLeftRadius: this.props.isSingleBtn ? 5 : 0,
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
            </KBPopupDialog>
        );
    }

    show = () => {
        this.customPop.show();
    };
    dismiss = () => {
        this.customPop.dismiss();
    };
};
