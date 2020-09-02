<template>
  <v-container class="pa-0">
    <v-row align="center" justify="center">
      <!-- 소개 문구 및 메뉴 버튼 -->
      <v-col cols="12" sm="12" md="8" lg="6" align="center">
        <!-- 좌측 정렬 및 최대 가로길이 설정 -->
        <v-responsive max-width="650px">
          <p class="text-h4 font-weight-bold text-center text-md-left">
            Planner App.<br />Plan out your hangouts.
          </p>
          <p class="text-h6 font-weight-light text-center text-md-left">
            플래너는 일정관리 웹 어플리케이션입니다. <br />
            간단하게 일정을 등록하고 친구들과 공유하세요. <br />
            아직 많은 기능은 없지만, 계속 추가되고 있습니다. :)
          </p>
          <v-row class="my-6">
            <!-- 버튼은 xs 2개, sm 4개, md 이상 자동 정렬 -->
            <v-col
              cols="6"
              sm="3"
              md="auto"
              v-for="btn in buttons"
              :key="btn.title"
            >
              <v-btn :to="btn.link" :disabled="btn.title == '개발중'">
                <v-icon left>{{ btn.icon }}</v-icon>
                {{ btn.title }}
              </v-btn>
            </v-col>
          </v-row>
        </v-responsive>
      </v-col>
      <!-- 뷰티파이 로고 이미지 -->
      <v-col class="d-none d-md-flex mb-6" align="center" md="4" lg="3">
        <v-img src="@/assets/logo.svg" max-width="275px">
          <!-- 이미지 내부 텍스트 삽입부 -->
          <v-container class="fill-height" style="color: #004e81">
            <!-- 중앙에서 약간 아래로 치우치도록 정렬 -->
            <v-row justify="center" class="mt-12 pt-6">
              <v-col>
                <p class="text-h6 mb-0">Powered By</p>
                <p class="text-h4 font-weight-bold">Vuetify.js</p>
              </v-col>
            </v-row>
          </v-container>
        </v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      buttons: [
        { title: "마이페이지", icon: "mdi-account-circle", link: "/mypage" },
        { title: "대시보드", icon: "mdi-view-dashboard", link: "/dashboard" },
        {
          title: "투두리스트",
          icon: "mdi-format-list-checks",
          link: "/todo-list"
        },
        { title: "개발중", icon: "mdi-hammer-wrench", link: "" }
      ]
    };
  }
};
</script>

<style scoped></style>>
