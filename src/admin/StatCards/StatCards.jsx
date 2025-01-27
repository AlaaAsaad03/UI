import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { DollarSign, Users, Clipboard, ArrowDownRight, ArrowUpRight, ClipboardCheck } from "lucide-react";
import axios from "axios";

const StatCards = () => {
    const [overviewData, setOverviewData] = useState([]);
    const [todayCaseCount, setTodayCaseCount] = useState(0);
    const [totalHelpedCases, setTotalHelpedCases] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, revenueRes, ordersRes, helpedCasesRes] = await Promise.all([
                    axios.get("http://localhost:4000/api/statistics/registered-users"),
                    axios.get("http://localhost:4000/api/statistics/total-revenue"),
                    axios.get("http://localhost:4000/api/statistics/daily-case-creation"),
                    axios.get("http://localhost:4000/api/statistics/cases/helped/count"),
                ]);

                const today = new Date().toISOString().split('T')[0];
                const todayData = ordersRes.data.data.find(item => item._id === today);
                const count = todayData ? todayData.count : 0;

                setTodayCaseCount(count);

                const totalUsers = usersRes.data.count;
                const usersLastMonth = usersRes.data.lastMonthCount; // Assuming this data is available
                const userChange = ((totalUsers - usersLastMonth) / (usersLastMonth || 1) * 100).toFixed(1);
                
                const helpedCasesCount = helpedCasesRes.data.totalCases;
                setTotalHelpedCases(helpedCasesCount);

                const data = [
                    {
                        name: "Total Revenue",
                        value: `$${revenueRes.data.totalAmount.toLocaleString()}`,
                        change: ((revenueRes.data.difference / (revenueRes.data.yesterdayTotal || 1)) * 100).toFixed(1),
                        icon: DollarSign,
                    },
                    {
                        name: "Users",
                        value: totalUsers.toLocaleString(),
                        change: "0",
                        icon: Users,
                    },
                    {
                        name: "Today's Cases",
                        value: count,
                        change: "0", // Set to "0" or empty string
                        icon: Clipboard,
                    },
                    {
                        name: "Total Helped Cases", 
                        value: totalHelpedCases.toLocaleString(),
                        change: "0", // Set to "0" or empty string
                        icon: ClipboardCheck,
                        isGreen: true, // Added a flag for green styling
                    },
                ];

                setOverviewData(data);
            } catch (err) {
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-2'>
            {overviewData.map((item, index) => (
                <motion.div
                    key={item.name}
                    className='bg-transparent border border-tomato backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <div className='flex items-center justify-between'>
                        <div>
                            <h3 className='text-sm font-medium text-gray-400'>{item.name}</h3>
                            <p className='mt-1 text-xl font-semibold text-gray-300'>{item.value}</p>
                        </div>
                        <div className={`p-3 rounded-full bg-opacity-20 ${item.isGreen ? "bg-green-500" : (item.change === "Stable" ? "bg-orange-500" : (item.change >= 0 ? "bg-green-500" : "bg-red-500"))}`}>
                            <item.icon className={`size-6 ${item.isGreen ? "text-green-500" : (item.change === "Stable" ? "text-orange-500" : (item.change >= 0 ? "text-green-500" : "text-red-500"))}`} />
                        </div>
                    </div>
                    <div className={`mt-4 flex items-center ${item.change === "Stable" ? "text-orange-500" : (item.change >= 0 ? "text-green-500" : "text-red-500")}`}>
                        {item.change !== "0" && (item.change >= 0 ? <ArrowUpRight size='20' /> : <ArrowDownRight size='20' />)}
                        <span className='ml-1 text-sm font-medium'>{item.change !== "0" ? Math.abs(item.change) : ""}</span>
                        <span className='ml-2 text-sm text-gray-400'>{item.name === "Total Revenue" ? "vs yesterday" : ""}</span> {/* Removed "vs last month" from Users and Total Helped Cases */}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

export default StatCards;