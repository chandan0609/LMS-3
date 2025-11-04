import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBorrowRecords } from "../../redux/slices/borrowSlice";
import dayjs from "dayjs";

const BorrowList = () => {
  const dispatch = useDispatch();
  const { records, loading, error } = useSelector((state) => state.borrows);
  const { user } = useSelector((state) => state.auth); // Assuming you have user in auth state

  useEffect(() => {
    dispatch(fetchBorrowRecords());
  }, [dispatch]);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600">
        Loading borrow records...
      </p>
    );

  if (error)
    return <p className="text-center text-red-500 mt-10">❌ Error: {error}</p>;

  if (!records || records.length === 0)
    return (
      <p className="text-center mt-10 text-gray-600">
        {user?.role === "member"
          ? "You have not borrowed any books yet."
          : "No borrow records found."}
      </p>
    );

  const isAdminOrLibrarian =
    user?.role === "admin" || user?.role === "librarian";

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-emerald-700 text-center">
        {isAdminOrLibrarian ? "All Borrowed Books" : "Your Borrowed Books"}
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.map((record) => (
          <div
            key={record.id}
            className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition p-5 bg-white"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {record.book?.title || "Unknown Title"}
            </h3>
            <p className="text-sm text-gray-600">
              <strong>Author:</strong> {record.book?.author || "N/A"}
            </p>

            {/* Show borrower info for admin/librarian */}
            {isAdminOrLibrarian && record.user_info && (
              <div className="mt-2 mb-2 p-2 bg-blue-50 rounded border-l-4 border-blue-500">
                <p className="text-sm text-blue-800">
                  <strong>Borrowed by:</strong> {record.user_info.username}
                </p>
                <p className="text-xs text-blue-600">
                  {record.user_info.email}
                </p>
              </div>
            )}

            <p className="text-sm text-gray-600">
              <strong>Borrowed on:</strong>{" "}
              {dayjs(record.borrow_date).format("DD MMM YYYY")}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Due Date:</strong>{" "}
              {dayjs(record.due_date).format("DD MMM YYYY")}
            </p>
            <p
              className={`mt-3 text-sm font-medium ${
                record.return_date
                  ? "text-green-600"
                  : dayjs(record.due_date).isBefore(dayjs())
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {record.return_date
                ? `✅ Returned on ${dayjs(record.return_date).format(
                    "DD MMM YYYY"
                  )}`
                : dayjs(record.due_date).isBefore(dayjs())
                ? "⚠️ Overdue"
                : "⏳ Borrowed"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BorrowList;
