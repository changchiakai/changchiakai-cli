const axios = require("axios");
const cheerio = require("cheerio");
const Canvas = require("drawille");
const sparkly = require("sparkly");
const numberUtils = require("../utils/numberUtils");
const line = require("bresenham");
const commandColorUtils = require("../utils/commandColorUtils");
const stockUrl =
  "https://www.twse.com.tw/exchangeReport/STOCK_DAY_AVG?response=html&date=";
var c = new Canvas(50, 100);
const boxen = require("boxen");
const dateFns = require("date-fns");
const { zhTW } = require("date-fns/locale");

let stockList = [];
// 取當月每日收盤 及平均價格
function getTwStockForStockNo(stockNo, queryYYYYMMDD, callback) {
  // console.log(month.length )
  // console.log(month.length === 6 ? month+'01' : dateUtils.getTodayYYYYMMDD());
  const url = stockUrl + queryYYYYMMDD + "&stockNo=" + stockNo;
  // console.log(url);
  axios
    .get(url)
    .then(function (response) {
      // console.log(response.data || {})
      if (response.data) {
        let $ = cheerio.load(response.data);

        if (
          $("body div")[0].children[0].data.trim() ==
          "很抱歉，沒有符合條件的資料!"
        ) {
          console.log("很抱歉，沒有符合條件的資料!");
        } else {
          const stockName = $("table tr th div")[0].children[0].data.trim();
          const stockDataHtml = $("tbody tr td");

          let stockdata = { date: "", price: "" };
          let averagePrice = "";
          stockDataHtml.each(function (i, element) {
            if (element) {
              const data = element.children[0].data;
              // 最後兩欄

              if (i == stockDataHtml.length - 1) {
                // console.log("least")
                // break;
                averagePrice = data;
              } else if (i == stockDataHtml.length - 2) {
                // console.log("least -2")
                // break;
              } else if (i % 2 == 1) {
                stockdata.price = Number(data);
                stockList.push(stockdata);
                stockdata = { date: "", price: "" };
                // console.log("是股價",data);
              } else if (i % 2 == 0) {
                // console.log(data)
                const date = new Date(data);
                date.setFullYear(date.getFullYear() + 1911);
                // console.log(date.getTime());
                stockdata.date = date.toLocaleDateString();
                // stockdata.getTime = date.getTime()
                // console.log("是日期",data);
              }
              // console.log("i:",i,"  "," el:",element.children);
            }
          });

          if (stockList.length < 30) {
            // 不足三十要補足三十天
            //  console.log(queryYYYYMMDD.slice(4,6)-1);
            getTwStockForStockNo(
              stockNo,
              queryYYYYMMDD.slice(0, 4) + queryYYYYMMDD.slice(4, 6) - 1 + "01"
            );
          } else {
            let a = 0;
            stockList.forEach((data) => {
              a += data.price;
            });
            stockList.sort((stockDetailA, stockDetailB) => {
              let aDate = new Date(stockDetailA.date).getTime();
              let bDate = new Date(stockDetailB.date).getTime();
              return aDate - bDate;
            });
            console.log(stockName.split("月")[1].trim().split("日")[0].trim());

            console.table(stockList);
            console.log("平均價格: ", a / stockList.length);
            // console.log("平均價格: ", a / stockList.length);
            const aver = Math.floor(a / stockList.length);
            // console.log('w:', aver);
            c.clear();
            if (aver - 50 > 0) {
              const centerLineCost = aver - 50;
              // for (let i = 0; i < 100; i++) {
              //     for (let j = 0; j < 100; j++) {
              //         if (j === 50) {
              //             c.set(i, j);
              //         }
              //     }
              // }
              for (let ln = 0; ln < stockList.length; ln++) {
                if (ln !== stockList.length - 1) {
                  let firstPoint =
                    Math.floor(stockList[ln].price) - centerLineCost;
                  let lastPoint =
                    Math.floor(stockList[ln + 1].price) - centerLineCost;
                  // console.log(centerLineCost, stockList[ln].price);
                  // console.log(Math.floor(stockList[ln].price) - centerLineCost, firstPoint, lastPoint);
                  line(
                    ln,
                    100 - firstPoint,
                    ln + 1,
                    100 - lastPoint,
                    c.set.bind(c)
                  );
                }
              }
              // stockList.forEach((d,index)=>{
              //     c.set(index,100-(Math.floor(d.price)-centerLineCost))

              // })
            } else {
              console.log("股價五十以下正在想辦法做");
              for (let ln = 0; ln < stockList.length; ln++) {
                if (ln !== stockList.length - 1) {
                  let firstPoint = Math.floor(stockList[ln].price);
                  let lastPoint = Math.floor(stockList[ln + 1].price);
                  // console.log(firstPoint, lastPoint);
                  // console.log(Math.floor(stockList[ln].price) - centerLineCost, firstPoint, lastPoint);
                  line(
                    ln,
                    100 - firstPoint,
                    ln + 1,
                    100 - lastPoint,
                    c.set.bind(c)
                  );
                }
              }
            }
            line(0, 50, 50, 50, c.set.bind(c));

            //以均價為中線 畫出中線
            // c.set(0, 0)
            // 畫周圍
            // for(let i = 0 ; i <25 ; i++){

            //     for(let j = 0 ; j <25; j++){
            //             c.set(i,j);
            //     }
            // }
            //   var sin = function(i, l) {
            //     return Math.floor(Math.sin(i*2*Math.PI)*l+80);
            //   }, cos = function(i, l) {
            //     return Math.floor(Math.cos(i*2*Math.PI)*l+80);
            //   };
            //   console.log(sin(t.getHours()/24, 30), 160-cos(t.getHours()/24, 30));

            // line(10, 10, 10, 20, c.set.bind(c));
            // line(25, 25, 50, 50, c.set.bind(c));
            process.stdout.write(c.frame());
          }

          // let list = [];
          // stockList.forEach((stockData, index) => {
          //     list.push(stockData.price);

          // })
          // console.log(sparkly(list));

          // console.log(sparkly([0, 3, 5, 8, 4, 3, 4, 10]));
          //   var sin = function(i, l) {
          //     return Math.floor(Math.sin(i*2*Math.PI)*l+80);
          //   }, cos = function(i, l) {
          //     return Math.floor(Math.cos(i*2*Math.PI)*l+80);
          //   };
          //   console.log(sin(t.getHours()/24, 30), 160-cos(t.getHours()/24, 30));

          // process.stdout.write(c.frame());
          // stockList.forEach((i,el)=>{
          //     console.log('i:',i," el:",el);
          // })

          //=> '▁▃▄▇▄▃▄█'
          callback();
        }
      }
    })
    .finally(() => {
      callback();
    });
}

