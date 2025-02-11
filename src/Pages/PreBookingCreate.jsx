import { useEffect, useState } from "react";
import Button from "../components/Button/Button";
import toast from "react-hot-toast";
import { useAuthContext } from "../contex/index";
import { availableDrivers, sendScheduledRequest, userCreate } from "../api";
import axios from "axios";
import config from "../config/config";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const LIBRARIES = ["places"];

const PreBookingCreate = () => {
  const { subAdminData } = useAuthContext();

  const navigate = useNavigate();

  const getGeoLocationData = async (locationData) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: locationData,
            key: apiKey, // Use your API key here
          },
        }
      );

      if (response.data.status === "OK") {
        const { lat, lng } = response.data.results[0].geometry.location;
        return { lat, lng }; // Return lat and lng as an object
      } else {
        toast.error("Place not found. Try again.");
        return; // Return nothing if the place is not found
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message);
      return; // Return nothing if there is an error
    }
  };

  const getAddressData = async ({ lat, long }) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${apiKey}`;

    try {
      const response = await axios.get(url);

      // Log the response to check its structure
      console.log(response.data);

      if (response.data.status === "OK" && response.data.results.length > 0) {
        const formattedAddress = response.data.results[0].formatted_address;
        return {
          pickupAddressGet: formattedAddress,
          location: [
            response.data.results[0].geometry.location.lat,
            response.data.results[0].geometry.location.lng,
          ],
        }; // Return the address
      } else {
        console.error("No results found in the response");
        return { pickupAddressGet: "Address not found." }; // Handle no results
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      return { pickupAddressGet: "Error fetching address." }; // Handle API or network error
    }
  };

  const [ExistPage, setExistPage] = useState("createUser");
  // const [ExistPage, setExistPage] = useState("createBooking");
  // const [ExistPage, setExistPage] = useState("availableDrivers");
  // const [ExistPage, setExistPage] = useState("driverAcceptedRide");

  const [DriversData, setDriversData] = useState([]);
  // const [DriversData, setDriversData] = useState([
  //   {
  //     id: 12,
  //     document: "/img/MgEv.png",
  //     engineType: "electric",
  //     vehicleName: "Mg Astor",
  //     vehicleType: "Sedan",
  //     numberOfSeats: "5",
  //     bufferTimeInMinutes: 10,
  //     distance: "5.8 km",
  //     fare: 103,
  //   },
  //   {
  //     id: 1234,
  //     document: "/img/MgEv.png",
  //     engineType: "petrol",
  //     vehicleName: "Mercedez Benz",
  //     vehicleType: "Suv",
  //     numberOfSeats: "7",
  //     bufferTimeInMinutes: 15,
  //     distance: "5.8 km",
  //     fare: 123,
  //   },
  // ]);

  const [SelectVehicle, setSelectVehicle] = useState();

  useEffect(() => {
    console.log(SelectVehicle);

    // console.log(UserFormData);
  }, []);

  // User create

  const [UserFormData, setUserFormData] = useState({
    name: "",
    number: "",
    email: "",
    gender: "male",
    cCode: 91,
  });

  const handleUserInputChange = (e) => {
    setUserFormData({
      ...UserFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();

    if (
      !UserFormData.name ||
      !UserFormData.number ||
      !UserFormData.email ||
      !UserFormData.gender
    ) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const { data } = await userCreate(UserFormData);
      if (data?.status !== "success") throw new Error(data?.message);

      //   console.log(data.data.user);

      toast.success(data?.message || "User created successfully");
      setUserFormData({
        token: data.data.token,
        id: data.data.user._id,
        name: data.data.user.name,
        number: data.data.user.number,
        email: data.data.user.email,
        gender: data.data.user.gender,
        cCode: data.data.user.cCode,
      });

      setExistPage("createBooking");

      // getDriverData(data.data.user._id);
    } catch (error) {
      toast.error(e?.response?.data?.message || e?.message);
      return;
    }
  };

  // Get Driver Data

  const [location, setLocation] = useState({
    lat: 0,
    long: 0,
  });

  const [pickPlace, setPickPlace] = useState(null);
  const [place, setPlace] = useState(null);
  const [pickAutocomplete, setPickAutocomplete] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);

  // console.log(inputValue);

  const onPickLoad = (pickAutocomplete) => {
    setPickAutocomplete(pickAutocomplete);
  };

  const onLoad = (autoComplete) => {
    setAutocomplete(autoComplete);
  };

  const onPickPlaceChanged = () => {
    if (pickAutocomplete) {
      const placeResult = pickAutocomplete.getPlace();

      if (placeResult?.geometry) {
        setPickPlace(placeResult);
        setFormData({
          ...formData,
          pickupLocation: placeResult.formatted_address,
        });
      } else {
        toast.error("Please select a valid place from the dropdown");
      }
    }
  };

  const onDestPlaceChanged = () => {
    if (autocomplete) {
      const placeResult = autocomplete.getPlace();

      if (placeResult?.geometry) {
        setPlace(placeResult);
        setFormData({
          ...formData,
          destinationLocation: placeResult.formatted_address,
        });
      } else {
        toast.error("Please select a valid place from the dropdown");
        setPlace(null);
      }
    }
  };

  const handleInputPickChange = (e) => {
    setFormData({
      ...formData,
      pickupLocation: e.target.value,
    });
    if (pickPlace && e.target.value !== pickPlace.formatted_address) {
      setPickPlace(null);
    }
  };

  const handleInputDestChange = (e) => {
    setFormData({
      ...formData,
      destinationLocation: e.target.value,
    });
    if (place && e.target.value !== place.formatted_address) {
      setPlace(null);
    }
  };

  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(
  //     function (position) {
  //       const latitude = position.coords.latitude;
  //       const longitude = position.coords.longitude;

  //       setLocation({
  //         lat: latitude,
  //         long: longitude,
  //       });

  //       setpickupLocation({
  //         ...pickupLocation,
  //         type: "Point",
  //         coordinates: [longitude, latitude],
  //       });
  //     },
  //     function (error) {
  //       console.error("Error getting location: ", error);
  //     }
  //   );
  // }

  const [formData, setFormData] = useState({
    pickupLocation: "",
    destinationLocation: "",
    scheduledTime: "",

    subAdminId: subAdminData._id,
  });

  // choose driver

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.pickupLocation ||
      !formData.destinationLocation ||
      !formData.scheduledTime
    ) {
      toast.error("Please fill all the required fields");
      return;
    }

    try {
      // const { pickupAddressGet } = await getAddressData({
      //   lat: location.lat,
      //   long: location.long,
      // });

      // console.log(pickupAddressGet);
      // setpickupAddress(pickupAddressGet);

      setpickupAddress(formData.pickupLocation);

      const pickLatLng = await getGeoLocationData(formData.pickupLocation);
      setpickupLocation({
        type: "Point",
        coordinates: [pickLatLng.lng, pickLatLng.lat],
      });

      setLocation({
        lat: pickLatLng.lat,
        long: pickLatLng.lng,
      });

      const pick = {
        type: "Point",
        coordinates: [pickLatLng.lng, pickLatLng.lat],
      };

      const { lat, lng } = await getGeoLocationData(
        formData.destinationLocation
      );
      setDestinationLocation({
        type: "Point",
        coordinates: [lng, lat],
      });

      const dest = {
        type: "Point",
        coordinates: [lng, lat],
      };

      getDriverData(UserFormData.id, pick, dest);

      // console.log(lat, lng);

      setExistPage("availableDrivers");

      // getDriverData();

      toast.success("Available Drivers.");
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message);
      return;
    }
  };

  useEffect(() => {
    // console.log(location);
    // getDriverData();
    console.log(formData);

    console.log(pickupAddress, "====+");
    console.log(DriversData);
    console.log(destinationLocation);
  }, []);

  // pickupLocation: [72.7013819, 21.0478169],
  // destinationLocation: [72.7013819, 21.0478169],

  const [pickupLocation, setpickupLocation] = useState({
    type: "Point",
    coordinates: [0, 0],
  });

  const [pickupAddress, setpickupAddress] = useState("");

  const [destinationLocation, setDestinationLocation] = useState({
    type: "Point",
    coordinates: [0, 0],
  });

  const getDriverData = async (userId, pick, dest) => {
    const sentApiData = {
      userId: userId,
      // long: location.long,
      long: pick.coordinates[0],
      // lat: location.lat,
      lat: pick.coordinates[1],
      // pickupLocation: pickupLocation,
      pickupLocation: pick,
      // destinationLocation: destinationLocation,
      destinationLocation: dest,
    };

    console.log(sentApiData);
    try {
      const { data } = await availableDrivers(sentApiData);

      if (data?.status !== "success") throw new Error(data?.message);

      console.log(data.data);
      setDriversData(data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      return;
    }
  };

  const [SendScheduleRequestData, setSendScheduleRequestData] = useState({});

  const handleChooseDriverSubmit = async (e) => {
    e.preventDefault();

    if (!SelectVehicle) {
      toast.error("Please select a vehicle.");
      return;
    }

    try {
      const sentApiData = {
        userId: UserFormData.id,
        driverId: SelectVehicle,
        pickupLocation: {
          ...pickupLocation,
          address: pickupAddress,
        },
        destinationLocation: {
          ...destinationLocation,
          address: formData.destinationLocation,
        },
        scheduledTime: formData.scheduledTime,

        subAdminId: subAdminData._id,
      };

      console.log(sentApiData);

      const { data } = await sendScheduledRequest(sentApiData);
      if (data?.status !== "success") throw new Error(data?.message);

      console.log(data.data);

      setSendScheduleRequestData(data.data);

      // toast.success("Request confirmed successfully.");
      toast.success("Request sent successfully.");
      setExistPage("driverAcceptedRide");
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      return;
    }
  };

  const driverAcceptedRide = () => {
    // toast.success("Ride Accepted.");
    toast.success("Request sent, just awaiting approval.");

    navigate("/history");
  };

  const [SelectedDriverData, setSelectedDriverData] = useState();

  useEffect(() => {
    console.log(SelectedDriverData);
  }, []);

  return (
    <div className="w-full h-[calc(100vh-96px)] p-5 overflow-auto">
      <form
        className={`space-y-8 max-w-3xl mx-auto bg-gray-50 text-gray-800 p-5 border rounded-xl shadow-xl ${
          ExistPage == "createUser" ? "block" : "hidden"
        }`}
        onSubmit={handleUserSubmit}
      >
        <h2 className="text-3xl font-semibold mb-6 border-b-2 pb-3">
          User Details
        </h2>

        <div className="space-y-8">
          {/* Name Field */}
          <div className="w-full">
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={UserFormData.name}
              onChange={handleUserInputChange}
              className="w-full border-2 border-gray-300 text-gray-800 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-300 transition-all"
              placeholder="Enter your full name"
            />
          </div>

          {/* Mobile Number Field */}
          <div className="w-full">
            <label className="block text-sm font-medium mb-2">
              Mobile Number
            </label>
            <input
              type="text"
              name="number"
              value={UserFormData.number}
              onChange={handleUserInputChange}
              className="w-full border-2 border-gray-300 text-gray-800 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-300 transition-all"
              placeholder="Enter your mobile number"
            />
          </div>

          {/* Email Field */}
          <div className="w-full">
            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={UserFormData.email}
              onChange={handleUserInputChange}
              className="w-full border-2 border-gray-300 text-gray-800 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-300 transition-all"
              placeholder="Enter your email address"
            />
          </div>

          {/* Gender Field */}
          <div className="w-full">
            <label className="block text-sm font-medium mb-2">Gender</label>
            <select
              name="gender"
              value={UserFormData.gender}
              onChange={handleUserInputChange}
              className="w-full border-2 border-gray-300 text-gray-800 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-300 transition-all"
            >
              <option className="text-gray-800" value="male">
                Male
              </option>
              <option className="text-gray-800" value="female">
                Female
              </option>
              <option className="text-gray-800" value="other">
                Other
              </option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <Button
            type="submit"
            className="w-full py-3 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-300 font-medium transition-all"
          >
            Submit
          </Button>
        </div>
      </form>

      <form
        onSubmit={handleSubmit}
        className={`space-y-8 max-w-4xl mx-auto bg-gray-50 text-gray-800 p-5 border rounded-xl shadow-xl ${
          ExistPage == "createBooking" ? "block" : "hidden"
        }`}
      >
        <h2 className="text-3xl font-semibold mb-6 border-b-2 pb-3">
          {/* Create Booking */}
          Create Request
        </h2>

        <LoadScript googleMapsApiKey={apiKey} libraries={LIBRARIES}>
          <div className="w-full">
            <label className="block text-sm font-medium mb-2">
              Pickup Location
            </label>
            <Autocomplete
              onLoad={onPickLoad}
              onPlaceChanged={onPickPlaceChanged}
            >
              <input
                type="text"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleInputPickChange}
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-300 transition-all"
                placeholder="Enter pickup location"
              />
            </Autocomplete>
          </div>
        </LoadScript>

        {/* Destination Location */}
        <LoadScript googleMapsApiKey={apiKey} libraries={LIBRARIES}>
          <div className="w-full">
            <label className="block text-sm font-medium mb-2">
              Destination Location
            </label>
            <Autocomplete onLoad={onLoad} onPlaceChanged={onDestPlaceChanged}>
              <input
                type="text"
                name="destinationLocation"
                value={formData.destinationLocation}
                onChange={handleInputDestChange}
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-300 transition-all"
                placeholder="Enter destination location"
              />
            </Autocomplete>
          </div>
        </LoadScript>

        {/* Scheduled Time */}
        <div className="flex flex-col items-center justify-center md:flex-row gap-6 w-full">
          <div className="w-full">
            <label className="block text-sm font-medium mb-2">
              Scheduled Time
            </label>
            <input
              type="datetime-local"
              name="scheduledTime"
              value={formData.scheduledTime}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-300 transition-all"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 text-center">
          <Button
            type="submit"
            className="w-full py-3 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-300 transition-all"
          >
            Next
          </Button>
        </div>
      </form>

      <div
        className={`space-y-4 max-w-4xl mx-auto bg-gray-50 text-gray-800 p-5 border rounded-xl shadow-xl mb-6 ${
          ExistPage == "availableDrivers" ? "block" : "hidden"
        }`}
      >
        {/* Pick-up Address */}
        <div className="font-medium">
          <span className="text-green-500 font-semibold text-lg">
            Pick-up :
          </span>{" "}
          <span className="font-medium text-md">
            {pickupAddress ? pickupAddress : "Your pickup location"}
          </span>
        </div>

        {/* Drop-off Address */}
        <div className="font-medium">
          <span className="text-red-500 font-semibold text-lg">Drop-off :</span>{" "}
          <span className="font-medium text-md">
            {formData.destinationLocation
              ? formData.destinationLocation
              : "Your destination location"}
          </span>
        </div>
      </div>

      <form
        onSubmit={handleChooseDriverSubmit}
        className={`space-y-4 max-w-4xl mx-auto bg-gray-50 text-gray-800 p-5 border rounded-xl shadow-xl ${
          ExistPage == "availableDrivers" ? "block" : "hidden"
        }`}
      >
        <h2 className="text-3xl font-semibold mb-6 border-b-2 pb-3">
          Available Drivers
        </h2>

        {DriversData.length > 0 ? (
          DriversData.map((data, i) => (
            <div
              className={`flex justify-between items-center border shadow-lg rounded-lg px-6 py-4 w-full cursor-pointer transition-all duration-300 hover:shadow-xl ${
                SelectVehicle == data._id
                  ? "border-lime-500 bg-lime-50"
                  : "border-gray-300"
              }`}
              onClick={() => {
                setSelectVehicle(data._id);
                setSelectedDriverData(data);
              }}
              key={i}
            >
              {/* Vehicle Image and Engine Type */}
              <div className="">
                <img
                  // src={${config.apiUrl}/${data.vehicleId.document}}
                  src="/img/MgEv.png"
                  alt="img"
                  className="w-24 h-16"
                />
                <div className="font-semibold text-center mt-2">
                  {data?.vehicleId?.engineType.toUpperCase()}
                </div>
              </div>

              {/* Vehicle Details: Name, Arrival Time, Distance, Seats */}
              <div className="flex flex-col justify-center items-center font-medium w-1/3">
                <div className="text-lg font-semibold">
                  {data?.vehicleId?.vehicleName}
                </div>
                <div className="text-sm">
                  The car will arrive in {data?.bufferTimeInMinutes} minutes
                </div>
                <div className="flex justify-center gap-4 mt-2 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">Distance:</span>
                    <span>{data?.distance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">Seats:</span>
                    <span>{data?.vehicleId?.numberOfSeats}</span>
                  </div>
                </div>
              </div>

              {/* Fare Information */}
              <div className="flex flex-col justify-center items-center font-semibold w-1/6">
                <div className="text-lg">₹ {data?.fareDetails?.fare}</div>
                <div className="text-xs">Fare Estimate</div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center">
            <div className="font-medium">No Drivers Available</div>
          </div>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            // className=" text-white rounded"
            className="w-full py-3 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-300 transition-all"
          >
            Next
          </Button>
        </div>
      </form>

      <div
        // className="space-y-4 max-w-4xl mx-auto bg-white p-5 mt-5"
        className={`space-y-4 max-w-4xl mx-auto bg-gray-50 text-gray-800 p-5 border rounded-xl shadow-xl ${
          ExistPage == "driverAcceptedRide" ? "block" : "hidden"
        }`}
      >
        <h2 className="text-3xl font-semibold mb-6 border-b-2 pb-3">
          {/* Booking Accepted */}
          Pre Booking Created
        </h2>

        <div className="space-y-6">
          <div className="font-medium text-md">
            <span className="text-green-500 font-semibold text-lg">
              Pick-up :
            </span>{" "}
            {pickupAddress ? pickupAddress : "Your pickup location"}
          </div>

          <div className="font-medium text-md">
            <span className="text-red-500 font-semibold text-lg">
              Drop-off :
            </span>{" "}
            {formData.destinationLocation
              ? formData.destinationLocation
              : "Your destination location"}
          </div>
        </div>

        <div className="w-full  mx-auto mt-8">
          <div className="space-y-4">
            {/* Distance */}
            <div className="flex justify-between">
              <div className="font-semibold text-lg">Distance</div>
              <div className="font-medium text-md">
                {SelectedDriverData?.distance}
              </div>
            </div>

            {/* Rate per km */}
            <div className="flex justify-between">
              <div className="font-semibold text-lg">Rate per km</div>
              <div className="font-medium text-md">
                ₹{" "}
                {
                  SelectedDriverData?.fareDetails?.vehicleId?.vehicleTypeId
                    ?.prices?.basePrice
                }
              </div>
            </div>

            {/* Max Size */}
            <div className="flex justify-between">
              <div className="font-semibold text-lg">Max Size</div>
              <div className="font-medium text-md">
                {SelectedDriverData?.vehicleId?.numberOfSeats} persons
              </div>
            </div>

            {/* Duration */}
            <div className="flex justify-between">
              <div className="font-semibold text-lg">Duration (minutes)</div>
              <div className="font-medium text-md">
                {SelectedDriverData?.fareDetails?.durationInMinutes} min
              </div>
            </div>

            {/* Base Fare */}
            <div className="flex justify-between border-t-2 pt-4 border-gray-200">
              {/* <div className="font-semibold text-lg">Base Fare</div> */}
              <div className="font-semibold text-lg">Total Rate</div>
              <div className="font-medium text-md">
                ₹ {SelectedDriverData?.fareDetails?.fare}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 text-center">
          <Button
            type="submit"
            className="text-white rounded-lg py-3 px-8 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
            onClick={driverAcceptedRide}
          >
            Done
          </Button>
        </div>
      </div>

      {/* <div className="space-y-4 max-w-4xl mx-auto bg-white p-5 mt-5">a</div> */}
    </div>
  );
};

export default PreBookingCreate;
