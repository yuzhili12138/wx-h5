import axios from "axios";
import { showToast } from "vant";
const instance = axios.create({
  //https://api.example.com/ 相同的前缀
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 100 * 1000,
  headers: {}
});
// POST传参序列化(添加请求拦截器)
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    // let token = 'XkUHpXz26bsKVQ3Pi4IaefHByBCsyaTmIhpO9W2Ewg3NNfEoGUMeiUxtRRDa1PCb'
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
// 返回状态判断(添加响应拦截器)
instance.interceptors.response.use(
  res => {
    if (res.data.code === 200) {
      return res.data;
    } else if (res.data.code == 401) {
      localStorage.removeItem("token");
      showToast(res.data.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      showToast(res.data.message);
      return res.data;
    }
  },
  err => {
    return Promise.reject(err);
  }
);
// 发送请求
export function post(url: string, params: any) {
  return new Promise((resolve, reject) => {
    instance
      .post(url, params)
      .then(
        res => {
          resolve(res.data);
        },
        err => {
          reject(err);
        }
      )
      .catch(err => {
        reject(err);
      });
  });
}

export function get(url: string, params?: any) {
  return new Promise((resolve, reject) => {
    instance
      .get(url, {
        params: params
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function Delete(url: string, params?: any) {
  return new Promise((resolve, reject) => {
    instance
      .delete(url, {
        params: params
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function postJson(url: string, data = {}) {
  return new Promise((resolve, reject) => {
    instance
      .post(url, data, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(
        res => {
          if (res) {
            resolve(res);
          }
        },
        err => {
          reject(err);
        }
      );
  });
}
export function postFormData(url: string, data = {}) {
  return new Promise((resolve, reject) => {
    instance
      .post(url, data, {
        headers: {
          "Content-Type": "multipart/form-data"
          // 'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(
        res => {
          if (res) {
            resolve(res);
          }
        },
        err => {
          reject(err);
        }
      );
  });
}
