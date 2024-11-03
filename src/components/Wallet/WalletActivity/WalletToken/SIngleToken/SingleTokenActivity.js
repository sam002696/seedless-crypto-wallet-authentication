import React from "react";

const SingleTokenActivity = () => {
  const transactions = [
    {
      date: "2024-11-01",
      activities: [
        {
          message: "Send ARISPAY",
          status: "Confirmed",
          amount: "-20 ARISPAY",
        },
      ],
    },
    {
      date: "2024-11-02",
      activities: [
        {
          message: "Send ARISPAY",
          status: "Confirmed",
          amount: "-15 ARISPAY",
        },
        {
          message: "Receive ARISPAY",
          status: "Confirmed",
          amount: "+30 ARISPAY",
        },
        {
          message: "Send ARISPAY",
          status: "Pending",
          amount: "-10 ARISPAY",
        },
      ],
    },
  ];

  return (
    <div className="p-4">
      <p className="text-xl font-bold mb-4">Your Activity</p>
      {transactions.map((transaction, index) => (
        <div key={index} className="mb-4">
          <p className="text-lg font-semibold">{transaction.date}</p>
          {transaction.activities.map((activity, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-gray-100 rounded-lg p-4 mb-2 shadow-md mt-3"
            >
              <span className="text-gray-700">{activity.message}</span>
              <span className="text-gray-500">{activity.status}</span>
              <span
                className={`${
                  activity.message === "Send ARISPAY"
                    ? "text-red-500"
                    : "text-green-500"
                } text-gray-800 font-semibold`}
              >
                {activity.amount}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SingleTokenActivity;
