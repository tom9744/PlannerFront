<template>
  <v-container class="fill-height" fluid>
    <v-row>
      <v-col cols="12" class="text-center">
        <!-- 경고 아이콘 -->
        <v-icon class="text-h4 mb-4" color="indigo lighten-1">
          mdi-alert-circle-outline
        </v-icon>
        <!-- 메세지 -->
        <p class="text-h5">앗! 존재하지 않는 페이지입니다.</p>
        <p class="text-subtitle">
          접근하려는 URL을 다시 한번 확인해주세요. <br />
          또는 아래의 버튼을 통해 홈페이지로 돌아갈 수 있습니다.
        </p>
        <!-- 홈페이지 복귀 버튼 -->
        <v-btn color="indigo lighten-1 ma-2" to="/" dark>
          <v-icon left>mdi-home</v-icon> 홈페이지
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {};
</script>

<style></style>
