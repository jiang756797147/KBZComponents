import React, {Component} from 'react';
import {
    Modal,
    Text,
    View,
    Image,
    StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import theme from "../../constants/theme";
import colors from "../../constants/colors";
import image from "../../constants/image";
import KBButton from "../../components/KBButton";
import KBHeader from "../../components/KBHeader";

export default class PraisePopDialog extends Component {


    static defaultProps = {
        title: "",
        mainComponent: null,
    };

    static propTypes = {
        title: PropTypes.string,
        mainComponent: PropTypes.func,
    };
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            _dialogVisible: false
        }
    }

    show() {
        this.setState({
            _dialogVisible: true
        });
    }

    hide() {
        this.setState({
            _dialogVisible: false
        });
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
                animationType={"slide"}
            >
                <View style={styles.bg}>
                    <KBHeader
                        isLeft={false}
                        leftComponent={() => {
                            return (
                                <KBButton
                                    onPress={() => {
                                        this.hide();
                                    }}
                                >
                                    <View
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text style={{
                                            fontSize: 15,
                                            color: colors.text666,
                                        }}>
                                            取消
                                        </Text>
                                    </View>
                                </KBButton>
                            )
                        }}
                        title={this.props.title}
                    />
                    <View>
                        {this.props.mainComponent()}
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
        marginTop:theme.isAndroid?-theme.statusHeight:0,
        backgroundColor: 'rgba(52,52,52,1.0)',  //rgba  a0-1  其余都是16进制数
        paddingBottom: theme.tabBarStyle.paddingBottom,
    },

});