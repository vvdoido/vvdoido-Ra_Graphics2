document.getElementById('fileUpload').addEventListener('change', handleFile, false);
document.getElementById('chartsButton').addEventListener('click', goToChartsPage, false);
document.getElementById('logoutButton').addEventListener('click', function() {
    window.location.href = 'index.html';
});

let workbookData = [];
let filteredData = [];
const rowsPerPage = 20; 
let currentPage = 1;

async function handleFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    document.getElementById('loadingMessage').style.display = 'block';
    document.getElementById('fileUpload').style.display = 'none';
    document.getElementById('fileUploadImage').style.display = 'none'; 

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    workbookData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    filteredData = workbookData.slice(); 

    document.getElementById('loadingMessage').style.display = 'none'; 
    displayTable(filteredData, 1); 

    document.getElementById('globalSearch').addEventListener('input', filterTable);
}

function goToChartsPage() {
    if (filteredData.length) {
        sessionStorage.setItem('workbookData', JSON.stringify(filteredData));
        window.location.href = 'charts.html';
    } else {
        alert('Por favor, carregue uma planilha primeiro.');
    }
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function tryParseCurrency(value) {
    if (typeof value === 'string' && value.includes('*')) {
        return formatCurrency(0);
    } else if (typeof value === 'string' && value.includes(',')) {
        const numericValue = parseFloat(
            value.replace(/[^\d,-]/g, '').replace(',', '.')
        );
        return formatCurrency(numericValue);
    } else if (!isNaN(value)) {
        return formatCurrency(value);
    }
    return value;
}

function displayTable(data, page) {
    if (!data || data.length === 0) {
        document.getElementById('spreadsheetContent').innerHTML = '<p>Nenhum dado disponível</p>';
        return;
    }

    const startRow = (page - 1) * rowsPerPage + 1;
    const endRow = Math.min(startRow + rowsPerPage - 1, data.length - 1); 

    let table = '<table class="table table-dark table-striped">';
    table += '<thead><tr>';
    
    data[0].forEach(header => table += `<th>${header}</th>`);
    table += '</tr></thead><tbody>';

    for (let i = startRow; i <= endRow; i++) {
        table += '<tr>';
        data[i].forEach((cell, index) => {
            if (index === 10) { // Coluna 11 (índice 10) - formato de moeda
                table += `<td>${tryParseCurrency(cell)}</td>`;
            } else if (index === 11) { // Coluna 12 (índice 11) - valor numérico sem formatação especial
                table += `<td>${cell}</td>`;
            } else {
                table += `<td>${cell || ''}</td>`;
            }
        });
        table += '</tr>';
    }

    table += '</tbody></table>';
    document.getElementById('spreadsheetContent').innerHTML = table;
    setupPagination(data, page); 
}

function filterTable() {
    const searchValue = document.getElementById('globalSearch').value.toLowerCase();

    filteredData = workbookData.filter((row, rowIndex) => {
        if (rowIndex === 0) return true;

        return row.some(cell => {
            return (cell || '').toString().toLowerCase().includes(searchValue);
        });
    });

    displayTable(filteredData, 1); 
}

function setupPagination(data, currentPage) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil((data.length - 1) / rowsPerPage);

    for (let page = 1; page <= totalPages; page++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = page;
        pageButton.className = 'btn btn-primary mx-1';
        pageButton.disabled = page === currentPage;
        pageButton.addEventListener('click', () => displayTable(data, page));
        pagination.appendChild(pageButton);
    }
}
