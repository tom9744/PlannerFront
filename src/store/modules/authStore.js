import axios from "axios";
import router from "@/router";

function isRefreshPossible(
  accessTokenExpirationDate,
  refreshTokenExpirationDate
) {
  // 현재 시각을 기준으로 access, refresh 토큰의 만료까지 남은 시간 계산
  const now = new Date();
  const accessExpiresIn = new Date(accessTokenExpirationDate) - now;
  const refreshExpiresIn = new Date(refreshTokenExpirationDate) - now;

  console.log(accessExpiresIn, refreshExpiresIn);

  // 두 토큰 모두 만료된 경우, 로컬스토리지에서 모든 내용 삭제.
  if (accessExpiresIn < 0 && refreshExpiresIn < 0) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessTokenExpirationDate");
    localStorage.removeItem("refreshTokenExpirationDate");

    return false;
  } else if (accessExpiresIn < 0 && refreshExpiresIn > 0) {
    return true;
  }
  return null;
}

const instance = axios.create({
  baseURL: "https://hrhr-planner.herokuapp.com/api/user/"
});

const state = {
  // 인증 토큰 관련
  accessToken: null,
  refreshToken: null,
  accessTokenExpirationDate: null,
  refreshTokenExpirationDate: null,

  // 유저 프로필 정보
  userData: null,

  // 에러 관련
  loginErrorData: null
};

const mutations = {
  // 로그인 Mutation
  login(state, payload) {
    state.accessToken = payload.accessToken;
    state.refreshToken = payload.refreshToken;
    state.accessTokenExpirationDate = payload.accessTokenExpirationDate;
    state.refreshTokenExpirationDate = payload.refreshTokenExpirationDate;
  },

  // 로그아웃 Mutation
  logout(state) {
    state.accessToken = null;
    state.refreshToken = null;
    state.accessTokenExpirationDate = null;
    state.refreshTokenExpirationDate = null;
    state.userData = null;
  },

  // 로그인 성공/실패 여부 Mutation
  loginStatus(state, payload) {
    state.loginErrorData = payload;
  },

  // 유저 프로필 데이터 Mutation
  fetchUser(state, payload) {
    state.userData = payload;
  }
};

const actions = {
  login({ commit }, payload) {
    // axios를 통해 URL로 HTTP POST 요청을 보낸다.
    instance
      .post(`login`, payload)
      // 서버가 정상적으로 응답한 경우
      .then(response => {
        const data = response.data;

        const accessTokenExpirationDate = new Date(data.access_expiration_date);
        const refreshTokenExpirationDate = new Date(
          data.refresh_expiration_date
        );

        // State에 저장할 데이터
        const userData = {
          accessToken: data.access,
          refreshToken: data.refresh,
          accessTokenExpirationDate: accessTokenExpirationDate.toString(),
          refreshTokenExpirationDate: refreshTokenExpirationDate.toString()
        };

        // mutation 실행
        commit("login", userData);

        localStorage.setItem("accessToken", userData.accessToken);
        localStorage.setItem("refreshToken", userData.refreshToken);
        localStorage.setItem(
          "accessTokenExpirationDate",
          userData.accessTokenExpirationDate
        );
        localStorage.setItem(
          "refreshTokenExpirationDate",
          userData.refreshTokenExpirationDate
        );

        // 로그인 성공 시, 홈 페이지로 리디렉트한다.
        router.replace("/");
      })
      .catch(error => {
        // 로그인 오류 시, 서버로부터 반환된 에러 데이터를 가져온다.
        const errorData = error.response.data;

        // State에 에러 정보를 저장한다.
        commit("loginStatus", errorData);

        alert("로그인 실패!");
      });
  },

  logout({ commit }) {
    commit("logout");

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessTokenExpirationDate");
    localStorage.removeItem("refreshTokenExpirationDate");

    router.replace("/user");
  },

  async tryAutoLogin({ commit, dispatch }) {
    // LocalStrage에서 사용자 인증에 필요한 데이터를 가져온다.
    let accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    let accessTokenExpirationDate = localStorage.getItem(
      "accessTokenExpirationDate"
    );
    const refreshTokenExpirationDate = localStorage.getItem(
      "refreshTokenExpirationDate"
    );

    // 인증에 필요한 데이터가 존재하지 않는 경우, 자동 로그인 실패.
    if (
      !accessToken ||
      !refreshToken ||
      !accessTokenExpirationDate ||
      !refreshTokenExpirationDate
    ) {
      console.log("Auto Login Failed!");
      return;
    }

    const flag = await isRefreshPossible(
      accessTokenExpirationDate,
      refreshTokenExpirationDate
    );

    console.log(flag);

    if (flag == false) {
      return;
    }

    const userData = {
      accessToken,
      refreshToken,
      accessTokenExpirationDate,
      refreshTokenExpirationDate
    };

    if (flag == null) {
      // 유저 데이터로 로그인.
      commit("login", userData);

      // 자동 로그아웃 타이머를 시작한다.
      dispatch("startLogoutTimer");

      console.log("Auto Login Success!");

      return;
    }

    await instance
      .post("refresh", {
        refresh: refreshToken
      })
      .then(response => {
        const data = response.data;

        const newAccessToken = data.access;
        const newAccessTokenExpirationDate = new Date(
          data.access_expiration_date
        );

        // 인증 정보를 업데이트한다.
        userData.accessToken = newAccessToken;
        userData.accessTokenExpirationDate = newAccessTokenExpirationDate.toString();

        localStorage.setItem("accessToken", userData.accessToken);
        localStorage.setItem(
          "accessTokenExpirationDate",
          userData.accessTokenExpirationDate
        );

        console.log("accessToken Succesfully Updated!");
      })
      .catch(error => {
        console.log("Failed", error.response.data);

        dispatch("logout");
      });

    // 유저 데이터로 로그인.
    commit("login", userData);

    // 자동 로그아웃 타이머를 시작한다.
    dispatch("startLogoutTimer");

    console.log("Auto Login Success!");
  },

  startLogoutTimer({ dispatch, state }) {
    // Refresh 토큰 만료까지 남은 시간 계산
    const refreshTimetoExpire =
      new Date(state.refreshTokenExpirationDate) - new Date();

    console.log(
      "Time to get automatically logged out: ",
      refreshTimetoExpire / 1000 + "초"
    );

    setTimeout(() => {
      dispatch("logout");
    }, refreshTimetoExpire);
  },

  fetchUser({ commit, state }) {
    instance
      .get("me/", {
        headers: {
          Authorization: `Bearer ${state.accessToken}`
        }
      })
      .then(response => {
        const userData = {};

        // 'user' 객체에서 각각의 요소를 추출한다.
        for (let each in response.data.user) {
          if (each == "id") continue;
          userData[`${each}`] = response.data.user[each];
        }

        userData["nickname"] = response.data.nickname;
        userData["avatar"] = response.data.avatar;

        // Mutation 실행
        commit("fetchUser", userData);
      })
      .catch(error => {
        console.log(error);
      });
  }
};

const getters = {
  isLoggedIn(state) {
    return state.accessToken !== null;
  },
  isRegistrationFailed(state) {
    return state.registrationErrorData !== null;
  },
  getRegistrationErrorData(state) {
    return state.registrationErrorData;
  },
  isLoginFailed(state) {
    return state.loginErrorData !== null;
  },
  getUserData(state) {
    return state.userData;
  },
  getUserEmail(state, getters) {
    return getters.getUserData.email;
  },
  getAccessToken(state) {
    return state.accessToken;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
