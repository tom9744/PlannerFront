<template>
  <v-card class="mx-auto elevation-12" max-width="400">
    <v-toolbar color="indigo lighten-1" dark flat>
      <v-toolbar-title>로그인</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card-text>
      <v-form v-model="valid">
        <v-text-field
          label="이메일"
          prepend-icon="mdi-at"
          v-model="email"
          :rules="[required('이메일')]"
        ></v-text-field>

        <v-text-field
          label="비밀번호"
          prepend-icon="mdi-lock"
          type="password"
          v-model="password"
          :rules="[required('비밀번호')]"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="indigo lighten-1 white--text" to="/user" exact
        >돌아가기</v-btn
      >
      <v-btn
        color="indigo lighten-1 white--text"
        :disabled="!valid"
        @click="onLogin"
        >로그인</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",

      valid: false,

      required(propertyType) {
        return value => !!value || `${propertyType}은 필수 입력 항목입니다.`;
      }
    };
  },
  methods: {
    onLogin() {
      const formData = {
        email: this.email,
        password: this.password
      };
      this.$store.dispatch("login", formData);
    }
  }
};
</script>

<style></style>
