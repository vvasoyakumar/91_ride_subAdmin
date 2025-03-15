import { useEffect, useState } from "react";
import { dashboard } from "../api";

const Home = () => {
  const [dashboardData, setDashboardData] = useState();
  const [total, setTotal] = useState();

  const getDashboardData = async () => {
    const { data } = await dashboard();
    if (data?.status !== "success") throw new Error(data?.message);

    console.log(data.data);
    setDashboardData(data.data);
    setTotal(data.totalBookings);
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className="w-full h-[calc(100vh-96px)] p-8 overflow-auto bg-gray-50">
      <div className="mt-8">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 border-b-2 pb-3">
          Pre-Bookings
        </h2>

        <div className="flex flex-col bg-white p-8 rounded-xl shadow-lg w-2/4 lg:w-1/4">
          <p className="text-lg font-medium text-gray-700">
            Total Pre-Bookings
          </p>
          <p className="mt-4 text-2xl text-gray-800 font-semibold">{total}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 border-b-2 pb-3">
          Status
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-[#A09EAD] text-base font-semibold">
          {/* Ride Pending Card */}
          <div className="flex flex-col bg-[#FEE2E2] p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <p className="text-gray-700 font-medium">Ride Pending</p>
            <p className="mt-4 text-2xl text-gray-800 font-semibold">
              {dashboardData?.pendingBookings || 0}
            </p>
          </div>

          {/* Ride Completed Card */}
          <div className="flex flex-col bg-[#BFDBFE] p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <p className="text-gray-700 font-medium">Ride Completed</p>
            <p className="mt-4 text-2xl text-gray-800 font-semibold">
              {dashboardData?.completedBookings || 0}
            </p>
          </div>

          {/* Ride Cancelled Card */}
          <div className="flex flex-col bg-[#D1FAE5] p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <p className="text-gray-700 font-medium">Ride Cancelled</p>
            <p className="mt-4 text-2xl text-gray-800 font-semibold">
              {dashboardData?.canceledBookings || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
