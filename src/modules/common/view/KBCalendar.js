import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CalendarList, LocaleConfig, Calendar} from 'react-native-calendars';

import theme from '../../../constants/theme';

LocaleConfig.locales['fr'] = {
    monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    today: 'Aujourd\'hui',
};
LocaleConfig.defaultLocale = 'fr';

class KBCalendar extends Component {
    static defaultProps = {

        firstDate: null,
        secondDate: null,
        getDate: function () {

        },
        isSingle: true,
    };

    static propTypes = {
        isSingle: PropTypes.bool,
        getDate: PropTypes.func,

    };


    constructor(props) {
        super(props);

        this.state = {
            firstDate: this.props.firstDate,
            secondDate: this.props.secondDate,
        };
    }

    render() {
        return (
            <CalendarList
                // calendarWidth={theme.screenWidth}
                // calendarHeight={theme.screenHeight}
                theme={{
                    backgroundColor: '#ffffff',
                    calendarBackground: '#ffffff',
                    textSectionTitleColor: '#b6c1cd',
                    selectedDayBackgroundColor: '#00adf5',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#00adf5',
                    dayTextColor: '#2d4150',
                    textDisabledColor: '#d9e1e8',
                    dotColor: '#00adf5',
                    selectedDotColor: '#ffffff',
                    monthTextColor: '#FF2626',
                    textDayFontSize: 15,
                    textMonthFontSize: 17,
                    textDayHeaderFontSize: 15,
                }}
                style={{height: theme.screenHeight, width: theme.screenWidth}}
                scrollEnabled={true}
                showScrollIndicator={true}
                onDayPress={(day) => {
                    if (this.props.isSingle) {
                        this.setState({
                            firstDate: day,
                        }, () => {
                            this.props.getDate(this.state.firstDate);
                        });
                    } else {
                        if (!this.state.firstDate) {
                            this.state.firstDate = day;
                        } else if (!this.state.secondDate) {
                            this.state.secondDate = day;
                        } else {
                            this.state.firstDate = day;
                            this.state.secondDate = null;
                        }
                        //获取开始 结束日期
                        this.props.getDate(this.state.firstDate, this.state.secondDate);
                        this.setState({});
                    }

                }}
                monthFormat={'MM   yyyy'}
                hideArrows={true}
                hideExtraDays={true}
                disableMonthChange={false}
                firstDay={1}
                hideDayNames={false}
                showWeekNumbers={false}
                markedDates={this.props.isSingle ? this.getSingleMarkedStyle() : this.getMarkedStyle()}
                markingType={'period'}
            />
        );
    }

    getSingleMarkedStyle() {
        const markedStyle = {selected: true, startingDay: true, endingDay: true, color: '#91B2FC'};
        if (this.state.firstDate) {
            markedStyle[this.state.firstDate.dateString] = markedStyle;
        }
        return markedStyle;
    }

    getMarkedStyle() {
        const firstStyle = {selected: true, startingDay: true, endingDay: true, color: '#91B2FC'};
        const secondStyle = {selected: true, startingDay: true, endingDay: true, color: '#91B2FC'};
        const containStyle = {selected: true, color: '#91B2FC'};
        let markedStyle = {};
        let diffDates = [];

        if (this.state.firstDate && this.state.secondDate) {

            if (this.state.firstDate.timestamp > this.state.secondDate.timestamp) {
                firstStyle.startingDay = false;
                secondStyle.endingDay = false;

                //获取区间日期
                diffDates = this.getDiffDate(this.state.secondDate.dateString, this.state.firstDate.dateString);

            } else if (this.state.firstDate.timestamp < this.state.secondDate.timestamp) {
                firstStyle.endingDay = false;
                secondStyle.startingDay = false;
                //获取区间日期
                diffDates = this.getDiffDate(this.state.firstDate.dateString, this.state.secondDate.dateString);

            } else {
            }
        }
        //区间日期添加样式
        for (let dateString of diffDates) {
            markedStyle[dateString] = containStyle;
        }

        if (this.state.firstDate) {
            markedStyle[this.state.firstDate.dateString] = firstStyle;
        }
        if (this.state.secondDate) {
            markedStyle[this.state.secondDate.dateString] = secondStyle;
        }
        return markedStyle;
    }

    getDiffDate(start, end) {

        let startTime = this.getDate(start);
        let endTime = this.getDate(end);
        let dateArr = [];

        while ((endTime.getTime() - startTime.getTime()) > 0) {
            let year = startTime.getFullYear();
            let month = startTime.getMonth().toString().length === 1 ? '0' + (parseInt(startTime.getMonth().toString(), 10) + 1) : (startTime.getMonth() + 1);
            let day = startTime.getDate().toString().length === 1 ? '0' + startTime.getDate() : startTime.getDate();
            dateArr.push(year + '-' + month + '-' + day);
            startTime.setDate(startTime.getDate() + 1);
        }

        return dateArr;
    }


    getDate(datestr) {

        let temp = datestr.split('-');
        if (temp[1] === '01') {
            temp[0] = parseInt(temp[0], 10) - 1;
            temp[1] = '12';
        } else {
            temp[1] = parseInt(temp[1], 10) - 1;
        }
        let date = new Date(temp[0], temp[1], temp[2]);

        return date;
    }

}

export default KBCalendar;
