<template>
  <v-container class="py-1">
    <v-row v-for="item in filteredTodos" :key="item.id" align="center">
      <!-- 사용자 아바타 (BreakPoint 'sm' 이상에서만 표시) -->
      <v-col sm="1" align="center" class="pa-2 hidden-xs-only">
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-avatar
              size="36px"
              color="grey lighten-1"
              v-bind="attrs"
              v-on="on"
            >
              <!-- 유저 데이터에 있는 아바타 이미지 -->
              <span v-if="item.profile.avatar == null" class="text-caption"
                >{{ item.profile.nickname }}
              </span>
              <v-img v-else :src="item.profile.avatar" />
            </v-avatar>
          </template>
          <span>작성자: {{ item.profile.nickname }}님</span>
        </v-tooltip>
      </v-col>

      <!-- 할일 영역 및 수정 삭제 버튼 -->
      <v-col cols="11" sm="8" class="pa-2">
        <v-row justify="space-between" align="center">
          <!-- 할일 본문 내용 -->
          <v-col cols="auto">
            <!-- BreakPoint 'sm' 이상일 때 -->
            <todoDetail
              :item-id="item.id"
              :item-title="item.title"
            ></todoDetail>

            <!-- BreakPoint 'xs' 일 때 -->
            <v-checkbox
              hide-details
              class="shrink my-0 hidden-sm-and-up"
              color="indigo"
              :label="
                item.title.length > 12
                  ? `${item.title.substring(0, 12)}...`
                  : item.title
              "
              v-model="item.is_complete"
              @click="onToggle(item.id)"
            >
            </v-checkbox>
          </v-col>

          <!-- 수정 삭제 버튼 -->
          <v-col
            cols="auto"
            align="end"
            class="pa-0"
            v-if="item.user == userEmail"
          >
            <!-- 다이얼로그에 해당 아이템의 id 값을 props로 넘긴다. -->
            <todoDialog :item-id="item.id"></todoDialog>
            <v-btn icon small @click="onDelete(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>

      <!-- 중요도 -->
      <v-col cols="1" sm="2" class="pa-1" align="center">
        <!-- 이모티콘 -->
        <span class="text-h6">{{ priorityEmojis[item.importance] }}</span>
        <!-- 중요도 텍스트 (BreakPoint 'sm' 이상에서만 표시) -->
        <span class="hidden-xs-only"
          >{{ priorityLevel[item.importance] }}
        </span>
      </v-col>

      <!-- 할일 완료여부 체크박스 -->
      <v-col sm="1" class="pa-1 hidden-xs-only">
        <!-- 자신이 작성한 경우에만 수정, 삭제 아이콘 표시 -->
        <v-checkbox
          hide-details
          class="shrink my-0 ml-1 py-0"
          color="indigo"
          v-model="item.is_complete"
          @click="onToggle(item.id)"
        ></v-checkbox>
      </v-col>
    </v-row>

    <!-- 투두리스트가 비어있는 경우 표시 -->
    <v-row v-if="todos.length == 0" align="center" class="text-center">
      <v-col>
        <p class="text-h6 mb-0">투두리스트에 내용을 추가해주세요.</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TodoEditDialog from "./TodoEditDialog.vue";
import TodoDetailDialog from "./TodoDetailDialog.vue";

export default {
  components: {
    todoDialog: TodoEditDialog,
    todoDetail: TodoDetailDialog
  },
  computed: {
    userEmail() {
      return this.$store.getters["mypage/userEmail"];
    },
    todos() {
      return this.$store.getters.todos;
    },
    filteredTodos() {
      return this.$store.getters.filteredTodos;
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
