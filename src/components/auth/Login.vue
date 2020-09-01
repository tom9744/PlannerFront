<template>
  <div>
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
            hint="한/영키 여부를 확인해주세요."
            persistent-hint
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
          :disabled="!valid || isLoading"
          :loading="isLoading"
          @click="onLogin"
          >로그인</v-btn
        >
      </v-card-actions>
    </v-card>

    <!-- 스낵바 -->
    <v-snackbar v-model="isError" timeout="3000">
      {{ errorMessage }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="isError = null">
          닫기
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  computed: {
    errorMessage() {
      return this.$store.getters.getLoginErrorMsg;
    },
    isError: {
      get() {
        return this.$store.getters.getLoginErrorMsg != null;
      },
      set() {
        // 입력 값에 상관없이 무조건 null로 값을 설정한다.
        this.$store.commit("fetchLoginErrorMsg", null);
      }
    },
    isLoading: {
      get() {
        return this.$store.getters.getLoadingStatus;
      },
      // Vuex State를 v-model에 사용하기 위해서는 setter를 설정해야한다.
      set(newValue) {
        this.$store.commit("fetchLoading", newValue);
      }
    }
  },
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
