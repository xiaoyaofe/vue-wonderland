import GraphQLJSON from 'graphql-type-json'
// import shortid from 'shortid'
import Request from 'request'
import { BASE_URL } from 'apollo-server/const';

const urlOrigin = BASE_URL

export default {
  JSON: GraphQLJSON,
  Counter: {
    countStr: counter => `Current count: ${counter.count}`
  },
  Query: {
    hello: (root, { name }) => {
      return `Hello ${name || 'World'}!`
    },
    messages: (root, args, { db }) => db.get('messages').value(),
    uploads: (root, args, { db }) => db.get('uploads').value(),
    get: (root, { options: { name, version, data: $data } }) => {
      switch (name) {
        case 'appInfos':
          return new Promise((resolve, reject) => {
            if (version === '1') {
              Request(
                urlOrigin + "/pocketgames/orderRepair/appInfo/SDK/1",
                function (error, httpResponse, body) {
                  if (error) {
                    console.log("job1 v1 error: " + error)
                  } else {
                    const data: OrderManagement.AppInfoRes = JSON.parse(body)
                    const appInfos: OrderManagement.AppInfos2 = {}
                    data.data.appInfos.forEach((val, index, arr) => {
                      const gameZones = {}
                      const appId = val.appInfo.appId
                      val.gameZones.forEach(val => {
                        gameZones[appId + "-" + val.gameZoneId] = val
                      });
                      (val.appInfo as OrderManagement.AppInfo2).gameZones = gameZones
                      appInfos[
                        val.appInfo.appId
                      ] = val.appInfo as OrderManagement.AppInfo2
                    })
                    data.data.appInfos = appInfos as any
                    resolve(data)
                  }
                })
            } else if (version === '2') {
              Request(
                urlOrigin + "/pocketgames/orderRepair/appInfo/SDK/2",
                function (error, httpResponse, body) {
                  if (error) {
                    console.log("job1 v2 error: " + error)
                  } else {
                    const data: OrderManagement.AppInfoRes = JSON.parse(body)
                    const appInfos: OrderManagement.AppInfos2 = {}
                    data.data.appInfos.forEach((val, index, arr) => {
                      const gameZones = {}
                      val.gameZones.forEach(val => {
                        gameZones[val.appId + "-" + val.gameZoneId] = val
                      });
                      (val.appInfo as OrderManagement.AppInfo2).gameZones = gameZones
                      appInfos[
                        val.appInfo.appId
                      ] = val.appInfo as OrderManagement.AppInfo2
                    })
                    data.data.appInfos = appInfos as any
                    resolve(data);
                  }
                })
            }
          })
        case 'games':
          return new Promise((resolve, reject) => {
            let url = urlOrigin + '/pocketgames/appInfo/list/SDK/' + version
            Request(url, function (err, httpResponse, body) {
              if (!err) {
                if (body) {
                  let data = JSON.parse(body)
                  data.version = version
                  resolve(data)
                } else {
                  resolve(body)
                }
              }
            })
          })
        case 'channelGames':
          return new Promise((resolve, reject) => {
            Request(urlOrigin + '/pocketgames/channel/allGames', function (
              err,
              httpResponse,
              body
            ) {
              if (!err) {
                if (body) {
                  let data = JSON.parse(body)
                  resolve(data)
                } else {
                  resolve(body)
                }
              }
            })
          })
      }
    },
    post: (root, { options: { name, version, data: $data } }) => {
      let url = ''
      let bd = getUrlencodedBody($data)
      let channelNames = ['zones', 'channels']
      return new Promise((resolve, reject) => {
        switch (name) {
          case 'zones':
            url = urlOrigin + '/pocketgames/game/gameZoneInfo/list/SDK/' + version
            bd = getUrlencodedBody({ appId: $data.appId, pageCount: $data.pageCount })
            break
          case 'mainZoneList':
            url = `${urlOrigin}/pocketgames/game/gameZoneInfo/mainZoneList/SDK/${version}/${$data.appId}`
            break
          case 'channels':
            url = `${urlOrigin}/pocketgames/channel/list`
            break
        }
        if (channelNames.indexOf(name) === -1) {
          Request(url, function (err, httpResponse, body) {
            if (err) {
              console.error(err)
              return
            } else {
              if (body) {
                let data = JSON.parse(body)
                data.version = version
                resolve(data)
              } else {
                resolve(body)
              }
            }
          })
        } else {
          Request.post({
            url,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: bd
          },
            function (err, httpResponse, body) {
              if (err) {
                console.error(err)
                return
              } else {
                if (body) {
                  let data = JSON.parse(body)
                  data.version = version
                  resolve(data)
                } else {
                  resolve(body)
                }
              }
            }
          )
        }
      })
    }
  },

  Mutation: {
    myMutation: (root, args, context) => {
      const message = 'My mutation completed!'
      context.pubsub.publish('hey', {
        mySub: message
      })
      return message
    },

    post: (root, { options: { version, name, data } }, context) => {
      return new Promise((resolve, reject) => {
        let url = BASE_URL
        let zoneNames = ['mergeZone', 'addZoneInfo', 'editZoneInfo', 'addchannelInfo', 'editchannelInfo', 'deletechannel']
        switch (name) {
          case 'verify':
            url += '/pocketgames/orderRepair/verifyOrder/SDK/' + version
            break
          case 'repair':
            url += '/pocketgames/orderRepair/repair'
            break
          case 'mergeZone':
            url += '/pocketgames/game/gameZoneInfo/combine/SDK/' + version
            break
          case 'editZoneInfo':
            url += '/pocketgames/game/gameZoneInfo/update/SDK/' + version
            break
          case 'addZoneInfo':
            url += '/pocketgames/game/gameZoneInfo/add/SDK/' + version
            break
          case 'deletechannel':
            url += '/pocketgames/channel/delete'
            break
          case 'editchannelInfo':
            url += '/pocketgames/channel/edit'
            break
          case 'addchannelInfo':
            if (version === '1') {
              url += '/pocketgames/channel/saveChildren'
              break
            } else if (version === '2') {
              url += '/pocketgames/channel/saveParent'
              break
            }
          default:
            url += '/pocketgames/orderRepair/payInfo/SDK/' + version
            break
        }
        if (zoneNames.indexOf(name) !== -1) {
          let bd = getUrlencodedBody(data)
          Request.post({
            url: url,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: bd
          },
            function (err, httpResponse, body) {
              if (err) {
                console.error(err)
                return
              } else {
                if (body) {
                  try {
                    let data = JSON.parse(body)
                    data.version = version
                    resolve(data)
                  } catch (err) {
                    resolve(body)
                  }
                } else {
                  resolve(body)
                }
              }
            }
          )
        } else {
          Request.post({
            url,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          }, function (err, httpResponse, body) {
            if (err) {
              console.error(err)
              return
            } else {
              if (body) {
                let data = JSON.parse(body)
                data.version = version
                if (data.code === 200 && name === 'verify' && version === '2') {
                  Request.post(
                    {
                      url: urlOrigin + '/pocketgames/orderRepair/payInfo/SDK/2',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        appId: data.data.orderInfo.appId,
                        advChannel: data.data.orderInfo.advChannel,
                        channelId: data.data.orderInfo.channel,
                        cardCode: data.data.orderInfo.cardCode
                      })
                    },
                    function (err, httpResponse, res) {
                      if (err) {
                        console.error(err)
                        return
                      }
                      if (res) {
                        data.data.products = JSON.parse(res).data.products
                        resolve(data)
                      }
                    }
                  )
                } else if (
                  data.code === 200 &&
                  name === 'Verify' &&
                  version === '1'
                ) {
                  Request.post(
                    {
                      url: urlOrigin + '/pocketgames/orderRepair/payInfo/SDK/1',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        confId: data.data.orderInfo.confId,
                        channelId: data.data.orderInfo.payWay
                      })
                    },
                    function (err, httpResponse, res) {
                      if (err) {
                        console.error(err)
                        return
                      }
                      if (res) {
                        data.data.products = JSON.parse(res).data.products
                        resolve(data)
                      }
                    }
                  )
                } else {
                  resolve(data)
                }
              } else {
                resolve(body)
              }
            }
          })
        }
      })
    },
    addMessage: (root, { input }, { pubsub, db }) => {
      const message = {
        // id: shortid.generate(),
        text: input.text
      }
      db.get('messages').push(message).last().write()
      pubsub.publish('messages', {
        messageAdded: message
      })
      return message
    },
    singleUpload: (root, { file }, { processUpload }) => processUpload(file),
    multipleUpload: (root, { files }, { processUpload }) =>
      Promise.all(files.map(processUpload))
  },

  Subscription: {
    mySub: {
      subscribe: (parent, args, { pubsub }) => pubsub.asyncIteratoresolve('hey')
    },
    counter: {
      subscribe: (parent, args, { pubsub }) => {
        const channel = Math.random().toString(36).substring(2, 15)
        let count = 0
        setInterval(() => pubsub.publish(channel, {
          counter: {
            count: count++
          }
        }), 2000)
        return pubsub.asyncIteratoresolve(channel)
      }
    },
    messageAdded: {
      subscribe: (parent, args, { pubsub }) => pubsub.asyncIteratoresolve('messages')
    }
  }
}

function getUrlencodedBody(data) {
  let bodyStr = ''
  Object.keys(data).forEach(key => {
    const value = data[key]
    bodyStr += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`
  })
  if (bodyStr) {
    // 去除最后的&
    bodyStr = bodyStr.substring(0, bodyStr.length - 1)
  }
  return bodyStr
}