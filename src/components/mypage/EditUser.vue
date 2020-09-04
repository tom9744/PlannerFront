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
          :disabled="!valid || passwordLoading"
          :loading="passwordLoading"
          @click="onPasswordChange"
          >변경</v-btn
        >
      </v-card-actions>
    </v-card>

    <!-- 스낵바 -->
    <v-snackbar v-model="snackbar">
      <span>{{ snackbarMsg }}</span>

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          닫기
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  computed: {
    passwordLoading: {
      get() {
        return this.$store.getters["mypage/progCircle"];
      },
      // Vuex State를 v-model에 사용하기 위해서는 setter를 설정해야한다.
      set(newValue) {
        this.$store.commit("mypage/fetchProgCircle", newValue);
      }
    },
    snackbar: {
      get() {
        return this.$store.getters["mypage/showSnackbar"];
      },
      // Vuex State를 v-model에 사용하기 위해서는 setter를 설정해야한다.
      set() {
        this.$store.commit("mypage/fetchSnackbar", {
          flag: false,
          message: null
        });
      }
    },
    snackbarMsg() {
      return this.$store.getters["mypage/snackbarMsg"];
    }
  },
  data() {
    return {
      valid: false,

      password: "",
      password_confirm: "",

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
      }
    };
  },
  methods: {
    onPasswordChange() {
      this.$store.dispatch("mypage/changePassword", {
        password: this.password,
        password_confirm: this.password_confirm
      });
    }
  }
};
</script>

<style></style>
