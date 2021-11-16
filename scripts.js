// A movie app where the user enters a complete/incomplete title of a movie and gets the ratings and an overview of the movie (with other information possibly from the API), or selects a criteria from a drop down menu to find movies accordingly that match the criteria 

//1. Create app object
// 1. Save user inputs into constants 
// 2. Fetching movie data from the API and storing it in a function
// 3. Then go through the API and filter movies by matching criteria of user (could be using if statements according to which criteria user has filled) 
// 4. Create a function for display movie function append to the page with a poster and about blurb containing popularity, release date, title, genre, overview, adult movie or not, and total rating (can be modified)
// 5. Specifically, when we fetch the data, we want to append it to a separate page (empty div in html)
// 6. make init method and call displaymovie and getmovieinfo functions
// 7. call init function

// 8. error handling to empty each time our divs, make sure at least one criteria in entered

// STRETCH GOALS
// Carousel/image gallery that you can swipe through of different movies
// A 2nd api that displays trailers in a small pop up box to the side
//Firebase

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

const id = 13706
movieApp.apiUrl = `https://api.themoviedb.org/3/movie/${id}/videos`

movieApp.getMovieInfo = (argument, argumentTwo) => {
    const url = new URL(movieApp.apiUrl)
    url.search = new URLSearchParams({
        api_key: movieApp.apiKey,
        query: argument,
        language: argumentTwo
    })
    fetch(url)
        .then((response) => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error(res.statusText)
            }
        })
        .then((jsonResponse) => {
            console.log(jsonResponse)
            movieApp.displayMovieInfo(jsonResponse)
        })
        .catch((error) => {
            if (error.message === "Not Found") {
                alert("Please search again!")
            }
        })
}

// movieApp.getMovieInfo = () => {
//     const urlTwo = new URL(movieApp.apiUrl)
//     urlTwo.search = new URLSearchParams({
//         api_key: movieApp.apiKey,
//     })
//     fetch(urlTwo)
//         .then((response) => {
//             return response.json()
//         })
//         .then((jsonResponse) => {
//             console.log(jsonResponse)
//             console.log("hello")
//         })
// }


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
    const arrayOfId = []
    for (let i = 0; i <= firstFive.length; i++) {
        movieApp.movieId = dataMovie.results[i].id
        arrayOfId.push(movieApp.movieId)
    }
    console.log(arrayOfId)
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

    formElement.addEventListener('submit', function (e) {
        e.preventDefault();
        movieApp.userSearchTerm = document.querySelector('input[name=search]').value;
        movieApp.userLanguage = document.querySelector('select[name=language]').value;
        if (movieApp.userSearchTerm !== "") {
            movieApp.getMovieInfo(movieApp.userSearchTerm, movieApp.userLanguage)
            movieApp.headerElement.style.display = 'none'
            movieApp.iconElement.style.display = 'block'
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
