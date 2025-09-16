// Load past tasks from localStorage
let pastTasks = JSON.parse(localStorage.getItem('pastTasks'));
if (!pastTasks) pastTasks = [];

/*************** Display past tasks ***************/
function displayPastTasks() {
  // Build HTML for done tasks
  let html = `
    <details>
      <summary>View Done Tasks (by numbers)</summary>
      <p>`;
  
  // Join numbers with comma
  html += pastTasks.map(num => `#${num}`).join(', ');
  html += `</p></details>`;

  document.querySelector('.past-challenges').innerHTML = html;
}

/*************** Save pastTasks to localStorage ***************/
function savePastTasks() {
  localStorage.setItem('pastTasks', JSON.stringify(pastTasks));
}

/*************** Mark the challenge as done ***************/
function markDone(number) {
  // Avoid duplicates
  if (!pastTasks.includes(number)) {
    pastTasks.push(number);
    savePastTasks();
    displayPastTasks();
  }
}

/*************** Exit function ***************/
function Exit() {
  document.querySelector('.exit').addEventListener('click', () => {
    loadHomePage();
  });
}

/*************** Position of the buttons ***************/
function position() {
  let html=`
      <button class="done">Mark challenge as done</button>
      <button class="exit">Exit</button>`;

  if (window.innerWidth > 1000) {
    document.querySelector('.menu-2').innerHTML =html;
    document.querySelector('.button-area').innerHTML = '';
  } else {
    document.querySelector('.menu-2').innerHTML = '';
    document.querySelector('.button-area').innerHTML =html ;
  }

  // Reattach event listeners
  attachButtons();
}

//on resizig----------------
window.addEventListener('resize', () => {
if (document.querySelector('.challenge-today').innerHTML !='❓'){
      position();
      console.log('resize');}

})


/*************** Attach events to done and exit buttons ***************/
function attachButtons() {
  const doneBtn = document.querySelector('.done');
  const exitBtn = document.querySelector('.exit');

  if (doneBtn) {
    doneBtn.addEventListener('click', () => {
      // Extract number from current challenge
      const currentText = document.querySelector('.challenge-today').textContent.trim();
      // This regex extracts the first number (like 1, 2, 3…)
      const match = currentText.match(/^(\d+)/);
      if (match) {
        const number = parseInt(match[1], 10);
        markDone(number);
      }
    });
  }

  if (exitBtn) {
    exitBtn.addEventListener('click', () => loadHomePage());
  }
}

/*************** Load Home Page ***************/
function loadHomePage() {
   document.querySelector('.challenge-today').innerHTML = '❓';
  document.querySelector('.menu-2').innerHTML = '';
  document.querySelector('.button-area').innerHTML = '';
  displayPastTasks();
}

/*************** Load Second Page ***************/
function loadSecondPage() {
  document.querySelectorAll('.tasks p').forEach(element => {
    element.addEventListener('click', () => {
      position();

      document.querySelector('.challenge-today').innerHTML = element.innerHTML;

      const done = document.querySelector('.done');
      const exit = document.querySelector('.exit');

      if (done) done.style.display = 'block';
      if (exit) exit.style.display = 'block';
    });
  });
}

/*************** Initialize ***************/
document.addEventListener('DOMContentLoaded', () => {
  loadHomePage();
  loadSecondPage();
});
