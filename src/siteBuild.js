let keys = {};
fetch('./src/PropertyKeys.json')
  .then(response => response.json())
  .then(data => {
    keys = data;
    fillBiomInfoBoxes();
    getRegionCheckboxes();
    getSpecialCheckboxes();
    regionCheckboxes.forEach(box => box.checked = true); //start with all regions checked
  })
  .catch(error => console.error(error));


//gather all 'Region' checkboxes
const regionCheckboxes = [];
function getRegionCheckboxes(){
    for(let i=0; i<keys['Regions'].length; i++){
        regionCheckboxes.push(document.getElementById('checkRegion' + (i+1)));
    }
}

const buttonAllRegions = document.getElementById("checkAllRegions");
const buttonNoRegions = document.getElementById("checkNoRegions");
buttonAllRegions.addEventListener('click', e =>{
    regionCheckboxes.forEach(box => box.checked = true);
})
buttonNoRegions.addEventListener('click', e =>{
    regionCheckboxes.forEach(box => box.checked = false);
})

//gather all 'Special' checkboxes
const specialCheckboxes = [];
function getSpecialCheckboxes(){
    for(let i=0; i<keys['Specials'].length; i++){
        specialCheckboxes.push(document.getElementById('checkSpecial' + (i+1)));
    }
}

const buttonAllSpecials = document.getElementById("checkAllSpecials");
const buttonNoSpecials = document.getElementById("checkNoSpecials");
buttonAllSpecials.addEventListener('click', e =>{
    specialCheckboxes.forEach(box => box.checked = true);
})
buttonNoSpecials.addEventListener('click', e =>{
    specialCheckboxes.forEach(box => box.checked = false);
})

//go buttons
const buttonGo = document.getElementById("buttonGoRandom");
const buttonList = document.getElementById("buttonShowAll");
const buttonReset = document.getElementById("buttonResetAll");

buttonGo.addEventListener('click', e =>{
  renderResults(true);
})
buttonList.addEventListener('click', e =>{
  renderResults(false);
})

buttonReset.addEventListener('click', e =>{
  document.getElementById('typeDrop').value = 'Egal';
  document.getElementById('biomsDrop1').value = 'Egal';
  document.getElementById('biomsDrop2').value = 'Egal';
  document.getElementById('weatherDrop').value = 'Egal';
  document.getElementById('daytimeDrop').value = 'Egal';
  document.getElementById('rankDrop').value = 'Egal';
  regionCheckboxes.forEach(box => box.checked = true);
  specialCheckboxes.forEach(box => box.checked = false);
})

//fill biom info boxes from json data
function fillBiomInfoBoxes(){
    for(let i=0; i<keys['Bioms'].length; i++){
        document.getElementById('biomInfoGroup'+(1+Math.floor(i/3))).innerHTML += `
        <h3>${keys['Bioms'][i].Name}</h3>
        <p>${keys['Bioms'][i].Description}</p>
        `;
    }
}

//Back to top button
const buttonToTop = document.getElementById("topButton");
buttonToTop.addEventListener('click', e =>{
    window.scrollTo({top: 0, behavior: 'smooth'});
})