async function getTwStockForRealTimeWithOtc(stockNo, isOtc) {}

async function getTwStockForRealTime(stockNo, callback, isOtc) {
  console.log(`查詢的股票代號為:${stockNo}`);

  axios
    .get(getFivePriceUrl(stockNo, isOtc), {
      header: {
        // "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36",
        // "Cookie":"JSESSIONID=31D058A0598015805B738EC0F3A736FB; _ga=GA1.3.1950048803.1604293584; _gid=GA1.3.1521451193.1604293584; _gat_gtag_UA_138646291_1=1",
        // "X-Requested-With":"XMLHttpRequest",
        // "Sec-Fetch-Site": "same-origin",
        // "Sec-Fetch-Mode": "cors",
        // "Sec-Fetch-Dest": "empty",
        // "Referer": "https://mis.twse.com.tw/stock/fibest.jsp?stock=2330",
        // "Host": "mis.twse.com.tw",
        // "Accept": "application/json, text/javascript, */*; q=0.01",
        // "Accept-Encoding": "gzip, deflate, br",
        // "Accept-Language": "zh-TW,zh;q=0.9",
        // "Connection":"keep-alive"
      },
    })
    .then(function (response) {
      // console.log(response.data || {})
      if (response.data) {
        const stockData = response.data.msgArray[0];
        if (stockData == undefined) {
          // 可能是otc
          axios
            .get(getFivePriceUrl(stockNo, true), {
              header: {
                // "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36",
                // "Cookie":"JSESSIONID=31D058A0598015805B738EC0F3A736FB; _ga=GA1.3.1950048803.1604293584; _gid=GA1.3.1521451193.1604293584; _gat_gtag_UA_138646291_1=1",
                // "X-Requested-With":"XMLHttpRequest",
                // "Sec-Fetch-Site": "same-origin",
                // "Sec-Fetch-Mode": "cors",
                // "Sec-Fetch-Dest": "empty",
                // "Referer": "https://mis.twse.com.tw/stock/fibest.jsp?stock=2330",
                // "Host": "mis.twse.com.tw",
                // "Accept": "application/json, text/javascript, */*; q=0.01",
                // "Accept-Encoding": "gzip, deflate, br",
                // "Accept-Language": "zh-TW,zh;q=0.9",
                // "Connection":"keep-alive"
              },
            })
            .then(function (response) {
              // console.log(response.data || {})
              if (response.data) {
                const stockData = response.data.msgArray[0];
                // console.log("stockData:", stockData);
                // v : 累積成量
                // f : 賣出 數量  後面越高 '313_142_228_317_291_',
                // g : 買入數量 前面越高 '11_234_239_77_302_',
                // l :當日最低
                // o: 開盤
                // h:當日最高
                // a: 賣五檔  '433.5000_434.0000_434.5000_435.0000_435.5000_',
                // b: 買五檔  '433.0000_432.5000_432.0000_431.5000_431.0000_',
                // pz: 開盤
                // n: '台積電',
                // y: 昨收
                if (stockData) {
                  console.log(
                    commandColorUtils.fgMagenta(
                      `股名:${stockData.n}(${stockNo})`
                    )
                  );
                  console.log(
                    commandColorUtils.warn(`開盤: ${stockData.pz} 元`)
                  );
                  console.log(
                    commandColorUtils.red(`當日最高: ${stockData.h} 元`)
                  );
                  console.log(
                    commandColorUtils.green(`當日最低: ${stockData.l} 元`)
                  );
                  const buyPriceList = stockData.b.split("_");
                  const salePriceList = stockData.a.split("_");
                  const buyQList = stockData.f.split("_");
                  const saleQList = stockData.g.split("_");
                  for (let toFive = 0; toFive < 5; toFive++) {
                    console.log(
                      boxen(
                        commandColorUtils.green(buyQList[toFive]) +
                          commandColorUtils.white("|") +
                          commandColorUtils.green(buyPriceList[toFive]) +
                          commandColorUtils.white("||") +
                          commandColorUtils.red(salePriceList[toFive]) +
                          commandColorUtils.white("|") +
                          commandColorUtils.red(saleQList[toFive])
                      )
                    );
                  }

                  console.log("現價(買五檔第一位):", stockData.b.split("_")[0]);
                  console.log("現價(賣五檔第一位):", stockData.a.split("_")[0]);
                  console.log("成量:", numberUtils.toThousands(stockData.v));
                  callback();
                } else {
                  console.log("查無資料");
                  callback();
                }
              } else {
                console.log("無法查詢請稍後再試");
                callback();
              }
            });
          // getTwStockForRealTime(stockNo, callback, true);
        } else {
          // console.log("stockData:", stockData);
          // v : 累積成量
          // f : 賣出 數量  後面越高 '313_142_228_317_291_',
          // g : 買入數量 前面越高 '11_234_239_77_302_',
          // l :當日最低
          // o: 開盤
          // h:當日最高
          // a: 賣五檔  '433.5000_434.0000_434.5000_435.0000_435.5000_',
          // b: 買五檔  '433.0000_432.5000_432.0000_431.5000_431.0000_',
          // pz: 開盤
          // n: '台積電',
          // y: 昨收
          if (stockData) {
            console.log(
              commandColorUtils.fgMagenta(`股名:${stockData.n}(${stockNo})`)
            );
            console.log(commandColorUtils.warn(`開盤: ${stockData.pz} 元`));
            console.log(commandColorUtils.red(`當日最高: ${stockData.h} 元`));
            console.log(commandColorUtils.green(`當日最低: ${stockData.l} 元`));
            const buyPriceList = stockData.b.split("_");
            const salePriceList = stockData.a.split("_");
            const buyQList = stockData.f.split("_");
            const saleQList = stockData.g.split("_");
            for (let toFive = 0; toFive < 5; toFive++) {
              console.log(
                boxen(
                  commandColorUtils.green(buyQList[toFive]) +
                    commandColorUtils.white("|") +
                    commandColorUtils.green(buyPriceList[toFive]) +
                    commandColorUtils.white("||") +
                    commandColorUtils.red(salePriceList[toFive]) +
                    commandColorUtils.white("|") +
                    commandColorUtils.red(saleQList[toFive])
                )
              );
            }
            // const c = stockData.b.split("_");
            // c.forEach((d) => {
            //     console.log(boxen(d));
            // })
            // console.log(numberUtils.roundToTwo((Number(stockData.b.split("_")[0])/30.25-1)*100)+"%");
            // console.log(numberUtils.roundToTwo((Number(stockData.a.split("_")[0])/30.25-1)*100)+"%");
            console.log("現價(買五檔第一位):", stockData.b.split("_")[0]);
            console.log("現價(賣五檔第一位):", stockData.a.split("_")[0]);
            console.log("成量:", numberUtils.toThousands(stockData.v));
            callback();
          } else {
            console.log("查無資料");
            callback();
          }
        }
      } else {
        console.log("無法查詢請稍後再試");
        callback();
      }
    });
}

