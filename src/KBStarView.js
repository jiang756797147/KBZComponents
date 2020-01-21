import React, {Component} from "react"
import PropTypes from "prop-types";
import {View, Image} from "react-native"

import KBButton from '../components/KBButton';


class KBStarView extends Component {

    data = ['0', '1', '2', '3', '4'];

    static defaultProps = {
        number: 0,
        isPress: false,
    };

    static propTypes = {
        style: PropTypes.any,
        starViewStyle: PropTypes.any,
        starStyle: PropTypes.any,
        number: PropTypes.number,
        isPress: PropTypes.bool,
        starNumbers: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            number: this.props.number,
        }
    }

    render() {
        return (
            <View style={[{flexDirection: 'row', alignItems: 'center'}, this.props.style]}>
                {this.data.map(this.renderStarItem)}
            </View>
        )
    }

    renderStarItem = (item, index) => {
        return (
            <KBButton
                key={index}
                onPress={() => {
                    if (this.props.isPress){
                        this.props.starNumbers(index + 1);
                        this.setState({
                            number: index + 1,
                        })
                    }
                }}
            >
                <View style={[{padding: 5},this.props.starViewStyle]}>
                    <Image
                        style={[{height: 16, width: 16}, this.props.starStyle]}
                        resizeMode={'contain'}
                        source={index < this.state.number? require('../assets/message/starsSolid.png') : require('../assets/message/starsEmpty.png')}
                    />
                </View>
            </KBButton>

        );
    };
}

export default KBStarView;
