import React, {Component} from 'react';
import {Image, View, Text, StyleSheet} from "react-native";
import {Button} from 'native-base'
import StatisticsClassHolder from "../holder/StatisticsClassHolder";
import PropTypes from "prop-types";
import colors from "../../../constants/colors";

export default class StatisticsListView extends Component {

    static defaultProps = {
        data: [],
        click: false,
        isStudent: false,
    }

    static propTypes = {
        data: PropTypes.array,
        nameStr: PropTypes.string,
        click: PropTypes.bool,
        isStudent: PropTypes.bool,
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{marginTop: 10, backgroundColor: colors.white}}>
                {this.props.data.map((item, index, i) => {
                    return (
                        <Button style={{marginBottom: 10}} transparent key={index} onPress={() => {
                            this.props.click ?
                                this.props.navigation.navigate('StudentStatistics', {
                                    classItem: item,
                                    allClass: this.props.data
                                }) : null;
                        }}>
                            <StatisticsClassHolder isStudent={this.props.isStudent} showMore={this.props.click}
                                                   itemData={item} itemIndex={index + 1}/>
                        </Button>
                    )
                })}
            </View>
        )
    }

}