// tse 集中市場
// otc 上櫃市場
// https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=otc_3105.tw&json=1&delay=0&_=1622432923818

function getFivePriceUrl(stockNo, isOtc) {
  const nowTime = new Date();
  const url =
    "https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=" +
    (isOtc ? "otc" : "tse") +
    "_" +
    stockNo +
    ".tw&json=1&delay=0&_=" +
    nowTime.getTime();
  // console.log("url:", url);
  return url;
}

/* 
https://www.twse.com.tw/fund/BFI82U?response=html&dayDate=20210519
*/
function getThreeMajorCorporationsBuySell(callback) {
  //www.twse.com.tw/fund/BFI82U?response=html&dayDate=20210521

  // 如果今日超過３點再去打今天 如果沒打昨天
  const today = new Date();
  // const aa = new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });
  // console.log(aa);
  // https://date-fns.org/v2.21.3/docs/format
  // const todayFormat = dateFns.format(result, "yyyyMMdd kk:mm:ss", zhTW);
  const isOver15 = dateFns.format(today, "kk", zhTW) >= 15 ? true : false;
  console.log("isOver15:" + isOver15);
  const result = dateFns.add(today, {
    days: isOver15 ? 0 : -1,
  });
  // console.log("result:", result);

  const todayFormat = dateFns.format(result, "yyyyMMdd", zhTW);
  // console.log(todayFormat);
  try {
    axios
      .get(
        "https://www.twse.com.tw/fund/BFI82U?response=html&dayDate=" +
          todayFormat
      )
      .then(function (response) {
        if (response.data) {
          const stockData = response.data;
          // console.log(stockData);
          let $ = cheerio.load(response.data);
          // console.log("$:", $);
          const dataTitle = $("table tr th div")[0].children[0].data.trim();
          const stockDataHtml = $("tbody tr td");

          console.log(dataTitle);
          // console.log(stockDataHtml);

          // console.log("-------");
          // let stockdata = { date: "", price: "" };
          // let averagePrice = "";
          const threeMajorDataList = [];
          let threeMajorData = {};
          stockDataHtml.each(function (i, element) {
            const data = element.children;
            // console.log("thisis: data : ", data[0].data);

            switch (i % 4) {
              case 0:
                threeMajorData = {};
                threeMajorData.單位名稱 = data[0].data;

                break;
              case 1:
                threeMajorData.買進金額 = data[0].data;
                break;
              case 2:
                threeMajorData.賣出金額 = data[0].data;
                break;
              case 3:
                threeMajorData.買賣差額 = data[0].data;
                threeMajorDataList.push(threeMajorData);
                break;
            }
          });

          console.table(threeMajorDataList);
          // console.log("stockData:", stockData);
        }

        callback();
      });
    console.log(todayFormat);
  } catch (error) {
    console.log("目前呼叫不到");
    allback();
  }
  // => '02/11/2014'
  // if (date === "") {
  //   date = n;
  // }
}

module.exports = {
  getTwStockForStockNo,
  getTwStockForRealTime,
  getThreeMajorCorporationsBuySell,
};
