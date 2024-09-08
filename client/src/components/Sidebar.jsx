import { Link } from 'react-router-dom';
import { Dashboard, ListAlt, TaskAlt, HourglassEmpty, CheckCircle, Settings } from '@mui/icons-material';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4 shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Menu</h2>
      <nav>
        <ul className="space-y-4">
          {/* Dashboard */}
          <li className="flex items-center space-x-2 hover:bg-gray-700 rounded-lg p-2">
            <Dashboard />
            <Link to="/dashboard" className="text-white">Dashboard</Link>
          </li>

          {/* Task-related links */}
          <li className="flex items-center space-x-2 hover:bg-gray-700 rounded-lg p-2">
            <ListAlt />
            <Link to="/dashboard/tasks" className="text-white">All Tasks</Link>
          </li>
          <li className="flex items-center space-x-2 hover:bg-gray-700 rounded-lg p-2">
            <HourglassEmpty />
            <Link to="/tasks/in-progress" className="text-white">In Progress</Link>
          </li>
          <li className="flex items-center space-x-2 hover:bg-gray-700 rounded-lg p-2">
            <CheckCircle />
            <Link to="/tasks/completed" className="text-white">Completed</Link>
          </li>

          {/* Settings */}
          <li className="flex items-center space-x-2 hover:bg-gray-700 rounded-lg p-2">
            <Settings />
            <Link to="/settings" className="text-white">Settings</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
