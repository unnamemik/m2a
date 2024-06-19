//Const

const urlParts = window.location.href.split('/');
const currentPage = urlParts[5];
const currentLang = urlParts[3].length === 2 ? urlParts[3] : 'am';


//Validation & Inputs Logic

const emailInputs = document.querySelectorAll('input[type=email]');

const mailRe = /\S+@\S+\.\S+/;

emailInputs?.forEach((input) => {
    input.addEventListener('change', ()=> {
        const value = input.value;
        if (mailRe.test(value)) {
            input.classList.remove('invalid');
        } else {
            input.classList.add('invalid');
        }
    })
})

const passwordInputs = document.querySelectorAll('input[type=password]');

passwordInputs?.forEach((input) => {
    const toggleVisionButton = input.parentNode.querySelector('.vision-icon');

    toggleVisionButton.addEventListener('click', ()=> {
        if (toggleVisionButton.classList.contains('true')) {
            input.type = 'text';
            toggleVisionButton.classList.remove('true');
            toggleVisionButton.classList.add('false');
        } else {
            input.type = 'password';
            toggleVisionButton.classList.remove('false');
            toggleVisionButton.classList.add('true');
        }
    })
})

//Update current page style in sidebar

const sidebar = document.querySelector('.profile-sidebar');
const sidebarLinks = sidebar?.querySelectorAll('.nav-item');

sidebarLinks?.forEach((elem) => {
    elem.classList.remove('current');
    const page = elem.href.split('/')[5];
    if (currentPage === page) {
        elem.classList.add('current');
    }
})

//Change Password popup open & close

const changePasswordButton = document.querySelector('.change-password-button');


changePasswordButton?.addEventListener('click', () => {
    const popup = document.querySelector('#change_password_popup');
    popup.style.display = 'flex';

    const closeButton = popup.querySelector('.close-button');
    closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        popup.style.display = 'none';
    })
})



//Stats sidebar calendar logic

const INITIAL_RANGE = {
    FROM: '11.10.2023',
    TO: '19.02.2024'
}

let MOCK_FROM = INITIAL_RANGE.FROM;
let MOCK_TO = INITIAL_RANGE.TO;

const currentDate = document.querySelector('.current-date');
const daysList = document.querySelector('.days');
const monthChangeButtons = document.querySelectorAll('.month-picker .calendar-arrow');

const getDateStringUsa = (date) => {

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`

}

const getDateString = (date) => {

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day < 10 ? '0' : ''}${day}.${month < 10 ? '0' : ''}${month}.${year}`;

}

const getMonthString = async (index) => {
    return await fetch(`/assets-v2/locales/${currentLang}.json`)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            return data[`month-${index}`]
        });
}

let date = new Date();
let currYear = date.getFullYear();
let currMonth = date.getMonth();

let selectedDays = [];

let range = 7;
let from = new Date();
let to  = new Date();
from.setDate(from.getDate() - range);

monthChangeButtons?.forEach((button) => {
    button.addEventListener('click', () => {
        const nextDate = new Date(currYear, currMonth + 1);
        const prevDate = new Date(currYear, currMonth - 1);

        const getMonthToCheck = (a, b) => {
            if (a.getFullYear() > b.getFullYear()) {
                return false
            }
            return a.getMonth() < b.getMonth();
        }

        if (button.classList.contains('prev') && getMonthToCheck(prevDate, parseDate(MOCK_FROM))) {
            // console.log(prevDate.getMonth())
            // console.log(parseDate(MOCK_FROM).getMonth())
            return;
        }

        if (button.classList.contains('next') && nextDate > parseDate(MOCK_TO)) {
            // console.log(1)
            return;
        }

        currMonth = button.classList.contains('prev') ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth);
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        }

        renderCalendar();
    });
});

const statsRangeButtons = document.querySelectorAll('.stats-arrow');
const statsCurrentRange = document.querySelector('.stats-current-month');
const statsCurrentRanges = document.querySelectorAll('.stats-current-month');

// let range = 10;
// let from = new Date();
// let to  = new Date();
// from.setDate(from.getDate() - range);

