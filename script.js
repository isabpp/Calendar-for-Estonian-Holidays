let holidayData = [];

window.onload = function() {
    fetchData(2024);
};

async function  fetchData(year) {
    try {
        const response = await fetch('https://date.nager.at/api/v3/publicholidays/' + year + '/EE');

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        holidayData = await response.json();
        console.log(holidayData);

        renderHolidays(holidayData);
    }
    catch(error) {
        console.error("Couldn't fetch the holiday data: ", error);
        
    }
}

function renderHolidays(data) {
    const contentContainer = document.getElementById('content');

    for (let i = 0; i < data.length; i++) {
        const holidayContainer = document.createElement('div');
        holidayContainer.className = 'holiday-container';

        holidayContainer.innerHTML = '<p>' + data[i].localName + '</p>';

        contentContainer.appendChild(holidayContainer);
        console.log(data[i].localName);
    }
}
