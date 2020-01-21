'use strict';

import LoginScreen from './LoginScreen';
import TirdLoginListScreen from './TirdLoginListScreen';

export default {
    Login: { //登陆
        screen: LoginScreen,
        navigationOptions: {
            header: null,
        },
    },

    TirdLoginList: { //第三方登陆
        screen: TirdLoginListScreen,
        navigationOptions: {
            header: null,
        },
    },
}
