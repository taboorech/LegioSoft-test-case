import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Transaction } from "../../types/Transaction.type";

const PieChart = ({ filteredTransactions }: { filteredTransactions: Transaction[] }) => {

  const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });

  useEffect(() => {
    const transactionsByStatus: any = {
      pending: 0,
      completed: 0,
      cancelled: 0
    };
    filteredTransactions.forEach(transaction => {
      if (!transactionsByStatus[transaction.status]) {
        transactionsByStatus[transaction.status] = 0;
      }
      transactionsByStatus[transaction.status] += 1;
    });

    const totalTransactions = filteredTransactions.length;

    const labels = Object.keys(transactionsByStatus);
    const data: Array<string> = labels.map(status => {
      const count: number = transactionsByStatus[status];
      const percentage = (count / totalTransactions) * 100;
      return percentage.toFixed(2);
    });

    const backgroundColor = [
      'rgba(255, 99, 132, 0.2)',
      'rgba(128, 99, 255, 0.2)',
      'rgba(75, 192, 192, 0.2)',
    ]

    const borderColor = [
      'rgba(255, 99, 132, 1)',
      'rgba(128, 99, 255, 1)',
      'rgba(75, 192, 192, 1)',
    ]
    
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
  }, [filteredTransactions]);

  return (
    <Box>
      <h2>Transaction Volume by Status</h2>
      <Box mt={2}>
        <Pie data={chartData}/>
      </Box>
    </Box> 
  )
}

export default PieChart;