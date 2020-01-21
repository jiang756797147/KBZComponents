import React from 'react';
import {Container} from 'native-base';
import {StyleSheet, Text, View, Image} from 'react-native';
import BaseScreen from '../../../../base/BaseScreen';

import SQLite from '../../../../utils/SQLite';
import Utils from '../../../../utils/Utils';
import HttpUtils from '../../../../utils/HttpUtils';
import ToastUtils from '../../../../utils/ToastUtils';
import colors from '../../../../constants/colors';
import image from '../../../../constants/image';
import theme from '../../../../constants/theme';
import fetchUrl from '../../../../constants/fetchUrl';

import KBHeader from '../../../../components/KBHeader';
import KBPolygonImage from '../../../../components/KBPolygonImage';
import TextInputWithClear from '../../../../components/TextInputWithClear';
import KBButton from '../../../../components/KBButton';
import KBScrollView from '../../../../components/KBScrollView';
import KBImagePicker from '../../../../components/KBImagePicker';
import KBSourceView from '../../../../components/KBSourceView';


//入口 enterType : 1、点评学生 2、点评小组 3、编辑表扬待改进
//表扬、待改进 Type: 0、表扬 1、待改进
export default class ClassOptionEditScreen extends BaseScreen {


    constructor(props) {
        super(props);
        this.sqLite = new SQLite();

        const {params} = this.props.navigation.state;
        this.optionObj = params.optionObj;
        this.imagePath = Utils.getSystemAvatar(params.optionObj.header);

        this.itemData = [
            {icon: image.typeName, name: '名称'},
            {icon: image.typeCalssify, name: '分类'},
            {icon: image.typeName, name: '积分来源'},
            {icon: image.typeScore, name: '分值'},
        ];
        this.scoreData = [
            {score: 0},
            {score: 1},
            {score: 2},
            {score: 3},
            {score: 4},
            {score: 5},
            {score: 6},
            {score: 7},
            {score: 8},
            {score: 9},
            {score: 10},
        ];

        this.state = Object.assign({

            optionObj: this.optionObj,
            imagePath: this.imagePath,
            optionKindList: [],

        }, this.state);

    }

    componentDidMount() {
        super.componentDidMount();
        //开启数据库
        if (!this.db) {
            this.db = this.sqLite.open();
        }
        this.getOptionKindList();
    }


    getOptionKindList() {

        const {params} = this.props.navigation.state;
        let url = fetchUrl.getOptionKindList + '&classId=' + params.classId;
        HttpUtils.doGetWithToken(url, {
            onSuccess: (responseData) => {

                if (responseData.data && responseData.data.length > 0) {
                    let options = [];
                    for (let option of responseData.data) {
                        if (option.type < 3) {
                            options.push(option);
                        }
                    }
                    this.setState({
                        optionKindList: options,
                    });
                }
            },
            onFail: function (responseData) {
                ToastUtils.showToast(responseData.message);
            },
            onNullData: (responseData) => {
                this.setState({
                    optionKindList: [],
                });
            },
        });
    }

    render() {
        let renderView = super.render();
        return (
            <Container
                style={{
                    paddingBottom: theme.tabBarStyle.paddingBottom,
                    backgroundColor: colors.white,
                    height: theme.screenHeight,
                }}
            >
                {this.renderOptionHeader()}
                {renderView}

                <KBImagePicker ref={(c) => this.imagePicker = c} title={'头像选择'}
                               isSingle={true}
                               imagePicked={(image) => {
                                   this.state.optionObj.header = image['path'];
                                   this.setState({
                                       imagePath: {uri: image['path']},
                                   });
                               }}
                />
            </Container>
        );
    }

    renderHeader(): null {
        return null;
    }

    renderOptionHeader() {
        const {params} = this.props.navigation.state;
        return (
            <KBHeader
                isLeft={true}
                touchBack={() => {
                    const {goBack} = this.props.navigation;
                    goBack();
                }}
                title={params.title}
            />
        );
    }

