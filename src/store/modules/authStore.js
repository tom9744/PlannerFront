import axios from "axios";
import router from "@/router";

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/"
});

function isRefreshable(accessTokenExpires, refreshTokenExpires) {
  // 현재 시각을 기준으로 access, refreshToken의 만료까지 남은 시간 계산
  const accessExpiresIn = new Date(accessTokenExpires) - new Date();
  const refreshExpiresIn = new Date(refreshTokenExpires) - new Date();

  // accessToken은 만료되었지만 refreshToken이 유효한 경우, true를 반환한다.
  if (accessExpiresIn < 0 && refreshExpiresIn > 0) {
    return true;
  }

  // refreshToken이 만료된 경우, false를 반환한다.
  if (refreshExpiresIn < 0) {
    return false;
  }

  // 그 외 나머지 경우(Token 재발급 필요 없음), null을 반환한다.
  return null;
}

const state = {
  // 인증 토큰 관련
  accessToken: null,
  refreshToken: null,
  accessTokenExpires: null,
  refreshTokenExpires: null,

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
    state.accessTokenExpires = payload.accessTokenExpires;
    state.refreshTokenExpires = payload.refreshTokenExpires;
  },

  // 로그아웃 Mutation
  logout(state) {
    state.accessToken = null;
    state.refreshToken = null;
    state.accessTokenExpires = null;
    state.refreshTokenExpires = null;
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

    instance
      .post(`user/login`, payload)
      .then(response => {
        const data = response.data;

        // 자바스크립트 Date 객체로 파싱
        const accessTokenExpires = new Date(data.access_expiration_date);
        const refreshTokenExpires = new Date(data.refresh_expiration_date);

        // State에 저장할 데이터
        const authData = {
          accessToken: data.access,
          refreshToken: data.refresh,
          accessTokenExpires: accessTokenExpires.toString(),
          refreshTokenExpires: refreshTokenExpires.toString()
        };

        // mutation 실행
        commit("login", authData);

        localStorage.setItem("accessToken", authData.accessToken);
        localStorage.setItem("refreshToken", authData.refreshToken);
        localStorage.setItem("accessTokenExpires", authData.accessTokenExpires);
        localStorage.setItem(
          "refreshTokenExpires",
          authData.refreshTokenExpires
        );

        commit("fetchLoading", false); // 로딩 상태를 false 바꾼다.
        commit("fetchLoginErrorMsg", null); // 로그인 에러 메세지를 초기화한다.

        router.replace("/"); // 로그인 성공 시, 홈 페이지로 리디렉트한다.
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
        else if (errorResponse.status == 404) {
          errorMsg = "서버 연결이 원활하지 못합니다. 잠시 후 시도해주세요.";
        }

        commit("fetchLoginErrorMsg", errorMsg); // 에러 메세지 State에 저장
        commit("fetchLoading", false); // 로딩 상태를 false 바꾼다.
      });
  },

  logout({ commit }) {
    // State에서 유저관련 정보를 모두 지운다.
    commit("logout");

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessTokenExpires");
    localStorage.removeItem("refreshTokenExpires");
  },

  async tryAutoLogin({ commit, dispatch }) {
    // LocalStrage에서 사용자 인증에 필요한 데이터를 가져온다.
    let accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    let accessTokenExpires = localStorage.getItem("accessTokenExpires");
    const refreshTokenExpires = localStorage.getItem("refreshTokenExpires");

    // 인증에 필요한 데이터가 존재하지 않는 경우, 자동 로그인 실패.
    if (
      !accessToken ||
      !refreshToken ||
      !accessTokenExpires ||
      !refreshTokenExpires
    ) {
      console.log("토큰 정보가 없습니다.");
      return;
    }

    /*
      accessToken, refreshToken의 상태를 검사한다.
      true: 재발급 가능, false: 재발급 불가능, null: 재발급 불필요
    */
    const flag = isRefreshable(accessTokenExpires, refreshTokenExpires);

    // 재발급이 불가능한 경우, 로그아웃 실행
    if (flag == false) {
      await dispatch("logout");

      alert("[Router] 세션이 만료되었습니다. 다시 로그인해주세요.");

      return;
    }

    const authData = {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires
    };

    // 두 토큰 모두 유효한 경우
    if (flag == null) {
      // 갱신된 인증 정보를 State에 반영한다.
      await commit("login", authData);

      console.log("토큰 재발급 없이 자동 로그인 완료!");

      return;
    }

    // access 토큰 갱신이 필요한 경우
    axios
      .post("user/refresh", {
        refresh: refreshToken
      })
      .then(({ data }) => {
        const newAccessToken = data.access;
        const newAccessTokenExpires = new Date(data.access_expiration_date);

        // 인증 정보를 업데이트한다.
        authData.accessToken = newAccessToken;
        authData.accessTokenExpires = newAccessTokenExpires.toString();

        localStorage.setItem("accessToken", authData.accessToken);
        localStorage.setItem("accessTokenExpires", authData.accessTokenExpires);

        // 갱신된 인증 정보를 State에 반영한다.
        commit("login", authData);

        console.log("accessToken 재발급 후 자동 로그인 완료!");
      })
      .catch(error => {
        console.log("Failed", error.response.data);

        alert("토큰 갱신에 실패했습니다. 다시 로그인해주세요.");

        dispatch("logout");
      });
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
