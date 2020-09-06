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

  // 두 토큰 모두 만료된 경우, 로컬스토리지에서 모든 내용 삭제.
  if (accessExpiresIn < 0 && refreshExpiresIn < 0) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessTokenExpirationDate");
    localStorage.removeItem("refreshTokenExpirationDate");

    return false;
  }
  // refresh 토큰이 유요한 경우, true를 반환한다.
  else if (accessExpiresIn < 0 && refreshExpiresIn > 0) {
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
  loginErrorMsg: null,

  // 로딩 관련
  isAuthLoading: false
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
  },

  // 로그인 성공/실패 여부 Mutation
  fetchLoginErrorMsg(state, payload) {
    state.loginErrorMsg = payload;
  },

  fetchLoading(state, payload) {
    state.isAuthLoading = payload;
  }
};

const actions = {
  login({ commit }, payload) {
    // 로딩 상태를 true로 바꾼다.
    commit("fetchLoading", true);

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
        const authData = {
          accessToken: data.access,
          refreshToken: data.refresh,
          accessTokenExpirationDate: accessTokenExpirationDate.toString(),
          refreshTokenExpirationDate: refreshTokenExpirationDate.toString()
        };

        // mutation 실행
        commit("login", authData);

        localStorage.setItem("accessToken", authData.accessToken);
        localStorage.setItem("refreshToken", authData.refreshToken);
        localStorage.setItem(
          "accessTokenExpirationDate",
          authData.accessTokenExpirationDate
        );
        localStorage.setItem(
          "refreshTokenExpirationDate",
          authData.refreshTokenExpirationDate
        );

        // 로딩 상태를 false 바꾼다.
        commit("fetchLoading", false);

        // 로그인 에러 메세지를 초기화한다.
        commit("fetchLoginErrorMsg", null);

        // 로그인 성공 시, 홈 페이지로 리디렉트한다.
        router.replace("/");
      })
      .catch(error => {
        // 로그인 오류 시, 서버로부터 반환된 에러 데이터를 가져온다.
        const errorResponse = error.response;
        let errorMsg = "";

        // Unauthorized (401) 에러 처리
        if (errorResponse.status == 401) {
          errorMsg = "이메일 또는 비밀번호를 다시 확인해주세요.";
        }

        // Not Found(404) 에러 처리
        if (errorResponse.status == 404) {
          errorMsg = "서버 연결이 원활하지 못합니다. 잠시 후 시도해주세요.";
        }

        // 에러 메세지 State에 저장
        commit("fetchLoginErrorMsg", errorMsg);

        // 로딩 상태를 false 바꾼다.
        commit("fetchLoading", false);
      });
  },

  logout({ commit }) {
    // State에서 유저관련 정보를 모두 지운다.
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

    // Refresh 토큰이 유효하고 Access 토큰이 갱신 가능한지 확인한다.
    const flag = await isRefreshPossible(
      accessTokenExpirationDate,
      refreshTokenExpirationDate
    );

    // 두 토큰이 모두 만료된 경우
    if (flag == false) {
      alert("로그인 정보가 만료되었습니다. 다시 로그인해주세요!");
      return;
    }

    const authData = {
      accessToken,
      refreshToken,
      accessTokenExpirationDate,
      refreshTokenExpirationDate
    };

    // 두 토큰 모두 유효한 경우
    if (flag == null) {
      // 유저 데이터로 로그인.
      commit("login", authData);

      // 자동 로그아웃 타이머를 시작한다.
      dispatch("startLogoutTimer");

      console.log("Auto Login Success!");

      return;
    }

    // access 토큰 갱신이 필요한 경우
    instance
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
        authData.accessToken = newAccessToken;
        authData.accessTokenExpirationDate = newAccessTokenExpirationDate.toString();

        localStorage.setItem("accessToken", authData.accessToken);
        localStorage.setItem(
          "accessTokenExpirationDate",
          authData.accessTokenExpirationDate
        );

        console.log("accessToken Succesfully Updated!");
      })
      .catch(error => {
        console.log("Failed", error.response.data);

        alert("로그인 토큰 정보가 모두 만료되었습니다. 다시 로그인해주세요!");

        dispatch("logout");
      });

    // 유저 데이터로 로그인.
    commit("login", authData);

    // 자동 로그아웃 타이머를 시작한다.
    dispatch("startLogoutTimer");

    console.log("Auto Login Success!");
  },

  startLogoutTimer({ dispatch, state }) {
    // Refresh 토큰 만료까지 남은 시간 계산
    const refreshTimetoExpire =
      new Date(state.refreshTokenExpirationDate) - new Date();

    setTimeout(() => {
      dispatch("logout");
    }, refreshTimetoExpire);
  }
};

const getters = {
  // 로그인 여부 반환
  isLoggedIn(state) {
    return state.accessToken !== null;
  },
  // 로딩 여부 반환
  getLoadingStatus(state) {
    return state.isAuthLoading;
  },
  // 로그인 에러 메세지 반환
  getLoginErrorMsg(state) {
    return state.loginErrorMsg;
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
