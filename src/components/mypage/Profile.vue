<template>
  <v-card class="mx-auto elevation-12" max-width="400">
    <v-toolbar color="indigo lighten-1" dark flat>
      <v-toolbar-title>사용자 프로필</v-toolbar-title>
    </v-toolbar>

    <v-card-title class="pa-3">
      <v-row>
        <v-col cols="3" align="center" class="pa-1">
          <v-avatar color="grey darken-3" size="52px">
            <img class="elevation-12" :src="userData.avatar" />
          </v-avatar>
        </v-col>
        <v-col cols="9" align-self="center" class="px-1 py-3">
          <p class="text-h6 font-weight-bold mb-0">
            {{ userData.nickname }}님, 환영합니다!
          </p>
        </v-col>
      </v-row>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text>
      <p class="subtitle-1 font-weight-bold indigo--text">프로필 정보</p>
      <p class="mb-0">별명: {{ userData.nickname }}</p>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-text>
      <p class="subtitle-1 font-weight-bold indigo--text">개인 정보</p>
      <p>계정: {{ userData.email }}</p>
      <p>이름: {{ userData.name }}</p>
      <p class="mb-0">생년월일: {{ userData.birthday }}</p>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="indigo lighten-1 white--text" to="/mypage/profile"
        >프로필 편집</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  computed: {
    userData() {
      return this.$store.getters["userInfo/userInformation"];
    }
  },
  data() {
    return {};
  }
};
</script>

<style scoped></style>
