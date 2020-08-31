<template>
  <v-card class="mx-auto elevation-12" max-width="400">
    <v-toolbar color="indigo lighten-1" dark flat>
      <v-toolbar-title v-if="isActivated == null">인증 진행중...</v-toolbar-title>
      <v-toolbar-title v-if="isActivated == true">인증 완료</v-toolbar-title>
      <v-toolbar-title v-if="isActivated == false">인증 실패</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <div v-if="isActivated === null">
        <h3>인증 절차가 진행중입니다.</h3>
        <p>잠시만 기다려주시면 자동으로 화면이 넘어갑니다.</p>
      </div>

      <div>
        <h3 v-if="isActivated == true">계정 인증이 완료되었습니다.</h3>
        <h3 v-if="isActivated == false">이미 인증된 계정입니다.</h3>
        <p>5초 뒤 로그인 화면으로 자동 이동됩니다...</p>
      </div>

      <div class="d-flex flex-row-reverse">
        <v-progress-circular indeterminate color="indigo lighten-1 white--text"></v-progress-circular>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      isActivated: false,

      resonpseMsg: ""
    };
  },
  methods: {
    startRedirectTimer() {
      setTimeout(() => {
        this.$router.replace('/user');
      }, 5000);
    },
  },
  created() {
    // URI로부터 인증에 필요한 변수를 추출한다.
    const uidb64 = this.$route.params.uidb64;
    const token = this.$route.params.token;
    // axios GET 통신을 사용해 이메일 인증.
    axios.get(`http://localhost:8000/api/user/activate/${uidb64}/${token}`)
    .then(response => {
      this.resonpseMsg = response.data;
      this.isActivated = true;
      this.startRedirectTimer();
    })
    .catch(error => {
      this.resonpseMsg = error.response.data;
      this.isActivated = false;
      this.startRedirectTimer();
    })
  }
};
</script>

<style>
</style>