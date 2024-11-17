import React from "react";
import SendFromTo from "./SendFromTo";

const SendCryptoTokenModal = ({
  openCryptoTokenSend,
  setOpenCryptoTokenSend,
}) => {
  return (
    <>
      <SendFromTo
        openCryptoTokenSend={openCryptoTokenSend}
        setOpenCryptoTokenSend={setOpenCryptoTokenSend}
      />
    </>
  );
};

export default SendCryptoTokenModal;
