import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";

const HelpedCasesBar = () => {
	const [salesData, setSalesData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get("http://localhost:4000/api/statistics/cases-helped");
				const transformedData = response.data.data.map((item) => ({
					name: item.user || "Unknown",
					sales: item.count,
				}));
				setSalesData(transformedData);
			} catch (err) {
				setError("Failed to fetch data");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	if (loading) return <p className="text-gray-300">Loading...</p>;
	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<motion.div
    className="bg-white p-8 rounded-xl shadow-lg"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
		>
			<h2 className='text-3xl font-semibold text-gray-800 text-center mb-6'>Daily Sales Trend</h2>

			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<BarChart data={salesData} barSize={35}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='name' stroke='#FF6347' />
						<YAxis stroke='#9CA3AF' />
						<Tooltip
							contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
							itemStyle={{ color: "#FF6347" }}
						/>
						<Bar dataKey='sales' fill='#1C3F95' /> {/* Persian Blue color */}
					</BarChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default HelpedCasesBar;