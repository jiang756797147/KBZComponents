import React from "react"
import {Container} from 'native-base'
import {
    Text,
    View,
    Image,
} from "react-native";
import BaseScreen from "../../../base/BaseScreen";
import KBButton from "../../../components/KBButton";
import KBScrollView from "../../../components/KBScrollView";
import KBHeader from "../../../components/KBHeader";
import TextInputWithClear from "../../../components/TextInputWithClear";
import Divider from "../../../components/Divider";

import colors from "../../../constants/colors";
import theme from "../../../constants/theme";
import image from "../../../constants/image";
import UserData from "../../../constants/UserData";

import SQLite from "../../../utils/SQLite";
import Utils from "../../../utils/Utils";
import HttpUtils from "../../../utils/HttpUtils";
import fetchUrl from "../../../constants/fetchUrl";
import ToastUtils from "../../../utils/ToastUtils";

export default class TicketPrintScreen extends BaseScreen {


    constructor(props) {
        super(props);

        this.state = Object.assign({
            praiseOptions: [],
            improveOptions: [],
            hasOnlyPraise: false,
        }, this.state);

        this.sqLite = new SQLite();
        this.teacherId = UserData.getInstance().getId();

        const {params} = this.props.navigation.state;
        const {goBack} = this.props.navigation;
        this.classId = params.classId;
        this.goBack = goBack;
    }

    componentDidMount() {
        super.componentDidMount();
        this.getOption();
    }

    getPraiseOptions() {
        return new Promise((resolve, reject) => {
            /**
             * 查询数据排序
             * @param teacherId  教师ID
             * @param classId    班级ID
             * @param type       事项类型     0 表扬  1 待改进
             * @param entryType  排序事项显示入口  0 学生 1 小组  -1 全部
             */
            let praiseOptions = [];
            this.sqLite.select(this.teacherId, this.classId, 0, 0, {
                onSuccess: (data) => {
                    console.log('options000000 ==============', data);
                    for (let obj of data) {
                        obj.isSelected = false;
                        praiseOptions.push(obj);
                    }
                    resolve(praiseOptions);
                },
                onFail: () => {
                    resolve([])
                }
            });
        })
    }

    getImproveOptions() {
        return new Promise((resolve, reject) => {
            /**
             * 查询数据排序
             * @param teacherId  教师ID
             * @param classId    班级ID
             * @param type       事项类型     0 表扬  1 待改进
             * @param entryType  排序事项显示入口  0 学生 1 小组  -1 全部
             */
            let improveOptions = [];
            this.sqLite.select(this.teacherId, this.classId, 1, 0, {
                onSuccess: (data) => {
                    console.log('options11111 ==============', data);
                    for (let obj of data) {
                        obj.isSelected = false;
                        improveOptions.push(obj);
                    }
                    resolve(improveOptions);
                },
                onFail: () => {
                    resolve([])
                }
            });
        })
    }

    async getOption() {
        try {
            let praiseOptions = await this.getPraiseOptions();
            let improveOptions = await this.getImproveOptions();

            this.setState({
                praiseOptions: praiseOptions,
                improveOptions: improveOptions,
            })
        } catch (e) {
            console.log(e);
        }
    }

