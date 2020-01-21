import React, {Component} from 'react'
import moment from "moment"

class TimeUtils extends Component {

    /**
     * date转时间戳 已秒为单位
     * @param date  日期
     * @returns {string}
     */
    static getTimeByDateAsS(date) {
        return moment(date).format('X').toString();
    }

    /**
     * date转时间戳 已毫秒为单位
     * @param date  日期
     * @returns {string}
     */
    static getTimeByDateAsM(date) {
        return moment(date).format('x').toString();
    }

    /**
     * 时间戳转日期 带中文精确到日
     * @param mill  已秒为单位的时间戳
     * @returns {string}
     */
    static getTimeWithDayC(mill) {
        return moment.unix(parseInt(mill)).utcOffset(8).format('YYYY年MM月DD日');
    }

    /**
     * 时间戳转日期 带横杠精确到日
     * @param mill  已秒为单位的时间戳
     * @returns {string}
     */
    static getTimeWithDay(mill) {
        return moment.unix(parseInt(mill)).utcOffset(8).format('YYYY-MM-DD');
    }
    static getTimeWithMonth(mill) {
        return moment.unix(parseInt(mill)).utcOffset(8).format('YYYY-MM');
    }

    /**
     * 时间戳转日期 精确到分
     * @param mill  已秒为单位的时间戳
     * @returns {string}
     */
    static getTimeWithMinute(mill) {
        return moment.unix(parseInt(mill)).utcOffset(8).format('YYYY.MM.DD HH:mm');
    }

    static getTimeWithMinute1(mill) {
        return moment.unix(parseInt(mill)).utcOffset(8).format('YYYY-MM-DD HH:mm');
    }

    /**
     * 时间戳转日期 精确到分
     * @param mill  已秒为单位的时间戳
     * @returns {string}
     */
    static getTimeWithHourMinute(mill) {
        return moment.unix(parseInt(mill)).utcOffset(8).format('HH:mm');
    }

    /**
     * 时间戳转日期 带斜杠不带年份精确到日
     * @param mill  已秒为单位的时间戳
     * @returns {string}
     */
    static getTimeWithDayS(mill) {
        return moment.unix(parseInt(mill)).utcOffset(8).format('MM/DD');
    }

    /**
     * 时间戳转日期
     * @param mill  已秒为单位的时间戳
     * @returns {string}
     */
    static getTimeWithDayWithYear(mill) {
        return moment.unix(parseInt(mill)).utcOffset(8).format('YY/MM/DD');
    }

    /**
     * 时间戳转日期 带横杠没有年份精确到日
     * @param mill  已秒为单位的时间戳
     * @returns {string}
     */
    static getTimeWithoutYear(mill) {
        return moment.unix(parseInt(mill)).utcOffset(8).format('MM-DD');
    }

    /**
     * 时间戳转日期 没有年份精确到分
     * @param mill  已秒为单位的时间戳
     * @returns {string}
     */
    static getTimeWithoutYearToM(mill) {
        return moment.unix(parseInt(mill)).utcOffset(8).format('MM.DD HH:mm');
    }
    static getTimeWithoutYearToM1(mill) {
        return moment.unix(parseInt(mill)).utcOffset(8).format('MM-DD HH:mm');
    }

    /**
     *  时间戳转日期 精确到秒
     * @param mill  已秒为单位的时间戳
     * @returns {string}
     */
    static getTimeWithSecond(mill) {
        return moment.unix(parseInt(mill)).utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
    }

    /**
     * 时间戳转星期
     * @param mill  已秒为单位的时间戳
     * @returns {string}
     */
    static getWeekWithChina(mill) {
        return moment.unix(parseInt(mill)).utcOffset(8).format('dddd');
    }

    /**
     * 时间戳转自定义格式
     * @param mill      已秒为单位的时间戳
     * @param format    自定义格式
     * @returns {string}
     */
    static getTimeCusForm(mill, format) {
        return moment.unix(parseInt(mill)).utcOffset(8).format(format);
    }

    /**
     * 秒转分 0'10"
     * @param mill      秒数
     * @returns {string}
     */
    static getSecondForm(mill) {
        let second = mill % 60;
        let min = mill / 60;
        return parseInt(min) + " ' " + second + ' " ';
    }

    /**
     * 秒转分 00:10
     * @param mill      秒数
     * @returns {string}
     */
    static getSecondForm1(mill) {
        return moment().startOf('day').seconds(mill).format('mm:ss');
    }

    /**
     * 获取消息时间样式
     * @param timeStamp
     * @returns {*}
     */
    static getMessageTime(timeStamp) {
        let todayStart = moment().startOf('day').format('X');
        let todayEnd = moment().endOf('day').format('X');
        let yesterdayTimeStamp = moment().subtract(1, 'days').format('YYYY-MM-DD');
        let yesterdayStart = moment(yesterdayTimeStamp).startOf('day').format('X');
        let yesterdayEnd = moment(yesterdayTimeStamp).endOf('day').format('X');
        const yearStart = moment().year(moment().year()).startOf('year').format('X');
        const yearEnd = moment().year(moment().year()).endOf('year').format('X');

        if (timeStamp >= todayStart && timeStamp <= todayEnd) {
            return `今天${TimeUtils.getTimeWithHourMinute(timeStamp)}`;
        }else if (timeStamp >= yesterdayStart && timeStamp <= yesterdayEnd){
            return `昨天${TimeUtils.getTimeWithHourMinute(timeStamp)}`;
        }else if (timeStamp >= yearStart && timeStamp <= yearEnd) {
            return moment.unix(parseInt(timeStamp)).utcOffset(8).format('MM-DD HH:mm');
        }else {
            return TimeUtils.getTimeWithMinute1(timeStamp);
        }
    };


    /**
     * 当前时间转 上午/下午/晚上/凌晨
     * @param hour当前时间
     * @returns {string}
     */
    static getTimeFormat(hour) {
        let mOrAOrY='';
        if (hour < 12) {
            mOrAOrY = '上午';
        } else if (hour >= 12 && hour <= 13) {
            mOrAOrY = '中午';
        } else if (hour > 13 && hour <= 18) {
            mOrAOrY = '下午';
        } else if (hour > 18 && hour <= 23) {
            mOrAOrY = '晚上';
        } else {
            mOrAOrY = '凌晨';
        }
        return mOrAOrY;
    }


}

export default TimeUtils;
