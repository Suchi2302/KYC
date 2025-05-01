const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// In-memory customer data (in a real-world scenario, this would come from a database)
let customers = [
  {
    customerId: "CUST1001",
    name: "Alice Johnson",
    monthlyIncome: 6200,
    monthlyExpenses: 3500,
    creditScore: 710,
    outstandingLoans: 15000,
    loanRepaymentHistory: [1, 0, 1, 1, 1, 1, 0, 1],
    accountBalance: 12500,
    status: "Review"
  },
  {
    customerId: "CUST1002",
    name: "Bob Smith",
    monthlyIncome: 4800,
    monthlyExpenses: 2800,
    creditScore: 640,
    outstandingLoans: 20000,
    loanRepaymentHistory: [1, 1, 1, 0, 0, 1, 0, 0],
    accountBalance: 7300,
    status: "Approved"
  },
  {
    "customerId": "CUST1003",
    "name": "John Danger",
    "monthlyIncome": 3000,
    "monthlyExpenses": 2500,
    "creditScore": 500,
    "outstandingLoans": 40000,
    "loanRepaymentHistory": [0, 0, 0, 1, 0, 0, 1, 0],
    "accountBalance": 500,
    "status": "Review"
  }
  
];

// Initialize the Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Function to calculate risk score for a customer
const calculateRiskScore = (customer) => {
  const { creditScore, loanRepaymentHistory, outstandingLoans, monthlyIncome } = customer;
  console.log(loanRepaymentHistory)
  // Calculate the loan repayment ratio
  const repaymentRatio = loanRepaymentHistory?.filter(payment => payment === 1).length / loanRepaymentHistory?.length;

  // Calculate the risk score based on the defined algorithm
  const score = (creditScore / 1000) * 30 + (repaymentRatio * 30) - (outstandingLoans / monthlyIncome) * 20;

  return Math.max(0, Math.min(100, score));  // Ensure score is between 0 and 100
};
app.post('/api/customers', async (req, res) => {
    const   customerData  = req.body;
    try {
        console.log(customerData)
        const newCustomer = { ...customerData, customerId: `CUST${Date.now()}` };
        customers.push(newCustomer); // Add the new customer to the mock array
        res.status(200).send('Successfully Customer Created');
      
    } catch (error) {
      console.error('Error creating customer', error);
      res.status(400).json({ message: 'Error creating customer' });
    }
  });
// API endpoint to fetch customer data
app.get('/api/customers', (req, res) => {
  // Add calculated risk score to each customer
  const customersWithRisk = customers.map(customer => ({
    ...customer,
    riskScore: calculateRiskScore(customer)
  }));
  res.json(customersWithRisk);
});

// API endpoint to update customer status
app.post('/api/customers/:customerId/status', (req, res) => {
  const { customerId } = req.params;
  const { status } = req.body;

  // Find the customer and update their status
  const customer = customers.find(cust => cust.customerId === customerId);
  if (!customer) {
    return res.status(404).send({ message: 'Customer not found' });
  }

  customer.status = status;

  res.send({ message: 'Customer status updated successfully' });
});

// API endpoint to simulate sending alerts for high-risk customers
app.post('/api/alerts', (req, res) => {
  const { customerId, riskScore } = req.body;

  // Simulate an alert for high-risk customers (risk score > 70)
  if (riskScore > 70) {
    console.log(`ALERT: High-risk customer detected! ID: ${customerId}, Risk Score: ${riskScore}`);
    return res.send({ message: 'Alert sent for high-risk customer' });
  }
  
  res.send({ message: 'Customer is not high-risk' });
});

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
