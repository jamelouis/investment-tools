import akshare as ak
import os

data_folder = 'public/csv'

if not os.path.exists(data_folder):
    os.makedirs(data_folder)

symbol="sz399001"
stock_zh_index_daily_df = ak.stock_zh_index_daily(symbol)
stock_zh_index_daily_df.to_csv(f'{data_folder}/{symbol}.csv')
