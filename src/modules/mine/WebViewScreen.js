import React, {Component} from 'react';
import {Container, Content} from 'native-base';
import {StyleSheet} from 'react-native';
import WebView from 'react-native-webview';
import theme from '../../constants/theme';
import colors from '../../constants/colors';
import KBHeader from '../../components/KBHeader';
import BaseScreen from '../../base/BaseScreen';


export default class WebViewScreen extends BaseScreen {

    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.url = params.params.url;
        this.title = params.params.title;
        this.state = {
            status: 'No Page Loaded',
            backButtonEnabled: false,
            forwardButtonEnabled: false,
            loading: true,
            scalesPageToFit: true,
        };
    }

    render() {
        let renderView = super.render();
        return (
            <Container style={[{
                paddingBottom: theme.defaultPaddingBottom,
                backgroundColor: colors.white,
            }]}>
                <KBHeader {...this.props} isLeft={true} title={this.title}/>
                {renderView}
            </Container>

        );
    }

    renderData() {
        return (
            <WebView
                automaticallyAdjustContentInsets={false}
                style={this.styles.webView}
                source={{uri: this.url}}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                decelerationRate="normal"
                onNavigationStateChange={this.onNavigationStateChange}
                onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                startInLoadingState={true}
                scalesPageToFit={this.state.scalesPageToFit}
            />
        );
    }

    styles = StyleSheet.create({
        webView: {
            backgroundColor: '#ffffff',
            height: theme.defaultContent,
        },
    });
}
