<template>
  <v-dialog v-model="dialog" width="550" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon small v-bind="attrs" v-on="on" @click="onOpen">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-toolbar color="indigo lighten-1" dark flat>
        <v-toolbar-title>세부사항 확인 및 편집</v-toolbar-title>
      </v-toolbar>

      <v-card-text class="pb-0">
        <v-form v-model="valid">
          <v-row align="center" justify="space-between">
            <v-col cols="12" class="pb-0">
              <v-text-field
                v-model="todo.title"
                label="제목"
                :rules="[required()]"
              ></v-text-field>
            </v-col>
            <v-col cols="3" sm="5" class="pt-0">
              <v-text-field
                v-model="todo.profile"
                label="작성자"
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="5" sm="5" class="pt-0">
              <v-select
                :items="selections"
                item-value="index"
                item-text="priorityEmojis"
                v-model="todo.importance"
                label="우선 순위"
              ></v-select>
            </v-col>
            <v-checkbox
              v-model="todo.is_complete"
              class="mx-auto"
              color="indigo lighten-1"
              label="완료"
            ></v-checkbox>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="indigo" text @click="dialog = false">
          돌아가기
        </v-btn>
        <v-btn color="indigo" text @click="onSubmit">
          변경사항 저장
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    itemId: Number
  },
  computed: {
    getAccessToken() {
      return this.$store.getters.getAccessToken;
    }
  },
  data() {
    return {
      dialog: false,
      valid: false,
      selections: [
        { index: 0, priorityEmojis: "😭 싫어" },
        { index: 1, priorityEmojis: "🙁 별로" },
        { index: 2, priorityEmojis: "😐 보통" },
        { index: 3, priorityEmojis: "😊 좋아" },
        { index: 4, priorityEmojis: "😍 최고" }
      ],
      previousTitle: "",
      todo: {},
      required() {
        return value => !!value || `어떠한 내용도 입력하지 않았습니다.`;
      }
    };
  },
  methods: {
    onOpen() {
      this.$http
        .get(`/api/plan/bucket-list/${this.itemId}/`, {
          headers: { Authorization: `Bearer ${this.getAccessToken}` }
        })
        .then(response => {
          this.previousTitle = response.data.title;
          this.todo = response.data;
        })
        .catch(error => {
          console.log("Error :" + error);
        });
    },
    onSubmit() {
      this.$http
        .put(
          `/api/plan/bucket-list/${this.itemId}/`,
          {
            title: this.todo.title,
            importance: this.todo.importance,
            is_complete: this.todo.is_complete
          },
          { headers: { Authorization: `Bearer ${this.getAccessToken}` } }
        )
        .then(() => {
          // 변경 사항을 State에 반영하기위해 호출한다.
          this.$store.dispatch("getAllTodos");
          // 다이얼로그를 닫는다.
          this.dialog = false;
        })
        .catch(error => {
          alert("할일 : " + error.response.data.title);
        });
    }
  }
};
</script>

<style></style>
