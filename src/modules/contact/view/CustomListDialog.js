import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {View, StyleSheet, Text, Image, Modal} from 'react-native';
import colors from '../../../constants/colors';
import theme from "../../../constants/theme";
import KBButton from "../../../components/KBButton";
import KBScrollView from "../../../components/KBScrollView";

import ToastUtils from "../../../utils/ToastUtils";


export default class CustomListDialog extends Component {

    itemHeight = 45;
    defaultHeight = this.itemHeight * 5;

    static defaultProps = {};

    static propTypes = {
        data: PropTypes.array,
        submit: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            _dialogVisible: false,
            selectedObj: null,
        }
    }

    render() {
        let height = this.props.data.length * this.itemHeight > this.defaultHeight ? this.defaultHeight : this.props.data.length * this.itemHeight;
        return (
            <Modal
                visible={this.state._dialogVisible}
                transparent={true}
                onRequestClose={() => {
                    this.setState({
                        _dialogVisible: false,
                    })
                }} //如果是Android设备 必须有此方法
                animationType={"fade"}
            >
                <View style={{
                    width: theme.screenWidth,
                    height: theme.screenHeight,
                    backgroundColor: colors.trans,
                }}>
                    <KBButton onPress={() => {
                        this.dismiss();
                    }}>
                        <View style={styles.bg}>
                            <View style={{
                                borderRadius: 5,
                                width: theme.screenWidth * 0.8,
                                backgroundColor: colors.white
                            }}>
                                <View style={{paddingVertical: 15, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{fontSize: 17}}>选择分享班级</Text>
                                </View>
                                <View style={{
                                    width: theme.screenWidth * 0.8,
                                    height: 1,
                                    backgroundColor: colors.divider,
                                }}/>
                                <KBScrollView style={{height: height}}>
                                    {this.props.data && this.props.data.length > 0 ?
                                        this.props.data.map(this.renderItem)
                                        : null
                                    }
                                </KBScrollView>
                                <View style={{flexDirection: 'row', borderTopColor: colors.divider, borderTopWidth: 1}}>
                                    <KBButton onPress={() => this.dismiss()}>
                                        <View style={[styles.commitBtn, {
                                            borderBottomLeftRadius: 5,
                                            paddingVertical: 10
                                        }]}>
                                            <Text>取消</Text>
                                        </View>
                                    </KBButton>
                                    <KBButton onPress={() => {
                                        if (this.state.selectedObj) {
                                            this.props.submit(this.state.selectedObj)
                                        }else {
                                            ToastUtils.showToast("请先选择班级");
                                        }
                                        this.dismiss();
                                    }}>
                                        <View style={[styles.commitBtn, {
                                            borderBottomRightRadius: 5,
                                            backgroundColor: colors.yellowColor
                                        }]}>
                                            <Text>分享</Text>
                                        </View>
                                    </KBButton>

                                </View>
                            </View>
                        </View>
                    </KBButton>
                </View>
            </Modal>
        );
    }

    renderItem = (item, index) => {
        return (
            <View key={index}>
                <KBButton
                    onPress={() => {
                        if (item.isShare) {
                            return;
                        } else {
                            for (let obj of this.props.data) {
                                obj.isShare = false;
                            }
                            item.isShare = true;
                            this.setState({
                                selectedObj: item,
                            });
                        }
                    }}
                >
                    <View style={{
                        height: this.itemHeight,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 20
                    }}>
                        <Image style={{width: 17, height: 14, marginRight: 15}}
                               resizeMode={'contain'}
                               source={item.isShare ? require('../../../assets/class/btn_s.png') : require('../../../assets/class/btn_d.png')}
                        />
                        <Text>{item.name}</Text>
                    </View>
                </KBButton>
                {index == this.props.data.length - 1 ?
                    null
                    :
                    <View style={{flex: 1, height: 1, backgroundColor: colors.divider, marginHorizontal: 14}}/>
                }
            </View>
        )
    };

    show = () => {
        this.setState({
            _dialogVisible: true,
        });
    };
    dismiss = () => {
        this.setState({
            _dialogVisible: false,
        });
    };
};
const styles = StyleSheet.create({
    bg: {  //全屏显示 半透明 可以看到之前的控件但是不能操作了
        width: theme.screenWidth,
        height: theme.screenHeight,
        backgroundColor: 'rgba(52,52,52,0.8)',  //rgba  a0-1  其余都是16进制数
        justifyContent: 'center',
        alignItems: 'center',
    },

    commitBtn: {
        width: theme.screenWidth * 0.4,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
