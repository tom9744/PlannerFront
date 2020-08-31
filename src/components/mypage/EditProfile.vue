<template>
  <v-card class="mx-auto elevation-12" max-width="400">
    <v-toolbar color="indigo lighten-1" dark flat>
      <v-toolbar-title>프로필 편집</v-toolbar-title>
    </v-toolbar>

    <v-card-title class="pa-3">
      <v-row>
        <v-col cols="12" align="center" class="pa-1">
          <v-avatar color="grey darken-3" size="72px" class="elevation-6">
            <img :src="getUserData.avatar" />
          </v-avatar>
        </v-col>
        <v-col cols="12" align="center" class="pt-0">
          <span
            class="body-2 indigo--text font-weight-medium"
            style="cursor: pointer"
            @click="onClick"
          >
            프로필 사진 변경
          </span>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text>
      <v-form class="px-6 py-0" v-model="valid" @submit.prevent="">
        <v-text-field
          counter="10"
          hint="별명을 변경할 수 있습니다."
          persistent-hint
          solo
          dense
          :label="this.getUserData.nickname"
          :rules="[
            required('별명'),
            minLength('별명', 2),
            maxLength('별명', 10)
          ]"
          v-model="nickname"
        ></v-text-field>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <router-link to="/mypage/user/" style="text-decoration: none;">
        <span
          class="body-2 ml-2 indigo--text font-weight-medium"
          style="cursor: pointer"
        >
          비밀번호 변경
        </span>
      </router-link>

      <v-spacer></v-spacer>
      <v-btn
        class="ma-1"
        color="indigo lighten-1 white--text"
        to="/mypage"
        exact
        >돌아가기</v-btn
      >
      <v-btn
        class="ma-1"
        color="indigo lighten-1 white--text"
        :disabled="!valid || loading"
        :loading="loading"
        @click="onSubmit"
        >완료</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  computed: {
    getAccessToken() {
      return this.$store.getters.getAccessToken;
    },
    getUserData() {
      return !this.$store.getters.getUserData
        ? false
        : this.$store.getters.getUserData;
    }
  },
  data() {
    return {
      nickname: "",

      loader: null,
      loading: false,

      valid: false,

      required(propertyType) {
        return value => !!value || `${propertyType}은 공백일 수 없습니다.`;
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
      }
    };
  },
  watch: {
    loader() {
      const loading = this.loader;
      this[loading] = !this[loading];

      setTimeout(() => (this[loading] = false), 3000);

      this.loader = null;
    }
  },
  methods: {
    onClick() {},
    onSubmit() {
      this.loader = "loading";

      this.$http
        .put(
          "http://127.0.0.1:8000/api/user/me/",
          { nickname: this.nickname },
          {
            headers: {
              Authorization: `Bearer ${this.getAccessToken}`
            }
          }
        )
        .then(() => {
          this.$router.replace("/mypage"); // 이전 화면으로 새로고침
        })
        .catch(error => {
          console.log(error.response);
          // TODO - 상세 라우팅 등...
          alert("프로필 수정에 실패했습니다. 새로고침 후 시도해주세요.");
        });
    }
  }
};
</script>

<style></style>
