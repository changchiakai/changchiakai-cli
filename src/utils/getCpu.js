const os = require("os");
const si = require('systeminformation');

function cpuTemperature(callback) {
  si.cpuTemperature().then(data => {
    console.log("cpuTemperature: ", data);
    callback();

  }).catch(error => {
    console.log("error: ", error);
    callback();

  })

}
function tes(callback) {
  // promises style - new since version 3
  si.cpu()
    .then(data => {
      console.log(data);
      callback();
    })
    .catch(error =>{
      console.error(error);
      callback();
    });



}
function printComputerInfo(callback) {
  // console.log(os.cpus());
  // console.log(os.totalmem());
  // console.log(os.freemem());

  // console.log(os.type());
  // console.log(os.hostname());
  // console.log(os.version());
  // console.log(os.platform());
  console.log(`your cpu stlye is ${os.cpus()[0].model}`);
  console.log(`your cpu cores is ${os.cpus().length}`);

  switch (os.platform()) {
    case "darwin":
      console.log("os is osx");
      break;

    case "android":
      console.log("os is android ");
      break;
    case "linux":
      console.log("os is linux ");
      break;
    case "win32":
      console.log("os is win32 ");
      break;
    default:
      console.log("you os not recognize");
  }
  // console.log(os.release());
  // console.log(os.homedir());
  // console.log(os.userInfo());

  console.log("userName: ", os.userInfo().username);

  const bytesToSize = (bytes) => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "0 Byte";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
  };
  console.log("free memory : ", bytesToSize(os.freemem()));
  console.log("total memory : ", bytesToSize(os.totalmem()));
  // 在POSIX上，它使用$HOME環境變量（如果已定義）。否則，它將使用有效的UID查找用戶的主目錄。

  // 在Windows上，USERPROFILE如果已定義，它將使用環境變量。否則，它將使用當前用戶的配置文件目錄的路徑。
  callback();
}

module.exports = {
  printComputerInfo,
  tes,
  cpuTemperature
};
