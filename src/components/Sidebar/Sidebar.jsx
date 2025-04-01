import { FiHome, FiUser } from "react-icons/fi";
import { MdCreateNewFolder, MdManageHistory } from "react-icons/md";
import { NavLink } from "react-router-dom";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const handleSidebarToggle = () => {
    // Use matchMedia to check for small screen sizes
    if (window.matchMedia("(max-width: 768px)").matches) {
      setSidebarOpen(!sidebarOpen);
    }
  };

  return (
    <div className="w-full h-full p-4 bg-[#232d33]">
      <nav className="h-full flex flex-col justify-between">
        <div className="w-full">
          <ul className="flex flex-col gap-y-5 w-full">
            {/* Dashboard Menu Item */}
            <div className="w-full">
              <SidebarMenuItem
                to="/"
                text="Dashboard"
                icon={<FiHome className="w-5 h-5 text-white" />}
                onClick={handleSidebarToggle}
                className="flex items-center space-x-3 py-2 px-4 rounded-lg text-white hover:bg-[#1c2529] transition-all duration-200"
              />
            </div>

            <div className="border-b border-gray-600"></div>

            {/* Create PreBooking Menu Item */}
            {/* <div className="w-full">
              <SidebarMenuItem
                to="/create"
                text="Create PreBooking old"
                icon={<MdCreateNewFolder className="w-5 h-5 text-white" />}
                onClick={handleSidebarToggle}
                className="flex items-center space-x-3 py-2 px-4 rounded-lg text-white hover:bg-[#1c2529] transition-all duration-200"
              />
            </div>

            <div className="border-b border-gray-600"></div> */}

            <div className="w-full">
              <SidebarMenuItem
                to="/createBooking"
                text="Create Booking"
                icon={<MdCreateNewFolder className="w-5 h-5 text-white" />}
                onClick={handleSidebarToggle}
                className="flex items-center space-x-3 py-2 px-4 rounded-lg text-white hover:bg-[#1c2529] transition-all duration-200"
              />
            </div>

            <div className="border-b border-gray-600"></div>

            {/* PreBooking History Menu Item */}
            <div className="w-full">
              <SidebarMenuItem
                to="/history"
                text="PreBooking History"
                icon={<MdManageHistory className="w-5 h-5 text-white" />}
                onClick={handleSidebarToggle}
                className="flex items-center space-x-3 py-2 px-4 rounded-lg text-white hover:bg-[#1c2529] transition-all duration-200"
              />
            </div>

            <div className="border-b border-gray-600"></div>

            {/* Account Menu Item */}
            <div className="w-full">
              <SidebarMenuItem
                to="/account"
                text="Account"
                icon={<FiUser className="w-5 h-5 text-white" />}
                onClick={handleSidebarToggle}
                className="flex items-center space-x-3 py-2 px-4 rounded-lg text-white hover:bg-[#1c2529] transition-all duration-200"
              />
            </div>
          </ul>
        </div>
      </nav>
    </div>
  );
};

const SidebarMenuItem = ({ to, icon, text, onClick }) => {
  return (
    <li className="my-1 text-black list-none sidebar_menu">
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          isActive
            ? "flex items-center gap-3 px-4 py-2 rounded-md text-white bg-[#1a2227]"
            : "flex items-center gap-3 px-4 py-2 rounded-md text-white hover:bg-[#1a2227] transition-all duration-200"
        }
      >
        <div className="icon-div">{icon}</div>
        <span className="text-sm font-medium">{text}</span>
      </NavLink>
    </li>
  );
};

export default Sidebar;
