import {
  getSongsUrl
} from 'api/song'
export default class Song {
  constructor ({
    id,
    mid,
    singer,
    name,
    album,
    duration,
    image,
    url
  }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}

export function createSong (musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: musicData.url
  })
}

// 过滤出歌手名字
function filterSinger (singer) {
  let ret = []
  // 如果musicData对象中没有singer
  if (!singer) {
    return ''
  }
  // singer:[{id: 5062,mid: "002J4UUk29y8BY",name: "薛之谦"}]
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('')
}

// 判断歌曲是否有效
export function isValidMusic (musicData) {
  return musicData.songid && musicData.albummid && (!musicData.pay || musicData.pay.payalbumprice === 0)
}

// 对歌曲列表做处理
export function processSongUrl (songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  return getSongsUrl(songs).then(purlMap => {
    songs = songs.filter(song => {
      const purl = purlMap[song.mid]
      if (purl) {
        song.url = purl.indexOf('http') === -1 ? `http://dl.stream.qqmusic.qq.com/${purl}` : purl
        return true
      }
      return false
    })
    return songs
  })
}
