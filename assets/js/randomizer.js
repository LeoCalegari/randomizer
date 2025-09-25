var randomized = false;
var stopRandomizing = false;

const delay = ms => new Promise(res => setTimeout(res, ms));

// Elements
const loadingSection = document.getElementById("loadingSection");
const loadingElement = document.getElementById("loadingElement");
const characterSection = document.getElementById("characterSection");

const randomizeBtn = document.getElementById("randomizeBtn");
const stopRandomizingBtn = document.getElementById("stopRandomizingBtn");

const characterName = document.getElementById("characterName");
const characterSeries = document.getElementById("characterSeries");

const expandedImage = document.getElementById("expandedImage");
const imageOverlay = document.getElementById("imageOverlay");

// Filters & Config
const checkboxRandomizeUntilStop = document.getElementById("randomizeUntilStop");
const filterMale = document.getElementById("filterMale");
const filterFemale = document.getElementById("filterFemale");



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
    await loading(false);

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
    let male = filterMale.checked;
    let female = filterFemale.checked;

    if(male && !female){
        tempCharacterList = tempCharacterList.filter(character => character.gender === "M");
    }else if(female && !male){
        tempCharacterList = tempCharacterList.filter(character => character.gender === "F");
    }

    return tempCharacterList;
}

async function toggleRandomizing() {
    stopRandomizing = !stopRandomizing;

    if(stopRandomizing){
        // Sets up randomize button
        randomizeBtn.classList.remove("display-none");
        stopRandomizingBtn.classList.add("display-none");
    }
}

async function prepareRandomization() {
    stopRandomizing = false;

    const randomizeUntilStop = checkboxRandomizeUntilStop.checked;

    if(randomizeUntilStop){
        randomizeBtn.classList.add("display-none");
        stopRandomizingBtn.classList.remove("display-none");

        while(!stopRandomizing){
            await randomize();

            await delay(2000);
        }
    }else{
        randomize();
    }
}

async function randomize() {
    if(!randomizeBtn.disabled){
        characterSection.classList.add("display-none");

        await loading(true);

        // Sets randomized to stop cicling gifs
        randomized = true;

        // Returns random character
        let tempCharacterList = await filterCharacterList();
        let randomizedCharacter = await returnRandomObjectFromList(tempCharacterList);

        // Fills section with data
        await fillCharacterSectionWithData(randomizedCharacter);

        await loading(false);

        $(characterSection).fadeIn("300");

        characterSection.classList.remove("display-none");
    }   
}

async function fillCharacterSectionWithData(character) {
    const series = seriesList.filter(seriesTEMP => seriesTEMP.id == character.seriesID)[0];

    // ---------- * Background and profile pictures * ----------
    $("#characterBackgroundImage").css("background-image", "url('img/obras/" + series.name + "/0.png')");
    
    const profileImageHTML = `<img src="img/personagens/${series.name}/${character.name}/0.png"/ onclick="expandImage(this)">`;

    $("#characterProfileImage").find("img").remove();
    $("#characterProfileImage").append(profileImageHTML);


    // ---------- * Name and Series * ----------
    characterName.innerText = character.name;
    characterSeries.innerText = series.name;

    // ---------- * References * ----------
    $("#characterReferences").find("div").remove();

    let colSize = 4;
    for(let index = 1; index <= character.numberOfReferences; index++){
        const refereceHTML = `
                                <div class="col-md-${colSize}">
                                    <img class="character-reference-image primary-glow-on-hover" src="img/personagens/${series.name}/${character.name}/${index}.png" onclick="expandImage(this)"/>
                                </div>
                             `;

        $("#characterReferences").append(refereceHTML);
    }
}

