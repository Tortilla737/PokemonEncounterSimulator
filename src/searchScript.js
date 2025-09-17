let completeList = []
fetch('./src/PokemonTable.json')
  .then(resp => resp.json())
  .then(data => {completeList = data})
  .catch(error => console.error(error));

let filteredList = completeList;
let rarityDistribution = [44,32,16,8]; //common, uncommon, rare, very rare. Die Länge dieses Array muss der Anzahl der möglichen Rarities entsprechen
let shinyChance = 4069; //4069
let fatChance = 500;     //36

//#region render function
function renderResults(isRandom){
  filteredList = filterByCriteria(completeList);
  document.getElementById('numberOfResultsField').innerText = filteredList.length;
  if(filteredList.length > 0){
    if(isRandom){
      filteredList = gatherRandoms(filteredList, document.getElementById('numberField').value);
    }
    let displayElements = 1;
    document.getElementById('listSpace').innerHTML = filteredList.map(pokemonTemplate).join('');
  }
  else{
    document.getElementById('listSpace').innerHTML = `
    <div class="pkmn-box">
      <h2 class="pkmn-name">Keine Einträge</h2>
    </div>
    `;
  }
}

//#region Box Templates
function pokemonTemplate(pkmn){
  let gender = getGender(pkmn);
  return `
  <div class="pkmn-box ${pkmn.type1}">
    <img class="pkmn-photo" src="./pics/${getPic(pkmn, gender)}.png">
    <div class="pkmn-text-box">
      <p class="english-name">#${pkmn.number}</p>
      <p class="pkmn-name">${pkmn.name}</p>
      <p class="english-name">${genderSym(gender)}</p>
      <p class="english-name">${pkmn.nameEnglish}</p>
      <div class="rank-box">
        <img class="rank-photo" src="./icons/${pkmn.rank}.svg">
        <p class="english-name">${pkmn.rank}</p>
      </div>
      ${checkStatus(pkmn)}
    </div>
    <div class="pkmn-right-box">
      <p class="centered">Typ:</p>
      <div class="type-box">
        <img class="type-photo" src="./icons/${pkmn.type1}.svg">
        <p class="english-name">${pkmn.type1}</p>
      </div>
      ${checkType2(pkmn)}
    </div>
  </div>
  `
}

//#region Determine Randoms
function getGender(entry){
  if(entry.maleChance !== null){
    if(entry.maleChance > (Math.floor(Math.random() *100)+1)){
      return 'm'
    }
    else{
      return 'f'
    }
  }
  else{
    return 'n/a'
  }
}

function getPic(entry, gender){
  if(entry.special.includes('Geschlecht')){
    if(gender == 'f'){
      return entry.number + 'gend'
    }
    else{
      //determine number of variations
      return entry.number
    }
  }
  else if(entry.special.includes('Variante')){
    return entry.number
  }
  else {
    return entry.number
  }
}

function genderSym(gender){
  if(gender == 'f'){
    return '♀'
  }
  else if(gender == 'm'){
    return '♂'
  }
  else{
    return ''
  }
}

function checkType2(entry){
  if(entry.type2 !== ''){
    return `
    <div class="type-box">
      <img class="type-photo" src="./icons/${entry.type2}.svg"></img>
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
    output = output + `<p class="shiny-text">shiny!</p>`
  }
  if(1 == Math.floor(Math.random() * fatChance)){
    output =  output + `<p class="shiny-text">overgrown!</p>`
  }
  if(0){
    output = output + `<p>Wesen</p>`
  }
  return output
}

//#region Filtering
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
  listToFilter = listToFilter.filter(compareRegions);
  listToFilter = listToFilter.filter(compareSpecials);
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

function compareRegions(entry){
  for(let i=0; i<regionCheckboxes.length; i++){
    if(regionCheckboxes[i].checked && entry.origin.includes(keys['Regions'][i])){
      return entry
    }
  }
}

function compareSpecials(entry) {
  // Check if entry.special includes none of the keys['Specials']
  if (keys['Specials'].every(special => !entry.special.includes(special))) {
    return entry;
  }

  // Check if entry.special includes one of the keys['Specials'] and the corresponding checkbox is checked
  for (let i = 0; i < specialCheckboxes.length; i++) {
    if (entry.special.includes(keys['Specials'][i]) && specialCheckboxes[i].checked) {
      return entry;
    }
  }
}

function filterByRarity(contenderList){
  if('Egal' == document.getElementById('rankDrop').value){
    //1. Es wird gesucht, welche "rarities" in contenderList enthalten sind. So kann nicht fälschlicherweise ein "very rare" ausgewählt werden, wenn nur "common" und "uncommon" in contenderList sind
    includedRarities = contenderList.map(entry => entry.rarity).filter((value, index, self) => self.indexOf(value) === index);
    includedRarities = includedRarities.sort((a,b) => a - b)

    let rarityTotal = 0;
    includedRarities.forEach(element => {
      rarityTotal += rarityDistribution[element-1];
    }); //Summe aller enthaltenen rarity distribution values, damit die zufällige Zahl korrekt skaliert wird
    let includedDistributions = [];
    includedRarities.forEach(element => {
      includedDistributions.push(rarityDistribution[element-1]);
    }); //Array der enthaltenen distribution values, um später die korrektern Verhältnisse zu vergleichen

    let determinedRarity = Math.floor(Math.random() * rarityTotal);
    determinedRarity = findRarityIndex(includedDistributions, determinedRarity);
    //2. Es wird eine zufällige Zahl zwischen 0 und der Summe der enthaltenen rarity distribution values generiert
    //3. Für jede Stufe der enthaltenen rarity distribution values wird geprüft, ob die zufällige Zahl in den Bereich dieser Stufe fällt

    return contenderList.filter((entry) => entry.rarity == includedRarities[determinedRarity])
    //4. Der entsprechende Index wird an die enthaltenen Rarities gemappt und die contenderList danach gefiltert
  }
  else{
    return contenderList
  }
}

function findRarityIndex(distribution, number) {
  let cumulative = 0;
  for (let i = 0; i < distribution.length; i++) {
    cumulative += distribution[i];
    if (number < cumulative) {
      return i; // Gibt den Index (0, 1, 2, oder 3) zurück
    }
  }
  return distribution.length - 1; // Fallback für den seltensten Fall
}


/*
Sektionen zusammenklappen

Typ Box background color = Typ Icon background color

Offizielle Beeren Stats

Wesen bei getRandoms ergänzen
*/