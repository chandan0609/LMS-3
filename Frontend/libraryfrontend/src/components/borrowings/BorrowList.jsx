import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBorrowRecords,
  returnBorrowedBook,
  clearBorrowError,
  clearBorrowSuccess,
  sendBorrowerEmail,
} from "../../redux/slices/borrowSlice";
import dayjs from "dayjs";

const BorrowList = () => {
  const dispatch = useDispatch();
  const { records, loading, error, successMessage } = useSelector(
    (state) => state.borrows
  );
  const { user } = useSelector((state) => state.auth);

  const [returningIds, setReturningIds] = useState([]);
  const [emailModal, setEmailModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchBorrowRecords());
  }, [dispatch]);

  const handleReturn = async (id) => {
    if (window.confirm("Are you sure you want to return this book?")) {
      setReturningIds((prev) => [...prev, id]);
      await dispatch(returnBorrowedBook(id));
      dispatch(fetchBorrowRecords());
      setReturningIds((prev) => prev.filter((bookId) => bookId !== id));
    }
  };

  const handleSendEmail = (record) => {
    setSelectedRecord(record);
    setEmailModal(true);
  };

  const handleSubmitEmail = async () => {
    await dispatch(
      sendBorrowerEmail({
        id: selectedRecord.id,
        subject,
        message,
      })
    );
    setEmailModal(false);
    setSubject("");
    setMessage("");
    dispatch(fetchBorrowRecords());
  };

  const isAdminOrLibrarian =
    user?.role === "admin" || user?.role === "librarian";

  // 🟢 Loading state
  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600">
        Loading borrow records...
      </p>
    );

  // 🟢 Error state
  if (error)
    return (
      <div className="text-center text-red-500 mt-10">
        ❌ Error: {error}{" "}
        <button
          onClick={() => dispatch(clearBorrowError())}
          className="ml-2 text-sm underline"
        >
          Dismiss
        </button>
      </div>
    );

  // 🟢 Empty state
  if (!records || records.length === 0)
    return (
      <p className="text-center mt-10 text-gray-600">
        {user?.role === "member"
          ? "You have not borrowed any books yet."
          : "No borrow records found."}
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-emerald-700 text-center">
        {isAdminOrLibrarian ? "All Borrowed Books" : "Your Borrowed Books"}
      </h2>

      {successMessage && (
        <p className="text-center text-green-600 mb-3">
          ✅ {successMessage}{" "}
          <button
            onClick={() => dispatch(clearBorrowSuccess())}
            className="text-sm underline ml-2"
          >
            OK
          </button>
        </p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.map((record) => {
          const isReturned = !!record.return_date;
          const isOverdue = dayjs(record.due_date).isBefore(dayjs());

          return (
            <div
              key={record.id}
              className={`border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between ${
                isReturned ? "bg-gray-100" : "bg-white"
              }`}
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {record.book?.title || "Unknown Title"}
                </h3>
                <p className="text-sm text-gray-600">
                  <strong>Author:</strong> {record.book?.author || "N/A"}
                </p>

                {/* 🟦 Borrower Info (Admin/Librarian view) */}
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

                {/* 🗓️ Borrow, Due, and Return Dates */}
                <p className="text-sm text-gray-600">
                  <strong>Borrowed on:</strong>{" "}
                  {dayjs(record.borrow_date).format("DD MMM YYYY")}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Due Date:</strong>{" "}
                  {dayjs(record.due_date).format("DD MMM YYYY")}
                </p>
                {record.return_date && (
                  <p className="text-sm text-gray-600">
                    <strong>Returned on:</strong>{" "}
                    {dayjs(record.return_date).format("DD MMM YYYY")}
                  </p>
                )}

                {/* 🟢 Status Label */}
                <p
                  className={`mt-3 text-sm font-medium ${
                    isReturned
                      ? "text-green-600"
                      : isOverdue
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {isReturned
                    ? `✅ Returned on ${dayjs(record.return_date).format(
                        "DD MMM YYYY"
                      )}`
                    : isOverdue
                    ? "⚠️ Overdue"
                    : "⏳ Borrowed"}
                </p>
              </div>

              {/* 🟢 Action Buttons */}
              <div className="mt-3 space-y-2">
                {/* Return Button for Members */}
                {!isReturned && user?.role === "member" && (
                  <button
                    onClick={() => handleReturn(record.id)}
                    disabled={returningIds.includes(record.id)}
                    className={`w-full px-4 py-2 rounded text-white font-semibold ${
                      returningIds.includes(record.id)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                  >
                    {returningIds.includes(record.id)
                      ? "Processing..."
                      : "Return Book"}
                  </button>
                )}

                {/* Email Button for Admin/Librarian */}
                {isAdminOrLibrarian && record.user_info && (
                  <button
                    onClick={() => handleSendEmail(record)}
                    className="w-full px-4 py-2 rounded text-white font-semibold bg-blue-600 hover:bg-blue-700"
                  >
                    Send Email
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 🟢 Email Modal */}
      {emailModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-emerald-700">
              Send Email to {selectedRecord?.user_info?.username}
            </h3>
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full mb-3"
            />
            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              className="border border-gray-300 p-2 rounded w-full mb-3"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEmailModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitEmail}
                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowList;
