import React from "react";
import ReactApexChart from "react-apexcharts";

// Example card component
const DashboardCard = ({ title, value }) => {
  return (
    <div className="relative bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-lg rounded-xl p-6 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)] mx-2 overflow-hidden text-white">
      {/* Background Effects */}
      <div className="absolute w-32 h-32 rounded-full bg-white opacity-20 animate-spin-slow top-2/4 left-0 transform -translate-y-2/4"></div>
      <div className="absolute w-56 h-56 rounded-full bg-white opacity-10 animate-spin-slow right-0 bottom-0"></div>

      {/* Card Content */}
      <h2 className="relative z-10 text-2xl font-semibold">{title}</h2>
      <p className="relative z-10 text-4xl font-bold mt-4">{value}</p>
    </div>
  );
};

const Dashboard = () => {
  // Line chart data
  const lineChartOptions = {
    chart: {
      type: "line",
    },
    series: [
      {
        name: "Tasks Completed",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      },
    ],
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
      ],
    },
  };

  // Pie chart data
  const pieChartOptions = {
    chart: {
      type: "pie",
    },
    series: [44, 55, 13, 43],
    labels: ["To Do", "In Progress", "Done", "Blocked"],
  };

  // Donut chart data (poll results)
  const pollChartOptions = {
    chart: {
      type: "donut",
    },
    series: [35, 25, 40],
    labels: ["High Priority", "Medium Priority", "Low Priority"],
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Dashboard Header */}
      <h1 className="text-4xl font-bold text-gray-700 mb-8 text-center">
        Task Management Dashboard
      </h1>
  
      {/* Top Row - Summary Cards */}
      <div className="flex mb-8">
        <DashboardCard title="Total Tasks" value="256" />
        <DashboardCard title="Completed Tasks" value="198" />
        <DashboardCard title="Pending Tasks" value="58" />
        <DashboardCard title="Team Members" value="24" />
      </div>

      {/* Middle Row - Line and Pie Charts */}
      <div className="flex flex-wrap justify-between gap-4 mb-10">
        {/* Line Chart */}
        <div className="bg-white shadow-md rounded-lg p-6 w-full lg:w-[65%] mx-auto sm:mx-0">
          <h2 className="text-gray-600 text-xl font-semibold mb-4">
            Task Completion Over Time
          </h2>
          <ReactApexChart
            options={lineChartOptions}
            series={lineChartOptions.series}
            type="line"
            height={300}
          />
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow-md rounded-lg p-6 w-full lg:w-[30%] mx-auto sm:mx-0">
          <h2 className="text-gray-600 text-xl font-semibold mb-4">
            Task Status Distribution
          </h2>
          <ReactApexChart
            options={pieChartOptions}
            series={pieChartOptions.series}
            type="pie"
            height={300}
          />
        </div>
      </div>

      {/* Bottom Row - Poll/Donut Chart */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full lg:w-[65%] mx-auto">
        <h2 className="text-gray-600 text-xl font-semibold mb-4">
          Task Priority Poll
        </h2>
        <ReactApexChart
          options={pollChartOptions}
          series={pollChartOptions.series}
          type="donut"
          height={300}
        />
      </div>
    </div>
  );
};

export default Dashboard;