const handleButtonClick = async (event) => {
    // console.log(params);
    if (range === 0) return;

    const daysToAdd = event.target.parentNode.classList.contains('prev') ? -range : range;

    console.log(event.target);

    from.setDate(from.getDate() + daysToAdd);
    to.setDate(to.getDate() + daysToAdd);

    for (const elem of statsCurrentRanges) {
        elem.innerText = statsCurrentRange.innerText = `${from.getDate()} ${from.getMonth() !== to.getMonth() ? await getMonthString(from.getMonth()) : ''} - ${to.getDate()} ${await getMonthString(to.getMonth())}`;
    }

    $('#date_from').html(getDateStringUsa(from));
    $('#date_to').html(getDateStringUsa(to));
    load_charts()

    console.log(getDateString(from))
    console.log(getDateString(to))
}

const renderGraphRangePicker = async (...params) => {
    // console.log(from);

    console.log(params);
    
    if (params.length > 0) {
        from = params[0];
        to = params[1];
        range = params[2];
    }

    console.log(from instanceof Date && !isNaN(from));
    
    if (from instanceof Date && !isNaN(from)) {
      console.log('ok!');
    } else {
      from = parseDate(MOCK_FROM);
      to = parseDate(MOCK_TO);
      range = 0;
    }
    const getMonthString = async (index) => {
        return await fetch(`/assets-v2/locales/${currentLang}.json`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                return data[`of-month-${index}`]
            });
    }

    for (const elem of statsCurrentRanges) {
        console.log(to);
        elem.innerText = statsCurrentRange.innerText = `${from.getDate()} ${from.getMonth() !== to.getMonth() ? await getMonthString(from.getMonth()) : ''}${!isNaN(to) ? ` - ${to.getDate()} ${await getMonthString(to.getMonth())}` : ''}`;
    }

    for (const button of statsRangeButtons) {
        button?.removeEventListener('click', handleButtonClick);
        button?.addEventListener('click', handleButtonClick);
    }
}

const updateSelectedDays = async () => {
    selectedDays = [];
    const activeDays = document.querySelectorAll('.day.active');
    const days = document.querySelectorAll('.day.valid');
    days.forEach(day => day.style.background = 'transparent');
    days.forEach(day => day.style.borderRadius = '0');
    activeDays?.forEach((day) => {
        selectedDays.push(day.textContent)
    });

    const from = selectedDays[0];
    const to = selectedDays[1];

    if (selectedDays.length > 1) {

        const rangeDays = [...days].slice(from - 1, to);
        rangeDays[0].style.borderRadius = '10px 0 0 10px';
        rangeDays[rangeDays.length - 1].style.borderRadius = '0 10px 10px 0';
        rangeDays.forEach((day) => {
            day.style.background = 'rgba(248, 153, 52, 0.15)';
        })
    }

    const fromDate = new Date(currYear, currMonth, from);
    const toDate = new Date(currYear, currMonth, to);

    $('#date_from').html(getDateStringUsa(fromDate));
    $('#date_to').html(getDateStringUsa(toDate));
    load_charts()

    console.log(getDateString(fromDate));
    console.log(getDateString(toDate));

    await renderGraphRangePicker(fromDate, toDate, 0);
}


const renderCalendar = async (from = MOCK_FROM, to = MOCK_TO) => {
    console.log(from);
    console.log(to);

    selectedDays = [];

    let firstDayOfMonth =  new Date(currYear, currMonth, 1).getDay(),
        lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate(),
        lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth).getDay(),
        lastDateOfPrevMonth = new Date(currYear, currMonth, 0).getDate();


    let daysListInner = '';

    for (let i = firstDayOfMonth -1; i > 0; i--) {
        daysListInner += `<li class="day"><span>${lastDateOfPrevMonth - i + 1}</span></li>`;
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
        const currentDate = new Date(currYear, currMonth, i);
        const isValid = currentDate >= parseDate(from) && currentDate <= parseDate(to);
        daysListInner += `<li class="day${isValid ? ' valid' : ''}"><span>${i}</span></li>`;
    }

    if (lastDayOfMonth > 0) {
        for (let i = lastDayOfMonth; i < 7; i++) {
            daysListInner += `<li class="day"><span>${i - lastDayOfMonth + 1}</span></li>`;
        }
    }

    daysList.innerHTML = daysListInner;
    currentDate.innerText = `${await getMonthString(currMonth)} ${currYear}`;

    const days = document.querySelectorAll('.day.valid');

    days.forEach((day) => {

        day.addEventListener('click', () => {
            if (!selectedDays.includes(day.textContent)) {
                if (selectedDays.length < 2) {
                    day.classList.add('active');
                } else {
                    const activeDays = document.querySelectorAll('.day.active');
                    if (+day.innerText < +activeDays[0].innerText) {
                        activeDays[0].classList.remove('active');
                        day.classList.add('active');
                    } else {
                        activeDays[1].classList.remove('active');
                        day.classList.add('active');
                    }
                }
            } else {
                day.classList.remove('active');
            }
            updateSelectedDays();
        });
    })
}

