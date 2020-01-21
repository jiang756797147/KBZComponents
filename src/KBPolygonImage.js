import React, {Component} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types'
import theme from "../constants/theme";

import {Svg, Defs, ClipPath, Image, Polygon, Text, Rect, Circle,} from 'react-native-svg';
import CircleImage from "./CircleImage";

export default class KBPolygonImage extends Component {
    length = parseInt(this.props.width) / 2 / 1.75;

    static defaultProps = {
        imageUrl: false,
        width: "55",
        isEditText: false,
        editText: "更换",
    };


    static propTypes = {
        imageUrl: PropTypes.any,
        width: PropTypes.string,
        isEditText: PropTypes.bool,
        editText: PropTypes.string,
    };

    constructor(props) {
        super(props);
    }

    render() {

        let polygonPoint = (parseInt(this.props.width) / 2).toString() + ' 0,'
            + this.props.width.toString() + ' ' + this.length.toString() + ','
            + this.props.width.toString() + ' ' + (this.length * 3).toString() + ','
            + (parseInt(this.props.width) / 2).toString() + ' ' + (this.length * 4).toString() + ','
            + '0 ' + (this.length * 3).toString() + ','
            + '0 ' + this.length.toString();

        return (
            <View>
                <CircleImage
                    imageUrl={this.props.imageUrl}
                    customWidth={parseInt(this.props.width)}
                    customHeight={parseInt(this.props.width)}/>

                <View
                    style={{
                        alignItems: 'center',
                        borderRadius: parseInt(this.props.width) / 2,
                        position: 'absolute',
                        bottom: 0
                    }}>

                    {
                        this.props.isEditText ?

                            <Svg height={this.props.width}
                                 width={this.props.width}>
                                <Defs>
                                    <ClipPath id="clip">
                                        <Circle cx={'50%'} cy={'50%'} r={(parseInt(this.props.width) / 2).toString()}/>
                                    </ClipPath>
                                </Defs>
                                <Rect
                                    x="0%"
                                    y="68%"
                                    width="100%"
                                    height="32%"
                                    fill="black"
                                    opacity="0.5"
                                    clipPath="url(#clip)"
                                />
                                <Text
                                    x={"50%"}
                                    y="90%"
                                    textAnchor="middle"
                                    fontWeight="bold"
                                    fontSize="12"
                                    fill="white"
                                >
                                    {this.props.editText}
                                </Text>
                            </Svg>
                            :
                            null
                    }

                    {/*<Svg
                    height={this.length * 4}
                    width={this.props.width}
                >
                    <Defs>
                        <ClipPath id="clip">
                            <Polygon points={polygonPoint}
                                     fill="lime"
                                     stroke="purple"
                                     strokeWidth="1"/>
                        </ClipPath>
                    </Defs>
                    <Image
                        x="0%"
                        y="0%"
                        width="100%"
                        height="100%"
                        preserveAspectRatio="xMidYMid slice"
                        opacity="1"
                        href={this.props.imageUrl}
                        clipPath="url(#clip)"
                    />


                    {
                        this.props.isEditText ?
                            <Rect
                                x="0%"
                                y="68%"
                                width="100%"
                                height="32%"
                                fill="black"
                                opacity="0.5"
                                clipPath="url(#clip)"
                            />
                            :
                            null
                    }
                    {
                        this.props.isEditText ?
                            <Text
                                x={theme.isAndroid ? "50%" : "30%"}
                                y="85%"
                                textAnchor="middle"
                                fontWeight="bold"
                                fontSize="12"
                                fill="white"
                            >
                                {this.props.editText}
                            </Text>
                            :
                            null
                    }

                </Svg>*/}
                </View>
            </View>
        );
    }
}
