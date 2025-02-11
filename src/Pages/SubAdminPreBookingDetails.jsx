import React, { useState } from "react";
import { useLocation } from "react-router";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import Button from "../components/Button/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SubAdminPreBookingDetails = () => {
  const location = useLocation();
  const { SubAdminPrebookingData, SubAdminData } = location.state || {};

  const [IdPassword, setIdPassword] = useState(false);

  // console.log(SubAdminPrebookingData);
  // console.log(SubAdminData);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy / hh:mm a");
  };

  return (
    <>
      {SubAdminPrebookingData && (
        <div className="w-full h-[calc(100vh-96px)] p-5 overflow-auto">
          <div className="max-w-6xl mx-auto p-4 bg-white border border-gray-200 shadow-lg ">
            {/* Vehicle and Booking Information Table */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-medium mb-4 underline underline-offset-2 text-gray-600">
                Booking Details
              </h1>
              <Link to={-1}>
                <Button> Go Back </Button>
              </Link>
            </div>

            <table className="w-full text-left table-auto mt-5">
              <thead>
                <tr className="bg-[#247db6] text-white">
                  <th className="px-4 py-2">Booking</th>
                  <th className="px-4 py-2">
                    {SubAdminPrebookingData?.vehicle?.vehicleName}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-300">
                  <td className="px-4 py-2">Booking ID</td>
                  <td className="px-4 py-2">
                    {SubAdminPrebookingData?.bookingId}
                  </td>
                </tr>

                <tr className="border-t border-gray-300">
                  <td className="px-4 py-2">Driver</td>
                  <td className="px-4 py-2">
                    {SubAdminPrebookingData?.driverInfo?.firstName}{" "}
                    {SubAdminPrebookingData?.driverInfo?.lastName}
                  </td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td className="px-4 py-2">User</td>
                  <td className="px-4 py-2">
                    {SubAdminPrebookingData?.userInfo?.name}
                  </td>
                </tr>

                <tr className="border-t border-gray-300">
                  <td className="px-4 py-2">Duration</td>
                  <td className="px-4 py-2">
                    {SubAdminPrebookingData?.startDateTime
                      ? formatDate(SubAdminPrebookingData?.startDateTime)
                      : ""}{" "}
                    - {""}
                    {SubAdminPrebookingData?.endDateTime
                      ? formatDate(SubAdminPrebookingData?.endDateTime)
                      : ""}
                  </td>
                </tr>

                <tr className="border-t border-gray-300">
                  <td className="px-4 py-2">Pickup Address</td>
                  <td className="px-4 py-2">
                    {SubAdminPrebookingData?.startPlace?.name}
                  </td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td className="px-4 py-2">Drop Off Address</td>
                  <td className="px-4 py-2">
                    {SubAdminPrebookingData?.destination?.name}
                  </td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td className="px-4 py-2">Status</td>
                  <td className="px-4 py-2 text-blue-500 capitalize">
                    {SubAdminPrebookingData?.status}
                  </td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td className="px-4 py-2">Payment Status</td>
                  <td
                    className={`px-4 py-2 ${
                      SubAdminPrebookingData?.paymentStatus !== "paid"
                        ? "text-red-500"
                        : "text-green-500"
                    } capitalize`}
                  >
                    {SubAdminPrebookingData?.paymentStatus}
                  </td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td className="px-4 py-2">Payment Method</td>
                  <td className="px-4 py-2 capitalize font-medium">
                    {SubAdminPrebookingData?.paymentMethod
                      ? SubAdminPrebookingData?.paymentMethod
                      : "N/A"}
                  </td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td className="px-4 py-2">Date</td>
                  <td className="px-4 py-2 capitalize font-medium">
                    {new Date(
                      SubAdminPrebookingData?.createdAt
                    ).toLocaleDateString()}
                  </td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td className="px-4 py-2">Otp</td>
                  <td className="px-4 py-2 capitalize font-medium">
                    {SubAdminPrebookingData?.otp
                      ? SubAdminPrebookingData?.otp
                      : "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Amount Info */}
            <div className="my-4 flex justify-end">
              <div className="text-right flex flex-col gap-y-3 items-start">
                <p>
                  Total Amount :{" "}
                  <strong>{SubAdminPrebookingData?.totalPrice} Rs</strong>
                </p>
                <p>
                  Due Amount :{" "}
                  <strong>
                    {SubAdminPrebookingData?.paymentStatus === "paid"
                      ? "0"
                      : SubAdminPrebookingData?.totalPrice}{" "}
                    Rs
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {SubAdminData && (
        <div className="w-full h-[calc(100vh-96px)] p-5 overflow-auto">
          <div className="max-w-6xl mx-auto p-4 bg-white border border-gray-200 shadow-lg ">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-medium mb-4 underline underline-offset-2 text-gray-600">
                Sub Admin Details
              </h1>
              <Link to={-1}>
                <Button> Go Back </Button>
              </Link>
            </div>

            <table className="w-full text-left table-auto mt-5">
              <thead>
                <tr className="bg-[#247db6] text-white">
                  <th className="px-4 py-2">Sub Admin</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-300">
                  <td className="px-4 py-2">Name</td>
                  <td className="px-4 py-2">{SubAdminData?.name}</td>
                </tr>

                <tr className="border-t border-gray-300">
                  <td className="px-4 py-2">Mobile Number</td>
                  <td className="px-4 py-2">{SubAdminData?.mobileNumber}</td>
                </tr>

                <tr className="border-t border-gray-300">
                  <td className="px-4 py-2">Email</td>
                  <td className="px-4 py-2">{SubAdminData?.email}</td>
                </tr>

                <tr className="border-t border-gray-300">
                  <td className="px-4 py-2">Address</td>
                  <td className="px-4 py-2">{SubAdminData?.address}</td>
                </tr>

                <tr className="border-t border-gray-300">
                  <td className="px-4 py-2">City</td>
                  <td className="px-4 py-2">{SubAdminData?.city}</td>
                </tr>

                <tr className="border-t border-gray-300">
                  <td className="px-4 py-2">State</td>
                  <td className="px-4 py-2">{SubAdminData?.state}</td>
                </tr>

                <tr className="border-t border-gray-300">
                  <td className="px-4 py-2">Head Name</td>
                  <td className="px-4 py-2">{SubAdminData?.headName}</td>
                </tr>
              </tbody>
            </table>

            <div className="">
              <div className="flex gap-4">
                <h2 className="text-xl font-medium mt-4 mb-4 underline underline-offset-2 text-gray-600">
                  Sub Admin Id and Password
                </h2>

                <div
                  className="text-gray-600 text-xl cursor-pointer"
                  onClick={() => setIdPassword(!IdPassword)}
                >
                  {IdPassword ? (
                    <FaEye className="mt-5" />
                  ) : (
                    <FaEyeSlash className="mt-5" />
                  )}
                </div>
              </div>

              {IdPassword && (
                <div className="flex gap-4 mt-4">
                  <div className="bg-blue-100 rounded font-medium px-4 py-2">
                    Id: {SubAdminData.subAdminId}
                  </div>

                  <div className="bg-blue-100 rounded font-medium px-4 py-2">
                    Password: {SubAdminData.password}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubAdminPreBookingDetails;
