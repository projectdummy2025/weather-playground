<template>
  <div class="mb-8 sm:mb-12 p-4 sm:p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl">
    <h3 class="text-base sm:text-xl font-bold mb-4 sm:mb-6 opacity-90">Grafik Tren</h3>
    <div class="h-48 sm:h-64 md:h-80 w-full">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register chart components
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const props = defineProps({
  weatherData: {
    type: Object,
    required: true
  }
});

const chartRef = ref(null);
let chartInstance = null;

watch(
  () => props.weatherData,
  (newWeatherData) => {
    if (newWeatherData) {
      nextTick(() => {
        updateChart();
      });
    }
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  if (props.weatherData) {
    nextTick(() => {
      updateChart();
    });
  }
});

function updateChart() {
  if (!props.weatherData || !chartRef.value) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  const allPeriods = props.weatherData.prakiraan.flatMap((day) => day.periode);
  // Limit to first 24 points to avoid overcrowding
  const limitedPeriods = allPeriods.slice(0, 24);
  
  const timestamps = limitedPeriods.map((p) => formatTime(p.local_datetime));
  const temperatures = limitedPeriods.map((p) => p.t);
  const humidity = limitedPeriods.map((p) => p.hu);

  const ctx = chartRef.value.getContext("2d");
  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: timestamps,
      datasets: [
        {
          label: "Suhu (°C)",
          data: temperatures,
          borderColor: "rgba(255, 255, 255, 0.9)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#fff",
          pointBorderColor: "rgba(255, 255, 255, 0.5)",
          pointHoverRadius: 6,
          borderWidth: 3
        },
        {
          label: "Kelembaban (%)",
          data: humidity,
          borderColor: "rgba(56, 189, 248, 0.8)", // Sky blue
          backgroundColor: "rgba(56, 189, 248, 0.05)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "rgba(56, 189, 248, 1)",
          pointBorderColor: "#fff",
          pointHoverRadius: 6,
          borderWidth: 2,
          borderDash: [5, 5]
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#e2e8f0',
            padding: 15,
            font: {
              size: 12,
              weight: 'bold',
              family: 'Montserrat'
            },
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#e2e8f0',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 12,
          displayColors: true
        }
      },
      scales: {
        x: {
          grid: {
            color: "rgba(255, 255, 255, 0.05)",
            drawBorder: false
          },
          ticks: {
            color: "rgba(255, 255, 255, 0.6)",
            font: {
              size: 11
            }
          },
        },
        y: {
          grid: {
            color: "rgba(255, 255, 255, 0.05)",
            drawBorder: false
          },
          ticks: {
            color: "rgba(255, 255, 255, 0.6)",
            font: {
              size: 11
            }
          },
        },
      },
    },
  });
}

function formatTime(dateString) {
  if (!dateString) return '--:--';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      const timeMatch = dateString.match(/(\d{2}):(\d{2})/);
      if (timeMatch) return `${timeMatch[1]}:${timeMatch[2]}`;
      return '--:--';
    }
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  } catch (error) {
    return '--:--';
  }
}
</script>
