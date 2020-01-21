import React, {Component} from 'react';
import {Image, StyleSheet, Text, View, Keyboard, DeviceEventEmitter} from 'react-native';

import KBHeader from '../../components/KBHeader';
import Divider from '../../components/Divider';
import KBButton from '../../components/KBButton';
import TextInputWithClear from '../../components/TextInputWithClear';
import KBDisplayImages from '../../components/KBDisplayImages';
import KBImagePicker from '../../components/KBImagePicker';

import colors from '../../constants/colors';
import image from '../../constants/image';
import theme from '../../constants/theme';
import fetchUrl from '../../constants/fetchUrl';
import {MESSAGE_UPDATE} from '../../constants/notify';

import ToastUtils from '../../utils/ToastUtils';
import Utils from '../../utils/Utils';
import HttpUtils from '../../utils/HttpUtils';


export default class ReleaseHomeWorkScreen extends Component {

    markConfig = 1;
    imageWidth = (theme.screenWidth - 14) / 4 - 14;

    constructor(props) {
        super(props);
        this.state = {
            imagePath: '',
            imagePaths: [],
            imageUrls: [],
            modalVisible: false,
            visibleRang: '',
            visibleRangName: '公开',
            content: '',
            title: '',
        };
        this.eventEmitter = DeviceEventEmitter;
    }


