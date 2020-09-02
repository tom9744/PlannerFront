<template>
  <v-container class="pa-0">
    <!-- 중앙 정렬 및 최대 가로길이 설정 -->
    <v-responsive class="mx-auto" max-width="700px">
      <v-row justify="center" align="center" class="mb-6">
        <v-col cols="12" align="center">
          <p class="display-1">사용되고 있는 기술</p>
          <p class="title font-weight-light">
            RESTful API는 Django REST Framework을 통해 작성하였으며,
            데이터베이스는 PostgreSQL을 사용중에 있습니다. 프론트엔드는 Vue.js,
            VueX와 Vuetify.js를 사용해 구성되었으며, 웹사이트의 모든 API 요청은
            Axios를 통해 이루어지고 있습니다. 백엔드 배포는 Heroku, 프론트엔드
            배포는 Google Firebase로 진행중입니다.
          </p>
        </v-col>
      </v-row>

      <!-- 기술 로고 이미지 -->
      <v-row justify="center" align="center">
        <!-- sm 이상에서 줄 당 개수 자동, 그 이하는 한 줄에 하나 씩 -->
        <v-col
          v-for="logo in techLogos"
          :key="logo.name"
          class="mx-auto my-6"
          align="center"
          cols="6"
          sm="auto"
        >
          <v-img :src="logo.imgSrc" max-height="300px" max-width="175px">
          </v-img>
        </v-col>
      </v-row>

      <v-sheet class="py-12 my-12 text-center">...계속 추가중입니다...</v-sheet>
    </v-responsive>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      techLogos: [
        { name: "Python", imgSrc: require("@/assets/python.svg") },
        { name: "Django", imgSrc: require("@/assets/django.svg") },
        { name: "VueJS", imgSrc: require("@/assets/vue-js.svg") },
        { name: "JavaScript", imgSrc: require("@/assets/javascript.svg") }
      ]
    };
  }
};
</script>

<style></style>
