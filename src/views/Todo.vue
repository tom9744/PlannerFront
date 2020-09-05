<template>
  <v-responsive min-height="100vh">
    <v-container
      style="background: linear-gradient(180deg, #5C6BC0, #9FA8DA);"
      class="white--text"
      fluid
    >
      <v-responsive class="mx-auto pa-6" min-height="50vh" max-width="1304px">
        <!-- 새로운 항목을 입력하는 부분 -->
        <todoForm></todoForm>
      </v-responsive>
    </v-container>

    <v-container class="black--text" fluid>
      <v-responsive class="mx-auto pa-6" min-height="50vh" max-width="1304px">
        <todoList></todoList>
      </v-responsive>
    </v-container>
  </v-responsive>
</template>

<script>
import Form from "../components/todo-list/InputForm.vue";
import TodoList from "../components/todo-list/TodoList.vue";

export default {
  components: {
    todoForm: Form,
    todoList: TodoList
  }
};
</script>

<style scoped></style>