    renderData() {
        return (
            <View style={{flex: 1, backgroundColor: colors.white}}>
                <View
                    style={{padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{fontSize: 16, color: colors.text555}}>选择打印项：</Text>
                    <KBButton onPress={() => {
                        this.setState({
                            hasOnlyPraise: !this.state.hasOnlyPraise,
                        })
                    }}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image style={{width: 16, height: 16}}
                                   source={this.state.hasOnlyPraise ? image.ticketSelectIcon : image.ticketUnSelectIcon}/>
                            <Text style={{marginLeft: 5}}>只显示表扬项</Text>
                        </View>
                    </KBButton>
                </View>
                <Divider customHeight={10}/>
                <KBScrollView
                    // isRefreshControl={true}
                    // isRefreshing={this.state.isRefreshing}
                    // onRefresh={this.refreshData}
                >
                    {this.state.praiseOptions.map(this.renderItem)}
                    {this.state.hasOnlyPraise ? null : this.state.improveOptions.map(this.renderItem)}
                </KBScrollView>
                {this.renderBottom()}
            </View>
        )
    }

    renderItem = (item, index) => {

        let scoreText = item.type === 1 ? `-${item.score}` : `+${item.score}`;
        let scoreColor = item.type === 1 ? colors.reduceColor : colors.themeColor;
        return (
            <View key={index} style={{
                flex: 1,
                flexDirection: 'row',
                paddingLeft: 20,
                paddingRight: 15,
                paddingVertical: 10,
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <KBButton style={{flex: 2}} onPress={() => {
                    item.isSelected = !item.isSelected;
                    this.setState({});
                }}>
                    <View style={{flex: 2, flexDirection: 'row', alignItems: 'center'}}>
                        <Image style={{
                            width: 16,
                            height: 16,
                        }} source={item.isSelected ? image.ticketSelectIcon : image.ticketUnSelectIcon}/>
                        <Text style={{
                            marginLeft: 10,
                            fontSize: 15,
                            color: colors.text333,
                            lineHeight: 20
                        }} numberOfLines={1}>{item.name}</Text>
                        <Text style={{
                            marginLeft: 10,
                            fontSize: 15,
                            color: scoreColor,
                            lineHeight: 20
                        }}>{scoreText}</Text>
                    </View>
                </KBButton>
                <View style={{flex: 1, height: 40,}}>
                    {
                        item.isSelected ?
                            <TextInputWithClear
                                clearIconVisible={false}
                                showDriver={false}
                                keyboardType={'numeric'}
                                inputStyle={{
                                    flex: 1,
                                    borderColor: colors.divider,
                                    height: 40,
                                    textAlign: 'center',
                                    fontSize: 15
                                }}
                                onTextChange={(text) => {
                                    if (Utils.isNull(text)) {
                                        item.printNumber = 0;
                                    }else {
                                        item.printNumber = parseInt(text);
                                    }
                                    this.setState({})
                                }}
                                placeholderText={'请输入打印张数'}
                                value={Utils.isNull(item.printNumber) || item.printNumber === 0 ? '' : item.printNumber.toString()}
                            /> : null
                    }
                </View>
            </View>
        )
    };

    renderHeader() {
        return (
            <KBHeader
                isLeft={true}
                title={'奖票打印'}
                {...this.props}
            />
        )
    }

    renderBottom() {

        let printNumber = this._sumPrintNumber();
         return (
            <View style={{
                flexDirection: 'row',
                width: theme.screenWidth,
                height: 49,
                alignItems: 'center',
                backgroundColor: colors.white,
                borderTopWidth: 1,
                borderColor: colors.divider,
            }}>
                <View style={{flex: 4, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 15, color: colors.text555}}>{`合计：${printNumber}张`}</Text>
                </View>
                <View style={{flex: 6, paddingHorizontal: 15, paddingVertical: 5}}>
                    <KBButton style={{flex: 1}} onPress={() => this.completeTicket()}>
                        <View style={{
                            flex: 1,
                            height: 40,
                            backgroundColor: colors.yellowColor,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 20
                        }}>
                            <Text style={{fontSize: 15, color: colors.white}}>提交申请</Text>
                        </View>
                    </KBButton>
                </View>
            </View>
        )
    }

    _sumPrintNumber = () => {
        let sum = 0;
        let options = this.state.hasOnlyPraise ? [...this.state.praiseOptions] : [...this.state.praiseOptions, ...this.state.improveOptions];
        for (let option of options) {
            if (option.isSelected && option.printNumber && option.printNumber > 0) {
                 sum += option.printNumber;
            }
        }
        return sum;
    };

    _getPrintOptions = () => {
        let printOptions = [];
        let options = this.state.hasOnlyPraise ? [...this.state.praiseOptions] : [...this.state.praiseOptions, ...this.state.improveOptions];
        for (let option of options) {
            if (option.isSelected && option.printNumber && option.printNumber > 0) {

                let selectedOption = {};
                selectedOption.option_id = option.id;
                selectedOption.count = option.printNumber;
                printOptions.push(selectedOption);
            }
        }

        return printOptions;
    };

    completeTicket = () => {
        let printOptions = this._getPrintOptions();

        let formData = new FormData();
        formData.append('class_id', this.classId);
        formData.append('optionIds', JSON.stringify(printOptions));

        HttpUtils.doPostWithToken(fetchUrl.printOption, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(responseData.message);
                this.goBack();
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            }
        })
    }
}
