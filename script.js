const searchForm = document.querySelector(`#searchForm`);
const mainContent = document.querySelector(`#vinylShelf`);

// form submission event listener, lines 5-24 based on Harold Sikkema's IMDB search example https://github.com/ixd-system-design/UI-for-Data-Fetching/blob/main/movies/script.js
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
    // lines 30-32, 37-38 based on Harold Sikkema's Pokémon Types example https://github.com/ixd-system-design/PokemonTypes/blob/main/listings.js
    if (results) {
        results.forEach(async result => {
            const popoverId = `popover-${result.id}`;
            const today = new Date();
            const formatted = today.toISOString().slice(0, 10);
            console.log(formatted);

            let div = document.createElement('div');
            div.classList.add('result');

            // fetch tracks for each album
            let trackTitles = '';
            // lines 42-67 from using Co-Pilot to help fetch tracklist information
            try {
                const tracklistUrl = `https://corsproxy.io/?url=https://api.deezer.com/album/${result.id}/tracks`;
                const response = await fetch(tracklistUrl);
                const data = await response.json();
                if (data.data && Array.isArray(data.data)) {
                    totalTracks = data.data.length;
                    trackTitles = data.data.map(track => {
                        const minutes = Math.floor(track.duration / 60);
                        const seconds = String(track.duration % 60).padStart(2, '0');
                        return `
                        <li>
                            <div style="display: flex; justify-content: space-between; gap: 20px; width: 100%;">
                                <span>${track.title}</span> 
                                <span>${minutes}:${seconds}</span>
                            </div>
                        </li>`;
                    }).join('');

                } else {
                    trackTitles = '<li>No tracks found</li>';
                }
            } catch (err) {
                trackTitles = '<li>Error fetching tracks</li>';
            }
            console.log(trackTitles);

            let template =
                `<button id="display" class="open" popoverTarget="${result.id}">
                    <div class="item">
                        <img class="sleeve" src="${result.cover_medium}" alt="${result.title}" style="cursor:pointer"/>
                        <div class="shelf"></div>
                    </div>
                </button>

                <div popover id="${result.id}">
                    <div class="profile">
                        <h2>Java & Jive</h2>

                        <button class="close" popoverTarget="${result.id}" style="cursor:pointer">< BACK TO SHELF</button>

                        <p>${formatted}</p>

                        <div class="line"></div>

                        <div class="title">
                            <p>Title:</p>
                            <p>${result.title}</p>
                        </div>

                       <div class="line"></div>

                       <div class="songs">
                            <ol>
                                ${trackTitles}
                            </ol>
                       </div>

                       <div class="line"></div>

                       <div class="total">
                            <p>ITEM COUNT:</p>
                            <p>${totalTracks}</p>
                        </div>

                        <div class="thanks">
                            <h3>Thank you for visiting!</h3>
                            <button class="link">
                                <p>Listen on</p>
                                <img src="Wordmark-mb-rgb.png" alt="Deezer" width="80px"/>
                            </button>
                        </div>

                    </div>
                </div>`;
            // wordmark from Deezer Brand https://deezerbrand.com/document/37#/-/logo
            div.innerHTML = template;
            
            // lines 120-122 from using Co-Pilot to help add event listener for external link button
            div.querySelector('.link').addEventListener('click', () => {
                window.open(result.link, '_blank');
            });

            mainContent.appendChild(div);
        });

    } else {
        mainContent.innerHTML = `<p>Looks like that's not on our shelves...</p>`;
    }
}