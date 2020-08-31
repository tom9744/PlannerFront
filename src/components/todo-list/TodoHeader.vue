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
      md="6"
      class="text-center text-sm-left text-md-left text-lg-left"
    >
      <span class="indigo--text text-h6 text-weight-light"
        >총 {{ numOfInProcess }}개의 대기중 항목</span
      >
    </v-col>

    <v-col cols="4" sm="2" md="2" align="center">
      <v-btn @click="onFilter('전체')" small outlined color="indigo">
        <v-badge :content="numOfTodos" :value="numOfTodos" color="indigo"
          >전체</v-badge
        >
      </v-btn>
    </v-col>

    <v-col cols="4" sm="2" md="2" align="center">
      <v-btn @click="onFilter('대기')" small outlined color="green">
        <v-badge :content="numOfInProcess" :value="numOfInProcess" color="green"
          >대기</v-badge
        >
      </v-btn>
    </v-col>

    <v-col cols="4" sm="2" md="2" align="center">
      <v-btn @click="onFilter('완료')" small outlined color="red">
        <v-badge :content="numOfCompleted" :value="numOfCompleted" color="red"
          >완료</v-badge
        >
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  computed: {
    numOfTodos() {
      return this.$store.getters.todos.length;
    },
    numOfCompleted() {
      return this.$store.getters.numOfCompletedTodos;
    },
    numOfInProcess() {
      return this.$store.getters.numOfInProcessTodos;
    }
  },
  methods: {
    onFilter(filterName) {
      this.$store.dispatch("filterTodos", filterName);
    }
  }
};
</script>

<style></style>
