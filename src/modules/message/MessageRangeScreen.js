import React from "react"
import {Image, StyleSheet, Text, View} from "react-native";

import BaseScreen from "../../base/BaseScreen";

import KBHeader from "../../components/KBHeader";
import Divider from "../../components/Divider";
import KBButton from "../../components/KBButton";

import colors from "../../constants/colors";
import image from "../../constants/image";
import theme from "../../constants/theme";
import fetchUrl from "../../constants/fetchUrl";
import UserData from "../../constants/UserData";

import Utils from "../../utils/Utils";
import ToastUtils from "../../utils/ToastUtils";



export default class MessageRangeScreen extends BaseScreen {
    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.checkVisibleRang = params.checkVisibleRang;
        this.visibleRangId = params.visibleRang;
        this.state = Object.assign({
            data: [],
            classData: [],
            visibleRang: this.visibleRangId,
            visibleRangName: '',
        }, this.state);
    }

    getApiUrl() {
        return fetchUrl.getClassList;
    }

    onSuccess(responseData) {
        console.log("可见范围", responseData);
        let data = [
            {
                title: "公开",
                subTitle: "所有老师、家长可见",
                status: this.visibleRangId === UserData.getInstance().getClassIds() ? "1" : '0'
            },
            {
                title: "指定班级可见",
                subTitle: "选中班级里所有的老师、家长可见",
                status: this.visibleRangId === UserData.getInstance().getClassIds() ? "0" : '1'
            },
        ];
        let visibleIdArray = this.visibleRangId.split(',');
        let classData = responseData.data;

        let name = '';
        for (let obj of classData) {
            for (let visibleId of visibleIdArray) {
                if (visibleId === obj.id) {
                    name = name + (Utils.isNull(name) ? '' : ',') + obj.name;
                    obj.isSelected = true;
                    break;
                } else {
                    obj.isSelected = false;
                }
            }
        }
        this.state.visibleRangName = name;
        this.setState({
            data: data,
            classData: classData,
        });
    }

    renderData() {
        let status = this.state.data[1].status;
        return (
            <View>
                {this.state.data.map(this.renderItem)}
                {
                    status == "1" ?
                        this.state.classData.map(this.renderClassItem)
                        :
                        null
                }
            </View>
        )
    }

    renderClassItem = ({name, isSelected}, index) => {
        return (
            <KBButton key={index}
                onPress={() => {
                    let isSelected = this.state.classData[index].isSelected;
                    this.state.classData[index].isSelected = !isSelected;
                    let rang = '', name = '';
                    for (let item of this.state.classData) {
                        if (item.isSelected) {
                            rang = rang + (Utils.isNull(rang) ? '' : ',') + item.id;
                            name = name + (Utils.isNull(name) ? '' : ',') + item.name;
                        }
                    }
                    this.state.visibleRang = rang;
                    this.state.visibleRangName = name;
                    // this.checkVisibleRang(this.state.visibleRang);
                    this.setState({});
                }}>
                <View style={{
                        backgroundColor: colors.white,
                        width: theme.screenWidth,
                        paddingLeft: 30,
                        paddingRight: 14,
                    }}>
                    <View style={{
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                        <Text style={{
                                fontSize: 15,
                                color: colors.text555,
                            }}>{name}</Text>

                        <Image style={{width: 15, height: 15,}}
                            source={isSelected ? image.classBtnChoiceS : image.classBtnChoiceD}/>

                    </View>

                    {
                        index == this.state.classData.length - 1 ?
                            null
                            :
                            <View style={{width: theme.screenWidth - 44, height: 1, backgroundColor: colors.divider}}/>
                    }
                </View>
            </KBButton>
        );
    };
    renderItem = ({title, subTitle, status}, index) => {

        return (
            <KBButton
                key={index}
                onPress={() => {
                    for (let obj of this.state.data) {
                        obj.status = "0";
                    }
                    this.state.data[index].status = "1";
                    this.setState({});
                    this.state.visibleRang = index === 0 ? UserData.getInstance().getClassIds() : this.state.visibleRang;
                    this.state.visibleRangName = index === 0 ? '公开' : this.state.visibleRangName;
                }}
            >
                <View style={{width: theme.screenWidth, backgroundColor: colors.white,}}>
                    <View
                        style={{
                            paddingLeft: 14,
                            paddingRight: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            height: 70,
                        }}>
                        <View>
                            <Text style={{
                                    fontSize: 15,
                                    color: colors.text555,
                                }}>{title}</Text>
                            <Text style={{
                                    marginTop: 5,
                                    fontSize: 13,
                                    color: colors.text888,
                                }}>{subTitle}</Text>
                        </View>

                        <Image style={{width: 20, height: 20}}
                            source={status == "1" ? image.entryRadioOn : image.entryRadioOff}
                        />
                    </View>
                    <Divider customHeight={1} isMargin={true}/>
                </View>
            </KBButton>
        );
    };

    render() {
        let renderView = super.render();
        const {goBack} = this.props.navigation;
        return (
            <View style={styles.container}>
                <KBHeader
                    isLeft={true}
                    title={"可见范围"}
                    style={{backgroundColor: colors.white}}
                    headerStyle={'dark'}
                    showDriver={true}
                    rightText={'完成'}
                    touchRight={() => {
                        if (Utils.isNull(this.state.visibleRang)) {
                            ToastUtils.showToast('请至少选择一个标签')
                        } else {
                            this.checkVisibleRang(this.state.visibleRang, this.state.visibleRangName);
                            goBack();
                        }
                    }}
                    {...this.props}
                />
                {renderView}
            </View>
        );
    };

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        flex: 1
    },
});