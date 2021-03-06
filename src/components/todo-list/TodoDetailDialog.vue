<template>
  <v-dialog v-model="dialog" width="450px">
    <!-- v-dialog 템플릿 영역 -->
    <template v-slot:activator="{ on, attrs }">
      <p
        v-bind="attrs"
        v-on="on"
        @click="onOpen"
        class="ml-2 mb-0 text-truncate"
        :style="`max-width: ${maxLength}px;`"
      >
        {{ itemTitle }}
      </p>
    </template>

    <!-- 클릭 시 나타나는 Dialog 컴포넌트 -->
    <v-card>
      <v-container class="py-0">
        <!-- 할일 상세 헤더 부분 -->
        <v-list-item>
          <v-list-item-avatar color="grey lighten-1">
            <!-- 유저 데이터에 있는 아바타 이미지 -->
            <span v-if="todoDetail.avatar == null" class="text-caption"
              >{{ todoDetail.nickname }}
            </span>
            <v-img v-else :src="todoDetail.avatar" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="headline">
              {{ todoDetail.nickname }}님의 할일
            </v-list-item-title>
            <v-list-item-subtitle>
              작성일: {{ todoDetail.date_created }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <!-- 할일 상세 내용 부분 -->
        <v-card-text class="py-0">
          <!-- 세부 내용 -->
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <span>세부 내용</span>
              </v-list-item-title>
              <span class="text--secondary">{{ todoDetail.title }}</span>
            </v-list-item-content>
          </v-list-item>

          <!-- 중요도 및 아이콘 -->
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                중요도
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ priorityDecriptions[todoDetail.importance] }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-content>
              <v-list-item-title class="text-h3 text-center">
                {{ priorityEmojis[todoDetail.importance] }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <!-- 완료여부 및 아이콘 -->
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                완료 여부
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ todoDetail.is_complete ? "완료했어요!" : "아직 못했어요" }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-content>
              <v-list-item-title class="text-h3 text-center">
                {{ todoDetail.is_complete ? "🙆🏻" : "🙅🏻" }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="indigo" text @click="dialog = false">
            확인
          </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    itemId: Number,
    itemTitle: String,
    needIcons: Boolean
  },
  computed: {
    todoDetail() {
      return this.$store.getters["todolist/todoDetail"];
    },
    maxLength() {
      // Breakpoint에 따른 truncate 적용 최대 길이 설정
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return this.needIcons ? 140 : 200;
        case "sm":
          return this.needIcons ? 200 : 250;
        case "md":
          return this.needIcons ? 350 : 400;
        default:
          return this.needIcons ? 400 : 500;
      }
    }
  },
  data() {
    return {
      dialog: false,

      priorityDecriptions: [
        "하나도 중요하지 않음",
        "중요하지 않음",
        "그저 그런 우선순위",
        "기회가 있으면 꼭 할래요",
        "절대필수! 꼭 하고 말거에요"
      ],
      priorityEmojis: ["😭", "🙁", "😐", "😊", "😍"]
    };
  },
  methods: {
    onOpen() {
      this.$store.dispatch("todolist/getTodoDetail", this.itemId);
    }
  }
};
</script>

<style></style>
