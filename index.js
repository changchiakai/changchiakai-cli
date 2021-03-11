#!/usr/bin/env node
const twStock = require('./src/function/twStock');
const commandColorUtils = require('./src/utils/commandColorUtils');
const checkPackageVerisonUtils = require('./src/utils/checkPackageVerisonUtils');
const dateUtils = require('./src/utils/dateUtils');
const vorpal = require("vorpal")();

let argv = require('yargs/yargs')(process.argv.slice(2))
    .option('stock', {
        alias: 's',
        // demandOption: true,
        // boolean: true,
        describe: '找股票當月收盤  (首月第一天可能會故障要等收盤)  changchiakai-cli -s 2330',
        string: true
    })
    .option('realTime', {
        alias: 'r',
        // demandOption: true,
        // boolean: true,
        describe: '現價及當下總成量 changchiakai-cli -r 2330',
        string: true
    })
    .option('env', {
        alias: 'e',
        // demandOption: true,
        // boolean: true,
        describe: '環境參數',
        string: true
    })
    .option('month', {
        alias: 'm',
        // demandOption: true,
        // boolean: true,
        describe: ' --stock 搭配用 西元年月份  ex. changchiakai-cli -s 2330 -m 202010',
        default: "0",
        string: true
    })
    .help()
    .alias('help', 'h')
    .locale('zh_TW').argv
// console.log(":", argv);



if (!!argv.s || !!argv.stock) {
    const stockNo = argv.s;
   
    let queryYYYYMMDD =  (argv.m.length === 6 ? argv.m+'01' : dateUtils.getTodayYYYYMMDD()) 
    twStock.getTwStockForStockNo(stockNo, queryYYYYMMDD);
} else if (!!argv.r || !!argv.realTime) {
    const stockNo = argv.r;

    twStock.getTwStockForRealTime(stockNo);
} else {
    console.log(commandColorUtils.warn("請輸入指令  或是使用 -h 來看有甚麼指令能用"));
    // console.log(process.env.APPDATA);
    checkPackageVerisonUtils.checkVerison();
}
// https://www.twse.com.tw/exchangeReport/STOCK_DAY_ALL?response=open_dat
// https://aronhack.com/products/python-download-taiwan-stock-data-from-twse/

vorpal.command("stock <type> <stockId>")
    .action(function (args, callback) {
        console.log("args:",args.type);
        console.log("args:",args.stockId);
        callback();

        // if (!is_address(args.address)) {
        //     console.log(chalk.red(`不合法的地址： ${args.address}`));
        //     callback();
        //     return;
        // }
        // if (!is_amount(args.amount)) {
        //     console.log(chalk.red(`不合法的金額： ${args.amount}`));
        //     callback();
        //     return;
        // }
        // let json = JSON.stringify({
        //     method: "sendtoaddress",
        //     data: {
        //         address: args.address,
        //         amount: parseInt(args.amount)
        //     }
        // });
        // sendAPI(json, callback, sendtoaddress_validator);
    });

vorpal
    .delimiter("changchiakai-cli >")
    .show();