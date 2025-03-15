import { useState } from "react";
import { useAuthContext } from "../contex/index";
import Button from "../components/Button/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Account = () => {
  const { subAdminData } = useAuthContext();
  const [IdPassword, setIdPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: subAdminData.name || "",
    email: subAdminData.email || "",
    mobileNumber: subAdminData.mobileNumber || "",
    address: subAdminData.address || "",
    city: subAdminData.city || "",
    state: subAdminData.state || "",
    headName: subAdminData.headName || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="w-full h-[calc(100vh-96px)] p-5">
      <div className="w-full mx-auto bg-white p-8 rounded-md">
        <h2 className="text-3xl font-semibold mb-6 text-gray-700 border-b-2 pb-3">
          Account
        </h2>

        <form className="">
          <div className="flex flex-col items-center justify-center md:flex-row  gap-4 w-full">
            <div className="mb-4 w-full">
              <label htmlFor="name" className="block text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="name"
                value={formData.name}
                onChange={handleChange}
                required
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-[14px]"
              />
            </div>

            <div className="mb-4 w-full">
              <label htmlFor="mobileNumber" className="block text-gray-700">
                Mobile Number
              </label>
              <input
                type="text"
                id="mobileNumber"
                placeholder="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-[14px]"
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center md:flex-row  gap-4 w-full">
            <div className="mb-4 w-full">
              <label htmlFor="address" className="block text-gray-700">
                Address
              </label>
              <input
                type="text"
                id="address"
                placeholder="address"
                value={formData.address}
                onChange={handleChange}
                required
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-[14px]"
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center md:flex-row  gap-4 w-full">
            <div className="mb-4 w-full">
              <label htmlFor="city" className="block text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                placeholder="city"
                value={formData.city}
                onChange={handleChange}
                required
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-[14px]"
              />
            </div>

            <div className="mb-4 w-full">
              <label htmlFor="state" className="block text-gray-700">
                State
              </label>
              <input
                type="text"
                id="state"
                placeholder="state"
                value={formData.state}
                onChange={handleChange}
                required
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-[14px]"
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center md:flex-row  gap-4 w-full">
            <div className="mb-4 w-full">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                type="text"
                id="email"
                placeholder="email"
                value={formData.email}
                onChange={handleChange}
                required
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-[14px]"
              />
            </div>

            <div className="mb-4 w-full">
              <label htmlFor="headName" className="block text-gray-700">
                Head Name
              </label>
              <input
                type="text"
                id="headName"
                placeholder="headName"
                value={formData.headName}
                onChange={handleChange}
                required
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-[14px]"
              />
            </div>
          </div>

          {/* <Button type="submit">Save</Button> */}
        </form>

        {/* <div className="mt-4">
          <div className="flex gap-4">
            <h1 className="font-medium text-2xl underline underline-offset-2 mb-5 text-gray-600">
              Id and Password
            </h1>

            <div
              className="text-gray-600 text-xl cursor-pointer"
              onClick={() => setIdPassword(!IdPassword)}
            >
              {IdPassword ? (
                <FaEye className="mt-2" />
              ) : (
                <FaEyeSlash className="mt-2" />
              )}
            </div>
          </div>

          {IdPassword && (
            <div className="flex gap-4 ">
              <div className="bg-blue-100 rounded font-medium px-4 py-2">
                Id: {subAdminData.subAdminId}
              </div>

              <div className="bg-blue-100 rounded font-medium px-4 py-2">
                Password: {subAdminData.password}
              </div>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default Account;
