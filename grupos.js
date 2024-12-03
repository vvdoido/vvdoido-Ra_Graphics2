document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = 'charts.html';
});

document.getElementById('ordersButton').addEventListener('click', () => {
    window.location.href = 'pedidos.html';
});

const dataFromSession = JSON.parse(sessionStorage.getItem('workbookData'));

if (!dataFromSession || dataFromSession.length === 0) {
    console.error('Nenhum dado encontrado na sessionStorage.');
} else {
    const grupoData = dataFromSession.slice(1).map(row => row[5]); 
    const opsData = dataFromSession.slice(1).map(row => row[4]); 

    const groupOpsMap = {};

    dataFromSession.slice(1).forEach(row => {
        const group = row[5];
        const ops = row[4];

        if (group && ops) {
            if (!groupOpsMap[group]) {
                groupOpsMap[group] = new Set();
            }
            groupOpsMap[group].add(ops);
        }
    });

    const groupCounts = {};
    Object.keys(groupOpsMap).forEach(group => {
        groupCounts[group] = groupOpsMap[group].size; 
    });

    const labels = Object.keys(groupCounts);
    const values = Object.values(groupCounts);

    if (labels.length === 0 || values.length === 0) {
        console.error('Nenhum dado válido para gerar o gráfico.');
    } else {
        const sortedData = labels.map((label, index) => ({
            label: label,
            value: values[index]
        })).sort((a, b) => b.value - a.value);

        const sortedLabels = sortedData.map(item => item.label);
        const sortedValues = sortedData.map(item => item.value);

        const ctxGroupBar = document.getElementById('groupChart').getContext('2d');
        new Chart(ctxGroupBar, {
            type: 'bar',
            data: {
                labels: sortedLabels,
                datasets: [{
                    label: 'Quantidade de Grupos (OPS únicos)',
                    data: sortedValues,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            display: false,
                        },
                        grid: {
                            display: false,
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'white',
                            font: {
                                size: 14
                            }
                        },
                        grid: {
                            display: false,
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false 
                    },
                    tooltip: {
                        backgroundColor: '#333',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        callbacks: {
                            label: (tooltipItem) => {
                                return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                            }
                        }
                    },
                    datalabels: {
                        display: true,
                        color: 'white',
                        formatter: (value) => value,
                        font: {
                            weight: 'bold',
                            size: 14
                        }
                    }
                }
            }
        });

        const groupPieData = dataFromSession.slice(1).reduce((acc, row) => {
            const group = row[5];
            const quantity = parseInt(row[4], 10);
            if (group && !isNaN(quantity)) {
                acc[group] = (acc[group] || 0) + quantity;
            }
            return acc;
        }, {});

        const pieLabels = Object.keys(groupPieData);
        const pieValues = Object.values(groupPieData);

        if (pieLabels.length === 0 || pieValues.length === 0) {
            console.error('Nenhum dado válido para gerar o gráfico de pizza.');
        } else {
            const ctxGroupPie = document.getElementById('groupPieChart').getContext('2d');
            new Chart(ctxGroupPie, {
                type: 'pie',
                data: {
                    labels: pieLabels,
                    datasets: [{
                        data: pieValues,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.7)', 
                            'rgba(54, 162, 235, 0.7)', 
                            'rgba(255, 206, 86, 0.7)', 
                            'rgba(75, 192, 192, 0.7)', 
                            'rgba(153, 102, 255, 0.7)' 
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'right',
                            labels: {
                                color: 'white'
                            }
                        },
                        tooltip: {
                            backgroundColor: '#333',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            callbacks: {
                                label: (tooltipItem) => {
                                    return `${tooltipItem.label}: ${tooltipItem.raw}`;
                                }
                            }
                        },
                        datalabels: {  
                            display: true,  
                            color: 'white', 
                            formatter: (value, context) => {
                                const label = context.chart.data.labels[context.dataIndex];
                                return `${label}: ${value}`;  
                            },
                            font: {
                                weight: 'bold',
                                size: 14
                            }
                        }
                    }
                }
            });
        }
    }
}
