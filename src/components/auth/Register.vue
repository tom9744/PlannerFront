<template>
  <div>
    <v-card class="mx-auto elevation-12" max-width="400">
      <v-toolbar color="indigo lighten-1" dark flat>
        <v-toolbar-title>회원가입</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <p align="center">
          모든 항목을 입력하시면 회원가입 버튼이 활성화됩니다.
        </p>
        <v-form ref="form" v-model="valid">
          <v-text-field
            label="이메일"
            prepend-icon="mdi-at"
            v-model="email"
            hint="인증과정에 사용되니, 정확하게 입력해주세요."
            persistent-hint
            :rules="[required('이메일'), isEmail('이메일')]"
          ></v-text-field>

          <v-text-field
            label="비밀번호"
            prepend-icon="mdi-lock"
            type="password"
            hint="한/영키 여부를 확인해주세요."
            persistent-hint
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

          <v-text-field
            label="이름"
            prepend-icon="mdi-account-circle"
            v-model="name"
            counter="10"
            :rules="[required('이름'), maxLength('이름', 10)]"
          ></v-text-field>

          <v-text-field
            label="생년월일"
            prepend-icon="mdi-calendar-month"
            type="date"
            hint="만 18세 이상만 가입 가능합니다."
            persistent-hint
            v-model="birthday"
            :rules="[required('생년월일'), isFromFuture(), isUnderAge()]"
          ></v-text-field>
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
          :disabled="!valid || loading"
          :loading="loading"
          @click="onRegister"
          >회원가입</v-btn
        >
      </v-card-actions>
    </v-card>

    <!-- 스낵바 -->
    <v-snackbar v-model="isFailed">
      <span v-for="(item, index) in errorData" :key="index"
        >{{ item }} <br
      /></span>

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="isFailed = false">
          닫기
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      // Form 유효성 관련 플래그
      valid: false,

      // 회원가입 실패 여부 플래그
      isFailed: false,
      errorData: null,

      // 회원가입 버튼 클릭시 Loading 상태로 변경하기 위한 플래그
      loading: false,

      /* 각종 유효성 검사 규칙 */
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
      isFromFuture() {
        const today = new Date();
        return value => today - new Date(value) > 0 || "미래에서 오셨나요?";
      },
      isUnderAge() {
        const today = new Date();
        return value =>
          today.getFullYear() - new Date(value).getFullYear() > 18 ||
          "만 18세 이상만 가입할 수 있습니다.";
      },

      email: "",
      password: "",
      password_confirm: "",
      name: "",
      birthday: ""
    };
  },
  methods: {
    onRegister() {
      this.loading = true;

      const formData = {
        email: this.email,
        password: this.password,
        password_confirm: this.password_confirm,
        birthday: this.birthday,
        name: this.name
      };

      axios
        .post(`/api/user/register`, formData)
        .then(() => {
          // 회원가입 성공 시, 웰컴 페이지로 리디렉트 한다.
          this.$router.replace("/user/welcome");
        })
        .catch(error => {
          const errorResponse = error.response;
          let errors = [];

          // Not Found(404) 에러 처리
          if (errorResponse.status == 404) {
            errors.push("서버 연결이 원활하지 못합니다. 잠시 후 시도해주세요.");
          }

          // Bad Request(400) 에러 처리
          if (errorResponse.status == 400) {
            // 회원가입 오류 시, 서버로부터 반환된 에러 데이터를 가져온다.
            const errorData = errorResponse.data;

            // 에러 데이터를 파싱하여 배열에 저장한다.
            for (let field in errorData) {
              errors.push(errorData[field].pop());
            }
          }

          // 에러 메세지를 저장하고, 플래그를 수정한다.
          this.errorData = errors;
          this.isFailed = true;
          this.loading = false;
        });
    }
  }
};
</script>

<style></style>
