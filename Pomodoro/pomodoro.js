/********************************************
 *              PRIZES SETUP
 ********************************************/
let prizes = JSON.parse(localStorage.getItem('prizes'));
if (!prizes) {
  prizes = [
    {
      given: false,
      number: 0,
      title: "Fresh Starter 🥚",
      description: "First Pomodoro From The First Use Of The Website → Earn the Fresh Starter badge"
    },
    { 
      given: false,
      number: 0,
      title: "Focused Learner 📚",
      description: "Complete 5 Pomodoros in a day → Earn the Focused Learner badge"
    },
    {
      given: false,
      number: 0,
      title: "Productivity Master 🏆",
      description: "Complete 10 Pomodoros in a day → Earn the Productivity Master badge"
    },
    {
      given: false,
      number: 0,
      title: "Consistency Hero 🔥",
      description: "Maintain a 7-day streak → Earn the Consistency Hero badge"
    },
    {
      given: false,
      number: 0,
      title: "Legend of Focus 👑",
      description: "Maintain a 30-day streak → Earn the Legend of Focus badge"
    }
  ];
}

let FirstPrize = false;
let EarnedPrizes = JSON.parse(localStorage.getItem('EarnedPrizes'));
if (!EarnedPrizes) EarnedPrizes = [];


/********************************************
 *              ELEMENTS
 ********************************************/
let minutesEl   = document.querySelector('.minutes'); 
let secondsEl   = document.querySelector('.seconds'); 
let startBtn    = document.querySelector('.start');
let resetBtn    = document.querySelector('.reset');
let sessionEle  = document.querySelector('.session-length');
let breakEle    = document.querySelector('.break-length');
let mode        = document.querySelector('.mode');

let countdown; 
let time = parseInt(minutesEl.innerHTML) * 60;
let isRunning = false;


/********************************************
 *              POMODORO STATS
 ********************************************/
let today   = JSON.parse(localStorage.getItem('today'));
let todayP  = JSON.parse(localStorage.getItem('todayP'));
let bestday = JSON.parse(localStorage.getItem('bestday'));
let bestP   = JSON.parse(localStorage.getItem('bestP'));

if (!today) {
  FirstPrize = true; // first use
  today = dayjs().format("DD-MM-YYYY"); 
  todayP = 0;
  bestday = today;
  bestP = 0;
} else {
  if (today !== dayjs().format("DD-MM-YYYY")) {
    if (todayP > bestP) {
      bestP = todayP;
      bestday = today;
    }
    todayP = 0;
    today = dayjs().format("DD-MM-YYYY");
  }
}

// Save stats
localStorage.setItem('todayP', JSON.stringify(todayP));
localStorage.setItem('bestP', JSON.stringify(bestP));
localStorage.setItem('today', JSON.stringify(today));
localStorage.setItem('bestday', JSON.stringify(bestday));


/********************************************
 *              STREAK
 ********************************************/
let streak   = JSON.parse(localStorage.getItem('streak'));
let lastDate = JSON.parse(localStorage.getItem('lastDate'));

if (!streak) {
  streak = 0;
  document.querySelector('.streak').innerHTML=streak;}
if (!lastDate) lastDate = null;

function updateStreak() {
  let todayDate = dayjs().format("YYYY-MM-DD");

  if (lastDate === null) {
    streak = 1;
    lastDate = todayDate;
  } else if (lastDate !== todayDate) {
    let diff = dayjs(todayDate).diff(dayjs(lastDate), "day");

    if (diff === 1) {
      streak++;
    } else {
      streak = 1;
    }
    lastDate = todayDate;
  }

  localStorage.setItem('streak', JSON.stringify(streak));
  localStorage.setItem('lastDate', JSON.stringify(lastDate));

  let streakEl = document.querySelector('.streak');
  if (streakEl) streakEl.innerHTML = streak;
}
updateStreak();


/********************************************
 *              DISPLAY HELPERS
 ********************************************/
function displayStats() {
  document.querySelector('.todayP').innerHTML = todayP;
  document.querySelector('.bestday').innerHTML = bestday;
}
displayStats();

function displayPrizes() {
  let html = '';
  EarnedPrizes.forEach(element => {
    html += `
      <fieldset>
        <dt>⭐ ${element.title}:</dt>
        <dd>${element.description}</dd>
        <div class="repeat"><strong>🎉 Earned: <span class="times">${element.number}</span> times </strong></div>
      </fieldset>
    `;
  });
  document.querySelector('.prizes-container').innerHTML = html;
}

// Init displays
displayStats();
displayPrizes();


/********************************************
 *              PRIZES LOGIC
 ********************************************/
