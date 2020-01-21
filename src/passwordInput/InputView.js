import React, {PureComponent} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

class InputView extends PureComponent {

    static defaultProps = {
        length: 6,
        borderColor: '#C7C7C7',
        index: 0,
    };

    text = '●';

    renderItem() {
        const {index, length, borderColor, strs} = this.props;
        let items = [];
        for (let i = 0; i < length; i++) {
            let borderRightWidth = 1;
            // if (i === length - 1) borderRightWidth = 0;
            items.push(
                <View key={i} style={[styles.itemView, {marginLeft: i === 0 ? 0 : 15}, {
                    borderWidth: borderRightWidth,
                    borderColor: borderColor,
                }]}>
                    {/*<Text style={[styles.text, this.props.textStyle]}>{index > i ? this.text : ''}</Text>*/}
                    <Text style={[styles.text, this.props.textStyle]}>{index > i ? strs[i] : ''}</Text>
                </View>,
            );
        }
        return items;
    }

    render() {
        const {style, length, borderColor} = this.props;
        return (
            // borderWidth: 0.5, borderColor: borderColor
            <View style={[styles.inputView, {width: length * 37 + (length - 1) * 15}]}>
                {this.renderItem()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    inputView: {
        flexDirection: 'row',
        height: 40,
        backgroundColor: '#FFFFFF',
    },
    itemView: {
        width: 37,
        height: 37,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FCFBF9',
    },
    text: {
        fontSize: 15,
        color: '#333333',
    },
});

export default InputView;