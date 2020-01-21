import React, {Component} from 'react';
import {View, Text, PanResponder} from 'react-native';
import PropTypes from 'prop-types';
import colors from "../../../constants/colors";

class LetterPicker extends Component {

    render() {
        return (
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: this.props.item.isTouching ? colors.yellowColor : 'transparent',
            }}>
                <Text style={{fontSize: 13, color: this.props.item.isTouching ? colors.white : colors.text999}}>
                    {this.props.item.letter}
                </Text>
            </View>
        );
    }
}

let Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
export default class AlphabetPicker extends Component {
    static defaultProps = {
        topMargin: 0,
    };

    static propTypes = {
        topMargin: PropTypes.number,
    };

    constructor(props, context) {
        super(props, context);
        if (props.alphabet) {
            Alphabet = props.alphabet;
        }
        this.state = {
            alphabet: Alphabet,
        };
    }

    UNSAFE_componentWillMount(): void {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (e, gestureState) => {
                this.props.onTouchStart && this.props.onTouchStart();

                // this.tapTimeout = setTimeout(() => {
                this._onTouchLetter(this._findTouchedLetter(gestureState.y0), this._findTouchedLetterTop(gestureState.y0));
                // }, 100);
            },
            onPanResponderMove: (evt, gestureState) => {
                console.log("144444444444444444",);
                clearTimeout(this.tapTimeout);
                this._onTouchLetter(this._findTouchedLetter(gestureState.moveY), this._findTouchedLetterTop(gestureState.moveY));
            },
            onPanResponderTerminate: this._onPanResponderEnd.bind(this),
            onPanResponderRelease: this._onPanResponderEnd.bind(this),
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        if (this.props.alphabet !== nextProps.alphabet) {
            this.setState({alphabet: nextProps.alphabet})
        }
    }

    _onTouchLetter(letter, top) {
        letter && this.props.onTouchLetter && this.props.onTouchLetter(letter, top);
    }

    _onPanResponderEnd() {
        requestAnimationFrame(() => {
            // for (let letterItem of this.state.alphabet) {
            //     letterItem.isTouching = false;
            // }
            // this.setState({});
            this.props.onTouchEnd && this.props.onTouchEnd();
        });
    }

    _findTouchedLetter(y) {
        const {alphabet} = this.state;
        let top = y - this.absContainerTop - this.props.topMargin;

        // console.log("1111111111", 'alphabet:' + alphabet.length + "-------absContainerTop:" + this.absContainerTop + "------" + 'top:' + top + '---------' + 'y:' + y + '------------' + 'containerHeight:' + this.containerHeight + '---------' + 'index:' + Math.round((top / this.containerHeight) * alphabet.length));
        // console.log('22222222222', parseInt(top / (this.containerHeight / alphabet.length)));

        let letterIndex = 0;
        if (top >= 0 && top <= this.containerHeight) {
            // return alphabet[Math.round((top / this.containerHeight) * alphabet.length)]
            letterIndex = parseInt(top / (this.containerHeight / alphabet.length));
        } else if (top < 0) {
            letterIndex = 0;
        } else if (top > this.containerHeight) {
            letterIndex = alphabet.length - 1;
        }
        // if (letterIndex < alphabet.length && letterIndex >= 0) {
        //     if (!alphabet[letterIndex].isTouching) {
        //         for (let letterItem of alphabet) {
        //             letterItem.isTouching = letterItem.letter === alphabet[letterIndex].letter;
        //         }
        //     }
        //     this.setState({});
        // }
        return alphabet[letterIndex]
    }

    _findTouchedLetterTop(y) {
        const {alphabet} = this.state;
        let top = y - this.absContainerTop - this.props.topMargin;
        if (top >= 0 && top <= this.containerHeight) {
            // return alphabet[Math.round((top / this.containerHeight) * alphabet.length)]
            return y - this.props.topMargin
        } else if (top < 0) {
            return this.absContainerTop
        } else if (top > this.containerHeight) {
            return this.absContainerTop + this.containerHeight
        }
    }

    _onLayout(event) {
        console.log('1111', event.nativeEvent);
        let {x, y, width, height} = event.nativeEvent.layout;
        this.absContainerTop = y;
        this.containerHeight = height;
    }

    render() {
        const {alphabet} = this.state;
        this._letters = (
            alphabet.map((item, index) => <LetterPicker item={item} key={index}/>)
        );

        return (
            <View
                ref='alphabetContainer'
                {...this._panResponder.panHandlers}
                onLayout={this._onLayout.bind(this)}
                style={{paddingHorizontal: 5, backgroundColor: 'transparent', borderRadius: 1, justifyContent: 'center'}}>
                <View>
                    {this._letters}
                </View>
            </View>
        );
    }

}
