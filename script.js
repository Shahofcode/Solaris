//Här hämtar jag både funktionerna för att hämta api-nyckeln samt data om planeterna.
let planets = {}

const fetchPlanetData = async () => {
    const baseURL = "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com"
    const apiKeyRes = await (await fetch(`${baseURL}/keys`, {
        method: "POST",
        headers: {
            Accept: "application/json"
        }
    })).json()

    const res = await (await fetch(`${baseURL}/bodies`, {
        headers: {
            "x-zocom": apiKeyRes.key,
            Accept: "application/json"
        }
    })).json()
    //Här loopar jag igenom varje "himlakropp" i API-svaret. Om objektet är en planet, lägger det till dess egenskaper i planets-objektet.
    for (const item of res.bodies) {
        if (item.type !== "planet") {
            continue
        }

        planets[item.latinName] = {
            swedishName: item.name,
            description: item.desc,
            circumference: `${item.circumference} km`,
            distanceFromSun: `${item.distance} km`,
            maxTemp: `${item.temp.day}C`,
            minTemp: `${item.temp.night}C`,
            moons: item.moons
        }
    }

    document.querySelector(".planets").classList.add("active")
}

fetchPlanetData()

const dataFields = [
    "circumference",
    "distanceFromSun",
    "maxTemp",
    "minTemp",
    "moons"
]

// Funktion för att sätta det aktiva planetet och uppdatera gränssnittet
const setActivePlanet = (planet) => {
    // Om planet är "null" återställs alla planeter och solen blir aktiv
    if (planet === null) {
        for (const item of Object.keys(planets)) {
            document.querySelector(`#${item}`).classList.remove("inactive") // Aktivera planeternas visuella element
            document.querySelector(`#info__${item}`).classList.remove("active") // Avmarkera planetens informationsfält
        }

        document.querySelector("#Sun").classList.remove("inactive") // Aktivera solen visuellt
        document.querySelector(".infoWrapper").classList.remove("active") // Avmarkera informationsrutan
        return
    }

    document.querySelector(".infoWrapper").classList.add("active") // Markera informationsrutan som aktiv

    // Loopa igenom alla planeter
    for (const item of Object.keys(planets)) {
        document.querySelector(`#${item}`).classList.add("inactive") // Inaktivera visuellt alla planeter
        document.querySelector(`#info__${item}`).classList.remove("active") // Avmarkera informationsfält för alla planeter
    }

    document.querySelector("#Sun").classList.add("inactive") // Inaktivera solen visuellt
    document.querySelector(`#info__${planet}`).classList.add("active") // Markera den valda planetens informationsfält som aktivt

    // Uppdatera informationen för den valda planeten
    setInfoData(planet)
}

// Funktion för att uppdatera informationen om den valda planeten i info-popup
const setInfoData = (planet) => {

    document.querySelector(".infoPopUp h3").textContent = planets[planet].swedishName
    document.querySelector(".infoPopUp h4").textContent = planet
    document.querySelector(".infoPopUp .description").textContent = planets[planet].description
    // Loopa igenom alla datafält för den valda planeten
    for (const key of dataFields) {
        const newValue = Array.isArray(planets[planet][key])
            ? planets[planet][key].join(", ") // Om värdet är en array, sätt ihop alla element till en sträng
            : planets[planet][key] // Annars använd värdet direkt
        // Uppdatera det aktuella datafältets värde i informationsrutan
        document.querySelector(`.infoPopUp .data .data__${key} p`).textContent = newValue
    }
}
// Searchfunktion 
const submitSearch = () => {
    event.preventDefault()
    const search = document.querySelector("#search-input")
    const planet = search.value
    // Skapa en array med alla planeternas namn i små bokstäver
    const keyNames = Object.keys(planets).map((item => item.toLowerCase()))

    if (keyNames.includes(planet.toLowerCase())) {
        search.value = ""
        setActivePlanet(planet[0].toUpperCase() + planet.slice(1))
        return
    }
    // Error om planeten inte finns
    alert("Planeten hittades inte.")
}
