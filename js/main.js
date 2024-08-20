const form = document.querySelector(".container .main .top-banner form");
const list = document.getElementById("ulcities");
let liElements = Array.from(document.getElementsByClassName("pop"));
let mainElements = document.getElementsByClassName("main");
const msg = document.getElementById("msg");
window.onclick = () => {
    msg.style.display = "none";
};
let code = "";
form.addEventListener("submit", e => {
    e.preventDefault();
    fetchData(list);
});
function fetchData(list) {
    const inputVal = document.getElementById("cityname").value;
    if (!inputVal) {
        showMsg(msg, "Please provide a city!");
        return;
    }
    const apiKey = "6b54e41b045e110dabdfd45d6e56e5c0";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            code = data.cod;
            const { main, name, sys, weather, id } = data;
            id ? check(id, list, msg) : "";
            // const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;
            const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]}.svg`;
            const li = document.createElement("li");
            li.classList.add("city");
            const markup = `
<h2 class="city-name" data-id="${id}">
<span>${name}</span>
<sup>${sys.country}</sup>
</h2>
<div class="city-temp">${Math.round(main.temp)}<sup>°C</sup>
</div>
<figure>
<img class="city-icon" src=${icon} alt=${weather[0]["main"]}>
<figcaption>${weather[0]["description"]}</figcaption>
</figure>
`;
            li.innerHTML = markup;
            // console.log(main, name, sys, weather, id);
            list.appendChild(li);
        })
        .catch(error => {
            if (code === "404") {
                showMsg(msg, "City not found.");
            } else {
                showMsg(
                    msg,
                    " City is already here!. <br/>Check info page for more details."
                );
            }
        });
    msg.textContent = "";
    form.reset();
}
function check(id, list, msg) {
    // console.log(id, list, msg);
    for (let i = 0; i < list.childNodes.length; i++) {
        if (id === +list.children[i].children[0].dataset.id) {
            throw new Error("City already excited");
        }
    }
}

function showMsg(msg, message, time = 5000) {
    msg.style.display = "block";
    msg.innerHTML = message;
    setTimeout(function () {
        msg.style.display = "none";
    }, time);
}

liElements.forEach(function (li) {
    li.addEventListener("click", function () {
        if (li.classList.contains("home")) {
            if (mainElements[0].classList.contains("none")) {
                mainElements[1].classList.add("none");
                mainElements[0].classList.remove("none");
            }
        } else {
            if (mainElements[1].classList.contains("none")) {
                mainElements[1].classList.remove("none");
                mainElements[0].classList.add("none");
            }
        }
        liElements.forEach(function (li) {
            li.classList.remove("indicator");
        });
        this.classList.add("indicator");
    });
});
