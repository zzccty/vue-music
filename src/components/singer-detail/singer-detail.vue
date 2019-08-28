<template>
  <transition appear
              name="slide">
    <music-list :songs="songs"
                :title="title"
                :bg-image="bgImage">
    </music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongUrl } from 'common/js/song'
import MusicList from 'components/music-list/music-list'

export default {
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title () {
      return this.singer.name
    },
    bgImage () {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    this._getDetail()
    // console.log(this.singer)
  },
  methods: {
    _getDetail () {
      // 页面刷新的时候，没有获取到id,返回到singer页面
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          //  processSongUrl 对歌曲列表做处理
          processSongUrl(this._normalizeSongs(res.data.list)).then(songs => {
            this.songs = songs
            // console.log(this.songs)
          })
        }
      })
    },
    // _normalizeSongs 对付费歌曲做处理
    _normalizeSongs (list) {
      let ret = []
      list.forEach((item) => {
        let { musicData } = item
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="sass" scoped>
  @import "common/sass/variable"

  .slide-enter-active,.slide-leave-active
    transition: all 0.3s
  .slide-enter,.slide-leave-to
    transform: translate3d(100%,0,0)
</style>