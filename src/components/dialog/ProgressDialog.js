import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    ActivityIndicator,
    Image
} from 'react-native';
import theme from '../../constants/theme';
import Spinkit from 'react-native-spinkit';
import KBPopupDialog from './KBPopupDialog';

export default class ProgressDialog extends Component {

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            // _dialogVisible: false
        }
    }

    showProgress = () => {
        this.progressPop.show();
    }

    hideProgress = () => {
        this.progressPop.dismiss();
    }

    render() {
        // onPress事件直接与父组件传递进来的属性挂接
        return (
            <KBPopupDialog ref={(c) => this.progressPop = c}>
                <View style={styles.bg}>
                    <View style={styles.dialog}>
                        {
                            theme.isAndroid?
                                <View style={{justifyContent: 'center', alignItems: 'center', width: 60, height: 60}}>
                                    <ActivityIndicator
                                        animating={true}
                                        color='gray'
                                        size={45}
                                    />
                                    <Image source={require('../../assets/hzm_logo_h.png')} style={{width:35,height:35,position:'absolute'}} resizeMode={'contain'}/>
                                </View>
                                :
                                <Spinkit
                                    isVisible={true}
                                    color={'#C3C3C3'}
                                    size={40}
                                    type={'Arc'}
                                />
                        }
                        <Text style={styles.dialogTitle}>数据处理中...</Text>
                    </View>
                </View>
            </KBPopupDialog>
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
        width: theme.screenWidth * 0.6,
        height: theme.screenHeight * 0.22,
        backgroundColor: 'rgba(0,0,0,0.75)',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    dialogTitle: {
        color: "white",
        marginTop: 10,
        fontSize: 15
    },
});
