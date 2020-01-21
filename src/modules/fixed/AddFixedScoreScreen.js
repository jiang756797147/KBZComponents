import React, {Component} from 'react';
import {Image, StyleSheet, Text, View, TextInput, ScrollView, InteractionManager, Keyboard} from 'react-native';
import BaseScreen from '../../base/BaseScreen';
import KBHeader from '../../components/KBHeader';
import theme from '../../constants/theme';
import Divider from '../../components/Divider';
import Color from '../../constants/colors';
import KBButton from '../../components/KBButton';
import ToastUtils from '../../utils/ToastUtils';
import fetchUrl from '../../constants/fetchUrl';
import HttpUtils from '../../utils/HttpUtils';
import Utils from '../../utils/Utils';
import TimeUtils from '../../utils/TimeUtils';
import moment from 'moment';
// import KBSourceView from "../../components/KBSourceView";


export default class AddFixedScoreScreen extends BaseScreen {

    currentDate = moment().startOf('day').unix();

    constructor(props) {
        super(props);
        this.data = {};
        this.validity = '';
        this.state = Object.assign({
            selected: 0,
            name: '',   //固定分名称（选填）
            score: '',  //固定分值
            isChange: false,
            students: [],
            student_id: [],
            DateType: [],
            selectedValue: 1, //默认为第一个'德'
        }, this.state);
        const {params} = this.props.navigation.state;
        this.classId = params.classId;
        this.state.isChange = params.isChange;

        if (this.state.isChange) {

            this.data = params.item;
            console.log('item ===========', params);

            let students = this.data.studentData;

            for (let i = 0; i < students.length; i++) {
                this.state.students.push({'id': students[i].studentId, 'name': students[i].studentName});
                this.state.student_id.push({'studentId': students[i].studentId});
            }
            this.state.name = this.data.fixedName;
            this.state.score = this.data.score + '';
            this.state.startTime = this.data.validity;
            this.state.selectedValue = this.data.qualityType;

            this.refresh = params.refresh;

        }
    }

    getApiUrl() {

        return fetchUrl.getCateGory + 'classId=' + this.classId;
    }

    onSuccess(responseData) {
        this.setState({DateType: responseData.data});
    }

