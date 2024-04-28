import { defineStore } from "pinia";
import { getUserInfo } from "@/api/index";
export const userStore = defineStore({
  id: "userStore",
  state: (): any => ({
    // 获取微信sdk方法
    token: ""
  }),
  getters: {},
  actions: {
    async login(code: any) {
      return new Promise((resolve, reject) => {
        getUserInfo({ code }).then((res: any) => {
          if (res) {
            localStorage.setItem("token", res.tokenValue);
            this.token = res.tokenValue;
            // hasState();
            resolve(true);
          }
        });
      });
    }
  }
});
