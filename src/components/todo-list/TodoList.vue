<template>
  <v-card class="mx-auto elevation-6">
    <v-container class="py-0">
      <!-- 투두리스트 헤더 부분 -->
      <todoHeader></todoHeader>

      <v-divider></v-divider>

      <!-- 투두리스트 항목을 출력하는 부분 -->
      <todoItem></todoItem>
    </v-container>
  </v-card>
</template>

<script>
import TodoItem from "./TodoItem.vue";
import TodoHeader from "./TodoHeader.vue";

export default {
  created() {
    this.$store.dispatch("getAllTodos");
  },
  components: {
    todoItem: TodoItem,
    todoHeader: TodoHeader
  }
};
</script>

<style></style>
