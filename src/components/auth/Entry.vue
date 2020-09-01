<template>
  <v-card class="mx-auto elevation-12" max-width="400">
    <v-toolbar color="indigo lighten-1" dark flat>
      <v-toolbar-title>환영합니다.</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <p>로그인이 필요한 서비스입니다.</p>
      <p>기존 계정으로 로그인하시거나, 회원가입 해주시기 바랍니다.</p>
      <router-view></router-view>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="indigo lighten-1 white--text" to="/user/login"
        >로그인</v-btn
      >
      <v-btn color="indigo lighten-1 white--text" to="/user/register"
        >회원가입</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {};
</script>

<style></style>
