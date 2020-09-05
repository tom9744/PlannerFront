<template>
  <v-card class="mx-auto" max-width="400px" height="275px">
    <v-card-title class="px-6">
      <p class="title mb-0">{{ weatherData.location }}</p>
      <v-spacer></v-spacer>
      <!-- beforeUpdate() 라이프사이클 훅을 사용하기 위해 어쩔 수 없이 입력한 위도, 경도 필드 (Props가 있을 시에만 작동) -->
      <p class="body-2 mb-0" v-if="coords.addressName != null">
        ({{ Math.round(coords.latitude) }}, {{ Math.round(coords.longitude) }})
      </p>
    </v-card-title>

    <v-card-text class="pb-0">
      <v-container class="py-0">
        <!-- 날씨 정보를 불러오는 동안 표시할 로딩 화면 -->
        <v-row align="center" justify="center" class="py-8" v-if="isLoading">
          <v-col align="center">
            <app-loading class="mb-6"></app-loading>
            <p>날씨 정보를 불러오고 있습니다...</p>
          </v-col>
        </v-row>

        <!-- 날씨 정보 로딩 완료시, 지역의 날씨 정보를 출력 -->
        <div v-if="!isLoading">
          <div style="height: 145px;">
            <v-row align="center" justify="center">
              <v-col cols="5">
                <!-- 날씨 온도, 상태 정보 -->
                <p class="display-1 mb-1">
                  {{ Math.floor(weatherData.temp) }}&deg;C
                </p>
                <p class="title">{{ weatherData.description }}</p>
              </v-col>
              <v-col cols="5" align="center">
                <!-- 날씨 정보 이미지 -->
                <v-img
                  :src="
                    `https://openweathermap.org/img/wn/${weatherData.iconId}@2x.png`
                  "
                  alt="Weahter image"
                  width="125px"
                ></v-img>
              </v-col>
            </v-row>
          </div>

          <v-divider></v-divider>

          <v-list-item class="py-2">
            <v-row align="center" justify="center">
              <v-col cols="6" class="px-0">
                <v-icon>mdi-thermometer-high</v-icon>
                <span class="body-2"
                  >체감온도 {{ weatherData.feels_like }}&deg;C</span
                >
              </v-col>

              <v-col cols="6" class="px-0">
                <v-icon>mdi-water-percent</v-icon>
                <span class="body-2"
                  >대기습도 {{ weatherData.humidity }}&percnt;</span
                >
              </v-col>
            </v-row>
          </v-list-item>
        </div>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import Loading from "./Loading.vue";

export default {
  components: {
    appLoading: Loading
  },
  props: {
    coords: {
      type: Object
    }
  },
  created() {
    // Props로 전달된 데이터가 있는 경우 실행되는 로직.
    if (this.coords.addressName != null) {
      this.$store.dispatch("weather/getWeather", {
        latitude: this.coords.latitude,
        longitude: this.coords.longitude
      });
    }
    // Props로 전될된 데이터가 없는 경우 (undefined) 실행되는 로직.
    else {
      navigator.geolocation.getCurrentPosition(
        position => {
          const currentCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          this.$store.dispatch("weather/getWeather", currentCoords);
        },
        error => {
          alert("현재 위치 정보를 가져올 수 없습니다.");
          console.log(error);
        }
      );
    }
  },
  beforeUpdate() {
    // 컴포넌트 내용이 업데이트 되는 경우 실행되는 로직
    if (this.coords.addressName != null) {
      this.$store.dispatch("weather/getWeather", {
        latitude: this.coords.latitude,
        longitude: this.coords.longitude
      });
    }
  },
  computed: {
    // 로딩 완료 여부 플래그
    isLoading() {
      return this.$store.getters["weather/getStatus"];
    },
    // 날씨 정보 데이터
    weatherData() {
      return this.$store.getters["weather/getWeatherDate"];
    }
  }
};
</script>

<style></style>
