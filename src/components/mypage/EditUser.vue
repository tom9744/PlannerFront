<template>
  <div>
    <v-card class="mx-auto elevation-12" max-width="400">
      <v-toolbar color="indigo lighten-1" dark flat>
        <v-toolbar-title>비밀번호 변경</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-form v-model="valid">
          <v-text-field
            label="비밀번호"
            prepend-icon="mdi-lock"
            type="password"
            v-model="password"
            :rules="[
              required('비밀번호'),
              minLength('비밀번호', 8),
              checkPassword()
            ]"
          ></v-text-field>

          <v-text-field
            label="비밀번호 확인"
            prepend-icon="mdi-lock"
            type="password"
            v-model="password_confirm"
            :rules="[
              required('비밀번호 확인'),
              minLength('비밀번호 확인', 8),
              isPasswordIdentical()
            ]"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="ma-1"
          color="indigo lighten-1 white--text"
          to="/mypage/profile"
          exact
          >돌아가기</v-btn
        >
        <v-btn
          class="ma-1"
          color="indigo lighten-1 white--text"
          :disabled="!valid"
          @click="onPassChange"
          >변경</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  computed: {
    getAccessToken() {
      return this.$store.getters.getAccessToken;
    }
  },
  data() {
    return {
      valid: false,

      required(propertyType) {
        return value => !!value || `${propertyType}은 필수 입력 항목입니다.`;
      },
      minLength(propertyType, minLength) {
        return value =>
          (value && value.length >= minLength) ||
          `${propertyType} 항목은 최소 ${minLength} 글자입니다.`;
      },
      isPasswordIdentical() {
        return value =>
          (value && value == this.password) || `비밀번호가 일치하지 않습니다.`;
      },
      checkPassword() {
        const passwordReg = /^[0-9a-zA-Z~!@#$%^&*]{8,}$/;
        return value =>
          passwordReg.test(value) ||
          `영문 대소문자 및 특수기호(!,@,#,$,%,^,&,*)만 사용할 수 있습니다.`;
      },

      password: "",
      password_confirm: ""
    };
  },
  methods: {
    onPassChange() {
      console.log(this.getAccessToken);

      this.$http
        .patch(
          "/api/user/me/edit",
          { password: this.password, password_confirm: this.password_confirm },
          { headers: { Authorization: `Bearer ${this.getAccessToken}` } }
        )
        .then(() => {
          this.$router.replace("/mypage");
        })
        .catch(error => {
          console.log(error.response);
          // TODO - 상세 라우팅 등...
          alert("비밀번호 변경에 실패했습니다. 새로고침 후 시도해주세요.");
        });
    }
  }
};
</script>

<style></style>
