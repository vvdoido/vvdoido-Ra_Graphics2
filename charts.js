document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = 'gerador.html';
});

const dataFromSession = JSON.parse(sessionStorage.getItem('workbookData'));

if (!dataFromSession || dataFromSession.length === 0) {
    console.error('Nenhum dado encontrado na sessionStorage.');
} else {
    
    const uniqueOps = new Set();
    let totalQnt = 0;

    const filteredData = [];
    
    dataFromSession.slice(1).forEach(row => {
        const opsValue = row[0];
        const qntValue = row[4]; 

        if (!uniqueOps.has(opsValue) && qntValue > 0) {
            uniqueOps.add(opsValue);
            filteredData.push(row); 
            totalQnt += qntValue;    
        }
    });

    console.log("Total QNT corrigido:", totalQnt);

    const labels = filteredData.map(row => row[0]);  
    const values = filteredData.map(row => row[4]);  

    const ctxBar = document.getElementById('chart').getContext('2d');
    const myChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Quantidade',
                data: values,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
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

    const setorData = filteredData.map(row => row[7]); 

    const pcpCount = setorData.filter(setor => setor === 'PPCP').length;
    const produtoCount = setorData.filter(setor => setor === 'PRODUTO').length;
    const validRecords = produtoCount + pcpCount; 

    const pcpPercentage = (pcpCount / validRecords) * 100;
    const produtoPercentage = (produtoCount / validRecords) * 100;

    const grupoData = filteredData.map(row => row[5]); 
}

document.getElementById('gruposButton').addEventListener('click', () => {
    window.location.href = 'grupos.html';
});
