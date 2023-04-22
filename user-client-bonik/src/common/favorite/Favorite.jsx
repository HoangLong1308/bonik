import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Checkbox } from "antd";
import styled from "styled-components";
import React, { memo } from "react";
const MyCheckBox = styled(Checkbox)`
  &.ant-checkbox-wrapper {
    justify-content: center;
    align-items: center;
  }
  .ant-checkbox {
    display: none;
  }
`;

function Favorite({ onChange, isFavorite, value }) {
  let check = false;
  isFavorite.forEach(({ product_id }) => {
    if (product_id == value) {
      check = true
    }
  });
  return (
    <>
      <MyCheckBox
        children={
          check ? <HeartFilled style={{ color: "red" }} /> : <HeartOutlined />
        }
        onChange={onChange}
        value={value}
      />
    </>
  );
}

export default memo(Favorite);
