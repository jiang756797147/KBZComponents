import React, {Component} from 'react';
import {Image, View, Text, StyleSheet, processColor} from 'react-native';
import PropTypes from 'prop-types';
import colors from '../../../constants/colors';
import {RadarChart} from 'react-native-charts-wrapper';
import theme from '../../../constants/theme';

export default class KBRadarChart extends Component {


    static defaultProps = {
        edgeWidth: 0,
        firstData: [],
        secondData: [],
        titleArray: ['德', '智', '体', '美', '劳'],
    };

    static propTypes = {
        edgeWidth: PropTypes.number,
        firstData: PropTypes.array,
        secondData: PropTypes.array,
        titleArray: PropTypes.array,
    };

    constructor(props) {
        super(props);
    }


    render() {

        return (
            <View style={{
                width: theme.screenWidth - this.props.edgeWidth * 2,
                height: theme.screenWidth - 10,
                marginTop: 10,
                backgroundColor: '#fff',
            }}>
                <RadarChart
                    style={styles.chart}
                    data={{
                        dataSets: [{
                            values: this.props.firstData,
                            label: 'ds1',
                            config: {
                                drawValues: false,
                                highlightEnabled: false,
                                valueTextSize: 17,
                                valueTextColor: processColor('#63abfb'),
                                valueFormatter: '####',
                                color: processColor('#63abfb'),
                                drawFilled: true,
                                fillColor: processColor('#63abfb'),
                                fillAlpha: 150,
                                lineWidth: 2,
                                circleRadius: 3,
                                circleColor: processColor('#63abfb'),
                            },
                        }, {
                            values: this.props.secondData,
                            label: 'DS 2',
                            config: {
                                highlightEnabled: false,
                                valueTextSize: 14,
                                valueTextColor: processColor('#F0AA2F'),
                                valueFormatter: '####',
                                color: processColor('#FBDB63'),
                                drawFilled: true,
                                fillColor: processColor('#FBDB63'),
                                fillAlpha: 150,
                                lineWidth: 2,
                                circleRadius: 3,
                                circleColor: processColor('#fbdb63'),
                                drawValues: false,
                            },
                        }],
                    }}
                    xAxis={{
                        textColor: processColor(colors.text21),
                        textSize: 14,
                        valueFormatter: this.props.titleArray,
                    }}
                    yAxis={{
                        spaceTop: 0,
                        drawLabels: false,
                        centerAxisLabels: true,
                    }}
                    chartDescription={{text: ''}}
                    drawWeb={true}
                    legend={{
                        enabled: false,
                    }}

                    webLineWidth={1}
                    webLineWidthInner={1}
                    webAlpha={theme.isAndroid ? 20 : 0.2}
                    webColor={processColor(colors.text999)}
                    webColorInner={processColor(colors.text999)}
                    // chartBackgroundColor={processColor(colors.text999)}
                />
            </View>
        );

    }

}

const styles = StyleSheet.create({
    container: {
        width: theme.screenWidth - 16,
        marginHorizontal: 8,
        height: theme.screenHeight / 3,
        backgroundColor: '#fff',
    },
    chart: {
        flex: 1,
    },
    radarContainer: {},
});