    renderData() {
        return (
            <View
                style={{flex: 1, backgroundColor: Color.divider, height: theme.screenHeight, width: theme.screenWidth}}>
                <KBHeader isLeft={true} title={'固定分设置'} {...this.props} rightText={this.state.isChange ? '' : '查看统计'}
                          rightStyle={{fontSize: 14, color: Color.text888, fontWeight: 'normal'}}
                          touchRight={() => {
                              if (!this.state.isChange) {
                                  // this.props.navigation.navigate('FixedHistory', {'classId': this.classId});
                                  this.props.navigation.navigate('FixedStatistics', {'classId': this.classId});
                              }
                          }}/>
                <ScrollView style={{flex: 1}}>
                    <View style={{flex: 1}}>
                        <View style={{
                            width: theme.screenWidth,
                            height: 52,
                            backgroundColor: Color.white,
                            alignItems: 'center',
                            flexDirection: 'row',
                        }}>
                            <Text style={{color: '#212121', fontSize: 15, marginLeft: 15}}>选择加分项：</Text>
                            {this.state.isChange ?
                                <Text style={{
                                    marginRight: 15,
                                    flex: 1,
                                    textAlign: 'right',
                                }}>{this.data.cateName}{Utils.isNull(this.data.fixedName) ? '' : '(' + this.data.fixedName + ')'}</Text>
                                :
                                null}
                        </View>
                        <Divider/>
                        {this.state.isChange ? null : this.state.DateType.map((item, index, i) => {
                            return (
                                <View key={index}>
                                    <View style={styles.lineItem}>
                                        <KBButton onPress={() => {
                                            this.setState({selected: index, name: ''});
                                        }}>
                                            <View style={{flexDirection: 'row', paddingVertical: 5}}>
                                                <Image style={{width: 17, height: 17}}
                                                       source={index == this.state.selected ? require('../../assets/class/class_btn_choice_s.png') : require('../../assets/class/class_btn_choice_d.png')}/>
                                                <Text style={{
                                                    marginLeft: 15,
                                                    fontSize: 15,
                                                    color: '#494949',
                                                }}>{item.name}</Text>
                                            </View>
                                        </KBButton>
                                        <TextInput editable={index == this.state.selected ? true : false}
                                                   underlineColorAndroid='transparent' style={{flex: 1, fontSize: 15}}
                                                   textAlign='right'
                                                   value={index == this.state.selected ? this.state.name : ''}
                                                   onChangeText={(text) => this.setState({name: text})}
                                                   placeholder={item.title}/>
                                    </View>
                                    <Divider isMargin={true}/>
                                </View>
                            );
                        })}
                        <Divider customHeight={10}/>

                        {/*<KBSourceView defaultValue={this.state.selectedValue} ref={(c)=>this.sourceView=c} textStyle={styles.typeName} style={{paddingHorizontal:15}}/>*/}

                        <Divider customHeight={10}/>
                        <View style={styles.lineItem}>
                            <Text style={styles.typeName}>固定分值：</Text>
                            <TextInput underlineColorAndroid='transparent'
                                       style={{flex: 1, fontSize: 15}}
                                       textAlign='right'
                                       value={this.state.score}
                                       keyboardType={'number-pad'}
                                       onChangeText={(text) => {

                                           if (text.length > 0 && text.substr(0, 1) == 0) {
                                               text = text.substr(1, text.length - 1);
                                           }
                                           this.setState({score: text});
                                           // if (parseInt(text) > 20) {
                                           //     ToastUtils.showToast("固定分值不能超过20分，请重新输入");
                                           // }
                                       }}
                                       placeholder={'请输入分值'}/>
                        </View>
                        <Divider customHeight={10}/>
                        <KBButton onPress={() => {
                            const {navigate} = this.props.navigation;
                            navigate('ReceptorList', {
                                classId: this.classId,
                                receptors: this.state.students,
                                getReceptors: (data) => this.getReceptors(data),
                            });
                        }}>
                            <View style={styles.lineItem}>
                                <Text style={[styles.typeName, {flex: 1}]}>选择学生：</Text>
                                <Text style={{
                                    color: Color.text999,
                                    fontSize: 15,
                                }}>{this.state.students.length > 0 ? '已选择' + this.state.students.length + '位' : '请选择'}</Text>
                                <Image style={{marginLeft: 15, width: 6, height: 13}}
                                       source={require('../../assets/class/ic_more.png')}/>
                            </View>
                        </KBButton>

                        <View style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            paddingHorizontal: 15,
                            backgroundColor: Color.white,
                        }}>
                            {this.state.students.map((item, index, i) => {
                                return (
                                    <View key={index} style={{alignItems: 'center', marginRight: 10}}>
                                        <Image style={{width: 46, height: 46, borderRadius: 23}}
                                               source={Utils.getStudentAvatar(item.header, item.sex)}/>
                                        <Text style={{
                                            fontSize: 14,
                                            color: Color.text444,
                                            marginTop: 8,
                                            marginBottom: 20,
                                        }}>{item.name}</Text>
                                    </View>
                                );
                            })}
                        </View>
                        <Divider customHeight={10}/>
                        <KBButton onPress={() => {
                            const {navigate} = this.props.navigation;
                            navigate('KBDate', {
                                isSingle: true,
                                getDate: (startDate) => {

                                    if (startDate.timestamp / 1000 < this.currentDate) {
                                        ToastUtils.showToast('截止时间不能小于当前日期！');
                                    } else {
                                        this.setState({
                                            startTime: (startDate.timestamp / 1000).toString(),
                                        });
                                    }
                                },
                            });
                        }}>
                            <View style={styles.lineItem}>
                                <Text style={[styles.typeName, {flex: 1}]}>有效期：</Text>
                                <Text style={{
                                    color: Color.text999,
                                    fontSize: 15,
                                }}>{Utils.isNull(this.state.startTime) ? '请选择' : TimeUtils.getTimeWithDay(this.state.startTime)}</Text>
                                <Image style={{width: 6, height: 13, marginLeft: 15}}
                                       source={require('../../assets/class/ic_more.png')}/>
                            </View>
                        </KBButton>

