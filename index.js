let pokemonsArr;
let dropdownOption;

let dropDownMenu1=document.getElementById("pokemon-dropdown");
let dropDownMenu2=document.getElementById("pokemon-dropdown-2");
let compareResult=document.getElementById("compareResult");
let battleResult=document.getElementById("battleResult");
let attackDisplay=document.getElementById("attackDisplay");
let resultDisplay=document.getElementById("resultDisplay");
let backgroundImage = document.getElementById("backgroundImage");




// let pokemonDetails = document.getElementById("Pokemon-details");

let attackBtn=document.getElementById("attackBtn");
// 


async function fetchDataAndCreateOptions(){
    const url = "https://pokeapi.co/api/v2/pokemon?limit=151";
    let response = await fetch (url)
    let data = await response.json();
    pokemonsArr=data.results;
   console.log(pokemonsArr);
    createDropdownOptions(pokemonsArr);
}
fetchDataAndCreateOptions();;

function addOptionToDropdown(dropdown, pokemon) {
    const option = document.createElement("option");
    option.value = pokemon.url;
    option.innerText = pokemon.name;
    dropdown.appendChild(option);
}

function createDropdownOptions(pokemonsArr) {
    const dropdown1 = document.getElementById("pokemon-dropdown");
    const dropdown2 = document.getElementById("pokemon-dropdown-2");

    pokemonsArr.forEach(pokemon => {
        addOptionToDropdown(dropdown1, pokemon);
        addOptionToDropdown(dropdown2, pokemon);
    });
}



class Pokemon {
    constructor(name, image, types, weight, height, stats, moves){
        this.name=name;
        this.image=image;
        this.types=types;
        this.weight=weight;
        this.height=height;
        this.stats=stats;
        this.moves=moves;
    }
    static comparePokemones(pokemon1, pokemon2){
        const statCategories = ['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed'];
        let wins = { pokemon1: 0, pokemon2: 0 };

        if (pokemon1.weight > pokemon2.weight) wins.pokemon1++;
        else if (pokemon1.weight < pokemon2.weight) wins.pokemon2++;

        if (pokemon1.height > pokemon2.height) wins.pokemon1++;
        else if (pokemon1.height < pokemon2.height) wins.pokemon2++;

        statCategories.forEach(stat => {
            if (pokemon1.stats[stat] > pokemon2.stats[stat]) wins.pokemon1++;
            else if (pokemon1.stats[stat] < pokemon2.stats[stat]) wins.pokemon2++;
        });

       
        return wins;
        // console.log(wins);

    }
}

//fetch selected pokemon

async function createPokemonInstance (pokemonData){
    const moves = pokemonData.moves.map(moveInfo=>{
        return {
            name:moveInfo.move.name
        };
    })
    const pokemonInstance = new Pokemon(
        pokemonData.name,
        pokemonData.sprites.other.dream_world.front_default,
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
        }, 
        pokemonData.moves
    );
    return pokemonInstance;
    // console.log(pokemonInstance);

}


async function fetchAndDisplayPokemon(url, detailsId){
    let pokemonResponse = await fetch (url)
    let pokemonData= await pokemonResponse.json();
    let pokemonInstance = await createPokemonInstance(pokemonData);
    await renderPokemon(pokemonInstance, detailsId);
}


dropDownMenu1.addEventListener("change", async (event)=>{
    // let url=dropDownMenu1.value;
     await fetchAndDisplayPokemon(event.target.value, 'pokemonDetails1');
  backgroundImage.style.display="none";
   
});

dropDownMenu2.addEventListener("change", async (event)=>{
    // let url=dropDownMenu2.value;
    await fetchAndDisplayPokemon(event.target.value, 'pokemonDetails2');
  
})


async function renderPokemon(pokemonInstance, detailsId){

    // const pokemonContainer = document.getElementById(pokemonContainer)

    const detailsContainer = document.getElementById(detailsId);
    detailsContainer.innerText="";

    const pokemonName = document.createElement("h2");
    pokemonName.innerText=pokemonInstance.name;
    pokemonName.id = `pokemonName-${detailsId}`;
    // pokemonName.id="pokemonNameElement";

    const pokemonCard=document.createElement("div");
    pokemonCard.id="pokemonCard"


    const pokemonImage= document.createElement("img");
    pokemonImage.src=pokemonInstance.image;
    pokemonImage.className="pokemonImg"

    const heightWeightTypeContainer = document.createElement("div");
    heightWeightTypeContainer.id="height-weight-type-container";

    const pokemonTypes=document.createElement("p");
    pokemonTypes.innerText=` Type:${pokemonInstance.types}`;

    const pokemonWeight = document.createElement('p');
    pokemonWeight.innerText=` Weight : ${pokemonInstance.weight}`;

    const pokemonHeight = document.createElement('p');
    pokemonHeight.innerText =`Height : ${pokemonInstance.height}`;

    const statsContainer = document.createElement("div");
    statsContainer.id="stats-container";

    const statsTitle= document.createElement("h3");
    statsContainer.appendChild(statsTitle);

    statsTitle.innerText='Stats';

    Object.entries(pokemonInstance.stats).forEach(([key, value])=>{
        const statLabel=document.createElement('p');
        statLabel.innerText= `${key.toUpperCase()}: `;

        const progressBar = document.createElement('progress');
        progressBar.setAttribute('value', value);
        progressBar.setAttribute('max', 255);

        statsContainer.appendChild(statLabel);
        statsContainer.appendChild(progressBar);

    });

    detailsContainer.appendChild(pokemonName);
    detailsContainer.appendChild(pokemonImage);
    detailsContainer.appendChild(pokemonCard);
    heightWeightTypeContainer.appendChild(pokemonTypes);
    heightWeightTypeContainer.appendChild(pokemonWeight);
    heightWeightTypeContainer.appendChild(pokemonHeight);
    pokemonCard.appendChild(heightWeightTypeContainer);
    pokemonCard.appendChild(statsContainer);
}


