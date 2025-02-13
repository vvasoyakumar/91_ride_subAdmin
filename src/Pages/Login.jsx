import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button/Button";
import { login } from "../api";
import { useAuthContext } from "../contex/index.jsx";

const Login = () => {
  const { setisSubAdminAuthenticated, setsubAdminData } = useAuthContext();
  const navigate = useNavigate();
  const [details, SetDetails] = useState({
    id: "",
    password: "",
  });

  const [err, setErr] = useState("");

  const handleChange = (e) => {
    SetDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!details?.id || !details.password) {
      setErr("Please enter id and password");
      return;
    }
    try {
      setErr("");

      const { data } = await login(details);
      if (data?.status !== "success") throw new Error(data?.message);

      localStorage.setItem("subAdminToken", data?.token);

      setisSubAdminAuthenticated(true);
      setsubAdminData(data?.data);

      // console.log(data?.data);

      navigate("/");
    } catch (error) {
      console.log(error);
      setErr(error?.response?.data?.message || error?.message);
      setTimeout(() => {
        setErr("");
      }, 3000);
    }
  };

  return (
    <div className="flex justify-center items-center h-[100vh] flex-col">
      <div className="px-5 max-w-sm m-auto w-full">
        <div className="my-5 flex justify-center items-center flex-col gap-4">
          <img
            // src={`${config.apiUrl}/public/img/fevicon.png`}
            src="/img/login-logo-1.jpg"
            // src="/img/login-logo.jpg"
            alt="Logo"
            width={150}
            className="mx-auto"
          />
          {/* <h3 className="text-3xl uppercase mb-2">Logo</h3> */}

          <span className="text-gray-400 font-sans font-medium">
            Welcome! Please enter your details
          </span>
        </div>
        <form name="login-form" className="" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="id" className="w-full font-semibold">
              Id
            </label>
            <input
              value={details.id}
              name="id"
              id="id"
              type="id"
              placeholder="Enter your id"
              className="w-full px-3 my-2 py-2 max-w-sm transition duration-100 ease-in-out border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="w-full mb-1 font-semibold">
              Password
            </label>
            <input
              value={details.password}
              name="password"
              id="password"
              type="password"
              placeholder="•••••••"
              className="w-full px-3 py-2 max-w-sm my-2 transition duration-100 ease-in-out border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onChange={handleChange}
            />
          </div>

          {err && (
            <div className="text-red-400 my-2 w-full whitespace-nowrap">
              {err}
            </div>
          )}

          <Button
            className="my-3 w-full px-3 py-2 transition duration-100 ease-in-out border rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-white"
            type="submit"
            variant="contained"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
