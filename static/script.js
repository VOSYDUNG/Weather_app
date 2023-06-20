// Dữ liệu mẫu cho biểu đồ
const temperatureData = [
  { date: "2023-06-01", temperature: 28 },
  { date: "2023-06-02", temperature: 30 },
  { date: "2023-06-03", temperature: 29 },
  { date: "2023-06-04", temperature: 31 },
  { date: "2023-06-05", temperature: 26 },
  { date: "2023-06-06", temperature: 27 },
  { date: "2023-06-07", temperature: 28 },
  { date: "2023-06-08", temperature: 29 }
];

const humidityData = [
  { date: "2023-06-01", humidity: 60 },
  { date: "2023-06-02", humidity: 65 },
  { date: "2023-06-03", humidity: 70 },
  { date: "2023-06-04", humidity: 75 },
  { date: "2023-06-05", humidity: 80 },
  { date: "2023-06-06", humidity: 85 },
  { date: "2023-06-07", humidity: 90 },
  { date: "2023-06-08", humidity: 95 }
];

const rainfallData = [
  { date: "2023-06-01", rainfall: 10 },
  { date: "2023-06-02", rainfall: 5 },
  { date: "2023-06-03", rainfall: 3 },
  { date: "2023-06-04", rainfall: 8 },
  { date: "2023-06-05", rainfall: 2 },
  { date: "2023-06-06", rainfall: 4 },
  { date: "2023-06-07", rainfall: 6 },
  { date: "2023-06-08", rainfall: 7 }
];


// Lấy phần tử canvas từ DOM
const temperatureChartCanvas = document.getElementById("temperature-chart");
const humidityChartCanvas = document.getElementById("humidity-chart");
const rainfallChartCanvas = document.getElementById("rainfall-chart");

// Vẽ biểu đồ nhiệt độ
new Chart(temperatureChartCanvas, {
  type: "line",
  data: {
    labels: temperatureData.map((data) => data.date),
    datasets: [
      {
        label: "Nhiệt độ",
        data: temperatureData.map((data) => data.temperature),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        pointRadius: 0,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    legend: {
      display: false,
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            stepSize: 5,
          },
        },
      ],
    },
  },
});

// Vẽ biểu đồ độ ẩm
new Chart(humidityChartCanvas, {
  type: "line",
  data: {
    labels: humidityData.map((data) => data.date),
    datasets: [
      {
        label: "Độ ẩm",
        data: humidityData.map((data) => data.humidity),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        pointRadius: 0,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    legend: {
      display: false,
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            stepSize: 15,
          },
        },
      ],
    },
  },
});

// Vẽ biểu đồ lượng mưa
new Chart(rainfallChartCanvas, {
  type: "bar",
  data: {
    labels: rainfallData.map((data) => data.date),
    datasets: [
      {
        label: "Lượng mưa",
        data: rainfallData.map((data) => data.rainfall),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    legend: {
      display: false,
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            stepSize: 4,
          },
        },
      ],
    },
  },
});

// Hiển thị thông tin nhiệt độ, độ ẩm, lượng mưa
const temperatureElement = document.getElementById("temperature");
const humidityElement = document.getElementById("humidity");
const rainfallElement = document.getElementById("rainfall");

// Giả định lấy dữ liệu thời tiết từ nguồn nào đó và cập nhật vào giao diện
const updateWeatherData = () => {
  // Lấy dữ liệu thời tiết từ nguồn
  const temperature = getTemperatureData(); // Hàm lấy nhiệt độ từ nguồn
  const humidity = getHumidityData(); // Hàm lấy độ ẩm từ nguồn
  const rainfall = getRainfallData(); // Hàm lấy lượng mưa từ nguồn

  // Cập nhật giao diện
  temperatureElement.textContent = temperature + "°C";
  humidityElement.textContent = humidity + "%";
  rainfallElement.textContent = rainfall + "mm";
};

// Mô phỏng việc cập nhật dữ liệu thời tiết theo khoảng thời gian
setInterval(updateWeatherData, 5000);
const socket = new WebSocket('http://127.0.0.1:5000/'); // Thay đổi địa chỉ và cổng WebSocket tương ứng

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);

    // Cập nhật giao diện với dữ liệu mới nhận được từ MQTT
    document.getElementById('temperature').textContent = data.tem + "°C";
    document.getElementById('humidity').textContent = data.humi + "%";
    document.getElementById('rainfall').textContent = data.status + "mm";
};

socket.onclose = function(event) {
    // Xử lý khi kết nối WebSocket đóng
    console.log('WebSocket closed');
};
