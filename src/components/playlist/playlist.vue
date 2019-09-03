<template>
  <transition name="list-fade">
    <div class="playlist"
         @click="hide"
         v-show="showFlag">
      <div class="list-wrapper"
           @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon"
               :class="iconMode"
               @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear"
                  @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll ref="listContent"
                :data="sequenceList"
                class="list-content"
                :refreshDelay="refreshDelay">
          <transition-group ref="list"
                            name="list"
                            tag="ul">
            <li class="item"
                v-for="(item,index) in sequenceList"
                :key="item.id"
                @click="selectItem(item,index)">
              <i class="current"
                 :class="getCurrentIcon(item)"></i>
              <span class="text"
                    v-html="item.name"></span>
              <span class="like"
                    @click.stop="toggleFavorite(item)">
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span @click.stop="deleteOne(item)"
                    class="delete">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div @click="addSong"
               class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div @click="hide"
             class="list-close">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm"
               @confirm="confirmClear"
               text="是否清空播放列表"
               confirmBtnText="清空">
      </confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>
<script>
import { mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
import AddSong from 'components/add-song/add-song'
import { playerMixin } from 'common/js/mixin'
export default {
  mixins: [playerMixin],
  data () {
    return {
      showFlag: false,
      refreshDelay: 100
    }
  },
  computed: {
    modeText () {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
    }
  },
  methods: {
    show () {
      this.showFlag = true
      setTimeout(() => {
        // 因为当点击show后,高度不能及时的正确的计算，所以需要refresh()
        this.$refs.listContent.refresh()
        // 滚动到当前播放歌曲位置
        this.scrollToCurrent(this.currentSong)
      }, 20)
    },
    hide () {
      this.showFlag = false
    },
    // 设置当前播放歌曲的icon
    getCurrentIcon (item) {
      // 如果当前播放的歌曲的id等于列表中歌曲的id,则为当前播放的歌曲并设置icon-play
      if (this.currentSong.id === item.id) {
        return 'icon-play'
      }
      return ''
    },
    selectItem (item, index) {
      // 如果当前模式为随机模式,则先找到当前歌曲在playlist中的索引
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex((song) => {
          return song.id === item.id
        })
      }
      // 设置当前索引
      this.setCurrentIndex(index)
      // 将当前播放状态改为播放
      this.setPlayingState(true)
    },
    scrollToCurrent (current) {
      // 获取当前播放的歌曲在sequenceList中的索引
      const index = this.sequenceList.findIndex((song) => {
        return current.id === song.id
      })
      // 当切换播放的歌曲，列表滚动到当前歌曲的位置
      this.$refs.listContent.scrollToElement(this.$refs.list.$el.children[index], 300)
    },
    deleteOne (item) {
      this.deleteSong(item)
      // 播放列表没有数据,则隐藏
      if (!this.playlist.length) {
        this.hide()
      }
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    confirmClear () {
      // 清空整个播放列表数据
      this.deleteSongList()
      this.hide()
    },
    addSong () {
      this.$refs.addSong.show()
    },
    ...mapActions([
      'deleteSong',
      'deleteSongList'
    ])
  },
  watch: {
    // 监听currentSong 的变化
    currentSong (newSong, oldSong) {
      // 如果showFlag为false 或者 newSong.id等于oldSong.id 直接return
      if (!this.showFlag || newSong.id === oldSong.id) {
        return
      }
      setTimeout(() => {
        // 滚动到当前歌曲
        this.scrollToCurrent(newSong)
      }, 20)
    }
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  }
}
</script>
<style lang="sass" scoped>
  @import "common/sass/variable"
  @import "common/sass/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            @include extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            @include no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            @include extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            @include extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>
