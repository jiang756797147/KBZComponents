import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import PropTypes from 'prop-types'
import Search from './Search';
import colors from "../../constants/colors";


export default class KBSearch extends Component {

    static defaultProps = {
        onSearch: function () {

        },

        cancelTitle: '取消',
        placeholder: '搜索',
        backgroundColor: '#ffffff',
        inputBackgroundColor: '#f7f7f7',
        inputHeight: 30,
        borderRadius: 15,
    };

    static propTypes = {
        viewStyle: PropTypes.any,
        inputStyle: PropTypes.any,
        cancelButtonTextStyle: Text.propTypes.style,

        onSearch: PropTypes.func,

        cancelTitle: PropTypes.string,
        placeholder: PropTypes.string,
        backgroundColor: PropTypes.string,
        inputBackgroundColor: PropTypes.string,

        searchIconCollapsedMargin: PropTypes.number,
        placeholderCollapsedMargin: PropTypes.number,
        inputHeight: PropTypes.number,
        borderRadius: PropTypes.number,

    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[{
                height: this.props.inputHeight + 5,
                paddingHorizontal: 5,
                justifyContent: 'center',
                backgroundColor: this.props.backgroundColor,
                borderRadius: this.props.borderRadius,
            }, this.props.viewStyle]}>
                <Search
                    ref="search_box"
                    inputStyle={[{
                        borderRadius: this.props.inputHeight / 2,
                        backgroundColor: this.props.backgroundColor
                    }, this.props.inputStyle]}
                    inputHeight={this.props.inputHeight}
                    containerHeight={this.props.inputHeight}
                    backgroundColor={this.props.backgroundColor}
                    placeholderTextColor={'#888'}
                    titleCancelColor={'#999999'}
                    cancelTitle={this.props.cancelTitle}
                    cancelButtonTextStyle={this.props.cancelButtonTextStyle}
                    placeholder={this.props.placeholder}
                    tintColorSearch={'#333333'}
                    searchIconCollapsedMargin={this.props.searchIconCollapsedMargin}
                    placeholderCollapsedMargin={this.props.placeholderCollapsedMargin}
                    blurOnSubmit={true}
                    onFocus={this.onFocus}
                    onCancel={this.onCancel}
                    onChangeText={this.onChangeText}
                    onSearch={this.onSearch}
                />
            </View>

        );
    }

    // 搜索框点击事件
    // Important: You must return a Promise
    //获取焦点
    onFocus = (text) => {
        text = text.replace(/\s+/g, "");//去除空格 将空格设为""
        // this.props.onSearch(text);

        return new Promise((resolve, reject) => {
            resolve();
        });
    };
    //取消
    onCancel = () => {
        // this.props.onSearch('');

        return new Promise((resolve, reject) => {
            resolve();
        });
    };
    //搜索
    onSearch = (text) => {
        text = text.replace(/\s+/g, "");//去除空格 将空格设为""
        this.props.onSearch(text);

        return new Promise((resolve, reject) => {
            resolve();
        });
    };

    //输入内容
    onChangeText = (text) => {
        text = text.replace(/\s+/g, "");//去除空格 将空格设为""
        // this.props.onSearch(text);

        return new Promise((resolve, reject) => {
            resolve();
        });
    };
}
