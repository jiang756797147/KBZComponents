import React from "react"
import {Container, Button} from 'native-base'
import {
    Text,
    View,
    Image,
} from "react-native";
import BaseScreen from "../../../../base/BaseScreen";
import KBButton from "../../../../components/KBButton";
import CircleImage from "../../../../components/CircleImage";
import KBScrollView from "../../../../components/KBScrollView";
import KBHeader from "../../../../components/KBHeader";

import colors from "../../../../constants/colors";
import fetchUrl from "../../../../constants/fetchUrl";
import ToastUtils from "../../../../utils/ToastUtils";
import Utils from "../../../../utils/Utils";
import theme from "../../../../constants/theme";
import HttpUtils from "../../../../utils/HttpUtils";

export default class GroupPKScreen extends BaseScreen {

    pkItemWidth = (theme.screenWidth - 30 - 50) / 2;
    groupItemWidth = (theme.screenWidth - 30) / 4;

    constructor(props) {
        super(props);

        this.state = Object.assign({

            groupList: [],

        }, this.state);
        const {params} = this.props.navigation.state;
        const {goBack} = this.props.navigation;
        this.classId = params.classId;
        this.goBack = Utils.isNull(params.goBack) ? goBack : params.goBack;

        this.pkIndex = 0; //pk小组序号 （总共6个pK小组）
        this.index = 0;   //pk小组内小组序号（0、1）

        this.pkData = this.getPKData();
    }

    getPKData = () => {
        let data = [];
        for (let k = 0; k < 6; k++) {
            let pkGroups = [];
            for (let i = 0; i < 2; i++) {
                let group = {};
                pkGroups.push(group);
            }
            data.push(pkGroups);
        }
        return data;
    };

    componentDidMount() {
        this.getPKGroupData();
    }

