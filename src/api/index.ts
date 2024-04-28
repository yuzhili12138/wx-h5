import { get } from "@/utils/http";

export const checkwechat = (params: any) => {
  return get("/wechat/auth/accessToken", params);
};

export const getJsapiTicket = (params: any) => {
  return get("/wechat/jsapi/getJsapiTicket", params);
};

export const getUserInfo = (params: any) => {
  return get(`/wechat/auth/${params.code}`);
};
