<template>
  <v-responsive min-height="100vh">
    <v-container
      style="background: linear-gradient(180deg, #5C6BC0, #9FA8DA);"
      class="py-6 py-md-12 white--text"
      tag="section"
      fluid
    >
      <v-responsive class="mx-auto pa-6" min-height="50vh" max-width="1304px">
        <v-container class="pa-0">
          <v-row align="center">
            <!-- cols="12": 12개의 열(columns)을 사용하겠다는 뜻이다. -->
            <v-col cols="12" sm="7" md="7">
              <v-responsive max-width="625px">
                <p class="display-1">
                  Planner App.<br />Plan out your hangouts.
                </p>
                <p class="title font-weight-light">
                  플래너 APP은 일정관리 웹 어플리케이션입니다. 간단하게 일정을
                  등록하고 친구들과 공유하세요. 아직 많은 기능은 없지만,
                  계속해서 추가되고 있답니다. :)
                </p>
                <div class="py-5"></div>
                <div>
                  <v-btn to="/wishlist" class="ma-2">
                    <v-icon left>mdi-format-list-checks</v-icon>
                    Dashboard
                  </v-btn>
                  <v-btn class="ma-2">Button B</v-btn>
                  <v-btn class="ma-2">Button C</v-btn>
                </div>
              </v-responsive>
            </v-col>

            <v-col align="center" cols="12" sm="5" md="5">
              <v-img
                src="@/assets/logo.svg"
                max-height="300px"
                max-width="250px"
              >
                <v-container class="fill-height" style="color: #004e81">
                  <v-row justify="center" align="center">
                    <v-col class="text-center" cols="12">
                      <div class="py-8"></div>
                      <h4 class="subheading">Powered By</h4>
                      <h1 class="display-1 font-weight-bold mb-4">
                        Vuetify.js
                      </h1>
                    </v-col>
                  </v-row>
                </v-container>
              </v-img>
            </v-col>
          </v-row>
        </v-container>
      </v-responsive>
    </v-container>

    <v-container class="black--text text-center" tag="section" fluid>
      <v-responsive class="mx-auto pa-6" min-height="50vh" max-width="1304px">
        <v-container class="pa-0">
          <v-row justify="center" align="center" class="mb-6">
            <v-col cols="12" align="center">
              <p class="display-1">앞으로 추가될 기능</p>
              <p class="title font-weight-light" style="max-width: 700px;">
                현재 서버(백엔드)는 Django 프레임워크를 사용하고 있으며,
                사용자와 할일(Todo) 모델 외에는 구현되지 않았습니다. 하지만,
                웹사이트를 계속 확장해 나갈 계획이며, 현재는 프론트엔드에
                집중하고 있습니다. 프론트엔드는 Vue.js와 Vuetify.js를 사용해
                구성되었으며, 백엔드와의 통신은 Axios를 통해 이루어지고
                있습니다.
              </p>
            </v-col>
          </v-row>

          <v-row justify="center" align="center">
            <v-col align="center" cols="12" sm="4" md="4">
              <v-img
                src="@/assets/python.svg"
                max-height="300px"
                max-width="175px"
              >
              </v-img>
            </v-col>
            <v-col align="center" cols="12" sm="4" md="4">
              <v-img
                src="@/assets/django.svg"
                max-height="300px"
                max-width="175px"
              >
              </v-img>
            </v-col>
            <v-col align="center" cols="12" sm="4" md="4">
              <v-img
                src="@/assets/vue-js.svg"
                max-height="300px"
                max-width="175px"
              >
              </v-img>
            </v-col>
          </v-row>

          <v-sheet class="py-12 my-12">...계속 추가중입니다...</v-sheet>
        </v-container>
      </v-responsive>
    </v-container>
  </v-responsive>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    }
  }
};
</script>

<style scoped>
h {
  color: #004e81;
}
</style>
