// import { createProfile } from './album.js';

const searchForm = document.querySelector('#searchForm');
const mainContent = document.querySelector('#vinylShelf');

// form submission event listener
searchForm.addEventListener("submit", event => {
    event.preventDefault();

    let searchText = document.querySelector('#searchText').value;

    let url = new URL('https://corsproxy.io/?url=https://api.deezer.com/search/album');
    url.searchParams.set('q', searchText);
    url.searchParams.set('limit', 10);

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
            let div = document.createElement('div');
            div.classList.add('result');

            div.innerHTML =
                '<img src="' + result.cover_medium + '" alt="' + result.title + '" style="cursor:pointer" width="200px"/>';

            // click event for popover
            div.querySelector('img').addEventListener('click', async (e) => {
                // remove existing popovers
                const oldPopovers = document.querySelector('.popover');
                if (oldPopover) oldPopovers.remove();

                // fetch tracklist details
                const albumUrl = 'https://corsproxy.io/?url=https://api.deezer.com/album/${result.id}/tracks';
                let tracks = [];
                try {
                    const res = await fetch(albumUrl);
                    const data = await res.json();
                    tracks = data.tracks?.data || [];
                } catch (err) {
                    tracks = [];
                }

                // create popover
                
            });
            mainContent.appendChild(div);
        })
    } else {
        mainContent.innerHTML = '<p>No results found</p>';
    }
}