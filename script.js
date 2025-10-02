// import { createProfile } from './receipt.js';

const searchForm = document.querySelector(`#searchForm`);
const mainContent = document.querySelector(`#vinylShelf`);

// form submission event listener
searchForm.addEventListener("submit", event => {
    event.preventDefault();

    let searchText = document.querySelector(`#searchText`).value;

    let url = new URL(`https://corsproxy.io/?url=https://api.deezer.com/search/album`);
    url.searchParams.set(`q`, searchText);
    url.searchParams.set(`limit`, 10);

    console.log(url.href);

    // run request
    fetch(url.href)
        .then(response => response.json())
        .then(response => {
            console.log(response);
            displayResults(response.data);
        })
        .catch(err => console.error(err));
});

// display results
const displayResults = (results) => {
    mainContent.innerHTML = '';
    if (results) {
        results.forEach(result => {
            // const popoverId = `popover-${result.id}`;

            let div = document.createElement('div');
            div.classList.add('result');

            let template =
                `<button class="open" popoverTarget="${result.id}" >
                    <img src="${result.cover_medium}" alt="${result.title}" style="cursor:pointer" width="200px"/>
                    <div class="shelf"></div>
                </button>

                <div popover id="${result.id}">
                    <div class="profile">
                        <p>Loading...</p>
                    </div>
                </div>`;
            div.innerHTML = template;
                            
            mainContent.appendChild(div);
        });

    } else {
        mainContent.innerHTML = `<p>No results found</p>`;
    }
}