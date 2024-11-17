import React, { useState } from "react";

const To = () => {
  const [address, setAddress] = useState("");
  const [isValid, setIsValid] = useState(false);

  const validateAddress = (input) => {
    // Basic Ethereum address validation
    const regex = /^0x[a-fA-F0-9]{40}$/;
    return regex.test(input);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setAddress(`${inputValue.slice(0, 10)}...${inputValue.slice(-8)}`);

    if (validateAddress(inputValue)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  const handleEditClick = () => {
    setIsValid(false); // Allow re-editing the address
  };

  return (
    <div className="col-span-full">
      <label
        htmlFor="to-address"
        className="block text-sm/6 font-medium text-gray-900"
      >
        To
      </label>
      <div className="mt-2">
        {isValid ? (
          // Render the validated address and an edit button
          <div className="flex items-center justify-between">
            <p className="text-gray-900">{address}</p>
            <button
              type="button"
              onClick={handleEditClick}
              className="ml-4 text-sm text-indigo-600 hover:underline"
            >
              Edit
            </button>
          </div>
        ) : (
          // Render the input field for entering the address
          <input
            id="to-address"
            name="to-address"
            type="text"
            autoComplete="to-address"
            placeholder="Enter public address (0x)"
            value={address}
            onChange={handleInputChange}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
          />
        )}
      </div>
      {!isValid && address && (
        // Show validation error message
        <p className="mt-2 text-sm text-red-600">Invalid public address.</p>
      )}
    </div>
  );
};

export default To;
