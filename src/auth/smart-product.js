import Amplify from '@aws-amplify/core';
import Auth from "@aws-amplify/auth";
import AWS from 'aws-sdk'

import appConfig from '../config/config';
import { initApiGatewayClient, apiGatewayClientWithCredentials, cognitoIdentityPoolId, cognitoUserPoolId, cognitoRegion } from '../services/api'
import * as jwtDecode from 'jwt-decode'

Amplify.configure(appConfig);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getApiKey: async () => {
        let diff = 0
        let apiKey = null
        let user = await Auth.currentAuthenticatedUser();
        let token = user.signInUserSession.idToken.jwtToken;

        try {
            if (token) diff = await jwtDecode(token).exp * 1000 - Date.now()
        } catch (error) {
            console.error(error)
        }
        if(diff > 0){
            const preferredRole = await jwtDecode(token)['cognito:preferred_role']
            const params = {
                IdentityPoolId: cognitoIdentityPoolId,
                Logins: {
                [`cognito-idp.${cognitoRegion}.amazonaws.com/${cognitoUserPoolId}`]: token
                }
            }
            if (preferredRole) params.RoleArn = preferredRole
            AWS.config.credentials = await new AWS.CognitoIdentityCredentials(params)
            const res = await AWS.config.credentials.refresh( async (error) => {
                if (error) {
                    console.error(error)
                }
                await initApiGatewayClient(AWS.config.credentials)

                const res = await apiGatewayClientWithCredentials()
                    .then(apiGatewayClient => apiGatewayClient.get('/apikey', {}, {}, {}))
                console.log(res.data.value)
                apiKey = res.data.value
            })

            console.error(res)
            await initApiGatewayClient(AWS.config.credentials)

            const keyRes = await apiGatewayClientWithCredentials()
                .then(apiGatewayClient => apiGatewayClient.get('/apikey', {}, {}, {}))
            console.log(keyRes.data.value)
            apiKey = keyRes.data.value
        }
        return apiKey
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

