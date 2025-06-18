let holidayData = [];

window.onload = function() {
    fetchData(2025);
};

async function  fetchData(year) {
    try {
        const response = await fetch('https://date.nager.at/api/v3/publicholidays/' + year + '/EE');

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        holidayData = await response.json();
        console.log(holidayData);

        const isGrouped = document.getElementById('check').checked; 

        if (isGrouped) {
            renderHolidaysMonthly(holidayData);
        } else {
            renderHolidays(holidayData);
        }
        
    }
    catch(error) {
        console.error("Couldn't fetch the holiday data: ", error);
        
    }
}

function holidayColorCoding(currentDate, holidayDate) {
    let timeDifference = holidayDate - currentDate;
    let daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)); //converting from ms to days 

    if (daysDifference < 0) { //marking past holidays with gray
        return 'gray'; 
    } else if (daysDifference <= 14) { //upcoming holidays marked with green
        return '#28b546';
    } else if (daysDifference <= 30) { //holidays less than or 1 months away marked with yellow
        return 'yellow';
    } else if (daysDifference <= 60) { //holidays less than or 2 months away marked with orange
        return 'orange';
    } else { //the rest is marked with red, signalling that it's far away
        return '#db5942';
    }
}

function renderHolidays(data) {
    const contentContainer = document.getElementById('content');
    contentContainer.innerHTML = ''; //to clear previous content when selecting a year 

    const currentDate = new Date();

    for (let i = 0; i < data.length; i++) {
        const holidayContainer = document.createElement('div');
        holidayContainer.className = 'holiday_container';
        const innerContainer = document.createElement('div');
        innerContainer.className = 'inner_container';
        innerContainer.id = 'inner_container';
        const capsule1 = document.createElement('div');
        capsule1.className = 'capsule1';
        capsule1.id = 'capsule1';
        const capsule2 = document.createElement('div');
        capsule2.className = 'capsule2';
        
        const date = new Date(data[i].date);
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        capsule1.innerHTML = '<b>' + days[date.getDay()] + '</b> <br> <p>' + months[date.getMonth()].slice(0, 3) + ' ' + date.getDate() + ', ' + date.getFullYear() + '</p>';
        capsule2.innerHTML = '<b>' + data[i].localName + '</b> <br> <p>' + data[i].name + '</p>';

        const outlineColor = holidayColorCoding(currentDate, date);
        capsule1.style.outline = '2px solid ' + outlineColor;

        innerContainer.appendChild(capsule1);
        innerContainer.appendChild(capsule2);
        holidayContainer.appendChild(innerContainer);
        contentContainer.appendChild(holidayContainer);
        console.log(data[i].localName);
        console.log(capsule1.id);
    }
}

function renderHolidaysMonthly(data) {
    const contentContainer = document.getElementById('content');
    contentContainer.innerHTML = ''; //to clear previous content when selecting a year 

    const currentDate = new Date();
    let currentMonth = -1;

    for (let i = 0; i < data.length; i++) {
        const holidayContainer = document.createElement('div');
        holidayContainer.className = 'holiday_container';
        const innerContainer = document.createElement('div');
        innerContainer.className = 'inner_container';
        innerContainer.id = 'inner_container';
        const capsule1 = document.createElement('div');
        capsule1.className = 'capsule1';
        capsule1.id = 'capsule1';
        const capsule2 = document.createElement('div');
        capsule2.className = 'capsule2';
        
        const date = new Date(data[i].date);
        const month = date.getMonth();
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        if (month !== currentMonth) { //to group together holidays that fall under the same month
            currentMonth = month;
            const monthHeader = document.createElement('div');
            monthHeader.className = 'month_header';
            monthHeader.innerHTML = '<p>' + months[month] + '</p>';
            holidayContainer.appendChild(monthHeader);
        }

        capsule1.innerHTML = '<b>' + days[date.getDay()] + '</b> <br> <p>' + months[date.getMonth()].slice(0, 3) + ' ' + date.getDate() + ', ' + date.getFullYear() + '</p>';
        capsule2.innerHTML = '<b>' + data[i].localName + '</b> <br> <p>' + data[i].name + '</p>';

        const outlineColor = holidayColorCoding(currentDate, date);
        capsule1.style.outline = '2px solid ' + outlineColor;

        innerContainer.appendChild(capsule1);
        innerContainer.appendChild(capsule2);
        holidayContainer.appendChild(innerContainer);
        contentContainer.appendChild(holidayContainer);
        console.log(data[i].localName);
        console.log(capsule1.id);
    }
}

function switchThemes() {
    var button = document.getElementById('switch');
    var body = document.body;
    var elements = document.querySelectorAll('.holiday_container, .inner_container, .capsule1, .title-container');

    body.classList.toggle('darkmode');

    if (button.innerHTML === 'Toggle dark mode') {
        button.innerHTML = 'Toggle light mode';
        body.classList.add('dark');
        elements.forEach(element => {
            element.classList.add('dark');
        });

    } else {
        button.innerHTML = 'Toggle dark mode';
        body.classList.remove('dark');
        elements.forEach(element => {
            element.classList.remove('dark');
        });
    }

}

function toggleGrouping() {
    const isGrouped = document.getElementById('check').checked;

    if (isGrouped) {
        renderHolidaysMonthly(holidayData);
    } else {
        renderHolidays(holidayData);
    }
}

function searchHoliday() {
    const searchValue = document.getElementById('searchbar').value.toLowerCase();
    if (holidayData.length === 0) return; //to make sure there is data before moving on 
    const filteredHoliday = holidayData.filter(holiday => { 
        return holiday.name.toLowerCase().includes(searchValue) || holiday.localName.toLowerCase().includes(searchValue);
    });

    console.log('Filtered Holidays:', filteredHoliday);

    renderHolidays(filteredHoliday);
    
}

document.getElementById('searchbar').addEventListener('input', searchHoliday);
