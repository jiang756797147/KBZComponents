import React, {Component} from "react"
import {Image, Keyboard, StyleSheet, Text, View} from "react-native";
import BaseScreen from "../../../../base/BaseScreen";

import KBHeader from "../../../../components/KBHeader";
import KBButton from "../../../../components/KBButton";
import CircleImage from "../../../../components/CircleImage";
import Divider from "../../../../components/Divider";
import KBPopDialog from "../../../../components/dialog/KBPopupDialog";
import TextInputWithClear from "../../../../components/TextInputWithClear";
import KBImagePicker from "../../../../components/KBImagePicker";
import KBAlertDialog from "../../../../components/dialog/KBAlertDialog"
import KBScrollView from "../../../../components/KBScrollView";
import HttpUtils from "../../../../utils/HttpUtils";
import ToastUtils from "../../../../utils/ToastUtils";
import Utils from "../../../../utils/Utils";
import theme from "../../../../constants/theme";
import fetchUrl from "../../../../constants/fetchUrl";
import colors from "../../../../constants/colors";


export default class StudentInfoScreen extends BaseScreen {


    constructor(props) {
        super(props);

        const {params} = this.props.navigation.state;
        this.student = params.student;
        this.isMaster = Utils.isNull(params.isMaster) ? false : params.isMaster;
        this.backRefresh = params.backRefresh;
        this.state = Object.assign({
            itemData: [],
            isRefreshing: false,
            inputPopPlaceHolder: '',
            inputPopMaxLength: 6,
            hasHeader: false,
            name: '',
            cardId: '',
            duty: '',
            sex: null,
            isCheckBoy: true,
        }, this.state);
    }

    getApiUrl() {
        return fetchUrl.getStudentDetail + 'studentId=' + this.student.id;
    }

    onSuccess(responseData) {
        let data = [
            {
                itemName: '头像',
                itemValue: Utils.getStudentAvatar(responseData.data.header, responseData.data.sex),
                itemClick: () => {
                    this.pickerMenu.show();
                }
            },
            {
                itemName: '姓名', itemValue: responseData.data.name,
                itemClick: () => {
                    this.setState({inputPopPlaceHolder: '学生姓名', inputPopMaxLength: 16}, () => {
                        this.inputNamePop.show();
                    });
                }
            },
            {
                itemName: '性别', itemValue: Utils.getStudentSex(responseData.data.sex),
                itemClick: () => {
                    this.sexPop.show();
                }
            },
            {
                itemName: '身份证号(选填)', itemValue: Utils.getNoNullText(responseData.data.cardId),
                itemClick: () => {
                    this.setState({inputPopPlaceHolder: '身份证号', inputPopMaxLength: 18}, () => {
                        this.inputCardPop.show();
                    });
                }
            },
            {
                itemName: '职务(选填)', itemValue: Utils.getNoNullText(responseData.data.duty),
                itemClick: () => {
                    this.setState({inputPopPlaceHolder: '职务', inputPopMaxLength: 12}, () => {
                        this.inputDutyPop.show();
                    });
                }
            },
        ];
        this.setState({
            hasHeader: !Utils.isNullHeader(responseData.data.header),
            name: responseData.data.name,
            cardId: responseData.data.cardId,
            duty: responseData.data.duty,
            sex: responseData.data.sex,
            isCheckBoy: responseData.data.sex == 0 ? false : true,
            itemData: data
        });
    }

    onEnd() {
        this.setState({isRefreshing: false});
        super.onEnd();
    }

