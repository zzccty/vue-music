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
// 默认一页展示20条数据
const perpage = 20

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    // 是否展示歌手项,默认true
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
      // 设置还有更多数据
      this.hasMore = true
      // 设置当前页为第一页
      this.page = 1
      // 滚动到最顶部
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then((result) => {
            this.result = result
          })
          // 查询是否还有更多数据
          this._checkMore(res.data)
        }
      })
    },
    getIconCls (item) {
      // 如果item.type = singer 说明是查询歌手,显示歌手icon
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        // 否则显示歌曲icon
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
      // 页数+1
      this.page++
      // 再次调用search()搜索数据
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then((result) => {
            // 将搜索到的结果值追加到当前的this.result中
            this.result = this.result.concat(result)
          })
          this._checkMore(res.data)
        }
      })
    },
    selectItem (item) {
      // 如果点击的是歌手
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        // 直接跳转到歌手详情页
        this.$router.push({
          path: `/search/${singer.id}`
        })
        // 设置当前歌手
        this.setSinger(singer)
      } else {
        // 插入当前歌曲到播放列表中
        this.insertSong(item)
      }
      // 向外派发select事件,用于父组件去保存到当前搜索历史
      this.$emit('select')
    },
    listScroll () {
      // 向父组件传递listScroll事件,用于父组件调用blur()方法
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
    // 对查询到的数据进行处理
    _genResult (data) {
      let ret = []
      // console.log(data)
      if (data.zhida && data.zhida.singerid && this.page === 1) {
        // 如果获取到了data.zhida.singerid,则需要保存 type:singer 这个属性,就可以点击之后进入到歌手详情页
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
        // console.log(ret) // albumnum: 16, singerid: 5062,singermid: "002J4UUk29y8BY",singername: "薛之谦",songnum: 284,type: "singer"
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
    // 监听query变化,调用search方法请求搜索数据
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
