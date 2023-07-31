// https://ecapi.pchome.com.tw/ecshop/prodapi/v2/prod/DGBJG9-A900B51SM-000&store=DGBJG9&fields=Seq,Id,Name,Nick,Store,PreOrdDate,SpeOrdDate,Price,Discount,Pic,Weight,ISBN,Qty,Bonus,isBig,isSpec,isCombine,isDiy,isRecyclable,isCarrier,isMedical,isBigCart,isSnapUp,isDescAndIntroSync,isFoodContents,isHuge,isEnergySubsidy,isPrimeOnly,isPreOrder24h,isWarranty,isLegalStore,isFresh,isBidding,isSet,Volume,isArrival2

const axios = require("axios");

function getProDetail(prodId, callback) {
  if (!!!prodId) {
    prodId = "DGBJG9-A900B51SM";
  }

  const url = genPchomeQueryProdUrl(prodId);

  axios.get(url).then(function (response) {
    if (response.data) {
      // const a = JSON.parse(response.data);
      //   console.log(JSON.parse(response.data));
      let dataString = response.data;
      const prodDetailJson = JSON.parse(
        dataString
          .split(`try{jsonp_prod(`)[1]
          .split(`);}catch(e){if(window.console){console.log(e);}}`)[0]
      )[prodId + "-000"];
      //   console.log(`prodDetailJson:`, prodDetailJson);
      //   console.log(prodDetailJson.Discount);
      console.log(
        `${prodDetailJson.Name} 目前數量為 ${prodDetailJson.Qty} , 官網狀態為 ${prodDetailJson.Nick}`
      );
      callback();
    }
  });
}

function genPchomeQueryProdUrl(prodId) {
  return `https://ecapi.pchome.com.tw/ecshop/prodapi/v2/prod/${prodId}-000&store=DGBJG9&fields=Seq,Id,Name,Nick,Store,PreOrdDate,SpeOrdDate,Price,Discount,Pic,Weight,ISBN,Qty,Bonus,isBig,isSpec,isCombine,isDiy,isRecyclable,isCarrier,isMedical,isBigCart,isSnapUp,isDescAndIntroSync,isFoodContents,isHuge,isEnergySubsidy,isPrimeOnly,isPreOrder24h,isWarranty,isLegalStore,isFresh,isBidding,isSet,Volume,isArrival24h,isETicket,ShipType,isO2O,RealWH,ShipDay,ShipTag&_callback=jsonp_prod&1624954320?_callback=jsonp_prod`;
}

function getProdGroup() {
  return new Promise((resolve, reject) => {
    const groupUrl = genPchomeQueryProdGroupUrl(`DGBJG9`);
    axios.get(groupUrl).then((resp) => {
      console.log("resp.data", resp.data);
      const data = JSON.parse(processJsonByGroup(resp.data));
      const aa = data.map((mapData) => mapData.Id);
      console.log(aa);
      resolve(aa);
    });
  });
}

//     return axios.get(groupUrl).then(

//         function (response) {
//     if (response.data) {
//       // const a = JSON.parse(response.data);
//       console.log(response.data);
//       const data = JSON.parse(processJsonByGroup(response.data));
//       console.log("data:", data);
//       const aa = data.map((mapData) => mapData.Id);
//       console.log(aa);
//       return aa;
//     }
//   });
// }

function genPchomeQueryProdGroupUrl(group) {
  // DGBJG9;
  return `https://ecapi.pchome.com.tw/cdn/ecshop/prodapi/v2/store/${group}/prod&offset=0&limit=4&fields=Id,Nick,Pic,Price,Discount,isSpec,Name,isCarrier,isSnapUp,isBigCart,OriginPrice,iskdn,isPreOrder24h,PreOrdDate,isWarranty,isFresh,isBidding,isETicket,ShipType,isO2O&_callback=jsonp_prodtop?_callback=jsonp_prodtop`;
}
function processJsonByGroup(data) {
  return data
    .split(`try{jsonp_prodtop(`)[1]
    .split(`);}catch(e){if(window.console){console.log(e);}}`)[0];
}
// getProDetail();
async function test() {
  let bbbb = await getProdGroup();
}
module.exports = {
  getProDetail,
};
