document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = 'grupos.html';  
});

document.getElementById('faturamentoButton').addEventListener('click', () => {
    window.location.href = 'faturamento.html';
});

const dataFromSession = JSON.parse(sessionStorage.getItem('workbookData'));

if (!dataFromSession || dataFromSession.length === 0) {
    console.error('Nenhum dado encontrado na sessionStorage.');
} else {
  
    const pedidosData = dataFromSession.slice(1).map(row => ({
        pedido: row[9], 
        ops: row[0]   
    }));

    const filteredPedidosData = pedidosData.filter(item => 
        item.pedido !== undefined && 
        item.pedido !== 'undefined' &&
        item.ops !== undefined && 
        item.ops !== 'undefined'
    );

    const uniqueOPS = new Set();
    const uniquePedidosData = []; 

    filteredPedidosData.forEach(item => {
        if (!uniqueOPS.has(item.ops)) {
            uniqueOPS.add(item.ops); 
            uniquePedidosData.push(item.pedido); 
        }
    });

    const pedidoCounts = uniquePedidosData.reduce((acc, pedido) => {
        acc[pedido] = (acc[pedido] || 0) + 1;
        return acc;
    }, {});

    const labels = Object.keys(pedidoCounts);
    const values = Object.values(pedidoCounts);

    if (labels.length === 0 || values.length === 0) {
        console.error('Nenhum dado válido para gerar o gráfico.');
    } else {
     
        const sortedData = labels.map((label, index) => ({
            label: label,
            value: values[index]
        })).sort((a, b) => b.value - a.value);

        const sortedLabels = sortedData.map(item => item.label);
        const sortedValues = sortedData.map(item => item.value);

        const ctxPedidosChart = document.getElementById('pedidosChart').getContext('2d');
        const pedidosChart = new Chart(ctxPedidosChart, {
            type: 'bar',
            data: {
                labels: sortedLabels,
                datasets: [{
                    label: 'Quantidade de Pedidos',
                    data: sortedValues,
                    backgroundColor: 'rgba(75, 192, 192, 0.5)', 
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#FFF',
                            font: {
                                size: 16
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#FFF',
                            font: {
                                size: 14
                            }
                        },
                        grid: {
                            display: false  
                        }
                    },
                    y: {
                        ticks: {
                            display: false,  
                        },
                        grid: {
                            display: false  
                        },
                        beginAtZero: true
                    }
                },
                layout: {
                    padding: {
                        left: 20,
                        right: 20,
                        top: 20,
                        bottom: 20
                    }
                }
            }
        });
    }
}
