<template>
  <Line :data="chartData" :options="chartOptions"/>
</template>
<script>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineController, PointElement, LineElement, LinearScale, CategoryScale } from 'chart.js'
import axios from 'axios'

ChartJS.register(Title, Tooltip, Legend, LineController, PointElement, LineElement, LinearScale, CategoryScale)

export default {
  name: 'LineChart',
  components: { Line },
  props: ['pid'],
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'Sepsis Score',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
            data: [],
          },
        ],
      },
      chartOptions: {
        responsive: false,
        scales: {
          x: {
            type: 'category',
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    };
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:00`
    },
    async generateChartData() {
      const chartRecords = await axios.get(`http://127.0.0.1:8002/api/chart_records/${this.pid}`);
      const chartData = chartRecords.data.map((item) => {
        return {
          date: this.formatDate(item.input_time),
          value: item.sepsis_percent,
        }
      })
      const reversedData = chartData.reverse();
      const labels = reversedData.map(item => item.date)
      const data = reversedData.map(item => item.value)
      this.chartData = {
        labels,
        datasets: [
          {
            label: 'Sepsis Score',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
            data,
          },
        ],
      }
    }
  },
  mounted() {
    this.generateChartData();
  }
};
</script>