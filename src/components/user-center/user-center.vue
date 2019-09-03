<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back"
           @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <!-- 我喜欢的、最近播放 -->
        <switches :switches="switches"
                  :currentIndex="currentIndex"
                  @switch="switchItem">
        </switches>
      </div>
      <div ref="playBtn"
           class="play-btn"
           @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper"
           ref="listWrapper">
        <!-- 我喜欢的 -->
        <scroll v-if="currentIndex === 0"
                :data="favoriteList"
                class="list-scroll"
                ref="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList"
                       @select="selectSong">
            </song-list>
          </div>
        </scroll>
        <!-- 最近播放 -->
        <scroll v-if="currentIndex === 1"
                :data="playHistory"
                class="list-scroll"
                ref="playList">
          <div class="list-inner">
            <song-list :songs="playHistory"
                       @select="selectSong">
            </song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper">
        <no-result :title="noResultDesc"
                   v-show="noResult"></no-result>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import Switches from 'base/switches/switches'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import NoResult from 'base/no-result/no-result'
import Song from 'common/js/song'
import { mapGetters, mapActions } from 'vuex'
import { playlistMixin } from 'common/js/mixin'
export default {
  mixins: [playlistMixin],
  data () {
    return {
      currentIndex: 0,
      switches: [{
        name: '我喜欢的'
      }, {
        name: '最近听的'
      }]
    }
  },
  computed: {
    noResult () {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length
      } else {
        return !this.playHistory.length
      }
    },
    noResultDesc () {
      if (this.currentIndex === 0) {
        return '暂无收藏的歌曲,赶紧去添加吧！'
      } else {
        return '您还没有听过歌曲,赶紧去听歌吧!'
      }
    },
    ...mapGetters([
      'favoriteList',
      'playHistory'
    ])
  },
  methods: {
    switchItem (index) {
      this.currentIndex = index
    },
    selectSong (song) {
      this.insertSong(new Song(song))
    },
    back () {
      this.$router.back()
    },
    // 随机播放
    random () {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
      if (list.length === 0) {
        return
      }
      // 因为list不是song的实例
      list = list.map((song) => {
        return new Song(song)
      })
      this.randomPlay({
        list
      })
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.listWrapper.style.bottom = bottom
      // 不能直接对favoriteList进行refresh,因为它绑定了v-if，可能不存在
      this.$refs.favoriteList && this.$refs.favoriteList.refresh()
      this.$refs.playList && this.$refs.playList.refresh()
    },
    ...mapActions([
      'insertSong',
      'randomPlay'
    ])
  },
  components: {
    Switches,
    Scroll,
    SongList,
    NoResult
  }
}
</script>

<style lang="sass" scoped>
  @import "common/sass/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position: absolute
      top: 4px
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-theme
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        color: $color-theme
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        color: $color-theme
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>