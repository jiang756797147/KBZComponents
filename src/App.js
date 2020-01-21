/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StatusBar,
    DeviceEventEmitter
} from 'react-native';
import {Root} from 'native-base'
import moment from "moment";

import {UPDATE_OPACITY, HTTP_NOTIFY} from "./constants/notify";
import StorageUtils from "./utils/StorageUtils";
import DialogUtils from "./utils/DialogUtils";
import KBAlertDialog from "./components/dialog/KBAlertDialog";
import ProgressDialog from "./components/dialog/ProgressDialog";


import MenuProvider from "react-native-popup-menu/src/MenuProvider";
import {createAppContainer, StackActions, NavigationActions} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import SplashPage from './modules/SplashPage'
import MainTabPage from './containers/MainTabPage'
import LoginRouteConfig from './modules/login/LoginRouteConfig'
import MineRouteConfig from './modules/mine/MineRouteConfig';
import TicketRouteConfig from './modules/ticket/TicketRouteConfig';
import FixedScoreRouteConfig from './modules/fixed/FixedScoreRouteConfig';
import CommonRouteConfig from './modules/common/CommonRouteConfig';
import ClassRouteConfig from './modules/home/ClassRouteConfig';
import StatisticsRouteConfig from './modules/statistics/StatisticsRouteConfig';
import ContactRouteConfig from './modules/contact/ContactRouteConfig';
import MessageRouteConfig from './modules/message/MessageRouteConfig';

const SplashRouteConfig = {
    Splash: {
        screen: SplashPage,
        navigationOptions: {
            header: null,
        },
    },
};
const MainTabPageRouteConfig = {
    MainTabPage: {
        screen: MainTabPage,
        navigationOptions: {
            header: null,
        },
    },
};

const AppNavigatorConfigs = {
    ...SplashRouteConfig,
    ...LoginRouteConfig,
    ...MainTabPageRouteConfig,
    ...MineRouteConfig,
    ...TicketRouteConfig,
    ...FixedScoreRouteConfig,
    ...CommonRouteConfig,
    ...ClassRouteConfig,
    ...StatisticsRouteConfig,
    ...ContactRouteConfig,
    ...MessageRouteConfig,
};
//
const NavigatorStack = createStackNavigator(AppNavigatorConfigs);
const AppContainer = createAppContainer(NavigatorStack);

export default class App extends Component {

    constructor(props) {
        super(props);
        moment.updateLocale('en', {
            weekdays: [
                "星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"
            ]
        });

        this.eventEmitter = DeviceEventEmitter;
        this.state = {
            popPhone: '',
            opacity: 0,
            toastText: '',
        };
        StorageUtils._getStorage();
        DialogUtils.getInstance().setApp(this);
    }

    UNSAFE_componentWillMount(): void {
        this.eventEmitter.addListener(UPDATE_OPACITY, this.menuOpacityChanged.bind(this));
        this.eventEmitter.addListener(HTTP_NOTIFY, this.updateToast.bind(this));
    }

    componentWillUnmount() {
        this.eventEmitter.removeListener(UPDATE_OPACITY, this.menuOpacityChanged);
        this.eventEmitter.removeListener(HTTP_NOTIFY, this.updateToast);

    }

    updateToast(data) {
        this.setState({
            toastText: data
        })
    }

    menuOpacityChanged(num) {
        this.setState({
            opacity: num,
        });
    }

    render() {
        return (
            <Root>
                <MenuProvider backHandler={true}
                              customStyles={{
                                  backdrop: {
                                      backgroundColor: 'black',
                                      opacity: this.state.opacity,
                                  },
                              }}>
                    <StatusBar
                        animated={true}
                        hidden={false}
                        backgroundColor='#00000055'
                        translucent={true}
                        barStyle='dark-content'
                        networkActivityIndicatorVisible={false}
                        showHideTransition='fade'
                    />
                    <ProgressDialog ref={(c) => DialogUtils.getInstance().setProgress(c)}/>
                    <AppContainer/>
                    <KBAlertDialog ref={(c) => DialogUtils.getInstance().setLoginAgainDialog(c)} isSingleBtn={true}
                                   content={this.state.toastText}
                                   dismissOnTouchOutside={false} dismissOnHardwareBackPress={false}
                                   rightPress={() => {
                                      DialogUtils.getInstance().hideLoginDialog();
                                      StorageUtils._remove("token");
                                      let resetAction = StackActions.reset({
                                          index: 0,
                                          actions: [
                                              NavigationActions.navigate({routeName: 'Login'})//要跳转到的页面名字
                                          ]
                                      });
                                      DialogUtils.getInstance().getNavigation().dispatch(resetAction);
                                  }}/>
                </MenuProvider>
            </Root>
        );
    }
}
