let pokemonsArr;
let dropdownOption;
let dropdownList=document.getElementById("pokemon-dropdown");
let pokemonDetails = document.getElementById("Pokemon-details");


async function fetchData(){
    const url = "https://pokeapi.co/api/v2/pokemon?limit=151";
    let response = await fetch (url)
    let data = await response.json();
    pokemonsArr=data.results;
    createDropdownOptions(pokemonsArr);
}

function createDropdownOptions(pokemonsArr) {
    pokemonsArr.forEach( pokemon => {
        dropdownOption=document.createElement("option");
        dropdownOption.value=pokemon.url;
        dropdownOption.innerText=pokemon.name;
        dropdownList.appendChild(dropdownOption)
    });
};

fetchData();

class Pokemon {
    constructor(name, image, types, weight, height, stats){
        this.name=name;
        this.image=image;
        this.types=types;
        this.weight=weight;
        this.height=height;
        this.stats=stats;
    }
    comparePokemones(){
    }
}



//fetch selected pokemon

async function createPokemonInstance (pokemonData){
    const pokemonInstance = new Pokemon(
        pokemonData.name,
        pokemonData.sprites.front_default,
        pokemonData.types.map(typeInfo => typeInfo.type.name),
        pokemonData.weight,
        pokemonData.height,
        {
            hp: pokemonData.stats[0].base_stat,
            attack: pokemonData.stats[1].base_stat,
            defense: pokemonData.stats[2].base_stat,
            specialAttack: pokemonData.stats[3].base_stat,
            specialDefense: pokemonData.stats[4].base_stat,
            speed: pokemonData.stats[5].base_stat,
        }
    );
    return pokemonInstance;
    // console.log(pokemonInstance);

}


async function fetchSelectedPokemon(selectedPokemonUrl){
    let pokemonResponse = await fetch (selectedPokemonUrl)
    let pokemonData= await pokemonResponse.json();
    let pokemonInstance = await createPokemonInstance(pokemonData);
    await renderPokemon(pokemonDetails, pokemonInstance);
}


dropdownList.addEventListener("change", async ()=>{
    let selectedPokemonUrl=dropdownList.value;
    await fetchSelectedPokemon(selectedPokemonUrl);
   
});


async function renderPokemon(pokemonDetails, pokemonInstance){
    pokemonDetails.innerText="";

    const pokemonName = document.createElement("h2");
    pokemonName.innerText=pokemonInstance.name;

    const pokemonImage= document.createElement("img");
    pokemonImage.src=pokemonInstance.image;

    const pokemonTypes=document.createElement("p");
    pokemonTypes.innerText=pokemonInstance.types;

    const pokemonWeight = document.createElement('p');
    pokemonWeight.innerText=pokemonInstance.weight;

    const pokemonHeight = document.createElement('p');
    pokemonHeight.innerText =pokemonInstance.height;



    pokemonDetails.appendChild(pokemonName);
    pokemonDetails.appendChild(pokemonImage);
    pokemonDetails.appendChild(pokemonTypes);
    pokemonDetails.appendChild(pokemonWeight);
    pokemonDetails.appendChild(pokemonHeight);

    
}








