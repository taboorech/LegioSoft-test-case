import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Transaction } from "../../types/Transaction.type";
import { ArcElement, Chart, Tooltip } from "chart.js";

// Component props including filtered transactions
const PieChart = ({ filteredTransactions }: { filteredTransactions: Transaction[] }) => {
  // Register required chart elements and tooltips from Chart.js
  Chart.register(ArcElement, Tooltip);

  // State to hold chart data
  const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });

  // Effect to update chart data when filteredTransactions change
  useEffect(() => {
    // Object to store counts of transactions by status
    const transactionsByStatus: any = {
      pending: 0,
      completed: 0,
      cancelled: 0
    };

    // Count transactions by status
    filteredTransactions.forEach(transaction => {
      if (!transactionsByStatus[transaction.status]) {
        transactionsByStatus[transaction.status] = 0;
      }
      transactionsByStatus[transaction.status] += 1;
    });

    // Calculate total number of transactions
    const totalTransactions = filteredTransactions.length;

    // Extract labels (status names) from transactionsByStatus object
    const labels = Object.keys(transactionsByStatus);

    // Calculate percentage of transactions for each status
    const data: Array<string> = labels.map(status => {
      const count: number = transactionsByStatus[status];
      const percentage = (count / totalTransactions) * 100;
      return percentage.toFixed(2); // Convert percentage to fixed two decimal places
    });

    // Define colors for each pie segment
    const backgroundColor = [
      'rgba(255, 99, 132, 0.2)',
      'rgba(128, 99, 255, 0.2)',
      'rgba(75, 192, 192, 0.2)',
    ];

    const borderColor = [
      'rgba(255, 99, 132, 1)',
      'rgba(128, 99, 255, 1)',
      'rgba(75, 192, 192, 1)',
    ];
    
    // Update chartData state with new data, labels, and options
    setChartData({
      labels: labels,
      datasets: [{
        label: 'Percentage of Transactions per Status',
        data: data,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      }],
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: function(tooltipItem: any) {
                return tooltipItem.label + ': ' + tooltipItem.raw.toFixed(2) + '%';
              }
            }
          },
          legend: {
            display: true,
            position: 'bottom',
          }
        }
      }
    });
  }, [filteredTransactions]); // Depend on filteredTransactions to update the chart

  return (
    <Box>
      <h2>Transaction Volume by Status</h2>
      <Box mt={2}>
        <Pie data={chartData} /> {/* Render Pie chart with chartData */}
      </Box>
    </Box> 
  );
};

export default PieChart;
