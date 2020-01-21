import React, {Component} from 'react';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import {Image, StyleSheet, Text, View} from 'react-native';
import colors from '../../../constants/colors';
import CustomBar from '../../../components/CustomBar';
import KBAlertDialog from '../../../components/dialog/KBAlertDialog';

import MineTicketPage from './MineTicketPage';

export default class MineTicketScreen extends Component {

    ticketTypes = [
        {
            text: '全部',
            type: 0,
        },
        {
            text: '未通过',
            type: 1,
        },
        {
            text: '已通过',
            type: 2,
        },
        {
            text: '已作废',
            type: 3,
        },
    ];

    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.state);
        const {params} = this.props.navigation.state;
        this.temp = params.temp;
    }

    render() {
        let barWidth = 70;
        return (
            <View style={styles.container}>
                <ScrollableTabView style={styles.content}
                                   renderTabBar={() =>
                                       <CustomBar checkTextColor={colors.yellowColor} unCheckTextColor={colors.text333}
                                                  checkTextSize={16} unCheckTextSize={15}
                                                  isHeaderBar={true}
                                                  tabViewStyle={{width: barWidth * 4}}
                                                  tabBtnWidth={barWidth}
                                                  isCheckBold={false} underLineColor={colors.yellowColor}
                                                  isShowUnderDivider={true} {...this.props}/>}
                                   initialPage={0}>
                    {this.ticketTypes.map((ticketType, index) => {
                        return <MineTicketPage key={index}
                                               tabLabel={ticketType.text}
                                               type={ticketType.type}
                                               temp={this.temp}
                                               delMe={this.delMethord}
                                               {...this.props}
                        />;
                    })}
                </ScrollableTabView>

                <KBAlertDialog
                    ref={(ref) => this.dialog = ref}
                    content={'确定要作废该奖券吗?'}
                    rightPress={() => {
                        this.dopo();
                    }}/>
            </View>
        );
    }

    //点击作废按钮的网络请求
    delMethord = (doPo) => {
        this.dopo = doPo;
        this.dialog.show();

    };

}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
});
