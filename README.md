# changchiakai-cli

```
>changchiakai-cli
```

一些指令可以查資料

## stock -s ${stockId} 20200101

- 可以查股票近三十檔的股價 以 table 顯示於命令提示字元

- 可搭配-m 做期別查詢 ex: -s 2330 -m 20190101

## stock -r stockId

- 可以查股票當下五檔 -r 2330 當下成量 及 當日最高最低價

## stock -threeMajor

- 查詢三大法人買賣金額

## computerData

- 取電腦資料

## version

- 確認版本號碼

# 提醒

- 股票功能 因為有些 api 是去呼叫證交所
  [5 秒內不能存取超過 3 次 超過會鎖 IP 鎖的時間不一定 至少 20 分鐘起跳](https://www.ptt.cc/bbs/Stock/M.1513840325.A.AE7.html)
