import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { AmplifyAuthenticator, AmplifySignIn, AmplifySignInButton, AmplifyRequireNewPassword, AmplifyForgotPassword } from "@aws-amplify/ui-react";
import Amplify, { urlSafeDecode } from '@aws-amplify/core';
import Auth from "../auth/smart-product";

import routes from "../routes";

import appConfig from '../config/config';

Amplify.configure(appConfig);

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signed_in: false
        };
    }

    handleAuthStateChange = (nextState, authState) => {
        if (nextState === 'signedin') {
            this.setState({ signed_in: true });
        }
    };

    // Gets API token
    getToken = async () => {
        let token = await Auth.getToken();
        return token;
    };

    getRoutes = routes => {
        return routes.map((prop, key) => {
            if (prop.layout === "/admin") {
                return (
                    <Route
                        path={prop.path}
                        render={props => (
                            <prop.component
                                {...props}
                                getToken={this.getToken}
                            />
                        )}
                        exact
                        key={key}
                    />
                );
            } else {
                return null;
            }
        });
    };
    componentDidMount() {
        const that = this;
        Auth.getCurrentUser().then(user => {
            that.setState({
                userInfo: user,
                signed_in: true
            })
        });
    }

    render() {
        const { signed_in } = this.state;
        return (
            <AmplifyAuthenticator
                handleAuthStateChange={this.handleAuthStateChange}
            >
            <div slot="sign-in" ref="background-container" className="lsr-login-background-main">
                <AmplifySignIn
                    headerText="Sign in to MioConnect"
                    slot="sign-in"
                    hideSignUp
                ></AmplifySignIn>
            </div>
                <div id="main-panel" ref="mainPanel">

                        {this.getRoutes(routes)}
                        {
                            signed_in &&
                            <>
                                <Redirect to="/index" />
                            </>
                        }
                </div>
            </AmplifyAuthenticator>
        );
    }
}

export default Admin;