    renderData() {

        return (
            <View style={{flex: 1, backgroundColor: colors.white}}>
                <View style={{flex: 1}}>
                    <KBScrollView>
                        {/*//头像*/}
                        <Image style={{
                            width: theme.screenWidth,
                            height: 100,
                            opacity: 0.2,
                        }}
                               source={this.state.imagePath}
                        />
                        <View style={{
                            width: theme.screenWidth,
                            height: 100,
                            position: 'absolute',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <KBButton onPress={() => this.imagePicker.show()}>
                                <View>
                                    <KBPolygonImage
                                        width={'65'}
                                        imageUrl={this.state.imagePath}
                                        isEditText={true}
                                    />
                                </View>
                            </KBButton>
                        </View>
                        {/*事项*/}
                        <View>
                            {this.itemData.map((item, index) => this.renderItem(item, index))}
                        </View>
                    </KBScrollView>
                </View>
                {
                    this.renderEditToolBar()
                }
            </View>
        );
    }

    renderEditToolBar() {
        return (
            <View style={{
                height: 49,
                width: theme.screenWidth,
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 14,
                paddingRight: 14,
                paddingVertical: 7,
            }}>
                <KBButton style={{flex: 4}}
                          onPress={() => this.save()}
                >
                    <View style={[{
                        flex: 4,
                        backgroundColor: colors.yellowColor,
                    }, styles.bottomBtn]}
                    >
                        <Text style={{fontSize: 15, color: colors.text666}}>
                            保存
                        </Text>
                    </View>
                </KBButton>
                <KBButton style={{flex: 6}}
                          onPress={() => this.delete()}
                >
                    <View style={[{
                        flex: 6,
                        borderColor: colors.classroomCircle,
                        borderWidth: 1,
                        backgroundColor: colors.white,
                        marginLeft: 15,
                    }, styles.bottomBtn]}
                    >
                        <Text style={{fontSize: 15, color: colors.red}}>
                            删除
                        </Text>
                    </View>
                </KBButton>
            </View>
        );
    }

    renderItem(item, index) {

        return (
            <View key={index}
                  style={{
                      marginTop: 15,
                      paddingLeft: 14,
                      paddingRight: 14,
                      backgroundColor: colors.white,
                  }}>
                <View>
                    <View style={{
                        flexDirection: 'row',
                        height: 30,
                        width: theme.screenWidth - 20,
                        alignItems: 'center',
                    }}>
                        <Image style={{
                            width: 20,
                            height: 20,
                        }}
                               source={item.icon}
                        />
                        <Text style={{fontSize: 15, color: colors.text666, marginLeft: 10}}>
                            {item.name}
                        </Text>
                    </View>
                    <View>
                        {index == 0 ?
                            <View style={{width: theme.screenWidth - 30, marginTop: 0}}>
                                <TextInputWithClear
                                    clearIconVisible={true}
                                    onTextChange={(text) => this.changedText(text)}
                                    defaultText={this.state.optionObj.name}
                                />
                            </View>

                            :
                            index == 1 ?
                                <View style={{flexDirection: 'row', flexWrap: 'wrap', marginLeft: -14}}>
                                    {this.state.optionKindList.map((item, index) => this.renderTypeItem(item, index))}
                                </View>
                                :
                                index == 2 ?
                                    <View>
                                        <KBSourceView text={''} defaultValue={this.state.selectedValue}
                                                      ref={(c) => this.sourceView = c}
                                                      style={{padding: 0, flexDirection: 'row', paddingVertical: 10}}
                                                      itemAllStyle={{
                                                          flexDirection: 'row',
                                                          flexWrap: 'wrap',
                                                          justifyContent: 'flex-start',
                                                      }}
                                                      itemViewStyle={{marginRight: 20, width: 30, height: 30}}
                                                      itemStyle={{width: 30, height: 30}}
                                        />
                                    </View>
                                    :
                                    index == 3 ?
                                        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                                            {this.scoreData.map((item, index) => this.renderScoreItem(item, index))}
                                        </View>
                                        :
                                        null
                        }
                    </View>
                </View>
            </View>
        );
    }

    // 分类
    renderTypeItem(item, index) {
        let optionObj = this.state.optionObj;
        let isSelected = item.id == optionObj.pid ? true : false;
        return (
            <KBButton
                key={index}
                onPress={() => this.typeSelected(index)}
            >
                <View style={{
                    paddingHorizontal: 16,
                    paddingVertical: 7,
                    flexDirection: 'row',
                    borderRadius: 5,
                    backgroundColor: isSelected ? colors.yellowColor : colors.lightGray,
                    marginTop: 10,
                    marginLeft: 15,
                }}
                >
                    <Text style={{
                        color: colors.text666,
                    }}>
                        {item.name}
                    </Text>
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        right: -5,
                        paddingHorizontal: 3,
                        height: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderTopRightRadius: 3,
                        borderBottomLeftRadius: 3,
                        backgroundColor: item.type === 0 ? '#77BBFA' : (item.type === 1 ? '#FF8DA5' : colors.reduceColor),
                    }}>
                        <Text style={{
                            fontSize: 9,
                            color: colors.white,
                        }}>{item.type === 0 ? '学' : item.type === 1 ? '组' : '通用'}</Text>
                    </View>
                </View>
            </KBButton>
        );
    };

