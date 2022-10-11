import Amplify from '@aws-amplify/core';
import Auth from "@aws-amplify/auth";
import AWS from 'aws-sdk'

import appConfig from '../config/config';
import { initApiGatewayClient, apiGatewayClientWithCredentials, cognitoIdentityPoolId, cognitoUserPoolId, cognitoRegion } from '../services/api'

Amplify.configure(appConfig);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getApiKey: async () => {
        let user = await Auth.currentAuthenticatedUser();
        let token = user.signInUserSession.idToken.jwtToken;
        
        const params = {
            IdentityPoolId: cognitoIdentityPoolId,
            Logins: {
              [`cognito-idp.${cognitoRegion}.amazonaws.com/${cognitoUserPoolId}`]: token
            }
        }
        AWS.config.credentials = new AWS.CognitoIdentityCredentials(params)
        AWS.config.credentials.refresh(error => {
            if (error) {
                console.error(error)
            }
            console.log(AWS.config.credentials)
            initApiGatewayClient(AWS.config.credentials)

            const promise = apiGatewayClientWithCredentials()
                .then(apiGatewayClient => apiGatewayClient.get('/apikey', {}, {}, {}))
                .then(({ data }) => (console.log(data)))
        })
    },
    
    getToken: async () => {
        let user = await Auth.currentAuthenticatedUser();
        let token = user.signInUserSession.idToken.jwtToken;
        return token;
    },

    getCurrentUser: async () => {
        let user = await Auth.currentAuthenticatedUser();
        user.id = user && user.attributes.sub;
        return user;
    },

    signOut: async () => {
        return Auth.signOut();
    },

    changePassword: async (user, currentPassword, newPassword) => {
        return await Auth.changePassword(user, currentPassword, newPassword);
    },
}

