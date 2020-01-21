import React, {Component} from 'react'
import Toast from 'react-native-root-toast';
import colors from "../constants/colors";
let toast = null;
class ToastUtils extends Component {
    static showToast(message) {
        Toast.show(message, {
            duration: 3000,
            // position: -80,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: false,
            delay: 0,
            backgroundColor: 'rgba(52,52,52,0.75)'
        });
    }
    // /**
    //  *取消使用
    //  * @param message 显示内容
    //  * @param action  点击事件
    //  * @param option  事件内容
    //  */
    // static showTopToast(message, pressAction, onHidden) {
    //     if (toast) {
    //         Toast.hide(toast);
    //     }
    //     toast = Toast.show(message, {
    //         duration: 5000,
    //         hasIcon: true,
    //         position: Toast.positions.BOTTOM,
    //         shadow: false,
    //         animation: false,
    //         hideOnPress: true,
    //         onHidden: () => {
    //             onHidden();
    //         },
    //         press: () => {
    //             pressAction();
    //         },
    //         delay: 0,
    //         opacity: 1.0,
    //         textStyle: {
    //             color: '#212121',
    //             fontSize: 13,
    //         },
    //         containerStyle: {
    //             width: 120,
    //             height: 30,
    //             borderRadius: 15,
    //             // borderWidth: 0.5,
    //             // borderColor: '#e0e0e0',
    //             alignItems: 'center',
    //             justifyContent: 'center',
    //             flexDirection: 'row'
    //         },
    //         backgroundColor: 'rgba(255,255,255,1)'
    //     });
    // }

    static showIndexToast(message) {
        Toast.show(message, {
            duration: 3000,
            position: Toast.positions.CENTER,
            shadow: false,
            animation: true,
            textStyle: {color: colors.white, fontSize: 25},
            containerStyle: {width: 65, height: 65, alignItems: 'center', justifyContent: 'center'},
            hideOnPress: true,
            visible: true,
            delay: 0,
            backgroundColor: 'rgba(52,52,52,1)'
        });
    }
}

export default ToastUtils;
