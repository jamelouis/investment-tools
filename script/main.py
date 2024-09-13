import akshare as ak
import os

symbol="sz399001"
stock_zh_index_daily_df = ak.stock_zh_index_daily(symbol)
stock_zh_index_daily_df.to_csv(f'public/csv/{symbol}.csv')
