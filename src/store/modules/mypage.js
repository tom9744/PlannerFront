import axios from "axios";

const state = {
  // 유저 프로필 정보
  email: null,
  name: null,
  birthday: null,
  nickname: null,
  avatar: null,

  // 로딩 및 스낵바 플래그
  progCircle: false,
  progBar: false,
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

  fetchAvatar(state, payload) {
    state.avatar = payload.avatar;
  },

  fetchProgCircle(state, payload) {
    state.progCircle = payload;
  },

  fetchProgBar(state, payload) {
    state.progBar = payload;
  },

  fetchSnackbar(state, payload) {
    state.userInfoSnackbar = payload.flag;
    state.userInfoSnackbarMsg = payload.message;
  }
};

const actions = {
  getUserInfo({ commit }) {
    axios
      .get("user/me/")
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
        const errorResponse = error.response;

        // Bad Request (400)
        if (errorResponse.status == 400) {
          alert("잘못된 접근입니다.");
        }
        // Unauthorized (401)
        else if (errorResponse.status == 401) {
          alert("로그인 시간이 만료되었습니다. 새로고침 후 다시 시도해주세요.");
        }
        // Not Found (404)
        else if (errorResponse.status == 404) {
          alert("서버 연결이 원활하지 못합니다. 잠시 후 시도해주세요.");
        }
        // 기타 HTTP 에러 코드 발생 시
        else {
          alert(
            "예기치 못한 요류가 발생하였습니다. 새로고침 후 다시 시도해주세요."
          );
        }
      });
  },

  changeNickname({ commit, dispatch }, payload) {
    // 로딩 상태를 True로 설정한다.
    commit("fetchProgCircle", true);

    axios
      .put("user/me/", { nickname: payload.nickname })
      .then(response => {
        const newNickname = response.data.nickname;
        const snackbar = {
          flag: true,
          message: "별명이 성공적으로 변경되었습니다."
        };

        commit("fetchNickname", { nickname: newNickname });
        commit("fetchProgCircle", false);
        dispatch("toggleSnackbar", snackbar);
      })
      .catch(error => {
        dispatch("errorHandler", error);
      });
  },

  changeAvatar({ commit, dispatch }, payload) {
    // 로딩 상태를 True로 설정한다.
    commit("fetchProgBar", true);

    // axios의 payload는 JSON 포맷이기 때문에, 파일을 전송하려면 FormData를 사용해야한다.
    const formData = new FormData();
    // FormData에 아바타 파일 정보 추가
    formData.append("avatar", payload.file);

    axios
      .put("user/me/avatar", formData)
      .then(response => {
        const newAvatar = response.data.avatar;
        const snackbar = {
          flag: true,
          message: "아바타가 성공적으로 변경되었습니다."
        };

        commit("fetchAvatar", { avatar: newAvatar });
        commit("fetchProgBar", false);
        dispatch("toggleSnackbar", snackbar);
      })
      .catch(error => {
        dispatch("errorHandler", error);
      });
  },

  changePassword({ commit, dispatch }, payload) {
    // 로딩 상태를 True로 설정한다.
    commit("fetchProgCircle", true);

    axios
      .patch("user/me/edit", {
        password: payload.password,
        password_confirm: payload.password_confirm
      })
      .then(() => {
        const snackbar = {
          flag: true,
          message: "비밀번호가 성공적으로 변경되었습니다."
        };

        commit("fetchProgCircle", false);
        dispatch("toggleSnackbar", snackbar);
      })
      .catch(error => {
        dispatch("errorHandler", error);
      });
  },

  toggleSnackbar({ commit }, payload) {
    // Snackbar는 '닫기'를 누르지 않으면 flag가 false로 돌아오지 않는다.
    commit("fetchSnackbar", { flag: payload.flag, message: payload.message });
    // 따라서, 3000ms 타임아웃을 설정한다.
    setTimeout(() => {
      commit("fetchSnackbar", { flag: false, message: null });
    }, 3000);
  },

  errorHandler({ commit, dispatch }, error) {
    const errorResponse = error.response;
    let errorMsg = "";

    // Bad Request (400)
    if (errorResponse.status == 400) {
      errorMsg = "잘못된 접근입니다.";
    }
    // Unauthorized (401)
    else if (errorResponse.status == 401) {
      errorMsg = "로그인 시간이 만료되었습니다. 새로고침 후 다시 시도해주세요.";
    }
    // Not Found (404)
    else if (errorResponse.status == 404) {
      errorMsg = "서버 연결이 원활하지 못합니다. 잠시 후 시도해주세요.";
    }
    // 기타 HTTP 에러 코드 발생 시
    else {
      errorMsg =
        "예기치 못한 요류가 발생하였습니다. 새로고침 후 다시 시도해주세요.";
    }

    const snackbar = {
      flag: true,
      message: errorMsg
    };

    commit("fetchProgCircle", false);
    dispatch("toggleSnackbar", snackbar);
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
  userEmail(state) {
    return state.email;
  },
  // 로딩 여부를 반환
  progCircle(state) {
    return state.progCircle;
  },
  progBar(state) {
    return state.progBar;
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
