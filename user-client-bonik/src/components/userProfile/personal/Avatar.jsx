import {React,memo} from "react";
import { AntDesignOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
const Photo = () => (
  <Avatar
    size={{
      xs: 24,
      sm: 32,
      md: 40,
      lg: 64,
      xl: 40,
      xxl: 100,
    }}
    icon={<AntDesignOutlined />}
  />
);
export default memo(Photo);
