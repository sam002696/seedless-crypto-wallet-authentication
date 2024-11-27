import React from "react";

const TransferInfo = () => {
  return (
    <>
      <div>
        {/* Sender to receiver */}
        <div className=" flex flex-row justify-between p-3">
          <div>Account 1</div>
          <div>---</div>
          <div>Account 2</div>
        </div>
        {/* Transfer amount */}
        <div className="px-5 py-5 bg-gray-100">
          <div>
            <p>0x8E2fC...1Ac0</p>
          </div>
          <div className="mt-3">
            <p className="text-bold text-5xl">9 ARISPAY</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransferInfo;
