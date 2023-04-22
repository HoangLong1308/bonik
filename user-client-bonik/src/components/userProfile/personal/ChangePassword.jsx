import React, { useState,memo } from "react";
import { Button, Form, Input} from "antd";
import { SaveOutlined } from "@ant-design/icons";
function ChangePassword() {
  //loading button
  const [loading, setLoading] = React.useState(false);
  function handleClick() {
    setLoading(true);
  }

  const ChangePasswordForm = () => {
    const [form] = Form.useForm();
    const [formLayout, setFormLayout] = useState("horizontal");
    const onFormLayoutChange = ({ layout }) => {
      setFormLayout(layout);
    };
    const formItemLayout =
      formLayout === "horizontal"
        ? {
            labelCol: {
              span: 7,
            },
            wrapperCol: {
              span: 14,
            },
          }
        : null;
    const buttonItemLayout =
      formLayout === "horizontal"
        ? {
            wrapperCol: {
              span: 14,
              offset: 7,
            },
          }
        : null;
    return (
      <Form
        {...formItemLayout}
        layout={formLayout}
        form={form}
        initialValues={{
          layout: formLayout,
        }}
        onValuesChange={onFormLayoutChange}
      >
        <Form.Item label="Mật khẩu hiện tại">
          <Input
            name="current-password"
            style={{
              width: "calc(100% - 140px)",
            }}
          />
          <Button type="text">Quên mật khẩu?</Button>
        </Form.Item>
        <Form.Item label="Mật khẩu mới">
          <Input name="new-password" />
        </Form.Item>
        <Form.Item label="Xác nhận mật khẩu">
          <Input name="confirm-password" />
        </Form.Item>
        <Form.Item {...buttonItemLayout}>
          <Button loading={true} icon={<SaveOutlined />} type="primary">
            Xác nhận
          </Button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "750px",
        backgroundColor: "rgba(0,0,0,.09)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          margin: "auto",
          width: 800,
          height: 400,
          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 13%)",
          boxSizing: "border-box",
          backgroundColor: "#fff",
          padding: "50px",
          marginTop: "50px",
        }}
      >
        <div>
          <h3>Đổi mật khẩu</h3>
          <h5 style={{ opacity: 0.9 }}>
            Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
          </h5>
          <hr style={{ opacity: 0.2 }} />
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}

export default memo(ChangePassword);
