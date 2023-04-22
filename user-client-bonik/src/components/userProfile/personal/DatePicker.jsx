import {React,memo} from "react";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";

const dateFormat = "YYYY/MM/DD";
const DatePickerCalendar = () => (
  <Space direction="vertical" size={12}>
    <DatePicker
      defaultValue={dayjs("2015/01/01", dateFormat)}
      format={dateFormat}
    />
  </Space>
);
export default memo(DatePickerCalendar);
