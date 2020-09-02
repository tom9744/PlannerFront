<template>
  <v-responsive min-height="100vh">
    <v-container class="intro py-6 py-md-12 white--text" fluid>
      <v-responsive class="mx-auto pa-6" min-height="50vh" max-width="1304px">
        <homeIntro></homeIntro>
      </v-responsive>
    </v-container>

    <v-container class="py-6 py-md-12 black--text" fluid>
      <v-responsive class="mx-auto pa-6" min-height="50vh" max-width="1304px">
        <homeDescription></homeDescription>
      </v-responsive>
    </v-container>
  </v-responsive>
</template>

<script>
import Intro from "../components/home/Intro.vue";
import Description from "../components/home/Description.vue";

export default {
  components: {
    homeIntro: Intro,
    homeDescription: Description
  }
};
</script>

<style scoped>
h {
  color: #004e81;
}
.intro {
  background: linear-gradient(180deg, #5c6bc0, #9fa8da);
}
</style>