    renderItem = ({itemName, itemValue, itemClick}, index, data) => {
        return (
            <KBButton key={index} onPress={() => {
                if (this.isMaster) {
                    itemClick();
                }
            }}>
                <View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingVertical: index === 0 ? 8 : 15,
                            paddingHorizontal: 14
                        }}>
                        <Text style={{color: colors.text333, fontSize: 14}}>{itemName}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            {index === 0 ?
                                <CircleImage customWidth={55} customHeight={55} imageUrl={itemValue}/>
                                :
                                <Text style={{color: colors.text999, fontSize: 13}}>{itemValue}</Text>
                            }
                            {this.isMaster ? <Image source={require('../../../../assets/icon_right.png')}
                                                    style={{width: 10, height: 10, marginLeft: 10}}
                                                    resizeMode={'contain'}/> : null}
                        </View>
                    </View>
                    {index === data.length - 1 ?
                        null : <Divider customColor={'#FAFAF7'} isMargin={!(index === data.length - 2)}
                                        customHeight={index === data.length - 2 ? 10 : 0.7}/>
                    }
                </View>
            </KBButton>
        );
    };

    renderInputPop() {
        let text = "";
        switch (this.state.inputPopPlaceHolder) {
            case'学生姓名':
                text = this.state.name;
                break;
            case '身份证号':
                text = this.state.cardId;
                break;
            case '职务':
                text = this.state.duty;
                break;
        }
        return (
            <View style={{width: theme.screenWidth * 0.85, alignItems: 'center'}}>
                <View
                    style={{borderRadius: 5, width: theme.screenWidth * 0.85, backgroundColor: colors.white}}>
                    <Text style={[{
                        marginLeft: 14,
                        marginTop: 15
                    }]}>{this.state.inputPopPlaceHolder}</Text>
                    <TextInputWithClear
                        onTextChange={(text) => {
                            switch (this.state.inputPopPlaceHolder) {
                                case'学生姓名':
                                    this.setState({name: text});
                                    break;
                                case '身份证号':
                                    this.setState({cardId: text});
                                    break;
                                case '职务':
                                    this.setState({duty: text});
                                    break;
                            }
                        }}

                        // value={text}
                        placeholderText={'请输入' + this.state.inputPopPlaceHolder}
                        onFocusUnderlineColor={'#F9DB63'}
                        unFocusUnderlineColor={'#E0E0E0'}
                        maxLength={this.state.inputPopMaxLength}
                        inputStyle={{height: 30}}
                        viewStyle={{
                            marginTop: 20,
                            marginHorizontal: 14,
                            flex: 0,
                        }}/>
                    <Divider customStyle={{marginTop: 25, width: theme.screenWidth * 0.85,}}/>
                    <View style={{
                        width: theme.screenWidth * 0.85,
                        height: 40,
                        borderBottomLeftRadius: 5,
                        borderBottomRightRadius: 5,
                        flexDirection: 'row'
                    }}>
                        <KBButton style={{flex: 1}}
                                  onPress={() => {
                                      this.inputNamePop.dismiss();
                                      this.inputCardPop.dismiss();
                                      this.inputDutyPop.dismiss();
                                  }}>
                            <View style={{
                                flex: 1,
                                borderBottomLeftRadius: 5,
                                backgroundColor: colors.white,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Text style={{color: colors.text888, fontSize: 14}}>取消</Text>
                            </View>
                        </KBButton>
                        <KBButton style={{flex: 1}} onPress={() => {
                            switch (this.state.inputPopPlaceHolder) {
                                case'学生姓名':
                                    this.setState({});
                                    this.editStudent('name', this.state.name);
                                    break;
                                case '身份证号':
                                    this.setState({});
                                    this.editStudent('cardId', this.state.cardId);
                                    break;
                                case '职务':
                                    this.setState({});
                                    this.editStudent('duty', this.state.duty);
                                    break;
                            }
                        }}>
                            <View style={{
                                flex: 1,
                                borderBottomRightRadius: 5,
                                backgroundColor: '#FFDB49',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Text style={{color: colors.text333, fontSize: 14}}>保存</Text>
                            </View>
                        </KBButton>
                    </View>
                </View>
            </View>
        );
    };

    renderSexPop = () => {
        return (
            <View style={{borderRadius: 5, backgroundColor: colors.white, width: theme.screenWidth * 0.85,}}>
                <KBButton onPress={() => {
                    if (this.state.sex == 1) {
                        this.sexPop.dismiss();
                        return;
                    }
                    if (!this.state.hasHeader) {
                        this.state.itemData[0].itemValue = Utils.getStudentAvatar("", 1)
                    }
                    this.setState({sex: 1}, () => {
                        this.editStudent('sex', this.state.sex);
                    });
                }}>
                    <View style={{flexDirection: 'row', height: 45, alignItems: 'center', paddingHorizontal: 14,}}>
                        <Text style={{flex: 1, color: colors.text333, fontSize: 14}}>男</Text>
                        {this.state.isCheckBoy ? <Image source={require('../../../../assets/class/screen_ic_select.png')}
                                                        style={{width: 15, height: 15}} resizeMode={'contain'}/> : null}
                    </View>
                </KBButton>
                <Divider isMargin={true} customStyle={{width: theme.screenWidth * 0.85 - 28}}/>
                <KBButton onPress={() => {
                    if (this.state.sex == 0) {
                        this.sexPop.dismiss();
                        return;
                    }
                    if (!this.state.hasHeader) {
                        this.state.itemData[0].itemValue = Utils.getStudentAvatar("", 0)
                    }
                    this.setState({sex: 0}, () => {
                        this.editStudent('sex', this.state.sex);
                    });
                }}>
                    <View style={{flexDirection: 'row', height: 45, alignItems: 'center', paddingHorizontal: 14,}}>
                        <Text style={{flex: 1, color: colors.text333, fontSize: 14}}>女</Text>
                        {!this.state.isCheckBoy ? <Image source={require('../../../../assets/class/screen_ic_select.png')}
                                                         style={{width: 15, height: 15}}
                                                         resizeMode={'contain'}/> : null}
                    </View>
                </KBButton>
            </View>
        );
    };

    renderData() {
        return (
            <KBScrollView
                isRefreshControl={true}
                isRefreshing={this.state.isRefreshing}
                onRefresh={this.refreshData}
                style={{flex: 1, backgroundColor: colors.white}}
            >
                <View style={{flex: 1, backgroundColor: colors.white}}>
                    {this.state.itemData.map(this.renderItem)}
                    {this.isMaster ?
                        <KBButton onPress={() => {
                            this.deleteDialog.show();
                        }}>
                            <View style={{
                                alignItems: 'center',
                                marginTop: 35,
                                justifyContent: 'center',
                                marginHorizontal: 14,
                                height: 42,
                                backgroundColor: '#FFDA48',
                                borderRadius: 21
                            }}>
                                <Text style={{color: colors.text333, fontSize: 15}}>移出班级</Text>
                            </View>
                        </KBButton> :
                        null
                    }
                </View>
            </KBScrollView>
        );
    }

    render() {
        let renderView = super.render();
        return (
            <View style={this.styles.container}>
                <KBHeader isLeft={true} title={"学生资料"} {...this.props}/>
                {renderView}
                <KBPopDialog
                    ref={(c) => this.inputNamePop = c}>
                    {this.renderInputPop()}
                </KBPopDialog>
                <KBPopDialog
                    ref={(c) => this.inputCardPop = c}>
                    {this.renderInputPop()}
                </KBPopDialog>
                <KBPopDialog
                    ref={(c) => this.inputDutyPop = c}>
                    {this.renderInputPop()}
                </KBPopDialog>
                <KBPopDialog
                    ref={(c) => this.sexPop = c}>
                    {this.renderSexPop()}
                </KBPopDialog>

                <KBAlertDialog
                    ref={(c) => this.deleteDialog = c}
                    content={"您确定要删除该学生吗?"}
                    rightPress={() => {
                        this.deleteStudents();
                    }}
                    leftPress={() => {
                        this.deleteDialog.dismiss();
                    }}
                />
                <KBImagePicker ref={(c) => this.pickerMenu = c} title={'头像选择'}
                               isSingle={true}
                               imagePicked={(image) => {
                                   this.editHeadImg(image['path']);
                               }}
                />
            </View>
        );
    }

    refreshData = () => {
        this.setState({isRefreshing: true});
        super.componentDidMount();
    };

    editStudent = (key, value, imagePath) => {
        this.inputNamePop.dismiss();
        this.inputCardPop.dismiss();
        this.inputDutyPop.dismiss();
        this.sexPop.dismiss();
        if (key == 'name' && value.length > 6) {
            ToastUtils.showToast("学生名称最多为6位字符！");
            return;
        }
        if (key == 'cardId') {
            if (!Utils.isIDCard(value)) {
                ToastUtils.showToast("请输入正确的身份证号码！");
                return;
            }
        }
        let formData = new FormData();
        formData.append('studentId', this.student.id);
        formData.append(key, value);
        HttpUtils.doPostWithToken(fetchUrl.editStudent, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(responseData.message);
                if (!Utils.isNull(imagePath)) {
                    this.state.itemData[0].itemValue = {uri: imagePath};
                    this.state.hasHeader = true;
                }
                if (!Utils.isNull(this.state.name)) {
                    this.state.itemData[1].itemValue = this.state.name;
                }
                if (this.state.sex == 0 || this.state.sex == 1) {
                    this.state.itemData[2].itemValue = Utils.getStudentSex(this.state.sex);
                }
                if (!Utils.isNull(this.state.cardId)) {
                    this.state.itemData[3].itemValue = this.state.cardId;
                }
                if (!Utils.isNull(this.state.duty)) {
                    this.state.itemData[4].itemValue = this.state.duty;
                }
                this.setState({isCheckBoy: this.state.sex === 1,});
                if (!Utils.isNull(this.backRefresh)) {
                    this.backRefresh();
                }
                // this.refreshData();
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onNullData: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onEnd: () => {

            }
        })
    };

    editHeadImg(path) {
        let imagePath = path;
        let array = imagePath.split('/');
        let imageStr = Utils.removeChinese(array[array.length - 1]);
        let file = {uri: imagePath, type: 'multipart/form-data', name: imageStr};
        this.editStudent('files', file, imagePath)
    }

    deleteStudents = () => {
        const {goBack} = this.props.navigation;
        let formData = new FormData();
        formData.append('studentIds', this.student.id);
        HttpUtils.doPostWithToken(fetchUrl.deleteStudents, formData, {
            onSuccess: (responseData) => {
                // ToastUtils.showToast(responseData.message);
                ToastUtils.showToast('删除学生成功！');
                if (!Utils.isNull(this.backRefresh)) {
                    this.backRefresh();
                }
                goBack();
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onNullData: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onEnd: (responseData) => {

            },
        })
    };

    styles = StyleSheet.create({
        container: {
            backgroundColor: colors.white,
            flex: 1,
        }
    });
}