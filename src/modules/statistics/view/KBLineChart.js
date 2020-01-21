import React, {Component} from 'react';
import {View, StyleSheet, processColor} from 'react-native';
import PropTypes from 'prop-types';
import {LineChart} from 'react-native-charts-wrapper';
import theme from '../../../constants/theme';
import colors from '../../../constants/colors';
import update from 'immutability-helper';

export default class KBLineChart extends Component {

    static defaultProps = {
        bianWidth: theme.screenWidth - 30,
        lineDataOne: [],
        lineDataTwo: [],
        bottomNames: [],
    };

    static propTypes = {
        bianWidth: PropTypes.number,
        lineDataOne: PropTypes.array,
        lineDataTwo: PropTypes.array,
        bottomNames: PropTypes.array,
    };

    constructor(props) {
        super(props);
        this.state = {
            //图表相关数据
            ...this.props,
            data: {
                // $set: {
                //     dataSets: [{
                //         values: this.props.lineDataOne, label: 'A',
                //         config: {
                //             color: processColor('#63ABFB'),
                //             lineWidth: 2,
                //             circleRadius: 5,
                //             circleColor: processColor('#63abfb'),
                //             highlightEnabled: false,
                //             drawFilled: false,
                //             valueTextSize: 14,
                //             valueTextColor: processColor('#63abfb'),
                //             valueFormatter: '####',
                //             drawCubicIntensity: 0.3,
                //             drawCubic: false,
                //         }
                //     }, {
                //         values: this.props.lineDataTwo, label: 'B',
                //         config: {
                //             color: processColor('#FBDB63'),
                //             lineWidth: 2,
                //             circleRadius: 5,
                //             circleColor: processColor('#fbdb63'),
                //             highlightEnabled: false,
                //             drawFilled: false,
                //             valueTextSize: 14,
                //             valueTextColor: processColor('#fbdb63'),
                //             valueFormatter: '####',
                //         }
                //     }],
                // }
            },
            axisLabel: {
                interval: 0,
                rotate: 40,
            },
            xAxis: {
                valueFormatter: this.props.bottomNames,
                labelCount: this.props.bottomNames.length,
                labelRotationAngle: -55,
                granularityEnabled: true,
                granularity: 1,
                drawGridLines: false,
                textColor: processColor('#000'),
                textSize: 12,
                axisLineWidth: 0,
                IsStaggered: true,
                avoidFirstLastClipping: true,
                position: 'BOTTOM',
                yOffset: 0,
                valueFormatterPattern: ''
            },
            yAxis: {
                left: {
                    centerAxisLabels: false,
                    gridLineWidth: 0.5,
                    gridColor: processColor('#E9E9E9'),
                    spaceTop: 0.1,
                    granularityEnabled: true,
                    granularity: 1,
                    drawGridLines: true,
                    textColor: processColor('#FBDB63'),
                    textSize: 14,
                    position:'OUTSIDE_CHART',
                    axisLineWidth: 0,
                },
                right: {
                    centerAxisLabels: false,
                    gridLineWidth: 0.5,
                    gridColor: processColor('#E9E9E9'),
                    enabled: true,
                    spaceTop: 0.1,
                    granularityEnabled: true,
                    granularity: 1,
                    drawGridLines: true,
                    textColor: processColor('#63ABFB'),
                    textSize: 14,
                    position: 'OUTSIDE_CHART',
                    axisLineWidth: 0,
                },
            },

            marker: {
                enabled: true,
                markerColor: processColor(colors.reduceColor),
                textColor: processColor('#63ABFB'),
                markerFontSize: 18,
            },

            legend: {
                enabled: false,
                textColor: processColor('yellow'),
                textSize: 12,
                form: 'SQUARE',
                formSize: 14,
                xEntrySpace: 30,
                yEntrySpace: 50,
                formToTextSpace: 5,
                wordWrapEnabled: true,
                maxSizePercent: 0.5,
                custom: {
                    colors: [processColor('red'), processColor('red')],
                    labels: ['A', 'B'],
                },
            },
        };
    }


    componentDidMount() {
        this.updateData(this.props.lineDataOne, this.props.lineDataTwo);
    }

    updateData(oneData, twoData) {
        console.log('a ===================', oneData);
        this.setState(update(this.state, {
            data: {
                $set: {
                    dataSets: [{
                        values: oneData,
                        label: 'A',
                        config: {
                            color: processColor('#63ABFB'),
                            lineWidth: 1,
                            circleRadius: 3,
                            circleColor: processColor('#63abfb'),
                            highlightEnabled: false,
                            drawFilled: false,
                            valueTextSize: 14,
                            valueTextColor: processColor('#63abfb'),
                            valueFormatter: '####',
                            drawCubicIntensity: 0.1,
                            drawCubic: false,
                        },
                    }, {
                        values: twoData,
                        label: 'B',
                        config: {
                            color: processColor('#FBDB63'),
                            lineWidth: 1,
                            circleRadius: 3,
                            circleColor: processColor('#fbdb63'),
                            highlightEnabled: false,
                            drawFilled: false,
                            valueTextSize: 14,
                            valueTextColor: processColor('#fbdb63'),
                            valueFormatter: '####',
                        },
                    }],
                },
            },
        }));
        this.setState({
            isLoading: false,
        });
    }


    render() {
        return (

            <View style={{
                width: this.props.bianWidth,
                height: theme.screenHeight / 4 + 30,
                backgroundColor: '#fff',
            }}>
                <LineChart style={styles.chart}
                           data={this.state.data}
                           chartDescription={{text: ''}}
                           marker={this.state.marker}
                           xAxis={this.state.xAxis}
                           yAxis={this.state.yAxis}
                           drawGridBackground={false}
                           legend={this.state.legend}
                           borderWidth={0}
                           borderColor={processColor('red')}
                           drawBorders={false}
                           animation={{
                               durationX: 800,
                               durationY: 800,
                               // easingX: "easeInOutSine",
                               // easingY: "easeInOutQuart",
                           }}
                           touchEnabled={false}
                           dragEnabled={false}
                           autoScaleMinMaxEnabled={false}
                           scaleXEnabled={false}
                           pinchZoom={false}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
    chart: {
        flex: 1,
    },
});