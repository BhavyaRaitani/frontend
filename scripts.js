document.getElementById('jsonForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const jsonInput = document.getElementById('jsonInput').value;
    const errorElement = document.getElementById('error');
    const dropdownContainer = document.getElementById('dropdownContainer');
    
    try {
        const jsonData = JSON.parse(jsonInput);
        
        // Clear previous errors
        errorElement.textContent = '';

        // Show the dropdown after valid JSON
        dropdownContainer.style.display = 'block';

        // Submit JSON to backend
        const response = await fetch('http://localhost:5000/bfhl', { // Replace with your backend URL
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonData)
        });
        const data = await response.json();
        document.getElementById('applyFilter').addEventListener('click', () => applyFilter(data));

    } catch (error) {
        // Show error if JSON is invalid
        errorElement.textContent = 'Invalid JSON format.';
        document.getElementById('response').textContent = '';
        dropdownContainer.style.display = 'none';
    }
});

function applyFilter(data) {
    const selectedOptions = Array.from(document.getElementById('filter').selectedOptions).map(option => option.value);
    let filteredData = data.data || [];

    if (selectedOptions.includes('alphabets')) {
        filteredData = filteredData.filter(item => isNaN(item));
    }
    if (selectedOptions.includes('numbers')) {
        filteredData = filteredData.filter(item => !isNaN(item));
    }
    if (selectedOptions.includes('highestLowercase')) {
        const lowercaseItems = filteredData.filter(item => /^[a-z]$/.test(item));
        const highest = lowercaseItems.length ? Math.max(...lowercaseItems.map(item => item.charCodeAt(0))) : null;
        filteredData = highest !== null ? [String.fromCharCode(highest)] : [];
    }

    document.getElementById('response').textContent = `Filtered Data: ${JSON.stringify(filteredData)}`;
}
