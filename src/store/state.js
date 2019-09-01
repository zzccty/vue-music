import {
  playMode
} from 'common/js/config'
import {
  loadSearch
} from 'common/js/cache'

const state = {
  singer: {}, // 歌手信息
  playing: false, // 是否播放
  fullScreen: false, // 是否开启全屏
  playlist: [], // 播放列表
  sequenceList: [], // 顺序播放列表
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 歌曲播放索引
  disc: {},
  topList: {}, // 排行榜歌单
  searchHistory: loadSearch()
}

export default state