let compareBtn= document.getElementById("compareBtn");
compareBtn.addEventListener("click", async ()=>{
    let pokemon1Url = dropDownMenu1.value;
    let pokemon2Url = dropDownMenu2.value;

    let pokemon1Instance = await createPokemonInstanceFromUrl(pokemon1Url);
    let pokemon2Instance = await createPokemonInstanceFromUrl(pokemon2Url);

    const detailElements1 = document.getElementById('pokemonDetails1');
    const detailElements2 = document.getElementById('pokemonDetails2');

    // Anta att vi rensar tidigare stilar vid varje jämförelse
    detailElements1.style.backgroundColor = '';
    detailElements2.style.backgroundColor = '';

    let comparisonResult= Pokemon.comparePokemones(pokemon1Instance, pokemon2Instance);

    if (comparisonResult.pokemon1 > comparisonResult.pokemon2) {
        detailElements1.style.backgroundColor = 'green';
        detailElements2.style.backgroundColor = 'grey';
    } else if (comparisonResult.pokemon1 < comparisonResult.pokemon2) {
        detailElements1.style.backgroundColor = 'grey';
        detailElements2.style.backgroundColor = 'green';
    } else {
        // För en oavgjord match, välj en neutral färg eller behåll bakgrundsfärgen oförändrad
        console.log("It's a tie!");
    }


    function renderTheWinner(pokemonInstance){
        const nameElement=document.getElementById("pokemonNameElement");
        if(nameElement.innerText === pokemonInstance.name){
    
            nameElement.style.color="green";
        }
    }
    

    if (comparisonResult.pokemon1 > comparisonResult.pokemon2) {
        console.log(`${pokemon1Instance.name} wins!`);
        

    } else if (comparisonResult.pokemon1 < comparisonResult.pokemon2) {
        console.log(`${pokemon2Instance.name} wins!`);
      

    } else {
        console.log("It's a tie!");
    }
});

async function createPokemonInstanceFromUrl(pokemonUrl){
    let pokemonResponse = await fetch (pokemonUrl);
    let pokemonData = await pokemonResponse.json();
    return createPokemonInstance(pokemonData);
}





   


function updatePokemonHP(pokemonInstance, detailsId) {
   
    const hpElement = document.getElementById(`hp-${detailsId}`);
    if (hpElement) {
        hpElement.innerText = `HP: ${pokemonInstance.stats.hp}`; // Update the text to reflect the new HP
    } else {
       
        console.log('HP element not found, consider setting up the UI for this Pokémon.');
    }
}


async function startBattle (pokemon1, pokemon2){
    let attacker;
    let defender;
    let defenderDetailsId;

    if (pokemon1.stats.speed >= pokemon2.stats.speed){
        attacker=pokemon1;
        defender=pokemon2;
        defenderDetailsId = 'pokemonDetails2';
    }else{
        attacker=pokemon2;
        defender=pokemon1;
        defenderDetailsId = 'pokemonDetails1';
    }

    while (attacker.stats.hp> 0 && defender.stats.hp> 0){
        await attack (attacker, defender);
        updatePokemonHP(defender, defenderDetailsId);

        if (defender.stats.hp<= 0){
            resultDisplay.innerText=`${defender.name} fainted. ${attacker.name} wins!`
            console.log(`${defender.name} fainted. ${attacker.name} wins!`);
            document.getElementById(defenderDetailsId).style.backgroundColor = 'red';
            break;
        }
        [attacker, defender] = [defender, attacker]; 
        defenderDetailsId = defenderDetailsId === 'pokemonDetails1' ? 'pokemonDetails2' : 'pokemonDetails1';
    }

 }


//funktion-utföra attack


async function attack(attacker, defender){
    const attackName = attacker.moves[0].move.name;
    const damage = calculateDamage(attacker, defender);
    const actualDamage = Math.max(damage, 10)

    defender.stats.hp-= actualDamage;
    attackDisplay.innerText=`${attacker.name} used ${attackName} and did ${actualDamage} damage. ${defender.name} remaining HP: ${defender.stats.hp}.`
    console.log(`${attacker.name} used ${attackName} and did ${actualDamage} damage. ${defender.name} remaining HP: ${defender.stats.hp}.`);
    
    if (defender.stats.hp <= 0) {
        resultDisplay.innerText=`${defender.name} has fainted!`
        console.log(`${defender.name} has fainted!`);
        // Here you might want to trigger any additional logic for when a Pokémon faints, like updating the UI
    }
}
//uppdatera HP 
function calculateDamage (attacker, defender){
    const attackerAttack = attacker.stats.attack + attacker.stats.specialAttack;
    const defenderDefense = defender.stats.defense + defender.stats.specialDefense;
    return (attackerAttack - defenderDefense) * 0.8;
}

attackBtn.addEventListener("click", async ()=>{
    const pokemon1Url = dropDownMenu1.value;
    const pokemon2Url = dropDownMenu2.value;

    const pokemon1Instance = await createPokemonInstanceFromUrl(pokemon1Url);
    const pokemon2Instance = await createPokemonInstanceFromUrl(pokemon2Url);

     startBattle(pokemon1Instance, pokemon2Instance);
   

});



