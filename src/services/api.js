// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import AWS from 'aws-sdk'

import appConfig from '../config/config';

export const awsRegion = appConfig.aws_project_region
export const cognitoRegion = appConfig.aws_project_region
export const cognitoUserPoolId = appConfig.aws_user_pools_id
export const cognitoIdentityPoolId = appConfig.identifity_pool_id
export const cognitoClientId = appConfig.aws_user_pools_web_client_ids
export const cognitoDomain = appConfig.aws_project_region

AWS.config.region = cognitoRegion

let cachedClient
let cachedClientWithCredentials

export function initApiGatewayClient ({ accessKeyId, secretAccessKey, sessionToken } = {}) {
  cachedClient = window.apigClientFactory.newClient({
    accessKey: accessKeyId,
    secretKey: secretAccessKey,
    sessionToken: sessionToken,
    region: awsRegion
  })

  if (accessKeyId && secretAccessKey && sessionToken) {
    cachedClientWithCredentials = cachedClient
  }

  window.apigw = cachedClient
}

export function apiGatewayClient () {
  if (cachedClient) return Promise.resolve(cachedClient)
  return new Promise(resolve => {
    const poller = setInterval(() => {
      if (cachedClient) {
        clearInterval(poller)
        resolve(cachedClient)
      }
    }, 100)
  })
}

export function apiGatewayClientWithCredentials () {
  if (cachedClientWithCredentials) { return Promise.resolve(cachedClientWithCredentials) }
  return new Promise(resolve => {
    const poller = setInterval(() => {
      if (cachedClientWithCredentials) {
        clearInterval(poller)
        resolve(cachedClientWithCredentials)
      }
    }, 100)
  })
}
