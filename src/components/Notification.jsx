import React from "react";

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  const color =
    type === "success"
      ? "bg-green-100 border-green-400 text-green-700"
      : type === "error"
      ? "bg-red-100 border-red-400 text-red-700"
      : "bg-indigo-100 border-indigo-400 text-indigo-700";

  return (
    <div
      className={`border-l-4 p-4 mb-6 rounded-lg flex justify-between items-center ${color}`}
      role="alert"
    >
      <div>
        <p className="font-bold capitalize">{type}</p>
        <p>{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-xl font-bold p-1 leading-none hover:text-gray-900"
      >
        &times;
      </button>
    </div>
  );
};

export default Notification;
