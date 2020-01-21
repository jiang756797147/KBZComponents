import React from 'react';
import {Container} from 'native-base';
import {Image, StyleSheet, Text, View, TextInput} from 'react-native';
import BaseScreen from '../../../base/BaseScreen';
import KBHeader from '../../../components/KBHeader';
import KBScrollView from '../../../components/KBScrollView';
import CircleImage from '../../../components/CircleImage';
import KBDisplayImages from '../../../components/KBDisplayImages';
import KBStarView from '../../../components/KBStarView';
import colors from '../../../constants/colors';
import KBButton from '../../../components/KBButton';
import ToastUtils from '../../../utils/ToastUtils';
import TimeUtils from '../../../utils/TimeUtils';
import fetchUrl from '../../../constants/fetchUrl';
import HttpUtils from '../../../utils/HttpUtils';
import Utils from '../../../utils/Utils';

export default class ClassStarScreen extends BaseScreen {


    constructor(props) {
        super(props);
        this.commentList = [];
        this.number = 5;
        this.state = Object.assign({
            comment: '',
        }, this.state);

        const {params} = this.props.navigation.state;
        this.ticketData = params.data;
        this.setRecomment = params.setRecomment;
    }

    getApiUrl() {
        return fetchUrl.queryClassStarTag;
    }

    onSuccess(responseData) {
        this.commentList = responseData.data;
        this.setState({});
    }

    renderData = () => {
        let imageArray = this.ticketData.image ? this.ticketData.image.split(',') : [];
        return (
            <View style={{flex: 1}}>
                <KBHeader isLeft={true}
                          title="班级之星"
                          rightText={'发布'}
                          rightStyle={{color: colors.yellowColor}}
                          touchRight={() => {
                              this.plusStar();
                          }}
                          {...this.props}
                />
                <KBScrollView style={{backgroundColor: '#fff'}}>
                    <View style={{margin: 10}}>
                        <View style={{flexDirection: 'row'}}>
                            <CircleImage customHeight={40} customWidth={40}
                                         imageUrl={Utils.getStudentAvatar(this.ticketData.headerUrl, this.ticketData.sex)}/>
                            <View style={{justifyContent: 'center', marginLeft: 10}}>
                                <Text style={styles.name}>{this.ticketData.receptorName}</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={styles.time}>{TimeUtils.getTimeWithoutYearToM(this.ticketData.updateAt)}</Text>
                                    <Text
                                        style={[styles.time, {marginLeft: 3}]}>{TimeUtils.getWeekWithChina(this.ticketData.updateAt)}</Text>
                                </View>
                            </View>
                        </View>

                        <Text style={styles.content}>
                            {this.ticketData.content}
                        </Text>
                        {
                            imageArray.length > 0 ?
                                <KBDisplayImages
                                    ticketImgs={imageArray}
                                    isNetwork={true}
                                    style={{justifyContent: 'center'}}
                                /> : null
                        }
                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10, height: 16}}>

                            <View style={{width: 4, height: 14, backgroundColor: colors.yellowColor}}/>
                            <Text style={{
                                fontSize: 15,
                                color: colors.text333,
                                marginLeft: 5,
                            }}>教师点评</Text>
                        </View>
                        <KBStarView style={{marginVertical: 10, alignItems: 'center', justifyContent: 'center'}}
                                    number={this.ticketData.number}
                                    starNumbers={(number) => {
                                        this.ticketData.number = number;
                                        this.setState({});
                                    }}
                                    starStyle={{width: 30, height: 30, marginHorizontal: 5}} isPress={true}
                        />
                        <TextInput underlineColorAndroid={'#fff'}
                                   style={{
                                       textAlignVertical: 'top',
                                       padding: 5,
                                       borderWidth: 1,
                                       borderColor: colors.divider,
                                       flex: 1,
                                       height: 150,
                                   }}
                                   placeholder={'请写下您对学生的点评...'}
                                   multiline={true}
                                   onChangeText={(text) => this.setState({comment: text})}
                                   value={this.state.comment}
                        />
                        <View style={{flexWrap: 'wrap', flexDirection: 'row', marginTop: 10}}>
                            {this.commentList.map(this.renderCommentItem)}
                        </View>
                    </View>
                </KBScrollView>
            </View>
        );
    };
    renderCommentItem = (item, index) => {

        return (
            <KBButton key={index}
                      onPress={() => {
                          let comment = `${this.state.comment} ${item}`;
                          this.setState({comment: comment});
                      }}
            >
                <View style={{
                    margin: 7,
                    backgroundColor: '#ffe5e5',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 35,
                    borderRadius: 16,
                }}>
                    <Text style={{margin: 10, color: colors.reduceColor}}>
                        {item}
                    </Text>
                </View>
            </KBButton>
        );
    };

    //发布网络请求（添加班级之星请求)
    plusStar = () => {

        let formData = new FormData();
        formData.append('ticketId', this.ticketData.id);
        formData.append('classId', this.ticketData.classId);
        formData.append('starLevel', this.ticketData.number);
        formData.append('starComment', this.state.comment);

        HttpUtils.doPostWithToken(fetchUrl.dealClassStar, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast('班级之星发布成功');

                this.setRecomment(this.ticketData.number);
                this.props.navigation.goBack();
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onNullData: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        });

    };
}

const styles = StyleSheet.create({
    name: {
        fontSize: 14,
        color: colors.text333,
    },
    time: {
        marginTop: 10,
        fontSize: 12,
        color: colors.text999,
    },
    content: {
        fontSize: 14,
        color: colors.text444,
        marginTop: 10,
    },
    recommend: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 26,
        borderRadius: 13,
        backgroundColor: colors.yellowColor,
        paddingHorizontal: 15,
    },
});
