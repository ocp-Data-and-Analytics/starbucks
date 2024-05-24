import React from "react";

const StoreList = ({ stores }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        <tr>
          <th className="px-4 py-2 border-b">Store Name</th>
          <th className="px-4 py-2 border-b">Address</th>
          <th className="px-4 py-2 border-b">City</th>
          <th className="px-4 py-2 border-b">State</th>
          <th className="px-4 py-2 border-b">phone</th>
        </tr>
      </thead>
      <tbody>
        {stores.map((store, index) => (
          <tr key={index}>
            <td className="px-4 py-2 border-b">{store.name}</td>
            <td className="px-4 py-2 border-b">{store.street}</td>
            <td className="px-4 py-2 border-b">{store.city}</td>
            <td className="px-4 py-2 border-b">{store.state}</td>
            <td className="px-4 py-2 border-b">{store.phone}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default StoreList;
