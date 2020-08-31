<template>
  <div>
    <!-- <v-alert v-if="isRegistrationFailed" type="warning">회원가입에 실패했습니다. 다시 확인해주세요!</v-alert> -->
    <v-card class="mx-auto elevation-12" max-width="400">
      <v-toolbar color="indigo lighten-1" dark flat>
        <v-toolbar-title>회원가입</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <p align="center">
          모든 항목을 입력하시면 회원가입 버튼이 활성화됩니다.
        </p>
        <v-form ref="form" v-model="valid">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                label="이메일"
                prepend-icon="mdi-at"
                v-bind="attrs"
                v-on="on"
                v-model="email"
                :rules="[required('이메일'), isEmail('이메일')]"
              ></v-text-field>
            </template>
            <span>본인인증, 로그인에 사용될 이메일 주소입니다.</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                label="비밀번호"
                prepend-icon="mdi-lock"
                type="password"
                v-bind="attrs"
                v-on="on"
                v-model="password"
                :rules="[
                  required('비밀번호'),
                  minLength('비밀번호', 8),
                  checkPassword()
                ]"
              ></v-text-field>
            </template>
            <span>비밀번호는 최소 8자여야합니다.</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                label="비밀번호 확인"
                prepend-icon="mdi-lock"
                type="password"
                v-bind="attrs"
                v-on="on"
                v-model="password_confirm"
                :rules="[
                  required('비밀번호 확인'),
                  minLength('비밀번호 확인', 8),
                  isPasswordIdentical()
                ]"
              ></v-text-field>
            </template>
            <span>오/탈자를 방지하기위해 다시 한번 입력합니다.</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                label="이름"
                prepend-icon="mdi-account-circle"
                v-bind="attrs"
                v-on="on"
                v-model="name"
                counter="10"
                :rules="[required('이름'), maxLength('이름', 10)]"
              ></v-text-field>
            </template>
            <span>초기 별명으로 설정될 이름입니다.</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                label="생년월일"
                prepend-icon="mdi-calendar-month"
                type="date"
                v-bind="attrs"
                v-on="on"
                v-model="birthday"
                :rules="[required('생년월일')]"
              ></v-text-field>
            </template>
            <span>생년월일은 YYYY-MM-DD 양식을 따릅니다.</span>
          </v-tooltip>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="ma-1"
          color="indigo lighten-1 white--text"
          to="/user"
          exact
          >돌아가기</v-btn
        >
        <v-btn
          class="ma-1"
          color="indigo lighten-1 white--text"
          :disabled="!valid"
          @click="onRegister"
          >회원가입</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
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
      maxLength(propertyType, maxLength) {
        return value =>
          (value && value.length <= maxLength) ||
          `${propertyType} 항목은 ${maxLength} 글자를 넘을 수 없습니다.`;
      },
      isEmail(propertyType) {
        const emialReg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]*\.[a-zA-Z]{2,3}$/i; // 이메일 정규 표현식
        return value =>
          emialReg.test(value) || `${propertyType} 형식이 맞지 않습니다.`;
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

      email: "",
      password: "",
      password_confirm: "",
      name: "",
      birthday: ""
    };
  },
  computed: {
    isRegistrationFailed() {
      return this.$store.getters.isRegistrationFailed;
    }
  },
  methods: {
    onRegister() {
      const formData = {
        email: this.email,
        password: this.password,
        password_confirm: this.password_confirm,
        birthday: this.birthday,
        name: this.name
      };

      this.$store.dispatch("register", formData);
    }
  }
};
</script>

<style></style>
