import React, { useState, useEffect } from "react";
import {
  Card,
  Statistic,
  Progress,
  Table,
  Tag,
  Button,
  Select,
  Form,
  Input,
  Row,
  Col,
  Typography,
  Modal
} from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "axios";
import CreateCustomerForm from './CustomerForm';
import { fetchCustomers,updateCustomerStatus } from "./financialapi";

const { Title } = Typography;

const FinancialDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [status, setStatus] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

const showModal = () => setIsModalVisible(true);
const handleClose = () => setIsModalVisible(false);

  useEffect(() => {
    // Fetch customer data from API
    fetchCustomers()
      .then((data) => setCustomers(data))
      .catch((error) => console.error("Error fetching customer data:", error));
  }, []);

  const calculateRiskScore = (customer) => {
    const {
      creditScore,
      loanRepaymentHistory,
      outstandingLoans,
      monthlyIncome,
    } = customer;

    // 1. Low credit score = higher risk (score inverted)
    const creditComponent = ((850 - creditScore) / 850) * 30;

    // 2. Missed repayments = higher risk
    const missedPayments = loanRepaymentHistory?.filter((p) => p === 0).length;
    const repaymentComponent =
      (missedPayments / loanRepaymentHistory.length) * 30;

    // 3. High loan-to-income ratio = higher risk
    const loanIncomeRatio = outstandingLoans / (monthlyIncome || 1); // prevent divide-by-zero
    const loanComponent = Math.min(40, loanIncomeRatio * 10); // cap to 40

    // Total risk score: 0 (low risk) to 100 (high risk)
    const totalScore = Math.min(
      100,
      creditComponent + repaymentComponent + loanComponent
    );

    return totalScore;
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    if (selectedCustomerId) {
      // Persist status update to backend API
      updateCustomerStatus(selectedCustomerId,value)
        .then(() => {
          console.log("Status updated successfully");
          // Fetch the updated customer data after status change
          fetchCustomers().then((data) => setCustomers(data));
        })
        .catch((error) => console.error("Error updating status:", error));
    }
  };

  const riskColor = (score) => {
    console.log(score);
    if (score > 70) return "red";
    if (score > 40) return "orange";
    return "green";
  };
  // Group customers into risk categories
  const riskCategories = {
    Low: 0,
    Medium: 0,
    High: 0,
  };

  customers?.forEach((customer) => {
    const score = calculateRiskScore(customer);
    if (score > 70) {
      riskCategories.High += 1;
    } else if (score > 40) {
      riskCategories.Medium += 1;
    } else {
      riskCategories.Low += 1;
    }
  });

  const pieChartData = Object.entries(riskCategories)?.map(([name, value]) => ({
    name,
    value,
  }));

  const pieColors = {
    Low: "green",
    Medium: "orange",
    High: "red",
  };

  const incomeVsExpensesData = customers?.map((customer) => ({
    name: customer.name,
    income: customer.monthlyIncome,
    expenses: customer.monthlyExpenses,
  }));

  const columns = [
    { title: "Customer ID", dataIndex: "customerId" },
    { title: "Name", dataIndex: "name" },
    { title: "Monthly Income", dataIndex: "monthlyIncome" },
    { title: "Monthly Expenses", dataIndex: "monthlyExpenses" },
    { title: "Credit Score", dataIndex: "creditScore" },
    { title: "Outstanding Loans", dataIndex: "outstandingLoans" },
    { title: "Account Balance", dataIndex: "accountBalance" },
    { title: "Status", dataIndex: "status" },
    {
      title: "Risk Score",
      dataIndex: "riskScore",
      render: (_, record) => {
        const score = calculateRiskScore(record);
        return (
          <Progress
            percent={score}
            status={score > 70 ? "exception" : "normal"}
            strokeColor={riskColor(score)}
            width={80}
          />
        );
      },
    },
  ];

  const customerOptions = customers?.map((customer) => ({
    label: customer.name,
    value: customer.customerId,
  }));

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2>Customer Dashboard</h2>
        <Button type="primary" onClick={showModal}>
          + Create New Customer
        </Button>
      </div>

      <Modal
        title="Create New Customer"
        open={isModalVisible}
        onCancel={handleClose}
        footer={null}
        destroyOnClose
      >
        <CreateCustomerForm
          onSuccess={() => {
            handleClose();
            fetchCustomers(); // or whatever refresh logic you use
          }}
        />
      </Modal>

      <Row gutter={24}>
        <Col span={12}>
          <Card>
            <Title level={4}>Income vs Expenses</Title>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={incomeVsExpensesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#8884d8" />
                <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card>
            <Title level={4}>Risk Score Distribution</Title>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {pieChartData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Card title="Customer Data">
        <Table
          columns={columns}
          dataSource={customers}
          rowKey="customerId"
          pagination={false}
        />
      </Card>

      <Card title="Update Customer Status" style={{ marginTop: "20px" }}>
        <Form layout="inline" onFinish={() => handleStatusChange(status)}>
          <Form.Item label="Select Customer" name="customerId">
            <Select
              style={{ width: 200 }}
              onChange={setSelectedCustomerId}
              options={customerOptions}
            />
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select style={{ width: 200 }} value={status} onChange={setStatus}>
              <Select.Option value="Review">Review</Select.Option>
              <Select.Option value="Approved">Approved</Select.Option>
              <Select.Option value="Rejected">Rejected</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Status
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default FinancialDashboard;
