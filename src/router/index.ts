import {
  createRouter,
  createWebHashHistory,
  type RouteLocationNormalized,
  createWebHistory
} from "vue-router";
import routes from "./routes";
import { useCachedViewStoreHook } from "@/store/modules/cachedView";
import NProgress from "@/utils/progress";
import setPageTitle from "@/utils/set-page-title";

import { useWxStroe } from "@/store/modules/wx";
import { userStore } from "@/store/modules/userStore";
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes
});

export interface toRouteType extends RouteLocationNormalized {
  meta: {
    title?: string;
    noCache?: boolean;
  };
}

router.beforeEach(async (to: toRouteType, from, next) => {
  NProgress.start();

  // 判断url是否带有code，如果有code，使用code和后端去获取用户信息
  if (to.query.code) {
    const userSto = userStore();
    await userSto.login("1111");
  }
  // 如果没有code,判断是否有token，有token继续下一步
  if (localStorage.getItem("token")) {
    // 初始化微信sdk
    const wxStroe = useWxStroe();
    if (!wxStroe.wxAuth) wxStroe.init();
  } else {
    // 如果没有token就是获取微信code
    const wxStroe = useWxStroe();
    wxStroe.login();
  }

  // 路由缓存
  useCachedViewStoreHook().addCachedView(to);
  const tit = to.meta.title;
  // 页面 title
  setPageTitle(tit);
  if (to.query.code) {
    next({ path: to.path });
  } else {
    next();
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
