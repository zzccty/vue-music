<template>
  <div class="singer"
       ref="singer">
    <list-view @selectItem="selectSinger"
               :data="singers"
               ref="list">
    </list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import ListView from 'base/listview/listview'
import { mapMutations } from 'vuex'
import { playlistMixin } from 'common/js/mixin'

const HOT_NAME = '热门'
const HOT_SINGERS_LEN = 10

export default {
  mixins: [playlistMixin],
  data () {
    return {
      singers: []
    }
  },
  created () {
    this._getSingerList()
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
    // 获取子组件传入的singer,跳转到对应的歌手详情页面
    selectSinger (singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      // 操作mutaion,设置singer到state上
      this.setSinger(singer)
    },
    _getSingerList () {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list)
          // console.log(this.singers)
        }
      })
    },
    _normalizeSinger (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        // 索引为前10位,列为 热门
        if (index < HOT_SINGERS_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      // console.log(map)
      // 为了得到有序列表，需要处理map
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title === HOT_NAME) {
          hot.push(val)
        }
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        }
      }
      // 对ret数组进行排序
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    ListView
  }
}
</script>

<style lang="sass" scoped>
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>