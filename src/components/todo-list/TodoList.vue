<template>
  <v-container class="pa-0">
    <v-row justify="center" align="center">
      <v-col cols="12" align="center">
        <p class="display-1">이제 무엇을 할지 정해보세요!</p>
        <p class="text-subtitle-1">
          모두가 함께 공유하는 할일 리스트입니다. <br />
          자신이 등록한 할일만 수정 가능합니다.
        </p>
      </v-col>
    </v-row>

    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="10" lg="8">
        <v-container class="elevation-6 rounded">
          <!-- 투두리스트 헤더 부분 -->
          <v-toolbar flat>
            <todoHeader></todoHeader>
          </v-toolbar>

          <v-divider></v-divider>

          <v-card class="mx-auto overflow-y-auto" height="60vh" flat>
            <!-- 투두리스트 항목을 출력하는 부분 -->
            <todoItem></todoItem>
          </v-card>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
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
