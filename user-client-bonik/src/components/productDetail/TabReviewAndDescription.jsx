import Review from "./Review";
import React, { memo } from "react";
import { Tabs } from "antd";
import Description from "./Description";
const onChange = (key) => {
  console.log(key);
};
const TabReviewAndDescription = ({
  listReview,
  description,
  handleClick,
  loading,
}) => (
  <Tabs
    defaultActiveKey="1"
    items={[
      {
        key: "1",
        label: `Mô tả`,
        children: <Description data={description}/>,
      },
      {
        key: "2",
        label: `Đánh giá`,
        children: (
          <Review
            handleClick={handleClick}
            listReview={listReview}
            loading={loading}
          />
        ),
      },
    ]}
    onChange={onChange}
  />
);
export default memo(TabReviewAndDescription);
