import axios from "axios";
import authStore from "./authStore.js";
// import router from "@/router";

const instance = axios.create({
  baseURL: "https://hrhr-planner.herokuapp.com/api/user/"
});

const state = {
  // 유저 프로필 정보
  email: null,
  name: null,
  birthday: null,
  nickname: null,
  avatar: null,

  // 로딩 및 스낵바 플래그
  nicknameLoading: false,
  avatarLoading: false,
  userInfoSnackbar: false,
  userInfoSnackbarMsg: null
};

const mutations = {
  // 유저 프로필 데이터 Mutation
  fetchUserInfo(state, payload) {
    state.email = payload.email;
    state.name = payload.name;
    state.birthday = payload.birthday;
    state.nickname = payload.nickname;
    state.avatar = payload.avatar;
  },

  fetchNickname(state, payload) {
    state.nickname = payload.nickname;
  },

  fetchNicknameLoading(state, payload) {
    state.nicknameLoading = payload;
  },

  fetchAvatar(state, payload) {
    state.avatar = payload.avatar;
  },

  fetchAvatarLoading(state, payload) {
    state.avatarLoading = payload;
  },

  fetchUserInfoSnackbar(state, payload) {
    state.userInfoSnackbar = payload.flag;
    state.userInfoSnackbarMsg = payload.message;
  }
};

const actions = {
  getUserInfo({ commit }) {
    instance
      .get("me/", {
        headers: {
          Authorization: `Bearer ${authStore.state.accessToken}`
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
        commit("fetchUserInfo", userData);
      })
      .catch(error => {
        alert("사용자 정보를 불러오는데 실패했습니다.");
        console.log(error);
      });
  },

  changeNickname({ commit }, payload) {
    // 로딩 상태를 True로 설정한다.
    commit("fetchNicknameLoading", true);

    instance
      .put(
        "me/",
        { nickname: payload.nickname },
        {
          headers: {
            Authorization: `Bearer ${authStore.state.accessToken}`
          }
        }
      )
      .then(response => {
        const newNickname = response.data.nickname;
        const snackbar = {
          flag: true,
          message: "별명이 성공적으로 변경되었습니다."
        };

        commit("fetchNickname", { nickname: newNickname });
        commit("fetchNicknameLoading", false);
        commit("fetchUserInfoSnackbar", snackbar);
      })
      .catch(error => {
        const errorResponse = error.response;
        let errorMsg = "";

        // Bad Request (400)
        if (errorResponse.status == 400) {
          errorMsg = "잘못된 입력값입니다.";
        }

        // Unauthorized (401)
        if (errorResponse.status == 401) {
          errorMsg = "로그인 시간이 만료되었습니다. 새로고침 해주세요.";
        }

        // Not Found (404)
        if (errorResponse.status == 404) {
          errorMsg = "서버 연결이 원활하지 못합니다. 잠시 후 시도해주세요.";
        }

        const snackbar = {
          flag: true,
          message: errorMsg
        };

        commit("fetchNicknameLoading", false);
        commit("fetchUserInfoSnackbar", snackbar);
      });
  },

  changeAvatar({ commit }, payload) {
    // 로딩 상태를 True로 설정한다.
    commit("fetchAvatarLoading", true);

    // axios의 payload는 JSON 포맷이기 때문에, 파일을 전송하려면 FormData를 사용해야한다.
    const formData = new FormData();
    // FormData에 아바타 파일 정보 추가
    formData.append("avatar", payload.file);

    instance
      .put("me/avatar", formData, {
        headers: {
          Authorization: `Bearer ${authStore.state.accessToken}`
        }
      })
      .then(response => {
        const newAvatar = response.data.avatar;
        const snackbar = {
          flag: true,
          message: "아바타가 성공적으로 변경되었습니다."
        };

        commit("fetchAvatar", { avatar: newAvatar });
        commit("fetchAvatarLoading", false);
        commit("fetchUserInfoSnackbar", snackbar);
      })
      .catch(error => {
        const errorResponse = error.response;
        let errorMsg = "";

        // Bad Request (400)
        if (errorResponse.status == 400) {
          errorMsg = "잘못된 파일 양식입니다.";
        }

        // Unauthorized (401)
        if (errorResponse.status == 401) {
          errorMsg = "로그인 시간이 만료되었습니다. 새로고침 해주세요.";
        }

        // Not Found (404)
        if (errorResponse.status == 404) {
          errorMsg = "서버 연결이 원활하지 못합니다. 잠시 후 시도해주세요.";
        }

        const snackbar = {
          flag: true,
          message: errorMsg
        };

        commit("fetchAvatarLoading", false);
        commit("fetchUserInfoSnackbar", snackbar);
      });
  }
};

const getters = {
  // 유저 정보 전체를 반환한다.
  userInformation(state) {
    const userData = {
      email: state.email,
      name: state.name,
      birthday: state.birthday,
      nickname: state.nickname,
      avatar: state.avatar
    };
    return userData;
  },
  // 유저의 이메일 정보만 반환한다.
  getUserEmail(state) {
    return state.email;
  },
  // 로딩 여부를 반환
  isNicknameLoading(state) {
    return state.nicknameLoading;
  },
  isAvatarLoading(state) {
    return state.avatarLoading;
  },
  showSnackbar(state) {
    return state.userInfoSnackbar;
  },
  snackbarMsg(state) {
    return state.userInfoSnackbarMsg;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
