import React, {Component} from 'react';
import {Image, View, Text, StyleSheet} from 'react-native';
import KBButton from './KBButton';
import PropTypes from 'prop-types';
import colors from '../constants/colors';

export default class KBSourceView extends Component {

    data = [
        {name: '德', id: 1},
        {name: '智', id: 2},
        {name: '体', id: 3},
        {name: '美', id: 4},
        {name: '劳', id: 5},
    ];

    static defaultProps = {

        text: '来源:',
        defaultValue: 1,

    };

    static propTypes = {
        text: PropTypes.string,
        style: PropTypes.any,
        textStyle: PropTypes.any,
        itemViewStyle: PropTypes.any,
        itemStyle: PropTypes.any,
        itemsStyle: PropTypes.any,

        defaultValue: PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedId: this.props.defaultValue,
        };
    }

    render() {
        return (
            <View style={[styles.style, this.props.style]}>
                {
                    this.props.text ?
                    <Text style={[{fontSize: 13}, this.props.textStyle]}>{this.props.text}</Text>
                    : null
                }
                <View style={[styles.itemAllStyle, this.props.itemAllStyle]}>
                    {this.data.map(this.renderItem)}
                </View>
            </View>
        );
    }

    renderItem = (item, index) => {
        return (
            <KBButton
                key={index}
                onPress={() => {
                    this.setState({selectedId: this.data[index].id});
                }}
            >
                <View style={[{
                    width: 24,
                    height: 24,
                    alignItems: 'center',
                    justifyContent: 'center',
                }, this.props.itemViewStyle]}>
                    <Image
                        style={[{height: 24, width: 24, position: 'absolute'}, this.props.itemStyle]}
                        resizeMode={'contain'}
                        source={this.data[index].id === this.state.selectedId ? require('../assets/image3.5/source_ok.png') : require('../assets/image3.5/source_no.png')}
                    />
                    <Text style={{fontSize: 14, color: colors.white}}>{item.name}</Text>
                </View>
            </KBButton>

        );
    };

    _getSelectedId = () => {

        return this.state.selectedId;

    };
}

const styles = StyleSheet.create({
    style: {
        flex: 1,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    itemAllStyle: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flex: 1,
    },
});