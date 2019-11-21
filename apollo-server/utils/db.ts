import Lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import Path, { resolve } from "path"
import * as PathExists from "path-exists"
import MakeDir from "make-dir"


!PathExists.sync(
  resolve(__dirname, '../../live')
) && MakeDir.sync(resolve(__dirname, '../../live'))

const level1 = [
  PathExists.sync(
    resolve(__dirname, '../../live/datas')
  ) || MakeDir.sync(resolve(__dirname, '../../live/datas')),
  PathExists.sync(
    resolve(__dirname, '../../live/oa')
  ) || MakeDir.sync(resolve(__dirname, '../../live/oa')),
].filter(item => item !== true)

level1.length && Promise.all(level1).then(function () {

})

export const db = (function () {
  const table = new Lowdb(
    new FileSync(resolve(__dirname, '../../live/db.json'))
  )
  table.defaults({
    messages: [],
    uploads: [],
  }).write()
  return table
})()

export const AppInfos = function () {
  const table = new Lowdb(
    new FileSync(resolve(__dirname, "../../live/datas/appInfos.json"))
  )
  table.defaults({}).write()
  return table
}

export const access_token = function () {
  const table = new Lowdb(
    new FileSync(resolve(__dirname, '../../live/oa/access_token.json'))
  )
  table.defaults({}).write()
  return table
}

export const user_info = function () {
  const table = new Lowdb(
    new FileSync(resolve(__dirname, '../../live/oa/user_info.json'))
  )
  table.defaults({}).write()
  return table
}
