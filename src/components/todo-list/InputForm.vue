<template>
  <v-container class="pa-0">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-container class="pb-0">
          <v-row align="center" justify="center">
            <v-col cols="12" align="center" class="py-0">
              <p class="display-1">계획 중인 일이 있으신가요?</p>
              <p class="d-none d-sm-flex text-subtitle-1 justify-center">
                하고 싶던 일이 막상 기억이 나지 않았던 적 있으시죠? <br />
                버킷리스트에 등록하고 다른 사람과 공유하세요.
              </p>
              <p class="d-flex d-sm-none text-subtitle-1 justify-center">
                정말로 하고 싶었던 일이 막상 <br />
                기억이 나지 않았던 적 있으신가요? <br />
                버킷리스트에 등록하고 괸리하세요.
              </p>
            </v-col>
          </v-row>

          <v-row align="center" justify="center">
            <v-col cols="12">
              <v-form>
                <v-text-field
                  solo
                  v-model="title"
                  label="등록할 내용을 입력하세요."
                  class="mb-2"
                />
                <v-slider
                  v-model="importance"
                  :thumb-size="28"
                  thumb-color="indigo lighten-1"
                  thumb-label="always"
                  :tick-labels="importanceLevel"
                  :label="sliderLabel"
                  color="white"
                  step="1"
                  :max="4"
                  dark
                >
                  <template v-slot:thumb-label="{ value }">
                    {{ satisfactionEmojis[value] }}
                  </template>
                </v-slider>
              </v-form>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" align="center">
              <v-btn color="indigo lighten-1" @click="onClick" fab dark>
                <v-icon dark>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  computed: {
    sliderLabel() {
      // Breakpoint에 따른 truncate 적용 최대 길이 설정
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "중요도";
        default:
          return "얼마나 중요한 일인가요?";
      }
    }
  },
  data() {
    return {
      title: "",
      importance: 2,
      importanceLevel: ["최하", "하", "중", "상", "최상"],
      satisfactionEmojis: ["😭", "🙁", "😐", "😊", "😍"]
    };
  },
  methods: {
    onClick() {
      if (this.title == "") {
        alert("어떠한 내용도 입력되지 않아 등록할 수 없습니다!");
        return;
      }
      this.$store.dispatch("todolist/addTodo", {
        title: this.title,
        importance: this.importance
      });
      this.title = "";
    }
  }
};
</script>

<style></style>
