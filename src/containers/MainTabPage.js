import React, {Component} from 'react';
import {
    Image,
    DeviceEventEmitter,
    NativeModules,
    NativeEventEmitter
} from 'react-native';
import {Container} from 'native-base';
import TabNavigator from 'react-native-tab-navigator';

import colors from '../constants/colors';
import theme from '../constants/theme';
import {CHANGE_SELECTEDTAB} from '../constants/notify';

import HomeScreen from '../modules/home/HomeScreen';
import ContactScreen from '../modules/contact/ContactScreen';
import MineScreen from '../modules/mine/MineScreen';
import MessageScreen from '../modules/message/MessageScreen';

const {PushManager} = NativeModules;
const calendarManagerEmitter = new NativeEventEmitter(PushManager);

class MainTabPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedTab: 'home',
        };

        this.eventEmitter = DeviceEventEmitter;
    }

    UNSAFE_componentWillMount(): void {
        this.eventEmitter.addListener(CHANGE_SELECTEDTAB, this.changeSelectedTab.bind(this));

        this.subscription = calendarManagerEmitter.addListener(
            'EventReminder',
            (reminder) => {
                this.notificationEvent(reminder);
            }
        );
    }

    componentWillUnmount() {

        this.eventEmitter.removeListener(CHANGE_SELECTEDTAB, this.changeSelectedTab);

        this.subscription.remove();
    }

    //ios 通知事件处理 跳转详情  around 2 代表后台点击推送跳转  1代表前台收到通知未点击 收到通知即刷新角标
    notificationEvent = (reminder) => {
        console.log('reminder ==================', reminder);
        // this.getBadgeNumber();
        // this.eventEmitter.emit(UPDATE_MESSAGE);
        //
        // if (reminder && reminder.around === '2') {
        //     this.pushDetail(reminder);
        // }
    };

    changeSelectedTab = () => {
        this.setState({
            selectedTab: 'message',
        });
    };

    render() {
        return (
            <Container>
                <TabNavigator tabBarStyle={theme.tabBarStyle} sceneStyle={theme.sceneStyle}>
                    {this._renderTabarItems('课堂', 'home', require('../assets/class/tab/tab_classroom_n.png'),
                        require('../assets/class/tab/tab_classroom_s.png'), HomeScreen)}
                    {this._renderTabarItems('消息', 'message', require('../assets/class/tab/tab_message_n.png'),
                        require('../assets/class/tab/tab_message_s.png'), MessageScreen)}
                    {this._renderTabarItems('通讯录', 'contact', require('../assets/class/tab/tab_address_n.png'),
                        require('../assets/class/tab/tab_address_s.png'), ContactScreen)}
                    {this._renderTabarItems('我', 'mine', require('../assets/class/tab/tab_my_n.png'),
                        require('../assets/class/tab/tab_my_s.png'), MineScreen)}
                </TabNavigator>
            </Container>
        );
    }

    _renderTabarItems = (title, selectedTab, icon, selectedIcon, Component) => {
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === selectedTab}
                title={title}
                // badgeText={20}
                tabStyle={{marginTop: 5}}
                selectedTitleStyle={{color: colors.yellowColor}}
                renderIcon={() => <Image source={icon} style={{width: 20, height: 20}} resizeMode={'contain'}/>}
                renderSelectedIcon={() => <Image source={selectedIcon} style={{width: 20, height: 20}}
                                                 resizeMode={'contain'}/>}
                onPress={() => this.setState({selectedTab: selectedTab})}
            >
                <Component {...this.props} isExistTabBar={true}/>
            </TabNavigator.Item>
        );
    };

}

export default MainTabPage;