const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day);
}

await  renderGraphRangePicker();

if (currentDate !== undefined && daysList) {
    renderCalendar();
}

//Filters logic

// for (const elem of statsCurrentRanges) {
//     elem.innerText = statsCurrentRange.innerText = `${fromDay.getDate()} ${fromDay.getMonth() !== toDay.getMonth() ? await getMonthString(fromDay.getMonth()) : ''} - ${toDay.getDate()} ${await getMonthString(toDay.getMonth())}`;
// }

const showAllToggle = document.querySelector('.show-all-container .toggle-checkbox')

showAllToggle?.addEventListener('click', async () => {
    if (showAllToggle.checked) {
        console.log(MOCK_FROM);
        console.log(MOCK_TO);
        // renderCalendar();
        await renderGraphRangePicker(parseDate(MOCK_FROM), parseDate(MOCK_TO), 0);
        $('#date_from').html(MOCK_FROM);
        $('#date_to').html(MOCK_TO);
        load_charts();
    }
});

const dayRangeInput = document.querySelector('#stats_period_day');

dayRangeInput?.addEventListener('click', async () => {
    const today = new Date();
    console.log(getDateString(today));

    // renderCalendar(getDateString(today), getDateString(today));
    await renderGraphRangePicker(today, today, 0);
    showAllToggle.checked = false;
    $('#date_from').html(MOCK_FROM);
    $('#date_to').html(MOCK_TO);
    load_charts();
})

const weekRangeInput = document.querySelector('#stats_period_week');

weekRangeInput?.addEventListener('click', async () => {
    let to = new Date();
    let from = new Date();
    from.setDate(from.getDate() - 7)
    console.log(getDateString(from));
    console.log(getDateString(to));

    // renderCalendar(getDateString(from), getDateString(to));
    await renderGraphRangePicker(from, to, 7);
    showAllToggle.checked = false;

    $('#date_from').html(getDateStringUsa(from));
    $('#date_to').html(getDateStringUsa(to));
    load_charts()
})

const monthRangeInput = document.querySelector('#stats_period_month');

monthRangeInput?.addEventListener('click', async () => {
    let to = new Date();
    // let lastDateOfMonth = new Date(from.getFullYear(), from.getMonth() + 1, 0).getDate();
    let from = new Date();
    // to.setDate(to.getDate() + (lastDateOfMonth - 1))
    from.setDate(to.getDate() - 30)
    console.log(getDateString(from));
    console.log(getDateString(to));

    // renderCalendar(getDateString(from), getDateString(to));
    await renderGraphRangePicker(from, to, 30);
    showAllToggle.checked = false;

    $('#date_from').html(getDateStringUsa(from));
    $('#date_to').html(getDateStringUsa(to));
    load_charts()
})


//Stats graph tabs switch logic

const tabButtons = document.querySelectorAll('.sales-graph .tab');
const tabSections = document.querySelectorAll('.sales-graph .card');

if (tabSections.length) {
    tabSections[1].style.display = 'none';

    tabButtons.forEach((tab, i) => {
        tab.addEventListener('click', () => {
            tabButtons.forEach((button) => {
                button.classList.remove('active');
            })
            tab.classList.add('active');
            tabSections.forEach((section) => {
                section.style.display = 'none';
            })
            tabSections[i].style.display = 'flex';
            renderCalendar();
        })
    })
}

//Stats table dropdown logic

const statsTableRows = document.querySelectorAll('.stats-table-row');
const statsTableDropdowns = document.querySelectorAll('.table-dropdown');

statsTableRows?.forEach((row) => {
    const toggleButton = row.querySelector('.table-button-cell');
    const dropdownSelector = `#${row.id}.table-dropdown`;
    const rowDropdowns = document.querySelectorAll(dropdownSelector);

    toggleButton.addEventListener('click', () => {
        statsTableDropdowns.forEach(elem => elem.style.display = 'none')

        if (toggleButton.classList.contains('active')) {
            toggleButton.classList.remove('active');
            rowDropdowns.forEach(row => row.style.display = 'none')
            return;
        }

        toggleButton.classList.add('active');
        rowDropdowns.forEach(row => row.style.display = 'table-row')
    })
})