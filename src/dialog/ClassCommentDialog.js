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

let mainWidth = 0.8 * theme.screenWidth;
let mainHeight = 0.6 * theme.screenHeight;

export default class ClassCommentDialog extends Component {


    static defaultProps = {
        title: "",
        mainComponent: null,
        titleComponent: null,
    };

    static propTypes = {

        title: PropTypes.string,
        touchRight: PropTypes.func,
        touchTitle: PropTypes.func,
        mainComponent: PropTypes.func,
        titleComponent: PropTypes.func,
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
                animationType={"fade"}
            >
                <View style={styles.bg}>
                    <View style={styles.mianView}>

                        <View style={styles.topView}>

                            <KBButton
                                style={{flex: 3}}
                                onPress={() => this.hide()}
                            >
                                <View>
                                    <Image
                                        style={{
                                            width: 15,
                                            height: 15,
                                        }}
                                        source={image.popClose}
                                    />
                                </View>

                            </KBButton>

                            <KBButton style={{flex: 4}}
                                      onPress={() => this.props.touchTitle()}
                            >
                                <View style={{flex: 4, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{fontSize: 17, color: colors.text444}}>
                                        {this.props.title}
                                    </Text>
                                    <Image
                                        style={{
                                            width: 12,
                                            height: 12,
                                            marginLeft: 5,
                                        }}
                                        source={image.popEdit}
                                    />
                                </View>
                            </KBButton>

                            <KBButton
                                style={{flex: 3}}
                                onPress={() => this.props.touchRight()}
                            >
                                <View style={{flexDirection: 'row', justifyContent: "flex-end"}}>
                                    <Text style={{fontSize: 13, color: colors.text666}}>
                                        查看表现
                                    </Text>
                                </View>
                            </KBButton>

                        </View>

                        <View style={styles.contentView}>
                            {this.props.mainComponent()}
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
        backgroundColor: 'rgba(52,52,52,0.8)',  //rgba  a0-1  其余都是16进制数
        justifyContent: 'center',
        alignItems: 'center',
    },

    mianView: {
        width: mainWidth,
        height: mainHeight,
        backgroundColor: colors.white,
        borderRadius: 10,
    },

    topView: {
        width: mainWidth,
        height: 0.12 * mainHeight,
        backgroundColor: colors.yellowColor,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    contentView: {
        width: mainWidth,
        height: 0.9 * mainHeight,
        // backgroundColor: colors.bossgreen,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
    },
});