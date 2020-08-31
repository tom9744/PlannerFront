<template>
  <v-responsive min-height="100vh">
    <v-container
      style="background: linear-gradient(180deg, #5C6BC0, #9FA8DA);"
      class="white--text"
      fluid
    >
      <v-responsive class="mx-auto pa-6" min-height="50vh" max-width="1304px">
        <v-container class="pa-0">
          <v-row justify="center" align="center">
            <v-col cols="12" sm="10" md="8" lg="6">
              <!-- 새로운 항목을 입력하는 부분 -->
              <todoForm></todoForm>
            </v-col>
          </v-row>
        </v-container>
      </v-responsive>
    </v-container>

    <v-container class="black--text" fluid>
      <v-responsive class="mx-auto pa-6" min-height="50vh" max-width="1304px">
        <v-container class="pa-0">
          <v-row justify="center" align="center">
            <v-col cols="12" align="center">
              <p class="display-1">이제 무엇을 할지 정해보세요!</p>
              <p class="text-subtitle-1">
                모두가 함께 공유하는 할일 리스트입니다. <br />
                각 항목에 대한 자세한 내용을 확인 및 수정하려면 해당 항목을
                클릭하세요.
              </p>
            </v-col>
          </v-row>

          <v-row justify="center" align="center">
            <v-col cols="12" sm="10" md="8" lg="6">
              <todoList></todoList>
            </v-col>
          </v-row>
        </v-container>
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
