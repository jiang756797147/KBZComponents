import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import {Button} from 'native-base';

import KBPopupDialog from '../../../components/dialog/KBPopupDialog';
import theme from '../../../constants/theme';
import colors from '../../../constants/colors';

export default class MessageReleaseDialog extends Component {

    releaseArray = [
        {
            title: '发布公告',
            icon: require('../../../assets/class/message/message_ic_notice.png'),
            navigatePage: 'ReleaseNotice',
        },
        {
            title: '发布作业',
            icon: require('../../../assets/class/message/message_ic_task.png'),
            navigatePage: 'ReleaseHomeWork',
        },
    ];

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <KBPopupDialog
                ref={(c) => this.customPop = c}
                {...this.props}>
                <View style={{
                    width: 0.9 * theme.screenWidth,
                    height: 120,
                    backgroundColor: colors.white,
                    borderRadius: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {this.releaseArray.map(this.renderReleaseItem)}
                </View>
            </KBPopupDialog>
        );
    }

    renderReleaseItem = ({title, icon, navigatePage}, index) => {
        return (
            <Button key={index}
                    style={{
                        width: 0.9 * theme.screenWidth / 2,
                        height: 120,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    transparent={true}
                    onPress={() => {
                        this.dismiss();
                        const {navigate} = this.props.navigation;
                        navigate(navigatePage);
                    }}
            >
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Image style={{width: 35, height: 35}} resizeMode={'contain'} source={icon}/>
                    <Text style={{marginTop: 15, fontSize: 14, color: colors.text666}}>{title}</Text>
                </View>
            </Button>
        );
    };

    show = () => {
        this.customPop.show();
    };
    dismiss = () => {
        this.customPop.dismiss();
    };
};
