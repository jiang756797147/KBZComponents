import React, {Component} from "react"
import PropTypes from "prop-types";
import {ScrollView, RefreshControl} from "react-native"

import colors from "../constants/colors";

class KBScrollView extends Component {
    static defaultProps = {
        isRefreshControl: false
    };

    static propTypes = {
        children: PropTypes.any,
        isRefreshControl: PropTypes.bool,
        isRefreshing: PropTypes.bool,
        onRefresh: PropTypes.any,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    this.props.isRefreshControl ?
                        <RefreshControl
                            refreshing={this.props.isRefreshing}
                            onRefresh={this.props.onRefresh}
                            tintColor={colors.text888}
                            title="正在刷新"
                            titleColor={colors.text888}
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                        />
                        : null}
                {...this.props}
            >
                {this.props.children}
            </ScrollView>
        )
    }
}

export default KBScrollView;
