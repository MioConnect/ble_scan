const appConfig = {
  aws_project_region: "ap-northeast-1",
  aws_user_pools_id: "ap-northeast-1_LX5DZM0fA",
  aws_user_pools_web_client_id: "34t97orglindp743r5o9o1u97i",
  identifity_pool_id: "ap-northeast-1:e0c27f7b-8653-4f18-923e-a448506d2526",
  restApiId: "yp5udj0syf",
  oauth: {},
  use_authing: false,
  authing_app_id: "604a2c11c435f85c8227baf3",
  aws_cloud_logic_custom: [
    {
      name: "smart-product-api",
      endpoint:
        "https://a3h9rg05rd.execute-api.ap-northeast-1.amazonaws.com/dev/v1/",
      region: "ap-northeast-1",
    },
  ],
  deploy_env: "dev",
};

export default appConfig;