    async getPKGroupData() {
        try {
            let groupList = await this.getGroupList();
            this.state.groupList = groupList;

            let url = `${fetchUrl.getPkGroup}classId=${this.classId}`;

            HttpUtils.doGetWithToken(url, {
                onSuccess: (responseData) => {

                    if (responseData.data && responseData.data.length > 0) {
                        let dataObj = Utils.getSortDataByKey(responseData.data, 'associated');

                        let keys = Object.keys(dataObj);

                        for (let key of keys) {
                            let pkGroup = [];
                            for (let group of dataObj[key]) {
                                let groupInfo = groupList.find((item) => item.id === group.group_id);
                                if (!!groupInfo) {
                                    pkGroup.push(groupInfo);
                                }
                            }
                            this.pkData[key] = pkGroup;
                        }
                    }
                },
                onFail: (responseData) => {
                    ToastUtils.showToast(responseData.message);
                },
                onEnd: () => {
                    this.setState({
                        isLoading: false
                    });
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    getGroupList() {
        return new Promise((resolve, reject) => {

            let url = fetchUrl.getGroupList + '&classId=' + this.classId;
            HttpUtils.doGetWithToken(url, {
                onSuccess: (responseData) => {
                    if (responseData.data && responseData.data.length > 0) {

                        resolve(responseData.data);
                    } else {
                        resolve([]);
                    }
                },
                onFail: (responseData) => {
                    resolve([]);
                },
            });
        })
    }


    renderData() {
        return (
            <View style={{flex: 1, backgroundColor: colors.trans}}>
                <Image style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: theme.screenWidth,
                    height: theme.screenHeight
                }}
                       source={require('../../../../assets/image3.3/pk/pk_screen_bg.png')}
                />
                {this.renderHeader()}
                <KBScrollView style={{flex: 1}}>
                    {this.renderPKView()}
                    {this.renderGroupListView()}
                </KBScrollView>

            </View>
        )
    }

    renderPKView() {
        return (
            <View style={{paddingVertical: 10, paddingHorizontal: 15}}>
                <View style={{paddingVertical: 5}}>
                    <Text style={{fontSize: 15, color: colors.text555}}>龙虎榜840积分模式-小组PK设置</Text>
                </View>
                <View style={{flexWrap: 'wrap', flexDirection: 'row', marginTop: 5}}>
                    {this.pkData.map(this.renderPKGroups)}
                </View>
            </View>
        )
    }

    renderPKGroups = (pkGroups, pkIndex) => {
        return (
            <View key={pkIndex} style={{flexDirection: 'row'}}>
                {pkGroups.map((group, groupIndex) => this.renderPKGroupItem(group, groupIndex, pkIndex))}
            </View>
        )
    };

    renderPKGroupItem(group, index, pkIndex) {
        let value = Utils.isNull(group.name) ? '' : `${group.name} (${group.sort})`;
        let hasClearBtn = this.index === index && this.pkIndex === pkIndex;
        return (
            <View key={index} style={{flexDirection: 'row'}}>
                {
                    index % 2 !== 0 ?
                        <Image style={{width: 40, height: 40, marginHorizontal: 5}}
                               resizeMode={'contain'}
                               source={require('../../../../assets/image3.3/pk/pk_vs.png')}
                        /> : null
                }
                <KBButton onPress={() => {
                    this.pkIndex = pkIndex;
                    this.index = index;
                    this.setState({});
                }}>
                    <View style={{
                        width: this.pkItemWidth,
                        height: 35,
                        marginVertical: 5,
                        borderColor: hasClearBtn ? colors.yellowColor : colors.white,
                        borderWidth: 2,
                        backgroundColor: colors.white,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 17.5,
                    }}>
                        <Text style={{
                            flex: 1,
                            fontSize: 14,
                            textAlign: 'center',
                            color: Utils.isNull(value) ? colors.text999 : colors.text555
                        }}>{Utils.isNull(value) ? '点击头像选择小组' : value}</Text>
                        {
                            hasClearBtn && !Utils.isNull(value) ?
                                this.renderClearBtn() : null
                        }
                    </View>
                </KBButton>

            </View>

        )
    };

    renderClearBtn() {
        return (
            <Button transparent
                    style={{width: 20, height: 35}}
                    onPress={() => {
                        let pkGroups = this.pkData[this.pkIndex];
                        pkGroups.splice(this.index, 1, {});
                        this.setState({});
                    }}>
                <Image resizeMode={'contain'} source={require('../../../../assets/input_ic_close.png')}
                       style={{width: 15, height: 15}}/>
            </Button>
        )
    }

    renderGroupListView() {
        return (
            <View style={{paddingHorizontal: 15, marginTop: 10}}>
                <View>
                    <Text style={{fontSize: 15, color: colors.text555}}>请选择PK小组
                        <Text style={{color: colors.yellowColor}}>（点击头像自动选择）</Text>
                    </Text>
                </View>
                <View style={{marginTop: 10, flexDirection: 'row', flexWrap: 'wrap'}}>
                    {this.state.groupList.map(this.renderGroupItem)}
                </View>
            </View>
        )
    }

    renderGroupItem = (item, index) => {
        let isSelected = this._hasItem(this.pkData, item);
        return (
            <KBButton key={index}
                      onPress={() => {
                          if (isSelected) {
                              return;
                          }
                          let pkGroups = this.pkData[this.pkIndex];
                          pkGroups.splice(this.index, 1, item);
                          this.setState({});
                      }}>
                <View style={{
                    marginVertical: 5,
                    width: this.groupItemWidth,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View>
                        <CircleImage customWidth={55} customHeight={55}
                                     imageUrl={Utils.getTeamAvatar(item.header)}
                        />
                        {
                            isSelected ? <View style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: 55,
                                height: 55,
                                borderRadius: 27.5,
                                backgroundColor: 'rgba(0,0,0,0.5)'
                            }}/> : null
                        }
                    </View>

                    <Text style={{marginTop: 10, fontSize: 13, color: colors.text666}}>{item.name}</Text>
                </View>
            </KBButton>
        )
    };

    renderHeader() {
        return (
            <KBHeader
                isLeft={true}
                touchBack={() => {
                    this.goBack();
                }}
                title={'设置PK小组'}
                backgroundColor={colors.trans}
                showDriver={true}
                rightText={'提交'}
                rightStyle={{fontSize: 14, color: colors.text555}}
                touchRight={() => {
                    this.completePKGroups();
                }}
                {...this.props}
            />
        )
    }


    _hasItem = (dataArray, group) => {
        if (dataArray && dataArray.length > 0) {
            for (let groups of dataArray) {
                let isExist = !!groups.find((item) => item.id === group.id);
                if (isExist) {
                    return true;
                }
            }
            return false;
        } else {
            return false;
        }
    };

    _getPKGroupIds = () => {

        let pkIds = [];
        for (let pkGroups of this.pkData) {

            let pkGroupIds = this._getGroupIds(pkGroups);
            if (pkGroupIds.length > 0) {
                pkIds.push(pkGroupIds);
            }
        }

        return pkIds;
    };

    _getGroupIds = (dataArray) => {
        let array = [];
        if (dataArray && dataArray.length > 0) {
            for (let group of dataArray) {
                if (Object.keys(group).length === 0) {
                    return [];
                } else {
                    array.push(group.id);
                }
            }
            return array;
        } else {
            return [];
        }
    };

    _verify = () => {
        let array = [];
        for (let pkGroups of this.pkData) {
            for (let group of pkGroups) {
                if (Object.keys(group).length !== 0) {
                    array.push(group);
                }
            }
        }

        if (array.length === 0) {
            return 'empty';
        } else if (array.length % 2 !== 0) {
            return 'singular';
        } else {
            return 'even';
        }
    };

    completePKGroups = () => {

        let pkIdArray = this._getPKGroupIds();
        if (this._verify() === 'empty') {
            ToastUtils.showToast('请选择pk小组！');
            return;
        } else if (this._verify() === 'singular') {
            ToastUtils.showToast('请选择对应的pk小组！');
            return;
        }

        let formData = new FormData();
        formData.append('groupPkJson', JSON.stringify(pkIdArray));
        formData.append('classId', this.classId);

        HttpUtils.doPostWithToken(fetchUrl.setupPkGroup, formData, {
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
