'use strict';

import {Platform, Dimensions, NativeModules} from 'react-native';

import colors from './constants/colors';


const { StatusBarManager } = NativeModules;


const platform = Platform.OS;
const isAndroid = platform === 'android';
const isIphone = platform === 'ios';
const deviceHeight = Dimensions.get("window").height + (isAndroid ? StatusBarManager.HEIGHT : 0);
const deviceWidth = Dimensions.get("window").width;

const isIphone_4_7 = platform === "ios" && deviceHeight === 677 && deviceWidth === 375; // 6 6s 7 8
const isIphone_5_5 = platform === "ios" && deviceHeight === 736 && deviceWidth === 414; // 6p 6sp 7p 8p
const isIphone_5_8 = platform === "ios" && deviceHeight === 812 && deviceWidth === 375; // x xs
const isIphone_6_1 = platform === "ios" && deviceHeight === 896 && deviceWidth === 414; // xr
const isIphone_6_5 = platform === "ios" && deviceHeight === 896 && deviceWidth === 414; // xs max
const isIphoneX = isIphone_5_8 || isIphone_6_1 || isIphone_6_5;

const statusHeight = isIphoneX ? 44 : isIphone ? 20 : StatusBarManager.HEIGHT;

const withoutStatusHeight = isIphone ? 44 : 50;

const headerHeight = statusHeight + withoutStatusHeight;

const defaultPaddingBottom = isIphoneX ? 34 : 0;
const defaultContent = deviceHeight - headerHeight;

export default {
    isIphoneX,
    isIphone_4_7,
    isIphone_5_5,
    isIphone_5_8,
    isIphone_6_1,
    isIphone_6_5,
    isAndroid,
    isIphone,
    headerHeight,
    statusHeight,
    withoutStatusHeight,
    defaultPaddingBottom,
    defaultContent,
    screenHeight: deviceHeight,
    screenWidth: deviceWidth,
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    navigatorStyle: {
        height: headerHeight,
        alignItems: 'center',
        justifyContent: 'center',
        width: deviceWidth
    },
    itemDivider: {
        borderBottomWidth: 1,
        borderBottomColor: '#F4F4F4',
    },
    containerColor: "#f5fcff",
    tabBarStyle: {
        height: isIphoneX ? 83 : 49,
        paddingBottom: isIphoneX ? 34 : 0,
        alignItems: "center",
        backgroundColor: 'white',
    },
    sceneStyle: {
        paddingBottom: isIphoneX ? 83 : 49,
    },
}
