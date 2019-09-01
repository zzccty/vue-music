// 操作localstorage存储数据
import storage from 'good-storage'

const SEARCHKEY = '__search__'
const SEARCH_MAX_LENGTH = 15

function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.slice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function delectFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function saveSearch (query) {
  let searches = storage.get(SEARCHKEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCHKEY, searches)
  return searches
}

export function loadSearch () {
  return storage.get(SEARCHKEY, [])
}

export function deleteSearch (query) {
  let searches = storage.get(SEARCHKEY, [])
  delectFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCHKEY, searches)
  return searches
}

export function clearSearch () {
  storage.remove(SEARCHKEY)
  return []
}
