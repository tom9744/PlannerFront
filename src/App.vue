<template>
  <v-app id="planner">
    <!-- 좌측 네비게이션 바 -->
    <v-navigation-drawer v-model="drawer.isOpen" temporary app>
      <!-- 로그인 상태인 경우 표시되는 부분 -->
      <v-list v-if="isLoggedIn">
        <v-list-item
          v-for="item in drawer.items"
          :key="item.title"
          link
          :to="item.route"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <!-- 로그인 상태가 아닌 경우 표시되는 부분 -->
      <div v-if="!isLoggedIn" align="center" class="mt-16">
        <p class="headline">로그인 상태가 아닙니다.</p>
        <v-spacer></v-spacer>
        <p class="ma-10">메인 화면에서 로그인 또는 회원가입이 가능합니다.</p>
      </div>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn
            v-if="!isLoggedIn"
            block
            class="indigo lighten-1"
            dark
            to="/user"
          >
            Login
          </v-btn>
          <v-btn
            v-if="isLoggedIn"
            block
            class="indigo lighten-1"
            dark
            @click="onLogout"
          >
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- 화면 상단 네비게이션 바 -->
    <v-app-bar class="indigo lighten-1" elevate-on-scroll app>
      <v-app-bar-nav-icon
        @click.stop="drawer.isOpen = !drawer.isOpen"
      ></v-app-bar-nav-icon>

      <router-link to="/" style="text-decoration: none;">
        <v-toolbar-title class="white--text headline ml-2"
          >플래너 APP</v-toolbar-title
        >
      </router-link>

      <v-spacer></v-spacer>

      <div v-if="isLoggedIn">
        <v-tooltip 
          v-for="elem in menu"
          :key="elem.title"
          bottom
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon :to="elem.route" v-bind="attrs" v-on="on">
              <v-icon>{{ elem.icon }}</v-icon>
            </v-btn>
          </template>
          <span>{{ elem.title }}</span>
        </v-tooltip>
      </div>

      <v-tooltip bottom v-if="isLoggedIn">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" @click="onLogout">
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </template>
        <span>로그아웃</span>
      </v-tooltip>

      <v-tooltip bottom v-if="!isLoggedIn">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon to="/user" v-bind="attrs" v-on="on">
            <v-icon>mdi-login</v-icon>
          </v-btn>
        </template>
        <span>로그인</span>
      </v-tooltip>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
  methods: {
    onLogout() {
      this.$store.dispatch("logout");
    },
  },
  data() {
    return {
      drawer: {
        isOpen: null,
        items: [
          { title: "홈", icon: "mdi-home", route: "/" },
          { title: "프로필", icon: "mdi-account-circle", route: "/mypage" },
          { title: "대시보드", icon: "mdi-view-dashboard", route: "/dashboard" },
          { title: "투두리스트", icon: "mdi-format-list-checks", route: "/todo-list" },
        ],
      },
      menu: [
        { title: "투두리스트", icon: "mdi-format-list-checks", route: "/todo-list" },
        { title: "대시보드", icon: "mdi-view-dashboard", route: "/dashboard" },
        { title: "마이페이지", icon: "mdi-account-circle", route: "/mypage" },
      ],
    };
  },
};
</script>

<style scoped></style>
