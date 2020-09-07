import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

import Home from "../views/Home.vue";
// 유저 인증 관련 컴포넌트
import Auth from "../views/Auth.vue";
const Entry = () => import("../components/auth/Entry.vue");
const Login = () => import("../components/auth/Login.vue");
const Register = () => import("../components/auth/Register.vue");
const Welcome = () => import("../components/auth/Welcome.vue");
const Activate = () => import("../components/auth/Activate.vue");
// 유저 프로필 관련 컴포넌트
import Mypage from "../views/Mypage.vue";
const Profile = () => import("../components/mypage/Profile.vue");
const EditProfile = () => import("../components/mypage/EditProfile.vue");
const EditUser = () => import("../components/mypage/EditUser.vue");
// Wishlist 관련 컴포넌트
import Dashboard from "../views/Dashboard.vue";
import Todo from "../views/Todo.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },

  {
    path: "/user",
    component: Auth,
    children: [
      { path: "", name: "Auth-Entry", component: Entry },
      { path: "login", name: "Login", component: Login },
      { path: "register", name: "Register", component: Register },
      { path: "welcome", name: "Welcome", component: Welcome },
      {
        path: "activate/:uidb64/:token",
        name: "Activate",
        component: Activate
      }
    ],
    beforeEnter: async (to, from, next) => {
      // 로그인 상태가 아닌 경우만 접근할 수 있도록 한다.
      if (!store.getters.isLoggedIn) {
        next();
      } else {
        next("/");
      }
    }
  },

  {
    path: "/mypage",
    component: Mypage,
    children: [
      { path: "", name: "Profile", component: Profile },
      { path: "profile", name: "EditProfile", component: EditProfile },
      { path: "user", name: "EditUser", component: EditUser }
    ],
    meta: { requiresAuth: true }
  },

  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true }
  },

  {
    path: "/todo-list",
    name: "TodoList",
    component: Todo,
    meta: { requiresAuth: true }
  },

  {
    path: "*",
    name: "404 Not Found",
    component: () => import("../views/404Page.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  await store.dispatch("tryAutoLogin");

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn) {
      next("/user");
    } else {
      next();
    }
  } else {
    next();
  }
});

router.beforeEach(async (to, from, next) => {
  // 다음 라우터 Path가 Todolist 또는 MyPage인 경우,
  if (to.path === "/todo-list" || to.path === "/mypage") {
    // Vuex State에 유저 정보가 있는지 확인한다.
    if (store.state.mypage.email === null) {
      await store.dispatch("mypage/getUserInfo");
      next();
    }
    // 이미 Vuex State에 유저 정보가 있다면, 다음으로 바로 진행한다.
    else {
      next();
    }
  }
  // 그 외의 Path로 향하는 경우, 다음으로 진행한다.
  else {
    next();
  }
});

export default router;
