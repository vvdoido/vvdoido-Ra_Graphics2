document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = 'faturamento.html';
});

const dataFromSessionFaturamento = JSON.parse(sessionStorage.getItem('workbookData'));

if (!dataFromSessionFaturamento || dataFromSessionFaturamento.length === 0) {
    console.error('Nenhum dado encontrado na sessionStorage.');
} else {
    const headers = dataFromSessionFaturamento[0];
    const opsIndex = headers.indexOf('OPS');
    const vlSolicitadoIndex = headers.indexOf('VL.Solicitado');

    const opsData = {};
    const vlSolicitadoData = [];

    dataFromSessionFaturamento.slice(1).forEach(row => {
        const opsValue = row[opsIndex];
        const vlSolicitadoValue = parseFloat(row[vlSolicitadoIndex]) || 0;

        if (opsValue !== undefined && vlSolicitadoValue > 0) {
            if (opsValue in opsData) {
                opsData[opsValue] += vlSolicitadoValue;
            } else {
                opsData[opsValue] = vlSolicitadoValue;
            }
            vlSolicitadoData.push(vlSolicitadoValue);
        }
    });

    const totalValue = vlSolicitadoData.reduce((sum, value) => sum + value, 0);

    const opsLabels = Object.keys(opsData);
    const opsValues = Object.values(opsData);

    const opsLabelsWithTotal = [...opsLabels, 'TOTAL'];
    const opsValuesWithTotal = [...opsValues, totalValue];

    const ctxLine = document.getElementById('vlSolicitadoLineChart').getContext('2d');
    new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: opsLabelsWithTotal,
            datasets: [{
                label: 'VL.Solicitado',
                data: opsValuesWithTotal,
                fill: false,
                borderColor: '#42a5f5',
                pointBackgroundColor: '#fbc02d',
                pointBorderColor: '#f57c00',
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        color: 'white',
                        font: {
                            size: 14
                        }
                    }
                },
                y: {
                    ticks: {
                        callback: function(value) {
                            return `R$ ${value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
                        },
                        color: 'white',
                        font: {
                            size: 17
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: 'white',
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return `Valor: R$ ${tooltipItem.raw.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
                        }
                    },
                    backgroundColor: '#333',
                    titleColor: '#fff',
                    bodyColor: '#fff'
                }
            },
            elements: {
                line: {
                    borderWidth: 2
                }
            }
        }
    });

    const pedidosData = dataFromSessionFaturamento.slice(1).map(row => ({
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

    const labelsPedidos = Object.keys(pedidoCounts);
    const valuesPedidos = Object.values(pedidoCounts);

    if (labelsPedidos.length === 0 || valuesPedidos.length === 0) {
        console.error('Nenhum dado válido para gerar o gráfico.');
    } else {
        const sortedData = labelsPedidos.map((label, index) => ({
            label: label,
            value: valuesPedidos[index]
        })).sort((a, b) => b.value - a.value);

        const sortedLabels = sortedData.map(item => item.label);
        const sortedValues = sortedData.map(item => item.value);

        const ctxPedidosChart = document.getElementById('pedidosChart').getContext('2d');
        new Chart(ctxPedidosChart, {
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

    const ctxQuantidade = document.getElementById('quantidadeChart').getContext('2d');
    const uniqueOps = new Set();
    let totalQnt = 0;

    const filteredData = [];

    dataFromSessionFaturamento.slice(1).forEach(row => {
        const opsValue = row[0];
        const qntValue = row[4];

        if (!uniqueOps.has(opsValue) && qntValue > 0) {
            uniqueOps.add(opsValue);
            filteredData.push(row);
            totalQnt += qntValue;
        }
    });

    const labelsQuantidade = filteredData.map(row => row[0]);
    const valuesQuantidade = filteredData.map(row => row[4]);

    new Chart(ctxQuantidade, {
        type: 'bar',
        data: {
            labels: labelsQuantidade,
            datasets: [{
                label: 'Quantidade de Peças',
                data: valuesQuantidade,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white',
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white',
                    }
                }
            }
        }
    });

    const ctxGroupChart = document.getElementById('groupChart').getContext('2d');

    const groupData = {};
    
    dataFromSessionFaturamento.slice(1).forEach(row => {
        const group = row[5];  
        const quantity = parseFloat(row[4]);  
    
        if (group && !isNaN(quantity)) {
            if (!groupData[group]) {
                groupData[group] = 0;
            }
            groupData[group] += quantity;
        }
    });
    
    const groupLabels = Object.keys(groupData);
    const groupValues = Object.values(groupData);
    
    if (groupLabels.length === 0 || groupValues.length === 0) {
        console.error('Nenhum dado válido para gerar o gráfico.');
    } else {
        new Chart(ctxGroupChart, {
            type: 'bar',
            data: {
                labels: groupLabels,
                datasets: [{
                    label: 'Quantidade por Grupo',
                    data: groupValues,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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
                        beginAtZero: true,
                        ticks: {
                            color: '#FFF',
                            callback: function(value) {
                                return `${value}`;
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#FFF',
                            font: {
                                size: 16
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#333',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        callbacks: {
                            label: function(tooltipItem) {
                                return `Quantidade: ${tooltipItem.raw}`;
                            }
                        }
                    }
                }
            }
        });
    }
}   