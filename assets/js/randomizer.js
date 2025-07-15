var randomized = false;

async function init() {
    // Fills out the database
    await fillDatabase();

    // Inserts the series in the filter select
    await fillSeriesFilter();

    // Fills character autocomplete filter
    await fillsCharacterAutoCompleteFilter();

    // Inserts the characters in the list
    await fillListOfCharacter();

    // Removes loading animation
    $("#loadingElement").remove();

    // Ajusts disabled buttons
    await ajustButtonsAfterLoading();

    // Cicles the gifs after loading
    cicleGifs(0);
}

async function filterCharacterList() {
    let tempCharacterList = characterList;

    // ----- * Series * -----
    let series = $('#filterSeries').find(':selected')[0].innerText;

    if(series !== "All"){
        tempCharacterList = tempCharacterList.filter(character => character.series === series);
    }

    // ----- * Gender * -----
    let male = document.getElementById("filterMale").checked;
    let female = document.getElementById("filterFemale").checked;

    if(male && !female){
        tempCharacterList = tempCharacterList.filter(character => character.gender === "M");
    }else if(female && !male){
        tempCharacterList = tempCharacterList.filter(character => character.gender === "F");
    }

    return tempCharacterList;
}

async function randomize() {
    // Sets randomized to stop cicling gifs
    randomized = true;

    // Returns random character
    let tempCharacterList = await filterCharacterList();
    let randomizedCharacter = await returnRandomObjectFromList(tempCharacterList);

    // Fills section with data
    await fillCharacterSectionWithData(randomizedCharacter);

    // Haven't randomized yet
    if(randomized){
        // Hide loading section
        document.getElementById("loadingSection").classList.add("display-none");

        // Show character section
        document.getElementById("characterSection").classList.remove("display-none");
    }
}

async function fillCharacterSectionWithData(character) {
    // ---------- * Background and profile pictures * ----------
    $("#characterBackgroundImage").css("background-image", "url('img/obras/" + character.series + "/0.png')");

    const profileImageHTML = `<img src="img/personagens/${character.series}/${character.name}/0.png"/ onclick="expandImage(this)">`;

    $("#characterProfileImage").find("img").remove();
    $("#characterProfileImage").append(profileImageHTML);


    // ---------- * Name and Series * ----------
    document.getElementById("characterName").innerText = character.name;
    document.getElementById("characterSeries").innerText = character.series;

    // ---------- * References * ----------
    $("#characterReferences").find("div").remove();

    let colSize = 12;
    for(let index = 1; index <= character.numberOfReferences; index++){
        const refereceHTML = `
                                <div class="col-md-${colSize}">
                                    <img class="character-reference-image" src="img/personagens/${character.series}/${character.name}/${index}.png" onclick="expandImage(this)"/>
                                </div>
                             `;

        $("#characterReferences").append(refereceHTML);
    }
}

async function fillSeriesFilter() {
    await seriesList.forEach(series => {
        const seriesHTML = `<option value="${ajustString(series)}">${series}</option>`;

        $("#filterSeries").append(seriesHTML);
    });

    $("#filterSeries").select2({
        theme: 'bootstrap-5'
    });
}

async function fillsCharacterAutoCompleteFilter() {
    // ------ * Setup list * ------
    let autocompleteCharacterList = [];
    await characterList.forEach(character => {
        let autocompleteData = new Object();
        autocompleteData.series = character.series;

        let autocompleteCharacter = new Object();
        autocompleteCharacter.value = character.name;
        autocompleteCharacter.data = autocompleteData;

        autocompleteCharacterList.push(autocompleteCharacter);
    });

    // ------ * Setup input * ------
    $("#filterCharacterAutocomplete").devbridgeAutocomplete({
        lookup: autocompleteCharacterList,
        minChars: 1,
        onSelect: function (suggestion) {
            // Haven't randomized
            if(!randomized){
                // Sets randomized to stop cicling gifs
                randomized = true;

                // Hides loading section
                document.getElementById("loadingSection").classList.add("display-none");

                // Shows character section
                document.getElementById("characterSection").classList.remove("display-none");
            }

            // Returns character from list
            let character = characterList.filter(character => character.name === suggestion.value);

            // Fills out the character data
            fillCharacterSectionWithData(character[0]);
        },
        showNoSuggestionNotice: true,
        noSuggestionNotice: 'Não foi encontrado nenhum personagem...',
        groupBy: 'series'
    });
}

async function fillListOfCharacter() {
    // --- * Series * ---
    for(let index = 0; index < seriesList.length; index++){
        const series = seriesList[index];

        const HTML = `
                        <span class="character-list-title">${series}</span>
                        <div class="mb-10" id="characterList${await ajustString(series)}"></div>
                     `;
        
        $("#characterList").append(HTML);
    }

    // --- * Characters * ---
    for(let index = 0; index < characterList.length; index++){
        const character = characterList[index];

        const HTML = `
                        <div class="primary-background-on-hover character-on-list">
                            <span>${character.name}</span>
                        </div>
                     `;

        $("#characterList" + await ajustString(character.series)).append(HTML);
    }
}

function cicleGifs(ms){
    setTimeout(() => {
        if(randomized === false) document.getElementById("loadingSection").style.backgroundImage = "URL('gif/init" + returnRandomIndex(23) + ".gif')";
        if(randomized === false) cicleGifs(5000);
    }, ms);
}

async function expandImage(image) {
    document.getElementById("expandedImage").src = image.src;
    document.getElementById("imageOverlay").classList.add("active");

    document.body.style.overflow = "hidden";
}

document.getElementById("imageOverlay").addEventListener("click", (event) => {
    if (event.target === imageOverlay) {
        document.getElementById("imageOverlay").classList.remove("active"); 
        document.body.style.overflow = "";

        expandedImage.src = "";
    }
});

function returnRandomObjectFromList(list) {
    return list[Math.floor((Math.random() * list.length))];
}

function returnRandomIndex(range){
    return Math.floor((Math.random() * range));
}

async function ajustButtonsAfterLoading() {
    const buttonList = document.querySelectorAll(".button");

    buttonList.forEach(button => {
        button.classList.add("expand-on-hover");
        button.classList.add("shine-effect-on-hover");

        button.classList.remove("infinite-shine-effect");
        button.classList.remove("disabled");

        button.disabled = false;
    });
}

async function ajustString(string) {
    string = string.replaceAll(" ", "");
    string = string.replaceAll("'", "");

    return string;
}