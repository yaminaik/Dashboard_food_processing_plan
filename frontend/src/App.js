import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import './style.css'; // Import the CSS file

function FileUpload() {
    // State variables
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);
    const [chartType, setChartType] = useState('bar');
    const [backgroundColor, setBackgroundColor] = useState('rgba(54, 162, 235, 0.7)');
    const chartRefs = useRef([]);

    // Event handlers
    const onFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const onFileUpload = () => {
        const formData = new FormData();
        formData.append("file", file);
       
        axios.post("http://backend-dev2.us-east-1.elasticbeanstalk.com/upload", formData)
            .then(response => {
                console.log("Data:", response.data);
                setData(response.data);
            })
            .catch(error => {
                console.error("Error uploading file:", error);
            });
    };

    // Create charts function
    const createCharts = () => {
        // Destroy existing charts
        chartRefs.current.forEach(chart => chart.destroy());
        chartRefs.current = [];

        data.forEach(item => {
            const ctx = document.getElementById(item.__EMPTY);
            const labels = Object.keys(item).filter(key => key !== '__EMPTY');
            const values = Object.values(item).filter(value => typeof value === 'number');

            const newChart = new Chart(ctx, {
                type: chartType,
                data: {
                    labels: labels,
                    datasets: [{
                        label: item.__EMPTY,
                        data: values,
                        backgroundColor: backgroundColor,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(54, 162, 235, 0.9)',
                        hoverBorderColor: 'rgba(54, 162, 235, 1)',
                    }]
                },
                options: {
                    // Chart options
                },
            });

            chartRefs.current.push(newChart);
        });
    };

    useEffect(() => {
        if (data.length > 0) {
            createCharts();
        }
    }, [data, chartType, backgroundColor]);

    const handleChartTypeChange = (event) => {
        setChartType(event.target.value);
    };

    const handleBackgroundColorChange = (event) => {
        setBackgroundColor(event.target.value);
    };

    return (
        <div className="container">
            <h1>Environmental Metrics Dashboard</h1>
            <input type="file" onChange={onFileChange} />
            <button onClick={onFileUpload}>
                Upload
            </button>
            <div className="chart-options">
                <label>Select Chart Type:</label>
                <select value={chartType} onChange={handleChartTypeChange}>
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="pie">Pie Chart</option>
                    {/* Add more chart types as needed */}
                </select>
                <label>Select Background Color:</label>
                <input type="color" value={backgroundColor} onChange={handleBackgroundColorChange} />
            </div>
            <div className="charts">
                {data.map(item => (
                    <div key={item.__EMPTY} className="chart-container">
                        <h2>{item.__EMPTY}</h2>
                        <canvas id={item.__EMPTY} width="400" height="200"></canvas>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FileUpload;
