import React, { useEffect } from "react";

interface AlertProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500); // Hide after 2.5s
    return () => clearTimeout(timer);
  }, [onClose]);

  const color =
    type === "success"
      ? "bg-green-500 text-white"
      : "bg-red-500 text-white";

  return (
    <div
      className={`fixed top-20 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-md text-sm font-medium ${color} z-[9999] animate-bounce`}
    >
      {message}
    </div>
  );
};

export default Alert;
