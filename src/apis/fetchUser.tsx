import axios from "axios";
import { User } from "../types";

const API_URL = "https://jsonplaceholder.typicode.com/users";

// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Add a new user
export const addUser = async (user: Partial<User>): Promise<User> => {
  const response = await axios.post(API_URL, user);
  return response.data;
};

// Update a user
export const updateUser = async (user: User): Promise<User> => {
  const response = await axios.put(`${API_URL}/${user.id}`, user);
  return response.data;
};

// Delete a user
export const deleteUser = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
