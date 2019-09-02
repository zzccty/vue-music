<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox"
                  @query="onQueryChange">
      </search-box>
    </div>
    <div class="shortcut-wrapper"
         v-show="!query"
         ref="shortcutWrapper">
      <scroll class="shortcut"
              :data="shortcut"
              ref="shortcut"
              :refreshDelay="refreshDelay">
        <div>
          <!-- 热门搜索 -->
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item"
                  v-for="(item, index) in hotKey"
                  :key="index"
                  @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <!-- 搜索历史 -->
          <div class="search-history"
               v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear"
                    @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory"
                         @select="addQuery"
                         @delete="deleteOne">
            </search-list>
          </div>
        </div>
      </scroll>
    </div>
    <!-- 搜索结果 -->
    <div class="search-result"
         v-show="query"
         ref="searchResult">
      <suggest :query="query"
               @listScroll="blurInput"
               @select="saveSearch"
               ref="suggest">
      </suggest>
    </div>
    <confirm ref="confirm"
             text="是否清空所有搜索历史"
             confirmBtnText="清空"
             @confirm="deleteAll">
    </confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import SearchList from 'base/search-list/search-list'
import Confirm from 'base/confirm/confirm'
import Scroll from 'base/scroll/scroll'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import { mapActions } from 'vuex'
import { playlistMixin, searchMixin } from 'common/js/mixin'
export default {
  mixins: [playlistMixin, searchMixin],
  data () {
    return {
      hotKey: []
    }
  },
  computed: {
    shortcut () {
      return this.hotKey.concat(this.searchHistory)
    }
  },
  created () {
    this._getHotKey()
  },
  methods: {
    // 删除选中的一条搜索历史数据
    deleteOne (item) {
      this.deleteSearchHistory(item)
    },
    // 删除所有的搜索历史数据
    deleteAll () {
      this.clearSearchHistory()
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length ? '60px' : ''
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()

      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
    },
    _getHotKey () {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    ...mapActions([
      'clearSearchHistory'
    ])
  },
  watch: {
    query (newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        })
      }
    }
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  }
}
</script>

<style lang="sass" scoped>
  @import "common/sass/variable"
  @import "common/sass/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            line-height: 25px
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-theme
          ul
            padding: 0 10px
          .item
            display: inline-block
            padding: 0px 10px
            margin: 0 20px 10px 0
            line-height: 30px
            height: 30px
            border-radius: 99px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-l
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-theme
            .text
              flex: 1
            .clear
              @include extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>