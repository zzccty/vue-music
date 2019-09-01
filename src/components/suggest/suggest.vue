<template>
  <scroll ref="suggest"
          class="suggest"
          :data="result"
          :pullup="pullup"
          @scrollToEnd="searchMore"
          :beforeScroll="beforeScroll"
          @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li class="suggest-item"
          v-for="(item,index) in result"
          :key="index"
          @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text"
             v-html="getDisplayName(item)">
          </p>
        </div>
      </li>
      <loading v-show="hasMore"></loading>
    </ul>
    <div class="no-result-wrapper"
         v-show="!hasMore && !result.length">
      <no-result :title="title"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import NoResult from 'base/no-result/no-result'
import Singer from 'common/js/singer'
import { search } from 'api/search'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongUrl } from 'common/js/song'
import { mapMutations, mapActions } from 'vuex'

const TYPE_SINGER = 'singer'
const perpage = 20

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasMore: false,
      title: '暂无搜索结果!',
      beforeScroll: true
    }
  },
  methods: {
    search () {
      this.hasMore = true
      this.page = 1
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then((result) => {
            this.result = result
          })
          this._checkMore(res.data)
        }
      })
    },
    getIconCls (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    searchMore () {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then((result) => {
            this.result = this.result.concat(result)
          })
          this._checkMore(res.data)
        }
      })
    },
    selectItem (item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      // 向外派发select事件,
      this.$emit('select')
    },
    listScroll () {
      this.$emit('listScroll')
    },
    refresh () {
      this.$refs.suggest.refresh()
    },
    _checkMore (data) {
      const song = data.song
      if (!song.list.length || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum) {
        this.hasMore = false
      }
    },
    _genResult (data) {
      let ret = []
      if (data.zhida && data.zhida.singerid && this.page === 1) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
      }
      return processSongUrl(this._normalizeSongs(data.song.list)).then((songs) => {
        ret = ret.concat(songs)
        return ret
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((musicData) => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    // 监听query变化,调用search方法请求数据
    query () {
      this.search()
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style lang="sass" scoped>
  @import "common/sass/variable"
  @import "common/sass/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        height: 50px
        align-items: center
        border-bottom: 1px solid #3c3636
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          @include no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
