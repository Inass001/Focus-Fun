//==============================
// 1. TO DO LIST
//==============================

//--------- GLOBAL VARIABLES ----------
let tabToday = JSON.parse(localStorage.getItem('tabToday'));
if (!tabToday) { tabToday = []; }

let tabTomo = JSON.parse(localStorage.getItem('tabTomo'));
if (!tabTomo) { tabTomo = []; }

let doneToday = JSON.parse(localStorage.getItem('doneToday'));
if (!doneToday) { doneToday = []; }

let doneTomo = JSON.parse(localStorage.getItem('doneTomo'));
if (!doneTomo) { doneTomo = []; }


//--------- DISPLAY FUNCTIONS ----------
function displayToday() {
  let i = 0;
  let html = '';

  tabToday.forEach(element => {
    let done = doneToday[i];

    if (done) {
      html += `<div>
                 <input type="checkbox" id="${i}" data-id="${i}" checked class="today">`;
    } else {
      html += `<div>
                 <input type="checkbox" id="${i}" data-id="${i}" class="today">`;
    }

    html += `
                 <button class="delete deleteToday" data-id="${i}">❌</button>
                 <label for="${i}" data-id="${i}">${element}</label> 
             </div>`;
    i++;
  });

  document.querySelector('.tasks-today').innerHTML = html;
}

function displayTomorrow() {
  let i = 0;
  let html = '';

  tabTomo.forEach(element => {
    let done = doneTomo[i];

    if (done) {
      html += `<div>
                 <input type="checkbox" id="${i}" data-id="${i}" checked class="tomorrow">`;
    } else {
      html += `<div>
                 <input type="checkbox" id="${i}" data-id="${i}" class="tomorrow">`;
    }

    html += `
                 <button class="delete deleteTomorrow" data-id="${i}">❌</button>
                 <label for="${i}" data-id="${i}">${element}</label> 
             </div>`;
    i++;
  });

  document.querySelector('.tasks-tomorrow').innerHTML = html;
}

// Initial display
displayTomorrow();
displayToday();


//--------- TRACKER ----------
function updateTracker() {
  let total = tabToday.length;
  let done = 0;
  let progress = 0;

  if (total !== 0) {
    doneToday.forEach(element => {
      if (element) { done++ }
    })
    progress = ((done * 100) / total).toFixed(2);
  }

  document.getElementById('total-tasks').innerHTML = total;
  document.getElementById('done-tasks').innerHTML = done;
  document.getElementById('percent').innerHTML = `${progress}%`;
  document.querySelector('.progress-fill').style.width=`${progress}%`;
}
updateTracker();


//--------- DELETE FUNCTIONS ----------
function deleteToday() {
  document.querySelectorAll('.deleteToday').forEach(element => {
    element.addEventListener('click', () => {
      let index = element.dataset.id;

      tabToday.splice(index, 1);
      doneToday.splice(index, 1);

      localStorage.setItem('tabToday', JSON.stringify(tabToday));
      localStorage.setItem('doneToday', JSON.stringify(doneToday));

      displayToday();
      updateTracker();
      deleteToday();
      checkToday();
    })
  })
}

function deleteTomorrow() {
  document.querySelectorAll('.deleteTomorrow').forEach(element => {
    element.addEventListener('click', () => {
      let index = element.dataset.id;

      tabTomo.splice(index, 1);
      doneTomo.splice(index, 1);

      localStorage.setItem('tabTomo', JSON.stringify(tabTomo));
      localStorage.setItem('doneTomo', JSON.stringify(doneTomo));

      displayTomorrow();
      deleteTomorrow();
      checkTomorrow();
    })
  })
}

// Initial delete bindings
deleteToday();
deleteTomorrow();


//--------- CHECKBOX FUNCTIONS ----------
function checkToday() {
  document.querySelectorAll('.today').forEach(element => {
    element.addEventListener('click', () => {
      let index = parseInt(element.dataset.id);
      doneToday[index] = element.checked;

      localStorage.setItem('doneToday', JSON.stringify(doneToday));
      updateTracker();
    })
  })
}

function checkTomorrow() {
  document.querySelectorAll('.tomorrow').forEach(element => {
    element.addEventListener('click', () => {
      let index = parseInt(element.dataset.id);
      doneTomo[index] = element.checked;

      localStorage.setItem('doneTomo', JSON.stringify(doneTomo));
      updateTracker();
    })
  })
}

// Initial checkbox bindings
checkToday();
checkTomorrow();


//--------- ADD NEW ELEMENTS ----------
document.querySelector('.add-today').addEventListener('click', () => {
  let newelem = document.getElementById('today-input').value.trim();
  if (newelem !== '') {
    tabToday.push(newelem);
    doneToday.push(false); // to keep arrays aligned

    localStorage.setItem('tabToday', JSON.stringify(tabToday));
    localStorage.setItem('doneToday', JSON.stringify(doneToday));

    displayToday();
    updateTracker();
    deleteToday();
    checkToday();
  }
});

document.querySelector('.add-tomorrow').addEventListener('click', () => {
  let newelem = document.getElementById('tomorrow-input').value.trim();
  if (newelem !== '') {
    tabTomo.push(newelem);
    doneTomo.push(false);

    localStorage.setItem('tabTomo', JSON.stringify(tabTomo));
    localStorage.setItem('doneTomo', JSON.stringify(doneTomo));

    displayTomorrow();
    deleteTomorrow();
    checkTomorrow();
  }
});


//==============================
// 2. NOTES
//==============================

//--------- GET FROM STORAGE ----------
let notes = localStorage.getItem('notes'); // no need JSON
let inputarea = document.querySelector('textarea');
if (notes) { inputarea.value = notes; }

//--------- SAVE TO STORAGE ----------
document.querySelector('.save').addEventListener('click', () => {
  localStorage.setItem('notes', inputarea.value);
})
