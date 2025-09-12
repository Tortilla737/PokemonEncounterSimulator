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


//gather all Region checkboxes
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

//gather all Special checkboxes
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

//fill biom info boxes from json
function fillBiomInfoBoxes(){
    for(let i=0; i<keys['Bioms'].length; i++){
        console.log(1+Math.floor(i/3));
        document.getElementById('biomInfoGroup'+(1+Math.floor(i/3))).innerHTML += `
        <h3>${keys['Bioms'][i].Name}</h3>
        <p>${keys['Bioms'][i].Description}</p>
        `;
    }
}