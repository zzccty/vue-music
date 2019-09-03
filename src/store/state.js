import {
  playMode
} from 'common/js/config'
import {
  loadSearch,
  loadPlay,
  loadFavorite
} from 'common/js/cache'

const state = {
  singer: {}, // 歌手信息
  playing: false, // 是否播放
  fullScreen: false, // 是否开启全屏
  playlist: [], // 播放列表
  sequenceList: [], // 顺序播放列表
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 播放列表当前播放歌曲的索引
  disc: {},
  topList: {}, // 排行榜歌单
  searchHistory: loadSearch(), // 搜索历史
  playHistory: loadPlay(), // 播放历史
  favoriteList: loadFavorite() // 我喜欢的
}

export default state