                        <View style={{backgroundColor: Color.divider, flex: 1}}>

                            {this.state.isChange ? null :
                                <Text style={{padding: 15, fontSize: 12, color: Color.text666, lineHeight: 20}}><Text
                                    style={{fontSize: 12, color: Color.orangeRed}}>*固定分：</Text>指学生因为职务或特长等原因，可以获得额外积分的情况。添加固定分的学生，将以周为单位，每周一上午10：00自动获得固定积分。</Text>
                            }
                            <KBButton onPress={() => {
                                this.addFixed();

                            }}>
                                <View style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginHorizontal: 20,
                                    height: 42,
                                    marginBottom: 40,
                                    borderRadius: 21,
                                    marginTop: 15,
                                    backgroundColor: Color.yellowColor, //'#FCD963'
                                }}>
                                    <Text style={{
                                        fontSize: 15,
                                        color: Color.text444,
                                    }}>确定</Text>
                                </View>
                            </KBButton>
                        </View>
                    </View>
                </ScrollView>

            </View>

        );
    }


    getReceptors = (data) => {

        this.state.student_id = [];

        for (let student of data) {
            // receptorIdArr.push(student.id);
            // receptorNameArr.push(student.name);
            console.log(student.studentScore + '..........');
            this.state.student_id.push({'studentId': student.id});
        }

        this.setState({students: data});

    };


    addFixed = () => {

        let cateId = this.state.DateType[this.state.selected].id;
        if (Utils.isNull(this.state.score)) {
            ToastUtils.showToast('请输入分值');
            return;
        }
        if (this.state.students.length == 0) {
            ToastUtils.showToast('请选择学生');
            return;
        }
        if (Utils.isNull(this.state.startTime)) {
            ToastUtils.showToast('请选择时间');
            return;
        }
        // let tmp = Date.parse(new Date()).toString();
        // tmp = tmp.substr(0, 10);
        // let tos='';
        // for(let student of this.state.students){
        //     if(parseInt(student.allFixedScore)+parseInt(this.state.score)>20){
        //         tos=tos+student.name+' ';
        //         console.log(student.allFixedScore+this.state.score+"");
        //     }
        // }
        // if(!Utils.isNull(tos)){
        //     ToastUtils.showToast(tos+"学生超过限额20分");
        //     return;
        // }


        let formData = new FormData();
        if (!Utils.isNull(this.state.name)) {
            formData.append('name', this.state.name);
        }
        formData.append('score', this.state.score);
        formData.append('studentId', JSON.stringify(this.state.student_id));
        formData.append('classId', this.classId);
        formData.append('validity', this.state.startTime);
        if (!this.state.isChange) {
            formData.append('cateId', this.state.DateType[this.state.selected].id);
        }

        if (this.state.isChange) {
            formData.append('fixedId', this.data.id);
        }
        /*添加来源*/
        formData.append('qualityType', this.sourceView._getSelectedId());

        HttpUtils.doPostWithToken(this.state.isChange ? fetchUrl.editFixedScore : fetchUrl.addFixedScore, formData, {
            onSuccess: (responseData) => {
                // AnalyticsUtil.profileSignInWithPUID(this.nameEdit.getText());
                ToastUtils.showToast(responseData.message);
                if (this.refresh) {
                    this.refresh();
                }
                this.props.navigation.goBack();
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onNullData: (responseData) => {

            },
            onEnd: (responseData) => {

            },
        });

    };


}

styles = StyleSheet.create({
    lineItem: {
        backgroundColor: Color.white,
        alignItems: 'center',
        flexDirection: 'row',
        height: 52,
        paddingHorizontal: 15,
    },
    container: {},
    typeName: {
        fontSize: 15,
        color: '#494949',
    },
});
