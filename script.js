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
