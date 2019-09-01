<template>
  <div class="rank"
       ref="rank">
    <scroll class="toplist"
            :data="toplist"
            ref="toplist">
      <ul>
        <li class="item"
            v-for="(item,index) in toplist"
            :key="index"
            @click="selectItem(item)">
          <div class="icon">
            <img v-lazy="item.picUrl"
                 width="100"
                 height="100">
          </div>
          <ul class="songlist">
            <h2>{{item.topTitle}}</h2>
            <li class="song"
                v-for="(song,index) in item.songList"
                :key="index">
              <span>{{index + 1}}.</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container"
           v-show="!toplist.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getTopList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { mapMutations, mapGetters } from 'vuex'
import { playlistMixin } from 'common/js/mixin'
export default {
  mixins: [playlistMixin],
  data () {
    return {
      toplist: []
    }
  },
  created () {
    this._getTopList()
  },
  computed: {
    ...mapGetters([
      'playing'
    ])
  },
  methods: {
    selectItem (item) {
      this.$router.push({
        path: `/rank/${item.listenCount}`
      })
      this.setTopList(item)
    },
    handlePlaylist (list) {
      const bottom = this.playing ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.toplist.refresh()
    },
    _getTopList () {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          this.toplist = res.data.topList
        }
      })
    },
    ...mapMutations({
      setTopList: 'SET_TOPLIST'
    })
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="sass" scoped>
  @import "common/sass/variable"
  @import "common/sass/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          h2
            font-size: $font-size-medium-x
            color: $color-text
            padding: 4px 0
          .song
            @include no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>