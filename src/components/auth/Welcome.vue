<template>
  <v-card class="mx-auto elevation-12" max-width="400">
    <v-toolbar color="indigo lighten-1" dark flat>
      <v-toolbar-title>회원가입 완료</v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <h3>가입을 축하드립니다!</h3>
      <p>입력하신 이메일 주소로 인증 메일이 발송되었습니다.</p>
      <p>메일에 첨부된 인증 URL에 접속하시면 회원가입이 승인됩니다.</p>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="indigo lighten-1 white--text" to="/" exact>홈페이지 이동하기</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  // created() {
  //     setTimeout(() => {
  //         this.$router.replace("/");
  //     }, 3000)
  // }
};
</script>

<style>
</style>