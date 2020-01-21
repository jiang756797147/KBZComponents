import React, {Component} from "react"
import {Container} from 'native-base'
import {Image, StyleSheet, Text, View,} from "react-native";
import {NavigationActions, StackActions} from "react-navigation"

import colors from "../../constants/colors";
import fetchUrl from "../../constants/fetchUrl";
import UserData from "../../constants/UserData";
import KBHeader from "../../components/KBHeader";
import KBScrollView from "../../components/KBScrollView";
import KBButton from "../../components/KBButton";
import HttpUtils from "../../utils/HttpUtils";
import ToastUtils from "../../utils/ToastUtils";
import theme from "../../constants/theme";


export default class TirdLoginListScreen extends Component {

    orgBgArray = [
        require('../../assets/thirdLogin/org_bg_01.png'),
        require('../../assets/thirdLogin/org_bg_02.png'),
        require('../../assets/thirdLogin/org_bg_03.png'),
        require('../../assets/thirdLogin/org_bg_04.png'),
    ];
    orgIconArray = [
        require('../../assets/thirdLogin/org_ic_01.png'),
        require('../../assets/thirdLogin/org_ic_02.png'),
        require('../../assets/thirdLogin/org_ic_03.png'),
        require('../../assets/thirdLogin/org_ic_04.png'),
    ];

    constructor(props) {
        super(props);
        this.state = {};
        const {params} = this.props.navigation.state;
        this.userList = params.data;
    }

    render() {
        return (
            <View style={this.styles.container}>
                <KBHeader isLeft={true} showDriver={false} backgroundColor={colors.empty} {...this.props}/>
                <KBScrollView style={{flex: 1}}>
                    <View style={{flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center', marginTop: 20}}>
                        {/*<Image style={{width: 60, height: 60, backgroundColor: colors.bossgreen}}/>*/}
                        <Text style={{fontSize: 21, color: colors.text333, marginLeft: 20}}>请选择您所要登录的学校</Text>
                    </View>

                    <View style={{marginTop: 10, paddingHorizontal: 20}}>
                        {this.userList.map(this.renderItem)}
                    </View>
                </KBScrollView>
            </View>
        );
    }

    renderItem = (item, index) => {
        return (
            <KBButton key={index}
                      onPress={() => {
                          this.login(item.id);
                      }}
            >
                <View style={{marginTop: 10}}>
                    <Image style={{width: theme.screenWidth - 40, height: 120}} resizeMode={'cover'}
                           source={this.orgBgArray[index]}/>
                    <View style={{
                        width: theme.screenWidth - 40,
                        height: 120,
                        flexDirection: 'row',
                        paddingHorizontal: 14,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                    }}>
                        <Image style={{width: 33, height: 33, marginTop: 20}} source={this.orgIconArray[index]}/>
                        <View style={{marginLeft: 15, flex: 1, justifyContent: 'center',}}>
                            <Text style={[this.styles.itemTextStyle, {fontSize: 17}]}>{item.schoolName}</Text>
                            <Text style={[this.styles.itemTextStyle, {marginTop: 5}]}>{'学校'}</Text>
                            <View style={{flexDirection: 'row', marginTop: 15}}>
                                <Text style={[this.styles.itemTextStyle,]}>{'机构代码:'}</Text>
                                <Text style={[this.styles.itemTextStyle, {fontSize: 19}]}>{item.code}</Text>
                            </View>

                        </View>
                    </View>
                </View>

            </KBButton>
        );
    };


    login = (id) => {
        let formData = new FormData();
        formData.append("id", id);

        HttpUtils.doPost(fetchUrl.selectUser, formData, {
            onSuccess: (responseData) => {
                UserData.getInstance().saveData(responseData.data.user);
                UserData.getInstance().setClassIds(responseData.data.classIds);
                let resetAction = StackActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({routeName: 'MainTabPage'})//要跳转到的页面名字
                    ]
                });
                this.props.navigation.dispatch(resetAction);
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            }
        });
    };

    styles = StyleSheet.create({
        container: {
            backgroundColor: colors.empty,
            flex: 1
        },

        itemTextStyle: {
            color: colors.white,
            lineHeight: 20
        }
    });

}
