import React from "react";
import ReactApexChart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";

const DashboardCard = ({ title, value }) => {
  return (
    <div className="relative bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-lg rounded-xl p-6 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)]  overflow-hidden text-white">
      <div className="absolute w-32 h-32 rounded-full bg-white opacity-20 animate-spin-slow top-2/4 left-0 transform -translate-y-2/4"></div>
      <div className="absolute w-56 h-56 rounded-full bg-white opacity-10 animate-spin-slow right-0 bottom-0"></div>

      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-4xl font-bold mt-4">{value}</p>
    </div>
  );
};

const Dashboard = () => {
  const { tasks } = useSelector((state) => state?.task);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task?.status === "completed"
  ).length;
  const pendingTasks = tasks.filter((task) => task.status === "pending").length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "inprogress"
  ).length;
  const teamMembers = Array.from(
    new Set(tasks.map((task) => task?.owner?.name))
  ).length;

  const lineChartOptions = {
    chart: {
      type: "line",
      height: 300,
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: tasks.reduce((acc, task) => {
        const monthYear = new Date(task?.dueDate).toLocaleString("default", {
          year: "numeric",
          month: "short",
        });
        if (!acc.includes(monthYear)) acc.push(monthYear);
        return acc;
      }, []),
      title: {
        text: "Month",
        style: {
          fontSize: "14px",
          color: "#7C8D9C",
        },
      },
    },
    yaxis: {
      title: {
        text: "Tasks Completed",
        style: {
          fontSize: "14px",
          color: "#7C8D9C",
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} tasks`,
      },
    },
    series: [
      {
        name: "Tasks Completed",
        data: tasks
          .reduce((acc, task) => {
            const monthYear = new Date(task.dueDate).toLocaleString("default", {
              year: "numeric",
              month: "short",
            });
            const monthIndex = acc.findIndex(
              (item) => item.month === monthYear
            );
            if (monthIndex > -1) {
              acc[monthIndex].value += task.status === "completed" ? 1 : 0;
            } else {
              acc.push({
                month: monthYear,
                value: task.status === "completed" ? 1 : 0,
              });
            }
            return acc;
          }, [])
          .map((item) => item.value),
      },
    ],
    colors: ["#FF1654"],
    grid: {
      borderColor: "#e0e0e0",
    },
    title: {
      text: "Task Completion Over Time",
      align: "left",
      style: {
        fontSize: "18px",
        color: "#333",
      },
    },
  };


  const pieChartOptions = {
    chart: {
      type: "pie",
    },
    series: [
      tasks.filter((task) => task.status === "pending").length,
      tasks.filter((task) => task.status === "inprogress").length,
      tasks.filter((task) => task.status === "completed").length,
    ],
    labels: ["Pending", "In Progress", "Completed"],
  };

  const pollChartOptions = {
    chart: {
      type: "donut",
    },
    series: [
      tasks.filter((task) => task.priority === "high").length,
      tasks.filter((task) => task.priority === "medium").length,
      tasks.filter((task) => task.priority === "low").length,
    ],
    labels: ["High Priority", "Medium Priority", "Low Priority"],
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="md:text-4xl text-xl font-bold text-gray-700 md:mb-8 mb-4 text-center">
        Task Management Dashboard
      </h1>

      <div className="flex flex-col md:flex-row gap-4  mb-8">
        <DashboardCard title="Total Tasks" value={totalTasks} />
        <DashboardCard title="Completed Tasks" value={completedTasks} />
        <DashboardCard title="Pending Tasks" value={pendingTasks} />
        <DashboardCard title="In Progress Tasks" value={inProgressTasks} />
      </div>

      <div className="flex flex-wrap justify-between gap-4 mb-10">
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
