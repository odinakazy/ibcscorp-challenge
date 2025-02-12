import { useState, useEffect } from "react";
import { User } from "../types";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: Partial<User>) => void;
  user?: User | null;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
}) => {
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    phone: "",
  });

  // Populate form data if editing
  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData({ name: "", email: "", phone: "" });
    }
  }, [user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-30 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {user ? "Edit User" : "Add User"}
        </h2>

        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          className="w-full border p-2 rounded mb-2"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          className="w-full border p-2 rounded mb-2"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone"
          value={formData.phone}
          className="w-full border p-2 rounded mb-2"
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => {
              onSubmit(formData);
              onClose();
            }}
          >
            {user ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
