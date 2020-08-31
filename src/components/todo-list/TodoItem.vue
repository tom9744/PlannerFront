<template>
  <v-container class="py-1">
    <v-row v-for="item in filteredTodos" :key="item.id" align="center">
      <!-- 체크 박스 영역 -->
      <v-col cols="1" class="py-0">
        <v-checkbox
          color="indigo"
          v-model="item.is_complete"
          @click="onToggle(item.id)"
        ></v-checkbox>
      </v-col>
      <!-- 할일 내용 영역 -->
      <v-col cols="5">
        <p class="mb-0">
          {{ item.title }}
        </p>
      </v-col>
      <!-- 중요도 영역 -->
      <v-col cols="3" align="end">
        <p class="mb-0">
          <span>{{ priorityEmojis[item.importance] }}</span>
          {{ priorityLevel[item.importance] }}
        </p>
      </v-col>
      <!-- 수정, 삭제 버튼 영역 -->
      <v-col cols="3" align="end">
        <!-- 자신이 작성한 경우에만 수정, 삭제 아이콘 표시 -->
        <div v-if="item.user == userEmail">
          <!-- 다이얼로그에 해당 아이템의 id 값을 props로 넘긴다. -->
          <todoDialog :item-id="item.id"></todoDialog>
          <v-btn icon small @click="onDelete(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row v-if="todos.length == 0" class="text-center">
      <v-col>
        <p class="text-h6 mb-0">투두리스트에 내용을 추가해주세요.</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TodoDialog from "./TodoDialog.vue";

export default {
  components: {
    todoDialog: TodoDialog
  },
  computed: {
    todos() {
      return this.$store.getters.todos;
    },
    filteredTodos() {
      return this.$store.getters.filteredTodos;
    },
    userEmail() {
      return this.$store.getters.getUserEmail;
    }
  },
  data() {
    return {
      priorityLevel: ["싫어", "별로", "보통", "좋아", "최고"],
      priorityEmojis: ["😭", "🙁", "😐", "😊", "😍"]
    };
  },
  methods: {
    onToggle(id) {
      // 클릭된 체크박스에 해당하는 ID와 일치하는 투두리스트 항목의 is_complete 항목을 토글한다.
      this.$store.dispatch("toggleTodo", { id: id });
    },
    onDelete(id) {
      // 클릭된 체크박스가 위치한 항목의 ID에 해당하는 내용을 수정한다.
      this.$store.dispatch("deleteTodo", { id: id });
    }
  }
};
</script>

<style></style>
