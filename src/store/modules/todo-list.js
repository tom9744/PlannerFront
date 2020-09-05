import axios from "axios";
import authStore from "./authStore.js";

const instance = axios.create({
  baseURL: "https://hrhr-planner.herokuapp.com/api/plan/"
});

const state = {
  todos: [],
  filteredTodos: [],
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

  fetchCount(state, payload) {
    state.numOfCompleted = payload;
  }
};

const actions = {
  filterTodos({ state, commit }, payload) {
    let filteredTodos = [];

    switch (payload) {
      case "전체": {
        filteredTodos = state.todos;
        commit("fetchFilteredTodo", {
          filteredTodos: filteredTodos,
          currentFilter: payload
        });
        break;
      }
      case "대기": {
        filteredTodos = state.todos.filter(todo => !todo.is_complete);
        commit("fetchFilteredTodo", {
          filteredTodos: filteredTodos,
          currentFilter: payload
        });
        break;
      }
      case "완료": {
        filteredTodos = state.todos.filter(todo => todo.is_complete);
        commit("fetchFilteredTodo", {
          filteredTodos: filteredTodos,
          currentFilter: payload
        });
        break;
      }
    }
  },

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
      .catch(() => {
        alert("서버로부터 할일 항목을 받아오는데 실패했습니다.");
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
      .catch(() => {
        alert("항목을 추가하는데 실패했습니다.");
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
      .catch(() => {
        alert("해당 ID 값에 해당하는 정보가 데이터베이스에 없습니다!");
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
      .catch(() => {
        alert("해당 항목을 삭제하는데 실패했습니다.");
      });
  },

  countCompleted({ state, commit }) {
    let counter = 0;

    for (let index in state.todos) {
      if (state.todos[index].is_complete == true) {
        counter++;
      }
    }

    commit("fetchCount", counter);
  }
};

const getters = {
  todos(state) {
    return state.todos;
  },
  filteredTodos(state) {
    return state.filteredTodos;
  },
  numOfCompletedTodos(state) {
    return state.numOfCompleted;
  },
  numOfInProcessTodos(state) {
    return state.todos.length - state.numOfCompleted;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
