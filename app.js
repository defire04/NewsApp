import { createElement } from "./createElement.js";

// Custom Http Module
function customHttp() {
    return {
        get(url, cb) {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open("GET", url);
                xhr.addEventListener("load", () => {
                    if (Math.floor(xhr.status / 100) !== 2) {
                        cb(`Error. Status code: ${xhr.status}`, xhr);
                        return;
                    }
                    const response = JSON.parse(xhr.responseText);
                    cb(null, response);
                });

                xhr.addEventListener("error", () => {
                    cb(`Error. Status code: ${xhr.status}`, xhr);
                });

                xhr.send();
            } catch (error) {
                cb(error);
            }
        },
        post(url, body, headers, cb) {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open("POST", url);
                xhr.addEventListener("load", () => {
                    if (Math.floor(xhr.status / 100) !== 2) {
                        cb(`Error. Status code: ${xhr.status}`, xhr);
                        return;
                    }
                    const response = JSON.parse(xhr.responseText);
                    cb(null, response);
                });

                xhr.addEventListener("error", () => {
                    cb(`Error. Status code: ${xhr.status}`, xhr);
                });

                if (headers) {
                    Object.entries(headers).forEach(([key, value]) => {
                        xhr.setRequestHeader(key, value);
                    });
                }

                xhr.send(JSON.stringify(body));
            } catch (error) {
                cb(error);
            }
        },
    };
}

// Init http module
const http = customHttp();

const newsService = (function () {
    const apiKey = "65238e200f684b9783f1e9366624f6fd";
    const apiUrl = "https://newsapi.org";

    return {
        topHeadlines(country = "ua", callback) {
            const url = new URL("v2/top-headlines", apiUrl);
            const parameter = new URLSearchParams(url.search);
            parameter.set("country", country);
            parameter.set("category", "technology");
            parameter.set("apiKey", apiKey);
            url.search = parameter.toString();

            http.get(url.toString(), callback);
        },
        everything(query, callback) {
            const url = new URL("v2/everything", apiUrl);
            const parameter = new URLSearchParams(url.search);
            parameter.set("q", query);
            parameter.set("apiKey", apiKey);

            url.search = parameter.toString();

            http.get(url.toString(), callback);
        },
    };
})();

// Elements
const form = document.forms["newsControls"];
const countrySelect = form.elements["country"];
const searchInput = form.elements["search"];

form.addEventListener("submit", (event) => {
    event.preventDefault();
    loadNews();
});

document.addEventListener("DOMContentLoaded", function () {
    loadNews();
});

// Load news function
function loadNews() {
    showLoader();
    const country = countrySelect.value || "ua";
    const searchText = searchInput.value;

    if (!searchText) {
        newsService.topHeadlines(country, onGetResponse);
    } else {
        newsService.everything(searchText, onGetResponse);
    }
}

// Function on get response from server
function onGetResponse(error, response) {
    // console.log(response);

    if (error) {
        console.log(error);
        return;
    }

    if (!response.articles.length) {
        console.log("No news found for your search");
        showEmptyMessage();
        return;
    }
    renderNews(response.articles);
}

// Function render news
function renderNews(news) {
    const newsContainer = document.getElementById("news-container");

    if (newsContainer.children.length) {
        clearContainer(newsContainer);
    }
    const fragment = document.createDocumentFragment();
    // let fragment = "";

    news.forEach((newsItem) => {
        const el = newsTemplate(newsItem);
        fragment.append(el);
        // fragment += el;
    });

    newsContainer.prepend(fragment);

    // newsContainer.insertAdjacentHTML('afterbegin', fragment);
}

// News item template
function newsTemplate({ urlToImage, title, url, description }) {
    return createElement("div", { class: "card" }, [
        createElement("div", { class: "card-image" }, [
            createElement("img", {
                src:
                    urlToImage ||
                    "https://media.discordapp.net/attachments/1018916450888593459/1051505824419303534/image.png",
                onError(event) {
                    console.log(urlToImage);
                    event.target.src =
                        "https://media.discordapp.net/attachments/1018916450888593459/1051505824419303534/image.png";
                },
            }),
            createElement("span", { class: "card-title" }, title || ""),
        ]),
        createElement("div", { class: "card-content" }, [
            createElement("p", {}, description || ""),
        ]),
        createElement("div", { class: "card-action" }, [
            createElement("a", { href: url }, "Read more!"),
        ]),
    ]);
}

function showEmptyMessage() {
    const newsContainer = document.getElementById("news-container");
    newsContainer.append(newsEmptyTemplate());
}

function newsEmptyTemplate() {
    return createElement(
        "div",
        { class: "empty-message" },
        "No news found for your search"
    );
}

// Function clear
function clearContainer(container) {
    // container.innerHtml = "";
    let child = container.lastElementChild;
    while (child) {
        container.removeChild(child);
        child = container.lastElementChild;
    }
}

function showLoader() {
    const container = document.getElementById("news-container");
    container.insertAdjacentHTML("beforebegin", loaderTemplate());
}

function loaderTemplate() {
    return '<div class="lds - spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
}

// function removeLoader() {

// }

// function newsTemplate({ urlToImage, title, url, description }) {
//     return `
//       <div class="col s12">
//         <div class="card">
//           <div class="card-image">
//             <img src="${urlToImage}">
//             <span class="card-title">${title || ""}</span>
//           </div>
//           <div class="card-content">
//             <p>${description || ""}</p>
//           </div>
//           <div class="card-action">
//             <a href="${url}">Read more</a>
//           </div>
//         </div>
//       </div>
//     `;
// }
