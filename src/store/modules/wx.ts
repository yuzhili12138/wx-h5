import { defineStore } from "pinia";
import { checkwechat } from "@/api/index";
import wx from "weixin-js-sdk";
// 组件 pakages
export const useWxStroe = defineStore({
  id: "useWxStroe",
  state: (): any => ({
    // 是否微信授权
    wxAuth: false,
    // 测试
    appid: "wx9a52a1a0345e81a7"
  }),
  getters: {},
  actions: {
    init() {
      checkwechat({
        url: encodeURI(location.href.split("#")[0])
      }).then((res: any) => {
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: this.appid, // 必填，公众号的唯一标识
          timestamp: res.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.nonceStr, // 必填，生成签名的随机串
          signature: res.signature, // 必填，签名
          jsApiList: ["getLocation"] // 必填，需要使用的JS接口列表
        });
        wx.ready(() => {
          this.wxAuth = true;
          wx.getLocation({
            type: "wgs84", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
              console.log("获取到经纬度", res);
              const latitude: any = res.latitude; // 纬度，浮点数，范围为90 ~ -90
              const longitude: any = res.longitude; // 经度，浮点数，范围为180 ~ -180。
              localStorage.setItem("latitude", latitude);
              localStorage.setItem("longitude", longitude);
              // var speed = res.speed; // 速度，以米/每秒计
              // var accuracy = res.accuracy; // 位置精度
            }
          });
        });
        wx.error(res => {
          this.wxAuth = false;
        });
      });
    },
    login() {
      const redirect_uri = window.location.href;
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=state#wechat_redirect`;
    }
  }
});
