const searchForm = document.querySelector(`#searchForm`);
const mainContent = document.querySelector(`#vinylShelf`);

// form submission event listener, lines 5-24 based on Harold Sikkema's IMDB search example
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
    // lines 30-32, 37-38 based on Harold Sikkema's Pokémon Types example
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
            // lines 42-60 from using Co-Pilot to help fetch tracklist information
            try {
                const tracklistUrl = `https://corsproxy.io/?url=https://api.deezer.com/album/${result.id}/tracks`;
                const response = await fetch(tracklistUrl);
                const data = await response.json();
                if (data.data && Array.isArray(data.data)) {
                    totalTracks = data.data.length;
                    trackTitles = data.data.map(track => {
                        const minutes = Math.floor(track.duration / 60);
                        const seconds = String(track.duration % 60).padStart(2, '0');
                        return `<li>${track.title} ${minutes}:${seconds}</li>`;
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
                        <img src="${result.cover_medium}" alt="${result.title}" style="cursor:pointer" width="150px"/>
                        <div class="shelf"></div>
                    </div>
                </button>

                <div popover id="${result.id}">
                    <div class="profile">
                        <h2>Java & Jive</h2>

                        <button class="close" popoverTarget="${result.id}">< BACK TO SHELF</button>

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

                        <h3>Thank you for visiting!</h3>
                        <a href="${result.link}">Listen on Deezer</a>

                    </div>
                </div>`;
            div.innerHTML = template;
                            
            mainContent.appendChild(div);
        });

    } else {
        mainContent.innerHTML = `<p>No results found</p>`;
    }
}