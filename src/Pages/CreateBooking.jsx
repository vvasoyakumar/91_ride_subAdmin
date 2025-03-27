import { MdOutlineRestartAlt } from "react-icons/md";
import Button from "../components/Button/Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  availableDriversForScheduleRide,
  driverAllocateToUserRequest,
  getScheduleRequestForAllUsers,
} from "../api";
import config from "../config/config";
import toast from "react-hot-toast";

import { PropagateLoader } from "react-spinners";

function CreateBooking() {
  const navigate = useNavigate();

  const [ExistPage, setExistPage] = useState("userRideList");
  //   const [ExistPage, setExistPage] = useState("chooseDriver");

  const [UserScheduleRideList, setUserScheduleRideList] = useState([]);
  const [SelectBooking, setSelectBooking] = useState();

  const [SelectedBookingData, setSelectedBookingData] = useState();
  console.log(SelectedBookingData);

  const [AvailableDriversData, setAvailableDriversData] = useState([]);
  const [SelectVehicle, setSelectVehicle] = useState();
  const [SelectedDriverData, setSelectedDriverData] = useState();

  const getScheduleRequestList = async () => {
    try {
      const { data } = await getScheduleRequestForAllUsers();
      if (data?.status !== "success") throw new Error(data?.message);

      setUserScheduleRideList(data?.data);
    } catch (err) {
      console.log(err.message);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getScheduleRequestList();
  }, []);

  // if (UserScheduleRideList?.length == 0) {
  //   setTimeout(() => {
  //     getScheduleRequestList();
  //   }, 5000);
  // }

  // setTimeout(getScheduleRequestList, 5000);

  const handleButtonClick = () => {
    // toast.success("Page is reload...");
    // window.location.reload();

    getScheduleRequestList();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const chooseUserScheduleRide = async (ride) => {
    try {
      setSelectedBookingData(ride);

      const bodyData = {
        pickupLocation: ride?.pickupLocation,
        destinationLocation: ride?.destinationLocation,
        scheduledTime: ride?.scheduledTime,
        userId: ride?.userId?._id,
      };

      const { data } = await availableDriversForScheduleRide(bodyData);
      if (data?.status !== "success") throw new Error(data?.message);

      setAvailableDriversData(data?.data);
      setExistPage("chooseDriver");
      toast.success(`Choose ${ride?.userId?.name}'s ride.`);
    } catch (err) {
      console.log(err?.response?.data?.message);
      toast.error(err?.response?.data?.message);
    }
  };

  const chooseDriverForScheduleRide = async (driver) => {
    try {
      const bodyData = {
        reqId: SelectedBookingData?._id,
        user: SelectedBookingData?.userId?._id,
        driverId: driver?._id,
        vehicle: driver?.vehicleId?._id,
        pickupLocation: SelectedBookingData?.pickupLocation,
        destinationLocation: SelectedBookingData?.destinationLocation,
        startPlace: {
          name: SelectedBookingData?.pickupLocation?.address,
          latitude: SelectedBookingData?.pickupLocation?.coordinates[1],
          longitude: SelectedBookingData?.pickupLocation?.coordinates[0],
        },
        destination: {
          name: SelectedBookingData?.destinationLocation?.address,
          latitude: SelectedBookingData?.destinationLocation?.coordinates[1],
          longitude: SelectedBookingData?.destinationLocation?.coordinates[0],
        },
        scheduledTime: SelectedBookingData?.scheduledTime,
        bufferTimeInMinutes: driver?.bufferTimeInMinutes,
        fare: driver?.fare,
        rideDistance: driver?.rideDistance,
        driverResponse: "accepted", // rejected / accepted
      };

      const { data } = await driverAllocateToUserRequest(bodyData);
      if (data?.status !== "success") throw new Error(data?.message);

      console.log(data?.data);

      toast.success(
        `${driver?.firstName} ${driver?.lastName} Driver Allocate to ${SelectedBookingData?.userId?.name}'s ride.`
      );

      navigate("/history");
    } catch (err) {
      console.log(err?.response?.data?.message);
      toast.error(err?.response?.data?.message);
    }
  };

  return (
    <>
      <div className="w-full h-[calc(100vh-96px)] p-5 overflow-auto">
        <Button className="float-right" onClick={handleButtonClick}>
          <MdOutlineRestartAlt className="text-xl lg:text-3xl font-semibold" />
        </Button>

        <form
          className={`space-y-8 max-w-6xl mx-auto bg-gray-50 text-gray-800 p-5 border rounded-xl shadow-xl ${
            ExistPage == "userRideList" ? "block" : "hidden"
          }`}
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl lg:text-3xl font-semibold mb-6 border-b-2 pb-3">
            User Ride Details
          </h2>

          {UserScheduleRideList?.length > 0 ? (
            UserScheduleRideList?.map((data, i) => (
              <div
                className={`flex justify-between items-center border rounded-lg px-6 py-4 gap-1 w-full cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  SelectBooking === data._id
                    ? "border-lime-600 bg-lime-50 shadow-lg"
                    : "border-gray-300 hover:border-lime-400"
                }`}
                onClick={() => {
                  setSelectBooking(data._id);
                }}
                key={i}
              >
                <div className="flex flex-col gap-2 w-3/12">
                  <div className="text-2xl font-semibold text-gray-900">
                    {data?.userId?.name}{" "}
                    <span className="text-sm">({data?.userId?.gender})</span>
                  </div>
                  <div className="text-base text-gray-700">
                    {data?.userId?.cCode} {data?.userId?.number}
                  </div>
                  <div className="text-sm text-gray-600">
                    {/* {data?.scheduledTime
                      ? new Date(data?.scheduledTime).toLocaleString()
                      : "No scheduled time"} */}
                    {data?.scheduledTime
                      ? new Date(data?.scheduledTime).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                        })
                      : "No scheduled time"}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center w-2/6 text-center">
                  <div className="text-sm font-medium text-gray-600">
                    <span className="font-semibold text-gray-800">
                      Pickup location:&nbsp;
                    </span>
                    <div className="text-sm text-gray-700">
                      {data?.pickupLocation?.address}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center w-3/12 text-center">
                  <div className="text-sm font-medium text-gray-600">
                    <span className="font-semibold text-gray-800">
                      Dropoff location:&nbsp;
                    </span>
                    <div className="text-sm text-gray-700">
                      {data?.destinationLocation?.address}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center mt-4 w-1/6">
                  <button
                    className="bg-lime-500 text-white font-medium rounded-xl py-2 px-4 transition-colors duration-300 hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-400"
                    onClick={() => chooseUserScheduleRide(data)}
                  >
                    Choose
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="grid justify-center">
              <div className="flex justify-center mt-3 mb-5">
                {/* <img
                  src="/img/loading.gif"
                  alt="loading"
                  className="w-20 h-20"
                /> */}

                <PropagateLoader color="#5ab128" />
              </div>
              {/* <div className="font-medium">No Bookings Available.</div> */}
            </div>
          )}
        </form>

        <form
          className={`space-y-8 max-w-6xl mx-auto bg-gray-50 text-gray-800 p-5 border rounded-xl shadow-xl ${
            ExistPage == "chooseDriver" ? "block" : "hidden"
          }`}
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl lg:text-3xl font-semibold mb-6 border-b-2 pb-3">
            Driver List
          </h2>

          {AvailableDriversData.length > 0 ? (
            AvailableDriversData.map((data, i) => (
              <div
                className={`flex justify-between items-center border shadow-md rounded-lg px-6 py-4 w-full cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  SelectVehicle == data._id
                    ? "border-lime-500 bg-lime-50"
                    : "border-gray-300 hover:border-lime-400"
                }`}
                onClick={() => {
                  setSelectVehicle(data._id);
                  setSelectedDriverData(data);
                }}
                key={i}
              >
                <div className="flex flex-col items-center">
                  <img
                    // src={`${config.apiUrl}/${data.vehicleId.document}`}
                    src={`${config.apiUrl}/${data.vehicleId.vehicleImage}`}
                    // src="/img/MgEv.png"
                    alt="img"
                    className="w-28 h-20 rounded-md shadow-sm"
                  />
                  <div className="font-semibold text-center mt-3 text-sm text-gray-700">
                    {data?.vehicleId?.engineType.toUpperCase()}
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center font-medium w-1/3 space-y-2">
                  <div className="text-lg lg:text-xl font-semibold text-gray-800">
                    {data?.vehicleId?.vehicleName}
                  </div>
                  <div className="text-sm text-gray-500">
                    The car will arrive in {data?.bufferTimeInMinutes} minutes
                  </div>
                  <div className="flex justify-center gap-6 mt-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Distance:</span>
                      {/* <span>{data?.distance}</span> */}
                      <span>{data?.rideDistance}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Seats:</span>
                      <span>{data?.vehicleId?.numberOfSeats}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center font-semibold w-1/6">
                  <div className="text-xl lg:text-2xl text-gray-800">
                    ₹ {data?.fare}
                  </div>
                  <div className="text-xs text-gray-500">Fare Estimate</div>
                </div>

                <div className="flex flex-col justify-center items-center w-1/12">
                  <button
                    className="bg-lime-500 text-white font-medium rounded-xl py-2 px-4 transition-colors duration-300 hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-400"
                    onClick={() => chooseDriverForScheduleRide(data)}
                  >
                    Allocate
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="grid justify-center">
              <div className="flex justify-center mt-3 mb-5">
                {/* <img
                  src="/img/loading.gif"
                  alt="loading"
                  className="w-20 h-20"
                /> */}

                <PropagateLoader color="#5ab128" />
              </div>
              {/* <div className="font-medium">No Drivers Available.</div> */}
            </div>
          )}

          {/* <div className="pt-2">
            <Button
              type="submit"
              // className=" text-white rounded"
              className="w-full py-3 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-300 transition-all"
            >
              Next
            </Button>
          </div> */}
        </form>
      </div>
    </>
  );
}

export default CreateBooking;
