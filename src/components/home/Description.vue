<template>
  <v-container class="pa-0">
    <v-row justify="center" align="center" class="mb-6">
      <v-col cols="12" align="center">
        <p class="display-1">앞으로 추가될 기능</p>
        <p class="title font-weight-light" style="max-width: 700px;">
          현재 서버(백엔드)는 Django 프레임워크를 사용하고 있으며, 사용자와
          할일(Todo) 모델 외에는 구현되지 않았습니다. 하지만, 웹사이트를 계속
          확장해 나갈 계획이며, 현재는 프론트엔드에 집중하고 있습니다.
          프론트엔드는 Vue.js와 Vuetify.js를 사용해 구성되었으며, 백엔드와의
          통신은 Axios를 통해 이루어지고 있습니다.
        </p>
      </v-col>
    </v-row>

    <v-row justify="center" align="center">
      <v-col align="center" cols="12" sm="4" md="4">
        <v-img src="@/assets/python.svg" max-height="300px" max-width="175px">
        </v-img>
      </v-col>
      <v-col align="center" cols="12" sm="4" md="4">
        <v-img src="@/assets/django.svg" max-height="300px" max-width="175px">
        </v-img>
      </v-col>
      <v-col align="center" cols="12" sm="4" md="4">
        <v-img src="@/assets/vue-js.svg" max-height="300px" max-width="175px">
        </v-img>
      </v-col>
    </v-row>

    <v-sheet class="py-12 my-12">...계속 추가중입니다...</v-sheet>
  </v-container>
</template>

<script>
export default {};
</script>

<style></style>
