import React from "react";
import { RiAdminLine } from "react-icons/ri";
import { IoIosLogOut } from "react-icons/io";
import { useAuthContext } from "../../contex/index.jsx";
import config from "../../config/config";
import { IoMenu } from "react-icons/io5";
import { Link } from "react-router-dom";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { logoutSubAdmin, subAdminData } = useAuthContext();

  return (
    <div className="w-full absolute top-0 border-b z-50 bg-white h-24 ">
      <div className="w-full flex items-center justify-between py-4 px-4">
        <div className="ml-5 hidden md:block">
          <Link to={"/"}>
            <img
              // src={`${config.apiUrl}/public/img/fevicon.png`}
              src="/img/logo-1.png"
              className="cursor-pointer object-contain bg-white rounded-full h-16 w-16 "
              alt="logo"
            />
          </Link>
        </div>

        <div className="md:hidden">
          <IoMenu
            className="text-3xl cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>
        <div></div>
        <div className="relative flex items-center justify-center gap-4 group cursor-pointer">
          {/* <div>
            {subAdminData?.profile ? (
              <img
                src={`${config.apiUrl}/${subAdminData?.profile}`}
                alt="profile"
                className="rounded-full w-16 h-16 object-contain bg-white"
              />
            ) : (
              <div className="p-2 border bg-[#cfeaf5] rounded-full h-12 md:h-16 md:w-16 flex items-center justify-center">
                <RiAdminLine className="text-3xl " color="#7dd5f2" />
              </div>
            )}
          </div> */}

          <img
            src="/img/profile-1.png"
            alt="profile"
            className="rounded-full w-16 h-16 object-contain bg-white"
          />

          <div className="md:flex flex-col hidden ">
            <p className="text-[16px] font-semibold">
              {subAdminData?.name ? subAdminData.name : "Owner"}
            </p>
            <p className="text-[12px] ">
              {subAdminData?.email ? subAdminData.email : ""}
            </p>
          </div>

          {/* Logout Popup */}
          <div className="absolute right-5 mt-32 hidden group-hover:block p-2  bg-white border rounded-lg shadow-lg">
            <Link to={"/account"}>
              <div className="flex items-center justify-between w-36 px-3 py-2 gap-2 hover:bg-[#247db6] hover:rounded-md hover:text-white">
                <span>
                  <RiAdminLine />
                </span>
                <span>{subAdminData?.name}</span>
              </div>
            </Link>

            <div
              className="flex items-center justify-between w-36 px-3 py-2 gap-2 hover:bg-[#247db6] hover:rounded-md hover:text-white"
              onClick={logoutSubAdmin}
            >
              <span>
                <IoIosLogOut />
              </span>
              <span>Log Out</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