function PomodoroCounterPrizes() {
  updateStreak();

  // First Prize
  if (FirstPrize && !prizes[0].given) {
    prizes[0].given = true;
    EarnedPrizes[0] = { 
      number: 1,
      title: prizes[0].title,
      description: prizes[0].description,
    };
    FirstPrize = false;
  }

  // 5 Pomodoros
  if (todayP === 5) {
    if (prizes[1].given) {
      EarnedPrizes[1].number++;
    } else {
      prizes[1].given = true;
      EarnedPrizes[1] = { 
        number: 1,
        title: prizes[1].title,
        description: prizes[1].description,
      };
    }
  }

  // 10 Pomodoros
  if (todayP === 10) {
    if (prizes[2].given) {
      EarnedPrizes[2].number++;
    } else {
      prizes[2].given = true;
      EarnedPrizes[2] = { 
        number: 1,
        title: prizes[2].title,
        description: prizes[2].description,
      };
    }
  }

  // 7-day streak
  if (streak === 7) {
    if (prizes[3].given) {
      EarnedPrizes[3].number++;
    } else {
      prizes[3].given = true;
      EarnedPrizes[3] = { 
        number: 1,
        title: prizes[3].title,
        description: prizes[3].description,
      };
    }
  }

  // 30-day streak
  if (streak === 30) {
    if (prizes[4].given) {
      EarnedPrizes[4].number++;
    } else {
      prizes[4].given = true;
      EarnedPrizes[4] = { 
        number: 1,
        title: prizes[4].title,
        description: prizes[4].description,
      };
    }
  }

  // Save prizes
  localStorage.setItem('prizes', JSON.stringify(prizes));
  localStorage.setItem('EarnedPrizes', JSON.stringify(EarnedPrizes));
  displayPrizes();
}


/********************************************
 *              TIMER LOGIC
 ********************************************/
function updateDisplay() {
  let min = Math.floor(time / 60);
  let sec = time % 60;

  sec = sec < 10 ? "0" + sec : sec;
  min = min < 10 ? "0" + min : min;

  minutesEl.innerHTML = min;
  secondsEl.innerHTML = sec;
}

function startPauseTimer() {
  if (!isRunning) {
    // Start
    isRunning = true;
    startBtn.textContent = "Pause";
    countdown = setInterval(function() {
      updateDisplay();
      time--;

      if (time < 0) {
            clearInterval(countdown);
            minutesEl.innerHTML = '00';
            secondsEl.innerHTML = '00';
            startBtn.textContent = "Start";
            isRunning = false;

            // ✅ Only count pomodoro if we are in session mode
            if (mode.innerHTML === 'session') {
            todayP++;
            document.querySelector('.todayP').innerHTML = todayP;
            localStorage.setItem('todayP', JSON.stringify(todayP));

            // Update streak & prizes
            PomodoroCounterPrizes();
            }

            // If you want, you could auto-switch to Break mode here
            // mode.innerHTML = (mode.innerHTML === 'session') ? 'Break' : 'session';
            }

    }, 1000);
  } else {
    // Pause
    clearInterval(countdown);
    startBtn.textContent = "Start";
    isRunning = false;
  }
}

function resetTimer() {
  clearInterval(countdown);
  time = parseInt(minutesEl.innerHTML) * 60;
  updateDisplay();
  startBtn.textContent = "Start";
  isRunning = false;
}


/********************************************
 *              SESSION / BREAK UPDATES
 ********************************************/
function updateSession() {
  document.querySelector('.session-dec').addEventListener('click', () => {
    if (sessionEle.innerHTML != 1) {
      sessionEle.innerHTML--;
      minutesEl.innerHTML = sessionEle.innerHTML < 10 ? `0${sessionEle.innerHTML}` : sessionEle.innerHTML;
    }
    time = parseInt(minutesEl.innerHTML) * 60;
    mode.innerHTML = 'session';
    updateDisplay();
  });

  document.querySelector('.session-inc').addEventListener('click', () => {
    if (sessionEle.innerHTML != 59) {
      sessionEle.innerHTML++;
      minutesEl.innerHTML = sessionEle.innerHTML < 10 ? `0${sessionEle.innerHTML}` : sessionEle.innerHTML;
    }
    time = parseInt(minutesEl.innerHTML) * 60;
    mode.innerHTML = 'session';
    updateDisplay();
  });
}
updateSession();

function updateBreak() {
  document.querySelector('.break-dec').addEventListener('click', () => {
    if (breakEle.innerHTML != 1) {
      breakEle.innerHTML--;
      minutesEl.innerHTML = breakEle.innerHTML < 10 ? `0${breakEle.innerHTML}` : breakEle.innerHTML;
    }
    time = parseInt(minutesEl.innerHTML) * 60;
    mode.innerHTML = 'Break';
    updateDisplay();
  });

  document.querySelector('.break-inc').addEventListener('click', () => {
    if (breakEle.innerHTML != 59) {
      breakEle.innerHTML++;
      minutesEl.innerHTML = breakEle.innerHTML < 10 ? `0${breakEle.innerHTML}` : breakEle.innerHTML;
    }
    time = parseInt(minutesEl.innerHTML) * 60;
    mode.innerHTML = 'Break';
    updateDisplay();
  });
}
updateBreak();


/********************************************
 *              INIT
 ********************************************/
//--------------Start nthe counter--------------
startBtn.addEventListener("click", startPauseTimer);
resetBtn.addEventListener("click", resetTimer);
updateDisplay();
