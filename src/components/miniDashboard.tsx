/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../apis/fetchUser";
import Skeleton from "@/loader/skeleton";
import { User } from "../types";
import { FaSearch, FaSort } from "react-icons/fa";
import debounce from "lodash.debounce";
// import { debounce } from "lodash";

export default function MiniDashboard() {
  const {
    data: users,
    error,
    isLoading,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "email">("name");
  const [page, setPage] = useState<number>(1);
  const pageSize = 5;

  if (isLoading) return <Skeleton />;
  if (error)
    return (
      <div className="text-center text-red-500 py-6 text-lg font-semibold">
        Error fetching data
      </div>
    );

  // Debounced search handler

  const handleSearch = debounce((value: string) => {
    setSearch(value);
  }, 300);

  const filteredUsers = (users || [])
    .filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a[sortBy].localeCompare(b[sortBy]));

  // const filteredUsers = useMemo(() => {
  //   return (users || [])
  //     .filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))
  //     .sort((a, b) => {
  //       if (a[sortBy] && b[sortBy]) {
  //         return a[sortBy].localeCompare(b[sortBy]);
  //       }
  //       return 0;
  //     });
  // }, [users, search, sortBy]);

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white shadow-lg rounded-xl border border-gray-200">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Mini Dashboard
      </h1>

      {/* Search & Sort Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
        <div className="relative w-full md:w-1/2">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg  outline-none"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <FaSort className="absolute left-3 top-3 text-gray-400" />
          <select
            className="pl-10 pr-4 py-2 border rounded-lg  outline-none"
            onChange={(e) => setSortBy(e.target.value as "name" | "email")}
          >
            <option value="name">Sort by Name</option>
            <option value="email">Sort by Email</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-600 text-white text-left">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Website</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-100">
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4 text-blue-600 underline">
                  {user.email}
                </td>
                <td className="py-3 px-4">{user.phone}</td>
                <td className="py-3 px-4 text-blue-600 underline">
                  {user.website}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span className="text-lg font-semibold">Page {page}</span>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md disabled:opacity-50"
          disabled={page >= Math.ceil(filteredUsers.length / pageSize)}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