async function fillSeriesFilter() {
    await seriesList.forEach(series => {
        const seriesHTML = `<option value="${series.id}">${series.name}</option>`;

        $("#filterSeries").append(seriesHTML);
    });

    await setupSelectInput("filterSeries");

    // $("#filterSeries").select2({
    //     theme: 'bootstrap-5'
    // });
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
                loadingSection.classList.add("display-none");

                // Shows character section
                characterSection.classList.remove("display-none");
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
                        <span class="character-list-title">${series.name}</span>
                        <div class="mb-10" id="characterList${series.id}"></div>
                     `;
        
        $("#characterList").append(HTML);
    }

    // --- * Characters * ---
    for(let index = 0; index < characterList.length; index++){
        const character = characterList[index];

        const HTML = `
                        <div class="primary-background-on-hover character-on-list primary-glow-on-hover">
                            <span>${character.name}</span>
                        </div>
                     `;

        $("#characterList" + character.seriesID).append(HTML);
    }
}

function cicleGifs(ms){
    $(loadingSection).fadeIn("300");
    
    loadingSection.classList.remove("display-none");

    loadingElement.classList.add("display-none");

    setTimeout(() => {
        // if(randomized === false) loadingSection.style.backgroundImage = "URL('gif/init" + returnRandomIndex(23) + ".gif')";
        if(randomized === false) cicleGifs(5000);
    }, ms);
}

async function loading(loading) {
    loadingSection.style.backgroundImage = "";

    if(loading){
        await ajustButtonsBeforeLoading();

        $(loadingSection).fadeIn(300);
        
        loadingSection.classList.remove("display-none");
        loadingElement.classList.remove("display-none");
    }else{
        await delay(250);

        loadingSection.classList.add("display-none"); 
        loadingElement.classList.add("display-none");

        await ajustButtonsAfterLoading();
    }
}

async function expandImage(image) {
    expandedImage.src = image.src;
    imageOverlay.classList.add("active");

    document.body.style.overflow = "hidden";
}


imageOverlay.addEventListener("click", (event) => {
    if (event.target === imageOverlay) {
        closeExpandedImage();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && imageOverlay.classList.contains("active")) {
        closeExpandedImage();
    }
});

function closeExpandedImage(){
    imageOverlay.classList.remove("active"); 
    document.body.style.overflow = "";
}

function returnRandomObjectFromList(list) {
    return list[Math.floor((Math.random() * list.length))];
}

function returnRandomIndex(range){
    return Math.floor((Math.random() * range));
}

async function ajustButtonsBeforeLoading() {
    const buttonList = document.querySelectorAll(".button");

    buttonList.forEach(button => {
        button.classList.remove("primary-glow-on-hover");

        button.classList.add("infinite-shine-effect");
        button.classList.add("disabled");

        button.disabled = false;
    });
}

async function ajustButtonsAfterLoading() {
    const buttonList = document.querySelectorAll(".button");

    buttonList.forEach(button => {
        button.classList.add("primary-glow-on-hover");

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

async function setupSelectInput(elementID) {
    const element = document.getElementById(elementID);

    new Choices(element, {
        silent: false,
        items: [],
        choices: [],
        renderChoiceLimit: 5,
        maxItemCount: -1,
        closeDropdownOnSelect: "auto",
        singleModeForMultiSelect: false,
        addChoices: false,
        addItems: true,
        addItemFilter: (value) => !!value && value !== "",
        removeItems: true,
        removeItemButton: false,
        removeItemButtonAlignLeft: false,
        editItems: false,
        allowHTML: false,
        allowHtmlUserInput: false,
        duplicateItemsAllowed: true,
        delimiter: ',',
        paste: true,
        searchEnabled: true,
        searchChoices: true,
        searchFloor: 1,
        searchResultLimit: 4,
        searchFields: ["label", "value"],
        position: "auto",
        resetScrollPosition: true,
        shouldSort: true,
        shouldSortItems: false,
        sorter: () => {},
        shadowRoot: null,
        placeholder: true,
        placeholderValue: null,
        searchPlaceholderValue: null,
        prependValue: null,
        appendValue: null,
        renderSelectedChoices: "auto",
        loadingText: "Loading...",
        noResultsText: "No results found",
        noChoicesText: "Empty",
        itemSelectText: "",
        uniqueItemText: "Only unique values can be added",
        customAddItemText: "Only values matching specific conditions can be added",
        addItemText: (value, rawValue) => {
            return `Press Enter to add <b>"${value}"</b>`;
        },
        removeItemIconText: () => `Remove item`,
        removeItemLabelText: (value, rawValue) => `Remove item: ${value}`,
        maxItemText: (maxItemCount) => {
        return `Only ${maxItemCount} values can be added`;
        },
        valueComparer: (value1, value2) => {
            return value1 === value2;
        },
        classNames: {
            containerOuter: ['choices'],
            containerInner: ['choices__inner'],
            input: ['choices__input'],
            inputCloned: ['choices__input--cloned'],
            list: ['choices__list'],
            listItems: ['choices__list--multiple'],
            listSingle: ['choices__list--single'],
            listDropdown: ['choices__list--dropdown'],
            item: ['choices__item'],
            itemSelectable: ['choices__item--selectable'],
            itemDisabled: ['choices__item--disabled'],
            itemChoice: ['choices__item--choice'],
            description: ['choices__description'],
            placeholder: ['choices__placeholder'],
            group: ['choices__group'],
            groupHeading: ['choices__heading'],
            button: ['choices__button'],
            activeState: ['is-active'],
            focusState: ['is-focused'],
            openState: ['is-open'],
            disabledState: ['is-disabled'],
            highlightedState: ['is-highlighted'],
            selectedState: ['is-selected'],
            flippedState: ['is-flipped'],
            loadingState: ['is-loading'],
            invalidState: ['is-invalid'],
            notice: ['choices__notice'],
            addChoice: ['choices__item--selectable', 'add-choice'],
            noResults: ['has-no-results'],
            noChoices: ['has-no-choices'],
        },
        // Choices uses the great Fuse library for searching. You
        // can find more options here: https://fusejs.io/api/options.html
        fuseOptions: {
            includeScore: true
        },
        labelId: "",
        callbackOnInit: null,
        callbackOnCreateTemplates: null,
        appendGroupInSearch: false,
    });
}