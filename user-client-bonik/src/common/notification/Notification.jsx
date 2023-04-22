import React,{memo} from "react";
import { Button, notification, Space } from "antd";
const CustomizedNotification = ({
  type,
  message,
  placement,
  handleClick,
  buttonContent,
  style,
}) => {
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type) => {
    handleClick();
    api[type]({
      message: message,
      placement,
    });
  };
  return (
    <>
      {contextHolder}
      <Button style={style} onClick={() => openNotificationWithIcon(type)}>
        {buttonContent}
      </Button>
    </>
  );
};
export default memo(CustomizedNotification);
