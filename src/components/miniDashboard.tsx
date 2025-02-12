/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, addUser, updateUser, deleteUser } from "../apis/fetchUser";
import Skeleton from "@/loader/skeleton";
import { User } from "../types";
import { FaSearch, FaSort, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import debounce from "lodash.debounce";
import UserModal from "@/modals/userModal";
// import { debounce } from "lodash";

export default function MiniDashboard() {
  const queryClient = useQueryClient();
  const {
    data: users,
    error,
    isLoading,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const addUserMutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "email">("name");
  const [page, setPage] = useState<number>(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
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

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="relative p-8 max-w-5xl mx-auto bg-white shadow-lg rounded-xl border border-gray-200">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Mini Dashboard
      </h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setSelectedUser(null);
            setShowModal(true);
          }}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Add User
        </button>
      </div>

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
              <th className="py-3 px-4">Actions</th>
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
                <td className="py-3 px-4 flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowModal(true);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteUserMutation.mutate(user.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
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

      {showModal && (
        <UserModal
          isOpen={showModal} // Pass the isOpen prop
          user={selectedUser}
          onClose={() => setShowModal(false)}
          onSubmit={(data: any) => {
            if (selectedUser) {
              updateUserMutation.mutate(data);
            } else {
              addUserMutation.mutate(data);
            }
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
