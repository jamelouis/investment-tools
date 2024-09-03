"use client";
import { createClient } from '@supabase/supabase-js'
import { Database } from '../../../lib/supabase'
import { useEffect, useState } from 'react'
import MarketSentimentChart from '../../components/StackedBar'
import { DualAxes } from "@ant-design/plots";
import BoxplotWithHistogramChart from '@/app/components/BoxplotWithHistogramChart';
import testData from "@/data/supplement.json"
import { Space } from 'antd'

const supabase = createClient<Database>(
    "https://ortnrxgwpiizulknfdgr.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ydG5yeGd3cGlpenVsa25mZGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM2ODc2MDcsImV4cCI6MjAzOTI2MzYwN30.zbPUOJkwzyPpB5QJEaGpr13Ro3u_3S86cdLnpxPNFV4"
)

type UpFlatDown = Database['public']['Tables']['stock_stats']['Row']

function transformData(data: UpFlatDown[]) {
    // 创建一个新的数组来存储转换后的数据
    // Define the structure for the transformed data
    type TransformedData = {
        date: string;
        value: number | null;
        name: 'up' | 'flat' | 'down';
    };

    const transformedData: TransformedData[] = [];

    // 遍历原始数据
    data.forEach(item => {
        // 对于每个'up'和'down'，创建一个新的对象并添加到转换后的数据中
        transformedData.push({ date: item.date, value: item.up, name: 'up' });
        transformedData.push({ date: item.date, value: item.flat, name: 'flat' });
        transformedData.push({ date: item.date, value: item.down, name: 'down' });
    });

    return transformedData;
}

export default function UpFlatDownCount() {
    const [data, setData] = useState<UpFlatDown[]>([
            { date: '2024-08-13', up: 3729, flat: 231, down: 1377 },
    ]);
    const [statData, setStatData] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('stock_stats')
                .select('*')

            if (error) console.log('error', error)
            else setData(data.sort((a,b)=> a.date.localeCompare(b.date)))
        }

        fetchData()

        const fetchPercent = async () => {
            const { data, error } = await supabase.from('percent').select('*')
            if(error) console.log(error);
            else setStatData(data);
        }
        fetchPercent();

    }, [supabase])

    if (data == null || data.length == 0) return <p>Loading ...</p>

    const { up, flat, down } = data[data.length - 1];
    console.log(up, flat, down);
    let realData = transformData(data);
    const config = {
        xField: 'date',
        legend: {
            color: { range: ['#F44336', '#5f5f5f', '#4CAF50', '#4CAF50'] },
        },
        scale: { color: { range: ['#F44336', '#5f5f5f', '#4CAF50', '#4CAF50'] } },
        children: [
            {
                data: realData,
                type: 'line',
                yField: 'value',
                colorField: 'name',
                seriesField: 'name',
                axis: { y: { position: 'right' } },
                style: { lineWidth: 2 },
            }
        ],
    };

    const metadata = statData.length > 0 ? statData[0].metadata.filter((d)=> d.current_year_percent < 8000) : [];
    const date = statData.length > 0 ? statData[0].date : 'invalid date';
    
    return (
        <>
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 gap-4">
                    {/* First row: Full-width column */}
                    <div className="bg-gray-200 p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-2 text-center">涨跌统计</h2>
                        <div className="bg-white rounded">
                            {/* Place your D3 or Ant Design chart here */}
                            <div className="flex justify-center">
                                <MarketSentimentChart up={up ? up : 0} flat={flat ? flat : 0} down={down ? down : 0} />
                            </div>
                            <DualAxes {...config} />
                        </div>
                    </div>

                    {/* Second row: Two-column layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-200 p-4 rounded-lg shadow">
                            <h2 className="text-lg font-semibold mb-2">{date}日涨跌幅</h2>
                            <div className=" bg-white rounded">
                                {/* Place your D3 or Ant Design chart here */}
                        <BoxplotWithHistogramChart data={metadata} yField={'percent'} />
                            </div>
                        </div>
                        <div className="bg-gray-200 p-4 rounded-lg shadow">
                            <h2 className="text-lg font-semibold mb-2">年初至{date}涨跌幅</h2>
                            <div className="bg-white rounded">
                                {/* Place your D3 or Ant Design chart here */}
                        <BoxplotWithHistogramChart data={metadata} yField={'current_year_percent'} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}