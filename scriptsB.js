
const firebaseConfig = {
    apiKey: "AIzaSyDbO3S9lL5kraG_MrhvTGUjlXvueL5m5GA",
    authDomain: "group-project-movie-app.firebaseapp.com",
    projectId: "group-project-movie-app",
    storageBucket: "group-project-movie-app.appspot.com",
    messagingSenderId: "482529858431",
    appId: "1:482529858431:web:db9d7f4dd77780cc4f004a",
    measurementId: "G-82R57QS5Z5"
};

firebase.initializeApp(firebaseConfig)
const dbRef = firebase.database().ref()

/////

const movieApp = {}

movieApp.apiKey = `bfb23e9c017a2be83f91472023334cb6`
movieApp.apiUrl = 'https://api.themoviedb.org/3/search/movie'



movieApp.getMovieInfo = (argument, argumentTwo) => {
    const url = new URL(movieApp.apiUrl)
    url.search = new URLSearchParams({
        api_key: movieApp.apiKey,
        query: argument,
        language: argumentTwo
    })
    fetch(url)
        .then((response) => {
            return response.json()
        })
        .then((jsonResponse) => {
            console.log(jsonResponse)
            movieApp.displayMovieInfo(jsonResponse)
            movieApp.getVideoInfo()
        })
}

movieApp.getVideoInfo = () => {

    for(let i = 0; i <= 5; i++){
        const urlTwo = new URL(movieApp.arrayApiUrlTwo[i])
        urlTwo.search = new URLSearchParams({
            api_key: movieApp.apiKey,
        })
        fetch(urlTwo)
            .then((response) => {
                return response.json()
            })
            .then((jsonResponse) => {
                console.log(jsonResponse)
                movieApp.displayVideoLink(jsonResponse)
            })
    }
}

movieApp.displayVideoLink = (argument) => {
    movieApp.resultElement = document.querySelector('ul')
    const liEl = document.createElement('li')
    const a = document.createElement('a')
    const videoDefault = 'https://www.youtube.com/watch?v='

    a.target = '_blank'

    a.href = videoDefault.concat(argument.results[0].key)
    a.innerText = 'The official trailer of'
    liEl.append(a)
    movieApp.resultElement.append(liEl)
}


movieApp.getLanguage = (dataLanguage) => {
    let currentLanguage = dataLanguage.filter((item) => {
        return movieApp.userLanguage === dataLanguage.original_language
    })
}

movieApp.expandingBar = () => {
    const searchBtn = document.querySelector('.searchBtn')
    const inputEl = document.querySelector('.searchInput')

    searchBtn.addEventListener('mouseover', function () {
        inputEl.style.width = '50%'
        inputEl.style.cursor = 'text';
        inputEl.focus();
        searchBtn.style.display = 'none'
    })
}

movieApp.emptyResults = () => {
    const resultsEl = document.querySelector('ul')
    resultsEl.innerHTML = ""
}


movieApp.displayMovieInfo = (dataMovie) => {
    movieApp.emptyResults()
    const firstFive = dataMovie.results.slice(0, 4)

    movieApp.arrayOfId = []
    for (let i = 0; i <= 5; i++) {
        movieApp.movieId = dataMovie.results[i].id
        movieApp.arrayOfId.push(movieApp.movieId)
    }
    

    movieApp.arrayApiUrlTwo = []
    for (let i = 0; i <= 5; i++) {
        movieApp.apiUrlTwo = `https://api.themoviedb.org/3/movie/${movieApp.arrayOfId[i]}/videos`
        movieApp.arrayApiUrlTwo.push(movieApp.apiUrlTwo)
    }
    console.log(movieApp.arrayApiUrlTwo)

    firstFive.forEach((item) => {

        if (item.poster_path && item.popularity) {
            const ulElement = document.querySelector('ul')
            const img = document.createElement('img')
            const li = document.createElement('li')
            const infoElement = document.createElement('p')
            const imgDefault = 'https://image.tmdb.org/t/p/w500'

            img.src = imgDefault.concat(item.poster_path)
            img.alt = item.title

            li.append(img)
            ulElement.appendChild(li)

            infoElement.innerHTML = `<h2>${item.original_title}</h2><p>${item.overview}</p><div>🌟 Rating : ${item.vote_average}/10</div><div>Total of ${item.vote_count} votes</div>`
            li.append(infoElement)
        }
    });
}

movieApp.setUpEventListner = () => {

    const formElement = document.querySelector('form')
    const popUpElement = document.querySelector('.popUpError')
    const result = document.querySelector('.results')
    movieApp.resultElement = document.querySelector('.video')

    formElement.addEventListener('submit', function (e) {
        e.preventDefault();
        movieApp.userSearchTerm = document.querySelector('input[name=search]').value;
        movieApp.userLanguage = document.querySelector('select[name=language]').value;
        if (movieApp.userSearchTerm !== "") {
            movieApp.getMovieInfo(movieApp.userSearchTerm, movieApp.userLanguage)
            movieApp.headerElement.style.display = 'none'
            movieApp.iconElement.style.display = 'block'
            //movieApp.resultElement.style.display = 'inherit'

        } else {
            popUpElement.innerHTML = '<p>At least put something!!!</p><button class="goBack">Return</button>'
            popUpElement.addEventListener('click', function (event) {
                if (event.target.tagName === 'BUTTON') {
                    event.preventDefault();
                    document.getElementById('popUp').style.display = 'none'
                    document.getElementById('popUp').style.display = 'none'
                    document.getElementById('popUp').innerHTML = ''
                }
            })

        }
    })
}

movieApp.backButton = () => {
    movieApp.iconElement = document.querySelector('.fa-chevron-left')
    movieApp.headerElement = document.querySelector('header')
    movieApp.iconElement.addEventListener('click', function () {
        movieApp.headerElement.style.display = 'flex'
        movieApp.emptyResults()
        movieApp.iconElement.style.display = 'none'
        movieApp.placeHolder.style.display = 'none'
    })
}

movieApp.firebaseConnector = () => {

    movieApp.placeHolder = document.querySelector('.searchedItems ol')

    const searchedTerms = {
        searched: document.querySelector('input[name=search]').value
    }
    dbRef.push(searchedTerms)

    dbRef.on('value', (data) => {
        const searchedFromFb = data.val()

        const arrayOfSearched = []
        for (prop in searchedFromFb) {
            const searchedItems = document.createElement('li')
            searchedItems.appendChild(document.createTextNode(searchedFromFb[prop].searched))

            arrayOfSearched.push(searchedItems.outerHTML)


            movieApp.iconElementTwo = document.querySelector('.fa-film')
            movieApp.burgerMenu = document.querySelector('.burgerMenu')

            let clickCounter = 0
            movieApp.iconElementTwo.addEventListener('click', function () {
                clickCounter = clickCounter + 1;
                if (clickCounter % 2 == 0) {
                    movieApp.burgerMenu.style.display = 'none'
                    movieApp.placeHolder.style.display = 'none'
                } else {
                    movieApp.burgerMenu.innerHTML = `<h3>Search History</h3>`
                    movieApp.burgerMenu.style.display = 'block'
                    movieApp.placeHolder.style.display = 'block'
                }
            })

            movieApp.burgerMenu.addEventListener('click', function () {
                movieApp.placeHolder.innerHTML = arrayOfSearched.join('')
            })

        }
    })
}

movieApp.init = () => {
    movieApp.expandingBar()
    movieApp.setUpEventListner()
    movieApp.backButton()
    //movieApp.firebaseConnector()
}

movieApp.init();