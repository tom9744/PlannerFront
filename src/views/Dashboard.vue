<template>
  <!-- <v-responsive min-height="100vh"> -->
  <v-container
    style="background: linear-gradient(180deg, #5C6BC0, #9FA8DA);"
    class="white--text fill-height"
    fluid
  >
    <!-- <v-responsive class="mx-auto pa-6" min-height="100vh" max-width="1304px"> -->
    <v-container class="pa-0">
      <v-row align="center" justify="center" class="mb-6">
        <v-col cols="12" align="center">
          <!-- 현재 시각 컴포넌트 -->
          <dashboard-time></dashboard-time>
        </v-col>
      </v-row>

      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <!-- 현재 날씨 정보 컴포넌트 -->
          <dashboardWeather :coords="getCoords"></dashboardWeather>
        </v-col>

        <v-col cols="12" sm="8" md="6" lg="4">
          <!-- 날씨 정보 검색창 컴포넌트 -->
          <dashboardSearch></dashboardSearch>
        </v-col>
      </v-row>
    </v-container>
    <!-- </v-responsive> -->
  </v-container>
  <!-- </v-responsive> -->
</template>

<script>
import Time from "../components/dashboard/Time.vue";
import Weather from "../components/dashboard/Weather.vue";
import Search from "../components/dashboard/Search.vue";

export default {
  components: {
    dashboardTime: Time,
    dashboardWeather: Weather,
    dashboardSearch: Search
  },
  data() {
    return {
      flag: false
    };
  },
  computed: {
    // 사용자의 검색 여부를 나타내는 플래그
    isSubmitted() {
      const coords = this.$store.getters["weather/getCoordsData"];

      if (coords.latitude == null || coords.longitude == null) {
        return false;
      } else {
        return true;
      }
    },
    getCoords() {
      const coords = this.$store.getters["weather/getCoordsData"];
      return {
        addressName: coords.addressName,
        latitude: coords.latitude,
        longitude: coords.longitude
      };
    }
  }
};
</script>

<style scoped></style>
