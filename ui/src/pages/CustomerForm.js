// CreateCustomerForm.tsx
import React from "react";
import { Form, Input, InputNumber, Button, Select, message, Space } from "antd";
import { createCustomer } from "./financialapi"; // Import the createCustomer function

const { Option } = Select;

const CreateCustomerForm = ({ onSuccess }) => {
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    console.log(values);
    try {
      // Format repaymentHistory to binary array
      const repaymentHistory = values.loanRepaymentHistory
        .map((c) => Number(c));
      const payload = { ...values, repaymentHistory };

      await createCustomer(payload); // Call API to create the customer
      message.success("Customer created successfully");
      form.resetFields();
      if (onSuccess) onSuccess(); // Optionally trigger data refresh
    } catch (error) {
      message.error("Failed to create customer");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      style={{ maxWidth: 600, margin: "0 auto", marginTop: 24 }}
    >
      <Form.Item label="Name" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item
        label="Monthly Income"
        name="monthlyIncome"
        rules={[{ required: true }]}
      >
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Monthly Expenses"
        name="monthlyExpenses"
        rules={[{ required: true }]}
      >
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Credit Score"
        name="creditScore"
        rules={[{ required: true }]}
      >
        <InputNumber min={0} max={850} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Outstanding Loans"
        name="outstandingLoans"
        rules={[{ required: true }]}
      >
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>
      <Form.List name="loanRepaymentHistory">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <Space
                key={field.key}
                style={{ display: "flex", marginBottom: 8 }}
                align="baseline"
              >
                <Form.Item
                  {...field}
                  name={field.name}
                  fieldKey={field.fieldKey}
                  rules={[
                    { required: true, message: "Enter 1 (paid) or 0 (missed)" },
                  ]}
                >
                  <InputNumber min={0} max={1} />
                </Form.Item>
                <Button onClick={() => remove(field.name)} type="link" danger>
                  Remove
                </Button>
              </Space>
            ))}
            <Form.Item>
              <Button onClick={() => add()} type="dashed" block>
                + Add Repayment Entry
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item
        label="Account Balance"
        name="accountBalance"
        rules={[{ required: true }]}
      >
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item label="Status" name="status" initialValue="Review">
        <Select>
          <Option value="Review">Review</Option>
          <Option value="Approved">Approved</Option>
          <Option value="Rejected">Rejected</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Customer
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateCustomerForm;
