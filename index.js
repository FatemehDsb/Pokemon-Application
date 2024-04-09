let pokemonsArr;
let dropdownOption;
let data ;
let dropdownLista = document.createElement("select");
document.body.append(dropdownLista);


function createDropdownOptions(pokemonsArr) {
    pokemonsArr.forEach(pokemon => {
        dropdownOption=document.createElement("option");
        dropdownOption.value=pokemon.name;
        dropdownOption.innerText=pokemon.name;
        dropdownLista.appendChild(dropdownOption)
    });
};

async function fetchData(){
    let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
     data = await response.json();
    // console.log(data.results);
    pokemonsArr=data.results;
   createDropdownOptions(pokemonsArr);
};




fetchData();







//make an array of nameproperty





