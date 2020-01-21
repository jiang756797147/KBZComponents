import React, {Component} from 'react'
import {View} from 'react-native';

import KBHeader from '../../components/KBHeader';
import KBCalendar from './view/KBCalendar';
import ToastUtils from "../../utils/ToastUtils";
import colors from "../../constants/colors";


class KBDateScreen extends Component {


    constructor(props) {
        super(props);
        this.state = {
            firstDate: null,
            secondDate: null,
        };
        const {params} = this.props.navigation.state;
        const {goBack} = this.props.navigation;
        this.goBack = goBack;
        this.hasAllDate = params.hasAllDate || false; //是否默认全选
        this.isSingle = params.isSingle;
        this.getDate = params.getDate;
        if(params.firstDate && params.secondDate) {
            this.state.firstDate = params.firstDate;
            this.state.secondDate = params.secondDate;
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                {this.renderHeader()}
                <KBCalendar
                    isSingle={this.isSingle}
                    firstDate={this.state.firstDate}
                    secondDate={this.state.secondDate}
                    getDate={(firstDate, secondDate) => {
                        if (this.isSingle) {

                            this.getDate(firstDate);
                            this.goBack();
                        }else {
                            this.setState({
                                firstDate: firstDate,
                                secondDate: secondDate,
                            })
                        }
                    }}
                />
            </View>
        )
    }


    renderHeader() {
        return (
            <KBHeader
                title={'日期选择'}
                headerStyle={'dark'}
                isLeft={true}
                rightText={this.isSingle ? '' : '确定'}
                rightStyle={{color: colors.text666}}
                touchRight={() => {
                    if (!this.isSingle) {
                        if (this.state.firstDate && this.state.secondDate) {
                            let startDate = null;
                            let endDate = null;
                            if (this.state.firstDate.timestamp > this.state.secondDate.timestamp) {
                                startDate = this.state.secondDate;
                                endDate = this.state.firstDate;
                            }else {
                                startDate = this.state.firstDate;
                                endDate = this.state.secondDate;
                            }
                            this.getDate(startDate, endDate);
                            this.goBack();
                        }else {
                            if (this.hasAllDate) {
                                if (this.state.firstDate) {
                                    this.getDate(this.state.firstDate, null);
                                    this.goBack();
                                    return;
                                }
                                this.getDate(null, null);
                                this.goBack();
                                return;
                            }
                            ToastUtils.showToast('请选择开始或结束时间！');
                        }
                    }
                }}
                {...this.props}
            />
        )
    }
}

export default KBDateScreen;
