import akshare as ak
import os
import datetime
from supabase import create_client, Client
import json
import pandas as pd
import time

# Define the folder to store CSV files
data_folder = 'public/csv'
if not os.path.exists(data_folder):
    os.makedirs(data_folder)

# Fetch and analyze stock data for Chinese A-shares
print('download the daily trade of all stock in china')
df = ak.stock_zh_a_spot_em()

# Calculate statistics for stock performance
up_count = df[df['涨跌幅'] > 0]['涨跌幅'].count()
flat_count = df[df['涨跌幅'] == 0]['涨跌幅'].count()
down_count = df[df['涨跌幅'] < 0]['涨跌幅'].count()

max_change = df['涨跌幅'].max()
min_change = df['涨跌幅'].min()
median_change = df['涨跌幅'].median()

# Print summary statistics
print(f"涨跌幅 > 0 的个数: {up_count}")
print(f"涨跌幅 = 0 的个数: {flat_count}")
print(f"涨跌幅 < 0 的个数: {down_count}")
print(f"涨跌幅 最大值: {max_change:.2f}%")
print(f"涨跌幅 最小值: {min_change:.2f}%")
print(f"涨跌幅 中位数: {median_change:.2f}%")

# Calculate and format total deal value
total_deal_value = df['成交额'].sum()
formatted_deal_value = "{:,.2f}".format(total_deal_value)
print(f"总成交额: {formatted_deal_value}")

# Prepare data for JSON conversion
df_selected =  df[['名称','涨跌幅', '年初至今涨跌幅']]
df_rename = df_selected.rename(columns = {
    '名称': 'name',
    '涨跌幅' : 'percent',
    '年初至今涨跌幅': 'current_year_percent'
})
json_data = df_rename.to_json(orient='records', force_ascii=False)

# Retrieve Supabase API key from environment variables
supabase_api_key = os.environ.get('API_KEY')

if supabase_api_key is None:
    print(f"supabase api key is invalid.{supabase_api_key}")
    exit(0)
print(f"supabase api key is {supabase_api_key[:10]}...")  # Print first 10 characters for verification

# Set up Supabase client
url: str = 'https://ortnrxgwpiizulknfdgr.supabase.co'
key =  supabase_api_key
current_day = datetime.date.today().isoformat()
supabase: Client = create_client(url, key)

# Update 'percent' table in Supabase with new data
response = (
    supabase.table("percent")
    .update({"date": current_day, "metadata": json.loads(json_data)})
    .eq("id", 1)
    .execute()
)

# Insert new record into 'stock_stats' table
response = (
    supabase.table("stock_stats")
    .insert({"date": current_day, "up": int(up_count), "flat": int(flat_count), "down": int(down_count)})
    .execute()
)

print(response)

# Fetch and save margin account information
print('download margin info in china')
def retry_with_timeout(task_func, max_attempts=10, timeout_minutes=5):
    attempt = 0
    start_time = datetime.datetime.now()
    timeout = datetime.timedelta(minutes=timeout_minutes)

    while attempt < max_attempts and datetime.datetime.now() - start_time < timeout:
        try:
            result = task_func()
            print(f"Successfully completed task on attempt {attempt + 1}")
            return result
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {str(e)}")
            attempt += 1
            time.sleep(5)  # Wait for 5 seconds before retrying

    if attempt == max_attempts:
        print(f"Failed to complete task after {max_attempts} attempts")
    elif datetime.datetime.now() - start_time >= timeout:
        print(f"Timeout: Failed to complete task within {timeout_minutes} minutes")
    return None

def download_margin_info():
    stock_margin_account_info_df = ak.stock_margin_account_info()
    stock_margin_account_info_df.to_csv(f'{data_folder}/margin-info.csv')
    return stock_margin_account_info_df

print('download margin info in china')
result = retry_with_timeout(download_margin_info)
if result is not None:
    print("Successfully downloaded and saved margin info")
else:
    print("Failed to download margin info")

# Fetch and save bond rate information for China and US
print('download bond rate in china and us')
def download_bond_rate():
    bond_zh_us_rate_df = ak.bond_zh_us_rate(start_date="19901219")
    bond_zh_us_rate_df.to_csv(f'{data_folder}/bond-rate.csv')
    return bond_zh_us_rate_df

print('download bond rate in china and us')
result = retry_with_timeout(download_bond_rate)
if result is not None:
    print("Successfully downloaded and saved bond rate info")
else:
    print("Failed to download bond rate info")
