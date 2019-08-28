<template>
  <div id="app">
    <m-header></m-header>
    <m-tab></m-tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import MTab from 'components/tab/tab'
import Player from 'components/player/player'
export default {
  components: {
    MHeader,
    MTab,
    Player
  }
}
</script>

<style lang="sass" rel="stylesheet/sass" scoped>

</style>
