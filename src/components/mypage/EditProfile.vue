<template>
  <div>
    <v-card class="mx-auto elevation-12" max-width="400">
      <v-toolbar color="indigo lighten-1" dark flat>
        <v-toolbar-title>프로필 편집</v-toolbar-title>
        <!-- 아바타 이미지 변경 시 로딩화면 -->
        <v-progress-linear
          :active="avatarLoading"
          :indeterminate="avatarLoading"
          absolute
          bottom
          color="white"
        ></v-progress-linear>
      </v-toolbar>

      <v-card-title class="pa-3">
        <v-row>
          <v-col cols="12" align="center" class="pa-1">
            <!-- 아바타 이미지 부분 -->
            <v-avatar size="72px" color="grey lighten-1" class="elevation-6">
              <!-- 유저 데이터에 있는 아바타 이미지 -->
              <v-img
                v-if="imgURL == null && userData.avatar != null"
                :src="userData.avatar"
              />
              <!-- 아바타 변경 시 미리보기 이미지 -->
              <v-img v-if="imgURL != null" :src="imgURL" />
            </v-avatar>
          </v-col>
          <v-col cols="12" align="center" class="pt-0">
            <span
              class="body-2 indigo--text"
              style="cursor: pointer"
              @click="onAvatarChange"
            >
              프로필 사진 변경
            </span>
            <input
              v-show="false"
              type="file"
              accept="image/*"
              ref="uploader"
              @change="onSelection"
            />
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
            :label="this.userData.nickname"
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
          :disabled="!valid || nicknameLoading"
          :loading="nicknameLoading"
          @click="onNicknameChange"
          >완료</v-btn
        >
      </v-card-actions>
    </v-card>

    <!-- 스낵바 메세지 -->
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
    getAccessToken() {
      return this.$store.getters.getAccessToken;
    },
    userData() {
      return this.$store.getters["userInfo/userInformation"];
    },
    nicknameLoading: {
      get() {
        return this.$store.getters["userInfo/isNicknameLoading"];
      },
      // Vuex State를 v-model에 사용하기 위해서는 setter를 설정해야한다.
      set(newValue) {
        this.$store.commit("userInfo/fetchNicknameLoading", newValue);
      }
    },
    avatarLoading: {
      get() {
        return this.$store.getters["userInfo/isAvatarLoading"];
      },
      // Vuex State를 v-model에 사용하기 위해서는 setter를 설정해야한다.
      set(newValue) {
        this.$store.commit("userInfo/fetchAvatarLoading", newValue);
      }
    },
    snackbar: {
      get() {
        return this.$store.getters["userInfo/showSnackbar"];
      },
      // Vuex State를 v-model에 사용하기 위해서는 setter를 설정해야한다.
      set() {
        this.$store.commit("userInfo/fetchUserInfoSnackbar", {
          flag: false,
          message: null
        });
      }
    },
    snackbarMsg() {
      return this.$store.getters["userInfo/snackbarMsg"];
    }
  },
  data() {
    return {
      nickname: "",

      // Form 유효성 플래그
      valid: false,

      // 변경된 아바타 이미지 미리보기 URL
      imgURL: null,

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
  methods: {
    onNicknameChange() {
      this.$store.dispatch("userInfo/changeNickname", {
        nickname: this.nickname
      });
    },
    onAvatarChange() {
      this.$refs.uploader.click();
    },
    onSelection(event) {
      this.avatarLoading = true;
      // 이벤트 객체로부터 파일 정보를 가져온다.
      const file = event.target.files[0];

      this.$store.dispatch("userInfo/changeAvatar", {
        file
      });
    }
  }
};
</script>

<style></style>
