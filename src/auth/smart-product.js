import Amplify from '@aws-amplify/core';
import Auth from "@aws-amplify/auth";

import appConfig from '../config/config';

Amplify.configure(appConfig);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
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

