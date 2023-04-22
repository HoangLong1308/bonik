import { Rate } from "antd";
import React,{memo} from "react"
function HalfRatingRead({ value }) {
  return (
    <div>
      <Rate
        allowHalf
        disabled
        defaultValue={1}
        value={value}
        style={{ fontSize: "12px" }}
      />
    </div>
  );
}

export default memo(HalfRatingRead)