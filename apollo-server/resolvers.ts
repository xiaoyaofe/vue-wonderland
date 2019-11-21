import GraphQLJSON from "graphql-type-json";
// import shortid from "shortid";
import Request from "request";
import { OA as Const } from './utils/const';
import { OA_RESOLVER } from './resolvers/oa';

const BASE_URL = "http://sdk-admin-sg.pocketgamesol.com:8380"

export default {
  JSON: GraphQLJSON,

  Counter: {
    countStr: counter => `Current count: ${counter.count}`
  },

  Query: {
    hello: (root: any, { name }) => {
      return `Hello ${name || "World"}!`;
    },
    messages: (root: any, args, { db }) => db.get("messages").value(),
    uploads: (root: any, args, { db }) => db.get("uploads").value(),
    // oa: (root: any, { options: { name } }, context) => {
    //   switch (name) {
    //     case Const.QUERY.ACCESS_TOKEN:
    //       return OA_RESOLVER.query.accessToken()
    //     default:
    //       break
    //   }
    // },
    get: (root: any, { options: { name, version, data } }) => {
      switch (name) {
        case "appInfos":
          return new Promise((resolve, reject) => {
            if (version === '1') {
              Request(
                BASE_URL + "/pocketgames/orderRepair/appInfo/SDK/1",
                function (error, httpResponse, body) {
                  if (error) {
                    console.log("job1 v1 error: " + error)
                  } else {
                    try {
                      const data: OrderManagement.AppInfoRes = JSON.parse(body)
                      const appInfos: OrderManagement.AppInfos2 = {}
                      data.data.appInfos.forEach((val, index, arr) => {
                        ``
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
                    } catch (e) {
                      resolve({ code: 500, message: body })
                    }

                  }
                })
            } else if (version === '2') {
              Request(
                BASE_URL + "/pocketgames/orderRepair/appInfo/SDK/2",
                function (error, httpResponse, body) {
                  if (error) {
                    console.log("job1 v2 error: " + error)
                    return
                  } else {
                    try {
                      const data: OrderManagement.AppInfoRes = JSON.parse(body);
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
                    } catch (e) {
                      resolve({ code: 500, message: body })
                    }
                  }
                })
            }
          })
        case "games":
          return new Promise((r, j) => {
            let url = BASE_URL + "/pocketgames/appInfo/list/SDK/" + version;
            Request(url, function (err, httpResponse, body) {
              if (err) {
                console.error(err);
                return;
              }
              let data;
              try {
                data = JSON.parse(body);
              } catch (e) {
                console.log(e);
              }
              if (data) {
                data.version = version;
                r(data);
              } else {
                r({ code: 500, message: body });
              }
            });
          })
        case "channelGames":
          return new Promise((r, j) => {
            Request(BASE_URL + "/pocketgames/channel/allGames", function (
              err,
              httpResponse,
              body
            ) {
              if (err) {
                console.error(err);
                return;
              }
              let data;
              try {
                data = JSON.parse(body);
              } catch (e) {
                console.log(e);
              }
              if (data) {
                data.version = version;
                r(data);
              } else {
                r({ code: 500, message: body });
              }
            });
          })
      }
    },
    post: (root: any, { options: { name, version, data: $data } }) => {
      let url = ''
      let bd = getUrlencodedBody($data);
      let channelNames = ["zones", "channels"];//post
      return new Promise((r, j) => {
        switch (name) {
          case "zones":
            url = BASE_URL + "/pocketgames/game/gameZoneInfo/list/SDK/" + version;
            bd = getUrlencodedBody({ appId: $data.appId, pageCount: $data.pageCount });;
            break
          case "mainZoneList":
            url = `${BASE_URL}/pocketgames/game/gameZoneInfo/mainZoneList/SDK/${version}/${$data.appId}`;
            break
          case "channels":
            url = `${BASE_URL}/pocketgames/channel/list`;
            break
        }
        if (channelNames.indexOf(name) === -1) {
          Request(url, function (err, httpResponse, body) {
            if (err) {
              console.error(err);
              return;
            }
            let data;
            try {
              data = JSON.parse(body);
            } catch (e) {
              console.log(e);
            }
            if (data) {
              data.version = version;
              r(data);
            } else {
              r({ code: 500, message: body });
            }

          });
        } else {
          Request.post({
            url,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: bd
          },
            function (err, httpResponse, body) {
              if (err) {
                console.error(err);
                return;
              }
              let data;
              try {
                data = JSON.parse(body);
              } catch (e) {
                console.log(e);
              }
              if (data) {
                data.version = version;
                r(data);
              } else {
                r({ code: 500, message: body });
              }
            }
          );
        }
      });
    }
  },

  Mutation: {
    oa: (root: any, { options: { name, access_token, code, id, department_id, fetch_child, userid, UserId } }, context) => {
      switch (name) {
        case Const.QUERY.ACCESS_TOKEN:
          console.log(Const.QUERY.ACCESS_TOKEN)
          return OA_RESOLVER.query.accessToken()
        case Const.QUERY.DEPARTMENT_LIST:
          console.log(Const.QUERY.DEPARTMENT_LIST)
          return OA_RESOLVER.query.departmentList(access_token, id)
        case Const.QUERY.USER_LIST:
          console.log(Const.QUERY.USER_LIST)
          return OA_RESOLVER.query.userList(access_token, department_id, fetch_child)
        case Const.QUERY.USER_INFO:
          console.log(Const.QUERY.USER_INFO)
          return OA_RESOLVER.query.userInfo(access_token, code)
        case Const.QUERY.USER:
          console.log(Const.QUERY.USER)
          return OA_RESOLVER.query.user(access_token, userid)
        case Const.QUERY.CODE:
          console.log(Const.QUERY.CODE)
          return OA_RESOLVER.query.code(UserId)
      }
    },

    myMutation: (root: any, args, context) => {
      const message = "My mutation completed!";
      context.pubsub.publish("hey", {
        mySub: message
      });
      return message;
    },

    post: (root: any, { options: { version, name, data } }, context) => {
      return new Promise((r, j) => {
        let url = BASE_URL
        let zoneNames = ["mergeZone", "addZoneInfo", "editZoneInfo", "addchannelInfo", "editchannelInfo", "deletechannel"];
        switch (name) {
          case "verify":
            url += "/pocketgames/orderRepair/verifyOrder/SDK/" + version;
            break
          case "repair":
            url += "/pocketgames/orderRepair/repair";
            break
          case "mergeZone":
            url += "/pocketgames/game/gameZoneInfo/combine/SDK/" + version;
            break
          case "editZoneInfo":
            url += "/pocketgames/game/gameZoneInfo/update/SDK/" + version;
            break
          case "addZoneInfo":
            url += "/pocketgames/game/gameZoneInfo/add/SDK/" + version;
            break
          case "deletechannel":
            url += "/pocketgames/channel/delete";
            break
          case "editchannelInfo":
            url += "/pocketgames/channel/edit";
            break
          case "addchannelInfo":
            if (version === '1') {
              url += "/pocketgames/channel/saveChildren";
              break
            } else if (version === '2') {
              url += "/pocketgames/channel/saveParent";
              break
            }
          default:
            url += "/pocketgames/orderRepair/payInfo/SDK/" + version;
            break
        }
        console.log(url);
        if (zoneNames.indexOf(name) !== -1) {
          let bd = getUrlencodedBody(data);
          console.log(bd);
          Request.post(
            {
              url: url,
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: bd
            },
            function (err, httpResponse, body) {
              if (err) {
                console.error(err);
                return;
              }
              let data;
              try {
                data = JSON.parse(body);
              } catch (e) {
                console.log(e)
              }
              if (data) {
                data.version = version;
                r(data);

              } else {
                r({ code: 500, message: body });
              }

            }
          );
        } else {
          Request.post(
            {
              url,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data)
            },
            function (err, httpResponse, body) {
              if (err) {
                console.error(err);
                return;
              }
              console.log(body);
              let data;
              try {
                data = JSON.parse(body);
              } catch (e) {
                console.log(e);
              }
              if (data) {
                data.version = version;
                if (data.code === 200 && name === "verify" && version === "2") {
                  Request.post(
                    {
                      url: BASE_URL + "/pocketgames/orderRepair/payInfo/SDK/2",
                      headers: {
                        "Content-Type": "application/json"
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
                        console.error(err);
                        return;
                      }
                      if (res) {
                        // console.log(res);
                        data.data.products = JSON.parse(res).data.products;
                        r(data);
                      }
                    }
                  );
                } else if (
                  data.code === 200 &&
                  name === "verify" &&
                  version === "1"
                ) {
                  Request.post(
                    {
                      url: BASE_URL + "/pocketgames/orderRepair/payInfo/SDK/1",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify({
                        confId: data.data.orderInfo.confId,
                        channelId: data.data.orderInfo.payWay
                      })
                    },
                    function (err, httpResponse, res) {
                      if (err) {
                        console.error(err);
                        return;
                      }
                      if (res) {
                        data.data.products = JSON.parse(res).data.products;
                        r(data);
                      }
                    }
                  );
                } else {
                  r(data);
                }
              } else {
                r({ code: 500, message: body });
              }
            }

          );
        }
      });
    },

    addMessage: (root: any, { input }, { pubsub, db }) => {
      const message = {
        // id: shortid.generate(),
        text: input.text
      };

      db.get("messages")
        .push(message)
        .last()
        .write();

      pubsub.publish("messages", {
        messageAdded: message
      });

      return message;
    },

    singleUpload: (root: any, { file }, { processUpload }) => processUpload(file),
    multipleUpload: (root: any, { files }, { processUpload }) => Promise.all(files.map(processUpload))
  },

  Subscription: {
    mySub: {
      subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator("hey")
    },
    counter: {
      subscribe: (parent, args, { pubsub }) => {
        const channel = Math.random()
          .toString(36)
          .substring(2, 15); // random channel name
        let count = 0;
        setInterval(
          () =>
            pubsub.publish(channel, {
              // eslint-disable-next-line no-plusplus
              counter: {
                count: count++
              }
            }),
          2000
        );
        return pubsub.asyncIterator(channel);
      }
    },

    messageAdded: {
      subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator("messages")
    }
  }
};

function getUrlencodedBody(data) {

  let bodyStr = ''
  Object.keys(data).forEach(key => {
    const value = data[key]
    bodyStr += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
  })
  if (bodyStr) {
    // 去除最后的&
    bodyStr = bodyStr.substring(0, bodyStr.length - 1);
  }
  return bodyStr
}