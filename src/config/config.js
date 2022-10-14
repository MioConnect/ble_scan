const appConfig = {
  aws_project_region: "us-east-1",
  aws_user_pools_id: "us-east-1_V5B7jSsbK",
  aws_user_pools_web_client_id: "69cmqun5qo888sv7liv1b45ca5",
  identifity_pool_id: "us-east-1:74bcceb4-0be8-43d5-9a81-9a0aeb878713",
  restApiId: "yv5yxe3o54",
  oauth: {},
  use_authing: false,
  authing_app_id: "60e2961508b461330c4bdbc7",
  aws_cloud_logic_custom: [
    {
      name: "smart-product-api",
      endpoint:
        "https://ocbhhpgyeh.execute-api.us-east-1.amazonaws.com/stg/v1/",
      region: "us-east-1",
    },
  ],
  deploy_env: "stg",
};

export default appConfig;
