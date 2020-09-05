<template>
  <v-card class="mx-auto" max-width="400px" height="275px">
    <v-card-title class="px-6">
      <p class="title mb-0">지역 날씨 검색</p>
    </v-card-title>

    <v-card-text class="pt-10 pb-6">
      <!-- 검색어 입력 부분 -->
      <v-form class="px-6" v-model="valid" @submit.prevent="">
        <v-text-field
          placeholder="지역명 (시, 군, 구, 동..)"
          v-model="queryLocation"
          clearable
          solo
          :rules="[required()]"
        ></v-text-field>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <!-- 검색 버튼 부분 -->
      <v-spacer></v-spacer>
      <v-btn
        class="ma-3"
        color="indigo lighten-1 white--text"
        :disabled="!valid"
        @click="onClick"
        >날씨 검색</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      queryLocation: "",

      valid: false,

      required() {
        return value => !!value || `검색어를 입력해주시기 바랍니다.`;
      }
    };
  },
  methods: {
    onClick() {
      // 사용자가 입력한 정보에 해당하는 좌표값을 구한다.
      this.$store.dispatch("weather/getCoords", this.queryLocation);
    }
  }
};
</script>

<style></style>
