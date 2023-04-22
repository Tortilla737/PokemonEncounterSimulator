let completeList = []
fetch('./src/PokemonTable.json')
  .then(resp => resp.json())
  .then(data => {completeList = data})

const buttonList = document.querySelector(".button2");
const buttonGo = document.querySelector(".button1");
let filteredList = completeList;
let commonRarity = 60;
let uncommonRarity = 30;
let rareRarity = 8;
let mythicRarity = 2;
let shinyChance = 8000;
let fatChance = 36;

buttonGo.addEventListener('click', e =>{
  filteredList = filterByCriteria(completeList);
  if(filteredList.length > 0){
    filteredList = gatherRandoms(filteredList, document.getElementById('numberField').value);
    document.getElementById('listSpace').innerHTML = `
    ${filteredList.map(pokemonRandomTemplate).join('')}
    `;
  }
  else{
    document.getElementById('listSpace').innerHTML = `
    <div class="pkmn-box">
      <h2 class="pkmn-name">Keine Einträge</h2>
    </div>
    `;
  }
})

buttonList.addEventListener('click', e =>{
  filteredList = filterByCriteria(completeList);
  if(filteredList.length > 0){
    document.getElementById('listSpace').innerHTML = `
    ${filteredList.map(pokemonTemplate).join('')}
    `;
  }
  else{
    document.getElementById('listSpace').innerHTML = `
    <div class="pkmn-box">
      <h2 class="pkmn-name">Keine Einträge</h2>
    </div>
    `;
  }
  
})

function pokemonTemplate(pkmn){
  return `
  <div class="pkmn-box ${pkmn.type1}">
    <img class="pkmn-photo" src="./pics/${pkmn.number}.png">
    <div class="pkmn-text-box">
      <h2 class="english-name">#${pkmn.number}</h2>
      <h2 class="pkmn-name">${pkmn.name}</h2>
      <h1 class="english-name">${pkmn.nameEnglish}</h1>
    </div>
    <div class="pkmn-right-box">
      <div class="rank-box">
        <img class="rank-photo" src="./icons/${pkmn.rank}.svg">
        <p class="english-name">${pkmn.rank}</p>
      </div>
      <div class="type-box">
        <img class="rank-photo" src="./icons/${pkmn.type1}.svg">
        <p class="english-name">${pkmn.type1}</p>
      </div>
      ${checkType2(pkmn)}
    </div>
  </div>
  `
}

function pokemonRandomTemplate(pkmn){
  return `
  <div class="pkmn-box ${pkmn.type1}">
    <img class="pkmn-photo" src="./pics/${pkmn.number}.png">
    <div class="pkmn-text-box">
      <h2 class="english-name">#${pkmn.number}</h2>
      <h2 class="pkmn-name">${pkmn.name}</h2>
      <h2 class="english-name">${gender(pkmn)}</h2>
      <h1 class="english-name">${pkmn.nameEnglish}</h1>
      ${checkStatus(pkmn)}
    </div>
    <div class="pkmn-right-box">
      <div class="rank-box">
        <img class="rank-photo" src="./icons/${pkmn.rank}.svg">
        <p class="english-name">${pkmn.rank}</p>
      </div>
      <div class="type-box">
        <img class="rank-photo" src="./icons/${pkmn.type1}.svg">
        <p class="english-name">${pkmn.type1}</p>
      </div>
      ${checkType2(pkmn)}
    </div>
  </div>
  `
}

function gender(entry){
  if(entry.maleChance !== null){
    if(entry.maleChance < (Math.floor(Math.random() *100)+1)){
      return '♀'
    }
    else{
      return '♂'
    }
  }
  else{
    return ''
  }
}

function gatherRandoms(contenderList, count){
  let list = [];
  for(let i = 0; i < count; i++){
    let filteredRarityList = filterByRarity(contenderList);
    list.push(filteredRarityList[Math.floor(Math.random() * filteredRarityList.length)]);
  }
  return list
}

function filterByCriteria(listToFilter){
  if(document.getElementById('typeDrop').value != 'Egal'){
    listToFilter = listToFilter.filter(compareType)
  }
  if(document.getElementById('rankDrop').value != 'Egal'){
    listToFilter = listToFilter.filter(compareRank)
  }
  if(document.getElementById('biomsDrop1').value != 'Egal'){
    listToFilter = listToFilter.filter(compareBiom1)
  }
  if(document.getElementById('biomsDrop2').value != 'Egal'){
    listToFilter = listToFilter.filter(compareBiom2)
  }
  if(document.getElementById('weatherDrop').value != 'Egal'){
    listToFilter = listToFilter.filter(compareWeather)
  }
  if(document.getElementById('daytimeDrop').value != 'Egal'){
    listToFilter = listToFilter.filter(compareDaytime)
  }
  return listToFilter
}

function compareType(entry){
  if(entry.type1 == document.getElementById('typeDrop').value ||
      entry.type2 == document.getElementById('typeDrop').value){
    return entry
  }
}

function compareRank(entry){
  if(entry.rank == document.getElementById('rankDrop').value){
    return entry
  }
}

function compareBiom1(entry){
  if(entry.biom1 == document.getElementById('biomsDrop1').value ||
      entry.biom2 == document.getElementById('biomsDrop1').value ||
      entry.biom3 == document.getElementById('biomsDrop1').value){
    return entry
  }
}

function compareBiom2(entry){
  if(entry.biom1 == document.getElementById('biomsDrop2').value ||
      entry.biom2 == document.getElementById('biomsDrop2').value ||
      entry.biom3 == document.getElementById('biomsDrop2').value){
    return entry
  }
}

function compareWeather(entry){
  if(entry.weather == document.getElementById('weatherDrop').value){
    return entry
  }
}

function compareDaytime(entry){
  if(entry.daytime == document.getElementById('daytimeDrop').value || entry.daytime == ''){
    return entry
  }
}

function filterByRarity(contenderList){
  if('Egal' == document.getElementById('rankDrop').value){
    let determinedRarity = Math.floor(Math.random() * 100);
    if(determinedRarity<=commonRarity){determinedRarity=1}
    else if(determinedRarity>commonRarity && determinedRarity<(commonRarity+uncommonRarity)){determinedRarity=2}
    else if(determinedRarity>(commonRarity+uncommonRarity) && determinedRarity<(commonRarity+uncommonRarity+rareRarity)){determinedRarity=3}
    else{determinedRarity=4}
    return contenderList.filter((entry) => entry.rarity == determinedRarity)
  }
  else{
    return contenderList
  }
  
}

function checkType2(entry){
  if(entry.type2 !== ''){
    return `
    <div class="type-box">
      <img class="rank-photo" src="./icons/${entry.type2}.svg"></img>
      <p class="english-name">${entry.type2}</p>
    </div>
    `
  }
  else{
    return ''
  }
}

function checkStatus(){
  let output = '';
  if(1 == Math.floor(Math.random() * shinyChance)){
    output = output + `<h1 class="shiny-text">shiny!</h1>`
  }
  if(1 == Math.floor(Math.random() * fatChance)){
    output =  output + `<h1 class="shiny-text">overgrown!</h1>`
  }
  if(0){
    output = output + `<p>Wesen</p>`
  }
  return output
}

/*
elegantere Lösung für rarity distribution

reset button

Typ Box background color = Typ Icon background color

random beere
*/