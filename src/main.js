import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";

Vue.prototype.$http = axios;

// axios.defaults.baseURL = "https://hrhr-planner.herokuapp.com/api/";
axios.defaults.baseURL = "http://127.0.0.1:8000/api/";

axios.interceptors.request.use(
  config => {
    // LocalStorage에서 accessToken 획득 시도
    const accessToken = localStorage.getItem("accessToken");

    // accessToken이 존재하는 경우, Request Header에 포함시킨다.
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  error => {
    Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    // 응답이 정상적으로 돌아온 경우, 그대로 반환한다.
    return response;
  },
  error => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      originalRequest.url === "/user/refresh"
    ) {
      console.log("토큰 리프레쉬 실패!");
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      return axios
        .post("/user/refresh", {
          refresh: refreshToken
        })
        .then(res => {
          const newAccessToken = res.data.access;
          const newAccessTokenExpires = new Date(
            res.data.access_expiration_date
          );

          localStorage.setItem("accessToken", newAccessToken);
          localStorage.setItem("accessTokenExpires", newAccessTokenExpires);

          axios.defaults.headers.common["Authorization"] =
            "Bearer " + localStorage.getItem("accessToken");

          return axios(originalRequest);
        })
        .catch(() => {
          alert("[Interceptor] 세션이 만료되었습니다. 다시 로그인해주세요.");

          // router.replace("/user");
        });
    }
    return Promise.reject(error);
  }
);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
