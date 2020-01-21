import React, {Component} from 'react'
import {
    Modal,
    Text,
    View,
    StyleSheet,
} from 'react-native'

import PropTypes from 'prop-types'
import KBButton from "../KBButton"
import colors from "../../constants/colors"
import theme from "../../constants/theme"

export default class LoginAgainDialog extends Component {

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            _dialogVisible: false
        }
    }

    showDialog() {
        this.setState({
            _dialogVisible: true
        });
    }

    hideDialog() {
        this.setState({
            _dialogVisible: false
        });
    }

    static propTypes = {
        _dialogTitle: PropTypes.string, //标题
        _dialogContent: PropTypes.string, //内容
        _dialogRightBtnTitle: PropTypes.string,   //右按键标题
        _dialogRightBtnAction: PropTypes.func.isRequired, //右点击方法
        _dialogVisible: PropTypes.bool,       //显示还是隐藏
    };

    static defaultProps = {
        _dialogTitle: '温馨提示',
        _dialogContent: '您的账号已被他人登录,请重新登录',
        _dialogRightBtnTitle: '确定',
        _dialogVisible: false,
    };

    renderContent() {
        return (
            <View style={styles.dialogContentView}>
                <Text style={styles.dialogContent}>
                    {this.props._dialogContent}
                </Text>
            </View>
        );
    }

    render() {
        // onPress事件直接与父组件传递进来的属性挂接
        return (
            <Modal
                visible={this.state._dialogVisible}
                transparent={true}
                onRequestClose={() => {
                    this.setState({
                        _dialogVisible: false,
                    })
                }} //如果是Android设备 必须有此方法
            >
                <View style={styles.bg}>
                    <View style={styles.dialog}>
                        <View style={styles.dialogTitleView}>
                            <Text style={styles.dialogTitle}>
                                {this.props._dialogTitle}
                            </Text>
                        </View>
                        {this.renderContent()}

                        <View style={styles.dialogBtnView}>
                            <KBButton onPress={this.props._dialogRightBtnAction}>
                                <View style={styles.dialogBtnViewItem}>
                                    <Text style={styles.rightButton}>
                                        {this.props._dialogRightBtnTitle}
                                    </Text>
                                </View>
                            </KBButton>
                        </View>

                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    bg: {  //全屏显示 半透明 可以看到之前的控件但是不能操作了
        width: theme.screenWidth,
        height: theme.screenHeight,
        backgroundColor: 'rgba(52,52,52,0.5)',  //rgba  a0-1  其余都是16进制数
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialog: {
        // backgroundColor: '#000',
        borderRadius: 8,
        marginHorizontal: 30,
        marginBottom: theme.screenHeight / 3,
        width: theme.screenWidth * 0.8
    },
    dialogTitleView: {
        height: 40,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 20,
        backgroundColor: colors.empty
    },
    dialogTitle: {
        fontSize: 16,
        color: "#333333",
        fontWeight: "bold"
    },
    dialogContentView: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 20,
        backgroundColor: "white"
    },
    dialogContent: {
        textAlign: 'center',
        fontSize: 16,
        color: '#4A4A4A',
    },
    dialogBtnView: {
        flexDirection: 'row',
        justifyContent: "flex-end",
        backgroundColor: "white",
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    dialogBtnViewItem: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: 60,
    },
    leftButton: {
        fontSize: 15,
        color: '#666666',
    },
    rightButton: {
        fontSize: 15,
        color: colors.bossgreen,
    }
});