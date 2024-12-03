document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = 'pedidos.html'; 
});

document.getElementById('dashboardButton').addEventListener('click', () => {
    window.location.href = 'dashboard.html';
});


const dataFromSession = JSON.parse(sessionStorage.getItem('workbookData'));

if (!dataFromSession || dataFromSession.length === 0) {
    console.error('Nenhum dado encontrado na sessionStorage.');
} else {
    const headers = dataFromSession[0];
    const opsIndex = headers.indexOf('OPS');
    const vlSolicitadoIndex = headers.indexOf('VL.Solicitado');

    const opsData = {};
    const vlSolicitadoData = [];

   
    dataFromSession.slice(1).forEach(row => {
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

  
    const ctxFaturamento = document.getElementById('faturamentoChart').getContext('2d');
    const faturamentoLabels = opsLabels; 
    const faturamentoValues = opsValues.map(value => value * 1.1); 

    new Chart(ctxFaturamento, {
        type: 'bar',
        data: {
            labels: faturamentoLabels,
            datasets: [{
                label: 'Faturamento',
                data: faturamentoValues,
                backgroundColor: '#4caf50'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return `R$ ${value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
                        },
                        color: 'white', 
                        font: {
                            size: 14
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
                            return `Faturamento: R$ ${tooltipItem.raw.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
                        }
                    },
                    backgroundColor: '#333', 
                    titleColor: '#fff', 
                    bodyColor: '#fff'   
                }
            },
            elements: {
                bar: {
                    borderWidth: 1 
                }
            }
        }
    });
}