    // 分值
    renderScoreItem(item, index) {
        let optionObj = this.state.optionObj;
        let isSelected = item.score == optionObj.score ? true : false;
        return (
            <KBButton
                key={index}
                onPress={() => this.scoreSelected(index)}
            >
                <View style={{
                    width: (theme.screenWidth - 28) / 8,
                    height: 40,
                    justifyContent: 'center',
                }}
                >
                    <View
                        style={{
                            width: 25,
                            height: 25,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 12.5,
                            backgroundColor: isSelected ? colors.yellowColor : colors.lightGray,
                        }}
                    >
                        <Text style={{
                            color: colors.text666,
                        }}>{item.score}</Text>
                    </View>
                </View>
            </KBButton>
        );
    };

    /**
     * 名称
     */
    changedText(text) {
        this.state.optionObj.name = text;
        this.setState({});
    }

    /**
     * 类型选择
     */
    typeSelected(index) {
        this.state.optionObj.pid = this.state.optionKindList[index].id;
        this.setState({});
    };

    /**
     * 分值选择
     */
    scoreSelected(index) {

        this.state.optionObj.score = this.scoreData[index].score;
        this.setState({});
    };

    /**
     * 保存
     */
    save() {
        const {params} = this.props.navigation.state;
        const {goBack} = this.props.navigation;
        let optionObj = this.state.optionObj;

        if (Utils.isNull(optionObj.name)) {
            ToastUtils.showToast('请输入事项名称');
            return;
        }
        if (Utils.isNull(optionObj.pid)) {
            ToastUtils.showToast('请选择事项分类');
            return;
        }
        if (optionObj.name.length > 6) {
            ToastUtils.showToast('事项名称最多为6位字符！');
            return;
        }
        if (Utils.isNull(optionObj.score)) {
            ToastUtils.showToast('请选择事项分数');
            return;
        }

        let url = fetchUrl.editOption;
        let id = optionObj.id;

        let formData = new FormData();
        formData.append('optionId', id);

        if (this.imagePath == this.state.imagePath) {
            formData.append('header', optionObj.header);
        } else {
            let imagePath = optionObj.header;
            let array = imagePath.split('/');
            let imageStr = Utils.removeChinese(array[array.length - 1]);
            let file = {uri: imagePath, type: 'multipart/form-data', name: imageStr};
            formData.append('files', file);
        }

        formData.append('name', optionObj.name);
        formData.append('score', optionObj.score);
        formData.append('pid', optionObj.pid);
        // formData.append("config", config);
        formData.append('classId', params.classId);
        formData.append('type', params.praiseType);
        /*添加来源*/
        formData.append('qualityType', this.sourceView._getSelectedId());

        HttpUtils.doPostWithToken(url, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(responseData.message);

                //删除数据库当前数据重新插入
                this.sqLite.deleteSingleOption(id);
                let obj = responseData.data;
                let data = [];
                data.push(obj);
                this.sqLite.insertOptionData(data);

                // params.onRefresh();
                goBack();
            },
            onFail: function (responseData) {
                ToastUtils.showToast(responseData.message);
            },
        });

    };

    delete() {
        const {params} = this.props.navigation.state;
        const {goBack} = this.props.navigation;
        let optionObj = this.state.optionObj;
        let idArr = [];
        idArr.push(this.state.optionObj.id);
        let formData = new FormData();

        formData.append('idJson', JSON.stringify(idArr));

        HttpUtils.doPostWithToken(fetchUrl.deleteOption, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(responseData.message);

                //删除数据库当前数据
                this.sqLite.deleteSingleOption(optionObj.id);

                // params.onRefresh();
                goBack();
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        });
    }
}

const styles = StyleSheet.create({

    bottomBtn: {
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    distributeItem: {
        height: 45,
        paddingHorizontal: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});