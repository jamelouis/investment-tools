import akshare as ak
import os
import datetime
from supabase import create_client, Client
import datetime
import json
import pandas as pd

data_folder = 'public/csv'
if not os.path.exists(data_folder):
    os.makedirs(data_folder)

symbols = [
    "399001",
    "000016",
    "000300",
    "000905",
    "399006",
    "000922",
    "399989",
    "000991",
    "399812",
    "000942",
    "000990",
    "399971",
    "399975",
    "000992",
    "000827",
    "000993"
]

for symbol in symbols:
    print('download ' + symbol)
    if symbol.startswith('000'):
        real_symbol = 'sh'+symbol
    else:
        real_symbol = 'sz'+symbol
    stock_zh_index_daily_df = ak.stock_zh_index_daily(real_symbol)
    stock_zh_index_daily_df.to_csv(f'{data_folder}/{symbol}.csv')

hk_symbols = [
    'HSI', # 恒生指数
    'HSTECH', # 恒生科技指数
]

for symbol in hk_symbols:
   print('download ' + symbol)
   stock_hk_index_daily_sina_df = ak.stock_hk_index_daily_sina(symbol)
   stock_hk_index_daily_sina_df.to_csv(f'{data_folder}/{symbol}.csv')


us_symbols = [
   {
       "name": 'INX',
       "code": '.INX', # 标普五百
   },
   {
       "name": "NDX",
       "code": ".NDX"
   }
]

for symbol in us_symbols:
    print('download ' + symbol['name'])
    index_us_stock_sina_df = ak.index_us_stock_sina(symbol['code'])
    index_us_stock_sina_df.to_csv(f'{data_folder}/{symbol["name"]}.csv')