    renderSelectImageBtn() {
        return (
            <KBButton onPress={() => {
                Keyboard.dismiss();
                this.pickerMenu.show();
            }}>
                <View
                    style={{
                        width: this.imageWidth,
                        height: this.imageWidth,
                        backgroundColor: 'rgb(234,234,234)',
                        marginHorizontal: 7,
                        marginTop: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Image style={{width: 50, height: 50}} source={image.entryCamera}/>
                    <Text style={{fontSize: 13, color: colors.text888}}>添加照片</Text>
                </View>
            </KBButton>
        );
    }

    render() {
        return (
            <View style={this.styles.container}>
                <KBHeader
                    isLeft={true}
                    title={'发布作业'}
                    style={{backgroundColor: colors.white}}
                    headerStyle={'dark'}
                    touchRight={() => {
                        this.createTask();
                    }}
                    rightText={'发布'}
                    rightStyle={{color : colors.text666}}
                    {...this.props}
                />
                <Divider customHeight={0.5}/>

                <View>
                    <View style={{width: theme.screenWidth, backgroundColor: colors.white}}>

                        <View style={{
                            width: theme.screenWidth,
                            height: 60,
                            paddingHorizontal: 14,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: colors.white,

                        }}>
                            <TextInputWithClear
                                placeholderText={'作业标题（最多输入15个字）'}
                                clearIconVisible={false}
                                showDriver={false}
                                inputStyle={{fontSize: 15, color: colors.text666}}
                                onTextChange={(text) => {
                                    this.setState({title: text});
                                }}
                            />
                        </View>
                        <Divider customHeight={10} customStyle={{backgroundColor: colors.lightGray}}/>
                        <View
                            style={{width: theme.screenWidth, height: 100, paddingHorizontal: 14}}>
                            <TextInputWithClear
                                multiline={true}
                                onTextChange={(text) => {
                                    this.setState({content: text});
                                }}
                                placeholderText={'输入作业内容（最多输入500字）'}
                                clearIconVisible={false}
                                showDriver={false}
                                inputStyle={{
                                    fontSize: 15,
                                    color: colors.text666,
                                    height: 100,
                                    paddingTop: 10,
                                    textAlignVertical: 'top',
                                }}
                            />
                        </View>

                        <View style={{
                            paddingHorizontal: 7,
                            paddingBottom: 10,
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                        }}>
                            {this.state.imagePaths && this.state.imagePaths.length > 0 ?
                                <KBDisplayImages
                                    imgWidth={this.imageWidth}
                                    style={{backgroundColor: colors.white, paddingHorizontal: 10}}
                                    isDeleteImg={true}
                                    imageDeleteClick={(index) => {
                                        this.state.imagePaths.splice(index, 1);
                                        this.state.imageUrls.splice(index, 1);
                                        this.setState({});
                                    }}
                                    ticketImgs={this.state.imagePaths}
                                    // ticketImgUrls={this.state.imageUrls}
                                /> : null}
                            {this.state.imagePaths.length == 3 ? null : this.renderSelectImageBtn()}

                        </View>
                    </View>

                    <KBButton onPress={() => {
                        const {navigate} = this.props.navigation;
                        navigate('MessageRange', {
                            checkVisibleRang: this.checkVisibleRang,
                            visibleRang: this.state.visibleRang,
                        });
                    }}>
                        <View style={{
                            paddingHorizontal: 14,
                            marginTop: 10,
                            width: theme.screenWidth,
                            height: 60,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: colors.white,
                        }}>
                            <Text style={{color: colors.text333}}>可见范围</Text>

                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text numberOfLines={1}
                                      style={{
                                          color: colors.text888,
                                          maxWidth: 150,
                                      }}>{this.state.visibleRangName}</Text>
                                <Image style={{
                                    marginLeft: 10,
                                    width: 7,
                                    height: 13,
                                }}
                                       source={image.itemArrowImage}/>
                            </View>

                        </View>
                    </KBButton>
                </View>
                <KBImagePicker ref={(c) => this.pickerMenu = c} title={'图片选择'}
                               isSingle={false}
                               imagePicked={(image, index) => {
                                   let imagePaths = this.state.imagePaths;
                                   let imageUrls = this.state.imageUrls;
                                   if (index == 0) {
                                       imagePaths.push(image['path']);
                                       imageUrls.push({url: image['path']});
                                   } else {
                                       if (image.length > 0) {
                                           if (image.length + imagePaths.length > 3) {
                                               image.splice(3 - imagePaths.length, image.length - (3 - imagePaths.length));
                                               ToastUtils.showToast('您最多可选择3张图片');
                                           }
                                           for (let img of image) {
                                               imagePaths.push(img['path']);
                                               imageUrls.push({url: img['path']});
                                           }
                                       }
                                   }
                                   this.setState({
                                       imageUrls: imageUrls,
                                       imagePaths: imagePaths,
                                   });
                               }}
                />
            </View>
        );
    };

    checkVisibleRang = (visibleRang, visibleRangName) => {
        this.state.visibleRang = visibleRang;
        this.setState({visibleRangName: visibleRangName});
    };

    createTask = () => {
        if (this.state.title.length === 0) {
            ToastUtils.showToast('请输入作业标题');
            return;
        }
        if (this.state.content.length === 0) {
            ToastUtils.showToast('请输入作业内容');
            return;
        }
        if (this.state.title.length > 15) {
            ToastUtils.showToast('作业标题不超过15个字符！');
            return;
        }
        let formData = new FormData();
        formData.append('markConfig', this.markConfig.toString());
        formData.append('visibleRang', this.state.visibleRang);
        formData.append('content', this.state.content);
        formData.append('title', this.state.title);

        if (this.state.imagePaths.length > 0) {
            for (let imagePath of this.state.imagePaths) {
                let array = imagePath.split('/');
                let imageStr = Utils.removeChinese(array[array.length - 1]);
                let file = {uri: imagePath, type: 'multipart/form-data', name: imageStr};
                formData.append('files[]', file);
            }
            // formData.append('files', images);
        }
        HttpUtils.doPostWithToken(fetchUrl.createHomework, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast('作业发布成功！');
                this.eventEmitter.emit(MESSAGE_UPDATE);
                const {goBack} = this.props.navigation;
                goBack();
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onNullData: (responseData) => {
                // ToastUtils.showToast(responseData.message);
            },
        });
    };

    styles = StyleSheet.create({
        container: {
            backgroundColor: colors.empty,
            flex: 1,
        },
    });
}