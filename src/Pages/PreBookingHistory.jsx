import React, { useEffect, useMemo, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { FaRegEdit, FaSort } from "react-icons/fa";
import { MdOutlineDelete, MdOutlineRemoveRedEye } from "react-icons/md";
import { format } from "date-fns";
import { useNavigate } from "react-router";
import Select from "react-select";
import { getAllPreBookings } from "../api";
import Button from "../components/Button/Button";

const PreBookingHistory = () => {
  const [page, setPage] = useState({ page: 1, perPage: 5 });
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput, setDebouncedSearchInput] = useState(searchInput);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const fetchBookings = async (params, headers) => {
    try {
      const { data } = await getAllPreBookings(params, headers);

      if (data?.status !== "success") {
        throw new Error(data?.message);
      }

      setData(data?.data?.bookings);
      setTotalPages(data?.data?.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy / hh:mm a");
  };

  const handleViewClick = (row) => {
    navigate(`/history/details`, { state: { SubAdminPrebookingData: row } });
  };

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "bookingId",
      },
      {
        Header: "Driver",
        accessor: (row) =>
          `${row.driverInfo?.firstName} ${row.driverInfo?.lastName}`,
      },
      {
        Header: "Vehicle",
        accessor: (row) => `${row.vehicleInfo.vehicleName}`,
      },
      {
        Header: "Duration",
        accessor: (row) => {
          const startDateTime = row.startDateTime
            ? formatDate(row.startDateTime)
            : "-";
          const endDateTime = row.endDateTime
            ? formatDate(row.endDateTime)
            : "-";
          return `${startDateTime} ${
            endDateTime !== "-" ? `- ${endDateTime}` : ""
          }`;
        },
      },
      {
        Header: "Ride Type",
        accessor: (row) => {
          return row.rideType === "scheduled" ? "Scheduled" : "Instant";
        },
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Payment Status",
        accessor: "paymentStatus",
      },

      {
        Header: "Action",
        Cell: ({ row }) => (
          <div className="flex items-center justify-start gap-1">
            <div
              className="relative group cursor-pointer"
              onClick={() => handleViewClick(row.original)}
            >
              <MdOutlineRemoveRedEye className="text-yellow-500 w-6 h-6 cursor-pointer" />
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 p-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Details
              </span>
            </div>
            {/* <div className="relative group">
              <FaRegEdit className="text-green-500 w-6 h-6 cursor-pointer" />
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 p-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Edit
              </span>
            </div>
            <div className="relative group">
              <MdOutlineDelete className="text-red-500 w-6 h-6 cursor-pointer" />
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 p-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Delete
              </span>
            </div> */}
          </div>
        ),
      },
    ],
    []
  );

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page: tablePage,
    state: { pageIndex },
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: page.perPage },
      manualPagination: true,
      pageCount: totalPages,
    },
    useSortBy,
    usePagination
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchInput(searchInput);
    }, 500); // Adjust the debounce delay as needed

    return () => {
      clearTimeout(handler); // Cleanup timeout if the user keeps typing
    };
  }, [searchInput]);

  useEffect(() => {
    fetchBookings({
      page: page.page,
      limit: page.perPage,
      search: debouncedSearchInput,
    });
    window.scrollTo(0, 0);
  }, [page.page, page.perPage, debouncedSearchInput]);

  const handleSortChange = (e) => {
    // console.log(e.target.value);

    if (e.target.value) {
      fetchBookings({
        page: page.page,
        limit: page.perPage,
        search: debouncedSearchInput,
        statusSort: e.target.value,
      });
    } else {
      fetchBookings({
        page: page.page,
        limit: page.perPage,
        search: debouncedSearchInput,
      });
    }
  };

  const options = [
    { value: 5, label: "Show 5" },
    { value: 10, label: "Show 10" },
    { value: 20, label: "Show 20" },
  ];

  // const handlePageSizeChange = (e) => {
  //   const newSize = Number(e.target.value);
  //   setPageSize(newSize);
  //   setPage((prev) => ({ ...prev, perPage: newSize }));
  // };

  const handlePageSizeChange = (selectedOption) => {
    const newSize = selectedOption.value; // Get the selected value directly from the option
    setPageSize(newSize);
    setPage((prev) => ({ ...prev, perPage: newSize }));
  };

  const handlePageChange = (newPage) => {
    setPage((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="w-full h-[calc(100vh-65px)] p-5">
      <div className="flex my-5 justify-end">
        {/* <Button>+ Create Bookig</Button> */}
      </div>
      <div className="p-5 bg-white">
        <h2 className="text-3xl font-semibold mb-6 text-gray-700 border-b-2 pb-3">
          Pre Booking History
        </h2>

        <div className="flex items-center justify-between my-4 flex-wrap gap-4 w-full">
          <div className="flex items-center w-2/4">
            <p className="text-gray-600 font-medium">Search:</p>
            <input
              value={searchInput}
              onChange={handleSearch}
              placeholder="Search by Name or Phone No..."
              className="ml-2 border border-gray-300 px-4 py-2 rounded-md text-sm w-full lg:w-1/3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="">
            <select onChange={handleSortChange} className="border w-48 p-2">
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
        </div>

        <div className="overflow-auto ">
          <table
            {...getTableProps()}
            className="min-w-full bg-white border text-[16px] border-gray-200"
          >
            <thead className="bg-gray-50">
              {headerGroups.map((headerGroup, headerGroupIndex) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  key={`header-group-${headerGroupIndex}`} // Unique key for each header group
                >
                  {headerGroup.headers.map((column, columnIndex) => {
                    // Extract key and other props
                    const { key, ...columnProps } = column.getHeaderProps(
                      column.getSortByToggleProps()
                    );

                    return (
                      <th
                        {...columnProps} // Spread remaining props
                        key={`column-${columnIndex}`} // Apply key directly
                        className="px-3 py-3 text-left border text-gray-600"
                      >
                        <div className="flex items-center justify-between">
                          {column.render("Header")}
                          <span className="ml-1">
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <TiArrowSortedDown />
                              ) : (
                                <TiArrowSortedUp />
                              )
                            ) : (
                              <FaSort color="#dddddc" />
                            )}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {tablePage.map((row) => {
                prepareRow(row);

                return (
                  <tr
                    {...row.getRowProps()}
                    key={row.id} // Key is passed directly to <tr>
                    className={`border-t ${
                      row.index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    {row.cells.map((cell) => {
                      // Extract key and rest of the props
                      const { key, ...cellProps } = cell.getCellProps();

                      return (
                        <td
                          {...cellProps} // Spread remaining props
                          key={cell.column.id} // Apply key directly
                          className="px-3 py-3 border text-[15px] font-semibold text-[#696974]"
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
            {
              <tr>
                <td
                  colSpan={headerGroups[0].headers.length}
                  className="text-center "
                >
                  {data && data?.length == 0 && (
                    <p className="text-center p-3 border text-[15px] font-semibold text-[#838388]">
                      No Data Found
                    </p>
                  )}
                </td>
              </tr>
            }
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between mt-4 flex-wrap gap-y-3">
          <div className="flex items-center gap-5 flex-wrap gap-y-3 ">
            <span>
              {""}
              Showing page{" "}
              <strong>
                {page.page} of {totalPages}
              </strong>{" "}
            </span>
            {/* <select
              value={page.perPage}
              onChange={handlePageSizeChange}
              className="border px-2 py-2 cursor-pointer"
            >
              {[5, 10, 20].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select> */}
            <Select
              value={options.find((option) => option.value === page.perPage)}
              onChange={handlePageSizeChange}
              options={options}
              className=" px-2 py-2 cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="bg-[#ffffff] border text-black hover:bg-[#1a7cbc] hover:text-white"
              onClick={() => handlePageChange(page.page - 1)}
              disabled={page.page === 1}
            >
              previous
            </Button>{" "}
            <Button>{page.page}</Button>
            <Button
              className="bg-[#ffffff] border text-black hover:bg-[#1a7cbc] hover:text-white"
              onClick={() => handlePageChange(page.page + 1)}
              disabled={page.page === totalPages}
            >
              Next
            </Button>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreBookingHistory;
