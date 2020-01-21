import React, {Component} from 'react';
import {View, StyleSheet, Image, Text, Animated} from 'react-native';
import PropTypes from 'prop-types';

import colors from '../constants/colors';
import image from '../constants/image';
import Utils from '../utils/Utils';


export default class KBHeadImage extends Component {

    static defaultProps = {
        length: 60,
        starLength: 20,
        borderWidth: 0,
        borderColor: colors.trans,
        imageUrl: '',
        customStyle: null,
        grade: 0,

        starNumbers: [
            {number: '0'},
            {number: '1'},
            {number: '2'},
            {number: '3'},
        ],
        hasGrade: true,
    };

    static propTypes = {
        length: PropTypes.number,
        starLength: PropTypes.number,
        borderWidth: PropTypes.number,
        borderColor: PropTypes.string,
        imageUrl: PropTypes.any,
        customStyle: PropTypes.any,
        grade: PropTypes.number,
        starNumbers: PropTypes.array,

        Viewfade: PropTypes.any,
        Textfade: PropTypes.any,
        TextAnimate: PropTypes.any,
        TextName: PropTypes.string,

        hasGrade: PropTypes.bool,
    };

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <View style={{paddingTop: 20}}>
                <View
                    style={{
                        width: this.props.length,
                        height: this.props.length,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Image
                        style={{
                            width: this.props.length,
                            height: this.props.length,
                            borderRadius: this.props.length / 2,
                            borderColor: this.props.borderColor,
                            borderWidth: this.props.borderWidth,
                        }}
                        source={this.props.imageUrl}
                    />

                    <Animated.View style={{
                        width: this.props.length,
                        height: this.props.length,
                        borderRadius: this.props.length / 2,
                        borderColor: this.props.borderColor,
                        borderWidth: this.props.borderWidth,
                        backgroundColor: colors.black,
                        position: 'absolute',
                        // top: 10,
                        opacity: Utils.isNull(this.props.Viewfade) ? 0 : this.props.Viewfade,
                    }}/>

                    <Animated.Text style={{
                        color: colors.yellowColor,
                        fontSize: 13,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        position: 'absolute',
                        bottom: this.props.TextAnimate,
                        minWidth: this.props.length,
                        opacity: this.props.Textfade,
                    }}>
                        {Utils.isNull(this.props.TextName) ? '' : this.props.TextName}
                    </Animated.Text>


                    {this.props.hasGrade ? this.props.starNumbers.map((item, index) => this.renderStarView(item, index)) : null}
                </View>
            </View>
        );
    }

    // componentDidUpdate() {
    //     this.leftAnimate.start();
    // }

    renderStarView(item, index) {
        //判断等级
        let grade = this.props.grade;
        let crownNumber = parseInt(grade / 64);
        let sunNumber = parseInt(grade / 16);
        let moonNumber = parseInt(grade / 4);
        let starNumber = grade;

        let icon;
        if (crownNumber > 0) {
            icon = crownNumber > index ? image.gradeCrownS : image.gradeCrownD;
        } else if (sunNumber > 0) {
            icon = sunNumber > index ? image.gradeSunS : image.gradeSunD;
        } else if (moonNumber > 0) {
            icon = moonNumber > index ? image.gradeMoonS : image.gradeMoonD;
        } else {
            icon = starNumber > index ? image.gradeStarS : image.gradeStarD;
        }

        //圆心坐标
        let centerX = this.props.length / 2;
        let centerY = this.props.length / 2;
        //半径
        let radius = this.props.length / 2;
        //起始位置
        let num = 3.5;
        //每一个star对应的角度;
        let avd = 360 / 10;
        //每一个star对应的弧度;
        let ahd = avd * Math.PI / 180;

        let left = Math.sin(-ahd * (index + num)) * radius + centerX - this.props.starLength * 0.5;
        let top = Math.cos(ahd * (index + num)) * radius + centerY - this.props.starLength * 0.6;
        // let left = Math.sin(-ahd * (index + num)) * radius + centerX - (index < 2? this.props.starLength * 0.6 : this.props.starLength * 0.4);
        // let top = Math.cos(ahd * (index + num)) * radius + centerY - (index == 0 || index == 3? this.props.starLength * 0.6 : this.props.starLength * 0.7);

        // let rotate = ( avd * (index + num) + 180).toString() + 'deg';
        // let rotate = '0' + 'deg';
        // console.log('jhjjjjjjjjjj', rotate);
        return (
            <Image
                key={index}
                style={{
                    position: 'absolute',
                    width: this.props.starLength,
                    height: this.props.starLength,
                    backgroundColor: colors.trans,
                    left: left,
                    top: top,
                    // transform: [{rotateZ: rotate}],
                }}
                source={icon}
            />
        );
    };
}


