import React, {Component}from 'react';
import {
    View,
    Text,
    StyleSheet,
}from 'react-native';
import lodash from 'lodash';
import PropTypes from "prop-types";
import KBButton from "./KBButton";

import colors from '../constants/colors';

export default class KBText extends Component {

    static propTypes = {
        style: Text.propTypes.style,
        defaultLength: PropTypes.number,   //显示最大长度
    };
    static defaultProps = {
        defaultLength: 48,
    };
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            content: '',
            maxHeight: null,
            opacity: 0,
            isExtand: false,
            isExist: true, //是否存在显示全文的按钮
        };
        this.localText = '';
    }

    UNSAFE_componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        if (this.localText !== nextProps.children) {
            this.state.isExist = this.props.children.length > this.props.defaultLength;
            if (this.props.children.length > this.props.defaultLength) {
                this.text = this.props.children.slice(0, this.props.defaultLength) + '...';
                this.state.content = this.text;
            }else {
                this.state.content = this.props.children;
            }
            this.setState({})
        }
    }


    UNSAFE_componentWillMount(): void {

        this.localText = this.props.children;
        this.state.isExist = this.props.children.length > this.props.defaultLength ? true : false;
        if (this.props.children.length > this.props.defaultLength) {
            this.text = this.props.children.slice(0, this.props.defaultLength) + '...';
            this.state.content = this.text;
        }else {
            this.state.content = this.props.children;
        }
    }

    render() {
        return (
            <View>
                <Text style={[styles.text,this.props.style]}>
                    {this.state.content}
                </Text>
                {
                    this.state.isExist?
                        <KBButton
                            onPress={() => {
                                this.state.isExtand = !this.state.isExtand;
                                this.setState({
                                    content: this.state.isExtand ? this.props.children : this.text,
                                })
                            }}
                        >
                            <View style={{marginTop: 10}}>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        color: colors.toolBar,
                                    }}
                                >
                                    {this.state.isExtand? "收起" : "全文"}
                                </Text>
                            </View>
                        </KBButton>
                        :
                        null
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    text: {
        color: colors.text888,
        lineHeight: 20,
    }
});