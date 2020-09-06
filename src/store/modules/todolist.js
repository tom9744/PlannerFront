import axios from "axios";
import authStore from "./authStore.js";

const instance = axios.create({
  baseURL: "https://hrhr-planner.herokuapp.com/api/plan/"
});

const state = {
  todos: [],
  filteredTodos: [],
  todoDetail: {},

  currentFilter: "전체",
  numOfCompleted: 0
};

const mutations = {
  fetchTodo(state, payload) {
    state.todos = payload;
  },

  fetchFilteredTodo(state, payload) {
    state.filteredTodos = payload.filteredTodos;
    state.currentFilter = payload.currentFilter;
  },

  fetchTodoDetail(state, payload) {
    state.todoDetail = payload;
    state.todoDetail["nickname"] = payload.profile.nickname;
    state.todoDetail["avatar"] = payload.profile.avatar;
  },

  fetchCount(state, payload) {
    state.numOfCompleted = payload;
  }
};

const actions = {
  /* 
    Axios HTTP request Functions 
    1. getAllTodos : ƒ() 서버로부터 모든 할일 리스트를 받아온다.
    2. addTodo     : ƒ() 새로운 할일 목록을 서버에 전송한다.
    3. toggleTodo  : ƒ() 할일 완료 여부 변경 사항을 서버에 전송한다.
    4. deleteTodo  : ƒ() 할일 삭제 요청을 서버에 전송한다.
  */
  getAllTodos({ state, commit, dispatch }) {
    instance
      // 서버로부터 TodoList 항목을 받아온다.
      .get("bucket-list/", {
        headers: { Authorization: `Bearer ${authStore.state.accessToken}` }
      })
      .then(response => {
        // 받아온 내용을 State에 저장한다.
        commit("fetchTodo", response.data);

        // 현재 필터링 플래그에 맞는 리스트를 출력한다.
        dispatch("filterTodos", state.currentFilter);

        // 완료 표시된 항목의 개수를 구한다.
        dispatch("countCompleted");
      })
      .catch(error => {
        dispatch("errorHandler", error);
      });
  },
  addTodo({ state, commit, dispatch }, payload) {
    // 새로운 버켓리스트 항목을 서버 데이터베이스에 추가한다.
    instance
      .post(
        "bucket-list/",
        { title: payload.title, importance: payload.importance },
        { headers: { Authorization: `Bearer ${authStore.state.accessToken}` } }
      )
      .then(response => {
        let todos = state.todos; // 추가된 할일 정보
        todos.unshift(response.data); // 배열의 맨 앞에 추가

        commit("fetchTodo", todos); // State에 반경

        // 현재 필터링 플래그에 맞는 리스트를 출력한다.
        dispatch("filterTodos", state.currentFilter);
      })
      .catch(error => {
        dispatch("errorHandler", error);
      });
  },
  toggleTodo({ state, commit, dispatch }, payload) {
    instance
      // 우선 주어진 ID 값으로 서버에 GET 요청을 보낸다.
      .get(`bucket-list/${payload.id}/`, {
        headers: { Authorization: `Bearer ${authStore.state.accessToken}` }
      })
      .then(response => {
        const todo = response.data; // 응답받은 데이터에서 todo 정보 추출.

        instance
          .patch(
            `bucket-list/${payload.id}/`,
            { is_complete: !todo.is_complete }, // 현재 is_complete 값과 반대되는 값으로 수정한다.
            {
              headers: {
                Authorization: `Bearer ${authStore.state.accessToken}`
              }
            }
          )
          .then(response => {
            // 변경된 내용을 State에 반영하기 위해 호출한다.
            const toggledTodo = response.data;
            let todos = state.todos;

            const toggledIndex = todos.findIndex(
              todo => todo.id == toggledTodo.id
            );
            todos[toggledIndex] = toggledTodo;

            commit("fetchTodo", todos);

            // 현재 필터링 플래그에 맞는 리스트를 출력한다.
            dispatch("filterTodos", state.currentFilter);

            // 완료 표시된 항목의 개수를 구한다.
            dispatch("countCompleted");
          })
          .catch(() => {
            alert("할일 항목을 수정하는데 실패하였습니다!");
          });
      })
      .catch(error => {
        dispatch("errorHandler", error);
      });
  },
  deleteTodo({ state, commit, dispatch }, payload) {
    instance
      .delete(`bucket-list/${payload.id}/`, {
        headers: { Authorization: `Bearer ${authStore.state.accessToken}` }
      })
      .then(() => {
        let todos = state.todos;

        const deletedIndex = todos.findIndex(todo => todo.id == payload.id);

        // 삭제된 할일을 State에서 제거한다.
        todos.splice(deletedIndex, 1);
        commit("fetchTodo", todos);

        // 현재 필터링 플래그에 맞는 리스트를 출력한다.
        dispatch("filterTodos", state.currentFilter);

        // 완료 표시된 항목의 개수를 구한다.
        dispatch("countCompleted");
      })
      .catch(error => {
        dispatch("errorHandler", error);
      });
  },

  /* 
    Todo List Helper Functions 
    1. filterTodos    : ƒ() 필터 설정에 알맞는 할일 배열 State 반영
    2. countCompleted : ƒ() 완료된 할일 개수 계산
    3. errorHandler   : ƒ() Axios 처리에서 발생한 오류 처리
  */
  filterTodos({ state, commit }, payload) {
    let filteredTodos = [];

    switch (payload) {
      case "전체": {
        filteredTodos = state.todos;
        break;
      }
      case "대기": {
        filteredTodos = state.todos.filter(todo => !todo.is_complete);
        break;
      }
      case "완료": {
        filteredTodos = state.todos.filter(todo => todo.is_complete);
        break;
      }
    }
    // 필터링된 할일 배열을 State에 반영한다.
    commit("fetchFilteredTodo", {
      filteredTodos: filteredTodos,
      currentFilter: payload
    });
  },
  getTodoDetail({ state, commit }, payload) {
    const todos = state.todos; // 전체 할일 항목 배열
    const targetId = payload; // 세부사항을 가져올 할일의 ID

    // ID 값으로 정렬된 배열이므로, 이진탐색을 사용한다.
    let startIndex = 0;
    let endIndex = todos.length - 1;

    while (startIndex <= endIndex) {
      let midIndex = startIndex + Math.floor((endIndex - startIndex) / 2);
      let currentId = todos[midIndex].id;

      if (targetId == currentId) {
        commit("fetchTodoDetail", todos[midIndex]);
        return;
      } else if (targetId < currentId) {
        startIndex = midIndex + 1;
      } else {
        endIndex = midIndex - 1;
      }
    }

    alert("해당 할일 목록을 찾을 수 없습니다");
  },
  countCompleted({ state, commit }) {
    let counter = 0;

    for (let index in state.todos) {
      // 전체 배열에서 'is_complete'가 true인 요소의 개수를 counter에 저장한다.
      if (state.todos[index].is_complete == true) {
        counter++;
      }
    }

    commit("fetchCount", counter);
  },
  errorHandler(error) {
    const errorStatus = error.response.status;

    // Bad Request (400)
    if (errorStatus == 400) {
      alert("잘못된 접근입니다.");
    }
    // Unauthorized (401)
    else if (errorStatus == 401) {
      alert("로그인 시간이 만료되었습니다. 새로고침 후 다시 시도해주세요.");
    }
    // Not Found (404)
    else if (errorStatus == 404) {
      alert("서버 연결이 원활하지 못합니다. 잠시 후 시도해주세요.");
    }
    // 기타 HTTP 에러 코드 발생 시
    else {
      alert(
        "예기치 못한 요류가 발생하였습니다. 새로고침 후 다시 시도해주세요."
      );
    }
  }
};

const getters = {
  todos(state) {
    return state.todos;
  },
  filteredTodos(state) {
    return state.filteredTodos;
  },
  todoDetail(state) {
    return state.todoDetail;
  },
  numOfCompletedTodos(state) {
    return state.numOfCompleted;
  },
  numOfInProcessTodos(state) {
    return state.todos.length - state.numOfCompleted;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
