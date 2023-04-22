import React, { memo } from "react";
const Description = ({ data }) => {
  return (
    <>
      <p>{data}</p>
    </>
  );
};

export default memo(Description);
