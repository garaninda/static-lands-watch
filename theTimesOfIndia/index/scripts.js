$('[data-goto]').on('click', function (e) {
    e.preventDefault();
    let that = $(this).data('goto');
    $("html, body").animate({scrollTop: $(that).offset().top - 300}, 1500);
    return false;
});

const now = new Date();

const year = document.querySelectorAll('.year');
for (let i = 0; i < year.length; ++i) {
    year[i].innerHTML = now.getFullYear();
}

let todayTxt = now.toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit' });
const today = document.querySelectorAll('.today');
for (let i = 0; i < today.length; ++i) {
    today[i].innerHTML = todayTxt;
}

function setTimeAgo(selector, minutesAgo) {
    const date = new Date(now);
    date.setMinutes(date.getMinutes() - minutesAgo);

    const options = { hour: 'numeric', minute: '2-digit', hourCycle: 'h23' };
    const timeTxt = date.toLocaleTimeString('en-IN', options);

    const elements = document.querySelectorAll(selector);
    for (let i = 0; i < elements.length; ++i) {
        elements[i].innerHTML = timeTxt;
    }
}

setTimeAgo('.time', 334);

function decreaseCounter() {
    const counterElement = document.getElementById('steps-widget-remain');
    let currentValue = parseInt(counterElement.textContent.trim());

    if (currentValue > 3) {

        const randomInterval = Math.floor(Math.random() * 25000) + 5000;

        counterElement.textContent = currentValue - 1;

        setTimeout(decreaseCounter, randomInterval);
    }
}

decreaseCounter();
