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

print('download the daily trade of all stock in china')
df = ak.stock_zh_a_spot_em()

# Calculate statistics for '涨跌幅' column
up_count = df[df['涨跌幅'] > 0]['涨跌幅'].count()
flat_count = df[df['涨跌幅'] == 0]['涨跌幅'].count()
down_count = df[df['涨跌幅'] < 0]['涨跌幅'].count()

max_change = df['涨跌幅'].max()
min_change = df['涨跌幅'].min()
median_change = df['涨跌幅'].median()

# Print the results
print(f"涨跌幅 > 0 的个数: {up_count}")
print(f"涨跌幅 = 0 的个数: {flat_count}")
print(f"涨跌幅 < 0 的个数: {down_count}")
print(f"涨跌幅 最大值: {max_change:.2f}%")
print(f"涨跌幅 最小值: {min_change:.2f}%")
print(f"涨跌幅 中位数: {median_change:.2f}%")

# Calculate the sum of '成交额'
total_deal_value = df['成交额'].sum()

# Format the total deal value with commas for thousands separator
formatted_deal_value = "{:,.2f}".format(total_deal_value)

# Update the print statement to use the calculated sum
print(f"总成交额: {formatted_deal_value}")

df_selected =  df[['名称','涨跌幅', '年初至今涨跌幅']]
df_rename = df_selected.rename(columns = {'名称': 'name', '涨跌幅' : 'percent', '年初至今涨跌幅': 'current_year_percent'
})
json_data = df_rename.to_json(orient='records',force_ascii=False)

supabase_api_key = os.environ.get('API_KEY')

if supabase_api_key is None:
    print(f"supabase api key is invalid.{supabase_api_key}")
    exit(0)
print(f"supabase api key is {supabase_api_key[:10]}")

url: str = 'https://ortnrxgwpiizulknfdgr.supabase.co'
key =  supabase_api_key
current_day = datetime.date.today().isoformat()
supabase: Client = create_client(url, key)
response = (
    supabase.table("percent")
    .update({"date": current_day, "metadata": json.loads(json_data)})
    .eq("id", 1)
    .execute()
)

response = (
    supabase.table("stock_stats")
    .insert({"date": current_day, "up": int(up_count), "flat": int(flat_count), "down": int(down_count)})
    .execute()
)

print(response)

print('download margin info in china')
stock_margin_account_info_df = ak.stock_margin_account_info()
stock_margin_account_info_df.to_csv(f'{data_folder}/margin-info.csv')

print('download bond rate in china and us')
bond_zh_us_rate_df = ak.bond_zh_us_rate(start_date="19901219")
bond_zh_us_rate_df.to_csv(f'{data_folder}/bond-rate.csv')
