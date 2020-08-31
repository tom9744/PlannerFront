<template>
  <div v-if="currentHour != null">
    <p class="title">
      {{ currentMonth }}월 {{ currentDate }}일
      {{ days[currentDay] }}
    </p>
    <p class="display-2">
      {{ timeFormatter(currentHour) }} : {{ timeFormatter(currentMinute) }} :
      {{ timeFormatter(currentSecond) }}
    </p>
  </div>
</template>

<script>
export default {
  created() {
    this.getCurrentDate(); // 현재의 월, 일, 요일을 가져온다
    this.getCurrentTime(); // 현재의 시간, 분, 초를 가져온다.
    this.startTimer(); // 타이머를 작동한다.
  },
  data() {
    return {
      currentMonth: null,
      currentDate: null,
      currentDay: null,

      days: [
        "일요일",
        "월요일",
        "화요일",
        "수요일",
        "목요일",
        "금요일",
        "토요일",
      ],

      currentHour: null,
      currentMinute: null,
      currentSecond: null,
    };
  },
  methods: {
    getCurrentDate() {
      // Month는 0월부터 11일까지이므로, +1 해주어야 한다.
      this.currentMonth = new Date().getMonth() + 1;
      this.currentDate = new Date().getDate();
      this.currentDay = new Date().getDay();
    },

    getCurrentTime() {
      this.currentHour = new Date().getHours();
      this.currentMinute = new Date().getMinutes();
      this.currentSecond = new Date().getSeconds();
    },

    startTimer() {
      setInterval(() => {
        this.getCurrentTime();

        // 다음 날로 넘어가는 경우, getCurrentDate() 호출하여 정보 수정.
        if (
          this.currentHour == 23 &&
          this.currentMinute == 59 &&
          this.currentSecond == 59
        ) {
          this.getCurrentDate();
        }
      }, 1000);
    },

    timeFormatter(time) {
      // 각 값이 한자리 수인 경우, 앞에 '0'을 추가한다.
      return time < 10 ? `0${time}` : time;
    },
  },
};
</script>

<style></style>
