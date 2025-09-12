let completeList = []
fetch('./src/BerryTable.json')
  .then(resp => resp.json())
  .then(data => {completeList = data});

const buttonGo = document.querySelector(".button1");
const buttonList = document.querySelector(".button2");
const buttonReset = document.querySelector(".button3");

let filteredList = completeList;
let commonRarity = 45;
let uncommonRarity = 35;
let rareRarity = 15;
let mythicRarity = 5;

buttonGo.addEventListener('click', e =>{
  filteredList = filterByCriteria(completeList);
  if(filteredList.length > 0){
    filteredList = gatherRandoms(filteredList, document.getElementById('numberField').value);
    document.getElementById('listSpace').innerHTML = `
    ${filteredList.map(berryTemplate).join('')}
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
    ${filteredList.map(berryTemplate).join('')}
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
  
buttonReset.addEventListener('click', e =>{
  document.getElementById('rarityDrop').value = 'Egal';
})

function berryTemplate(berry){
  return `
  <div class="pkmn-box">
    <img class="pkmn-photo" src="./pics/${berry.number}.png">
    <div class="pkmn-text-box">
      <p class="pkmn-name">${berry.name}</p>
      <p class="english-name">#${berry.number}</p>
      <p class="english-name">${berry.nameEnglish}</p>
    </div>
    <div>
      <div style="max-width: 400px">
        <p>${berry.effect}</p>
        <p class="english-name">${berry.description}</p>
      </div>
    </div>
  </div>
  `
}

function filterByCriteria(listToFilter){
  if(document.getElementById('rarityDrop').value != 'Egal'){
    listToFilter = listToFilter.filter(compareRarity)
  }
  return listToFilter
}

function compareRarity(entry){
  if(entry.rarity == document.getElementById('rarityDrop').value){
    return entry
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

function filterByRarity(contenderList){
  if('Egal' == document.getElementById('rarityDrop').value){
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