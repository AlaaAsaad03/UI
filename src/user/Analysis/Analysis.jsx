import React from 'react';
import './Analysis.css';
import CategoryBreakdown from '../CategoryBreakdown/CategoryBreakdown';
import WeeklySpending from '../WeeklySpending/WeeklySpending';
import CasesHelpedPerDay from '../CasesHelpedPerDay/CasesHelpedPerDay';
import UserVsAverageSpending from '../UserVsAverageSpending/UserVsAverageSpending';
import MyOrders from '../MyOrders/MyOrders';

const Analysis = () => {
  return (
    <div className="analysis">
      <div className="flex-1 overflow-auto relative z-10 bg-white dark:bg-gray-900">
        <h1 className="page-title">Statistics</h1>
        <div className="title-underline"></div>

        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          {/* Weekly Spending at the top */}
          <WeeklySpending />
          
          {/* These three are aligned horizontally on larger screens and stack on smaller ones */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <CategoryBreakdown />
            <CasesHelpedPerDay />
            <UserVsAverageSpending />
          </div>
          
          {/* My Orders below the charts */}
          <MyOrders />
        </main>
      </div>
    </div>
  );
};

export default Analysis;
