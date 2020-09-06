<template>
  <v-row class="mx-auto py-2" align="center">
    <v-progress-linear
      absolute
      top
      color="indigo lighten-1"
      :value="(numOfCompleted / numOfTodos) * 100"
    ></v-progress-linear>

    <v-col
      cols="12"
      sm="6"
      class="text-center text-sm-left d-none d-sm-flex pl-0"
    >
      <span class="indigo--text text-h6 text-weight-light">
        총 {{ numOfInProcess }}개의 대기중 항목
      </span>
    </v-col>

    <v-col
      cols="4"
      sm="2"
      align="center"
      v-for="btn in buttons"
      :key="btn.title"
    >
      <v-btn small outlined :color="btn.color" @click="onFilter(btn.title)">
        <v-badge
          v-if="btn.title == '전체'"
          :content="numOfTodos"
          :value="numOfTodos"
          :color="btn.color"
          >{{ btn.title }}</v-badge
        >
        <v-badge
          v-if="btn.title == '대기'"
          :content="numOfInProcess"
          :value="numOfInProcess"
          :color="btn.color"
          >{{ btn.title }}</v-badge
        >
        <v-badge
          v-if="btn.title == '완료'"
          :content="numOfCompleted"
          :value="numOfCompleted"
          :color="btn.color"
          >{{ btn.title }}</v-badge
        >
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  computed: {
    numOfTodos() {
      return this.$store.getters["todolist/todos"].length;
    },
    numOfCompleted() {
      return this.$store.getters["todolist/numOfCompletedTodos"];
    },
    numOfInProcess() {
      return this.$store.getters["todolist/numOfInProcessTodos"];
    }
  },
  data() {
    return {
      buttons: [
        { title: "전체", color: "indigo" },
        { title: "대기", color: "green" },
        { title: "완료", color: "red" }
      ]
    };
  },
  methods: {
    onFilter(filterName) {
      this.$store.dispatch("todolist/filterTodos", filterName);
    }
  }
};
</script>

<style></style>
