import React from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

const TransactionDetailsModal = ({ open, setOpen, transactionDetails }) => {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-10"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-6 py-8 text-left shadow-xl transition-all sm:max-w-lg">
            <div className="space-y-6">
              {/* Status and Title */}
              <div className="text-center">
                <p className="text-sm font-medium text-green-600">Status</p>
                <h3 className="mt-2 text-xl font-bold text-gray-900">
                  {transactionDetails.status || "Pending"}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {transactionDetails.timestamp || "Timestamp not available"}
                </p>
              </div>

              {/* From and To Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700">From</h4>
                <p className="truncate text-gray-600">
                  {transactionDetails.from || "Sender address not available"}
                </p>

                <h4 className="mt-4 text-sm font-semibold text-gray-700">To</h4>
                <p className="truncate text-gray-600">
                  {transactionDetails.to || "Recipient address not available"}
                </p>
              </div>

              {/* Transaction Information */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold text-gray-700">
                  Transaction
                </h4>
                <div className="mt-2 space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-semibold">Nonce:</span>{" "}
                    {transactionDetails.nonce || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Amount:</span>{" "}
                    {transactionDetails.amount || "0"} ARISPAY
                  </p>
                  <p>
                    <span className="font-semibold">Gas Used:</span>{" "}
                    {transactionDetails.gasUsed || "N/A"} Units
                  </p>
                  <p>
                    <span className="font-semibold">Base Fee:</span>{" "}
                    {transactionDetails.baseFee || "N/A"} GWEI
                  </p>
                  <p>
                    <span className="font-semibold">Priority Fee:</span>{" "}
                    {transactionDetails.priorityFee || "N/A"} GWEI
                  </p>
                  <p>
                    <span className="font-semibold">Total Fee:</span>{" "}
                    {transactionDetails.totalFee || "N/A"} SepoliaETH
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mt-6">
                <a
                  href={transactionDetails.explorerLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                >
                  View on Explorer
                </a>
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default TransactionDetailsModal;
