import React from "react";

const CustomToken = () => {
  return (
    <>
      <div>
        <label
          htmlFor="token_contract_address"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Token contract address
        </label>
        <div className="mt-2">
          <input
            id="token_contract_address"
            name="token_contract_address"
            type="text"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          />

          <div className="text-center bg-blue-50 mt-20 py-2 rounded-full ">
            <button
              type="button"
              className="text-lg font-medium text-blue-600 shadow-sm hover:bg-blue-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomToken;