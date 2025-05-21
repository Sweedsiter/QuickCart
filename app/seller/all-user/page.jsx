'use client';
import React, { useEffect, useState } from "react";
import Footer from "@/components/seller/Footer";
import { useAppContext } from "@/context/AppContext";

const All_user = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const { router, isSeller, } = useAppContext()
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    if (!isSeller) {
      router.push('/');
    } else {
      setLoading(false);
      fetch('/api/user/user-data')
        .then((res) => res.json())
        .then((data) => setUsers(data.userData))
        .catch((err) => console.error(err));
       
    }
  }, [isSeller, router]);


  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col  text-sm">
      <div className="flex items-center justify-between p-4 ">
        <span className="text-2xl font-bold m-4">All Users</span>
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query
          className="border border-gray-300 rounded px-4 py-2"
        />
        <span className="text-sm font-bold m-4">Total Users: {users.length}</span>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <p>Loading...</p>
        </div>
      ) : (
        <>

          {filteredUsers.length > 0 ? (
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Email</th>
                  <th className="border border-gray-300 px-4 py-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{user?.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{user?.email}</td>
                    <td className="border border-gray-300 px-4 py-2">{user?.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No users found.</p>
          )}


          <Footer />
        </>
      )}
    </div>
  );
}
export default All_user 