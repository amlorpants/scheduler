// date/time population
class TimeblockObj {
  constructor(hour, todo) {
    this.hour = hour;
    this.todo = todo;
  }
}

window.onload = function () {
  const currentTime = moment();
  const currentTimeSections = getCurrentTimeSections();

  displayCurrentDate(currentTime);
  displayTimeblockRows(currentTime);

  document
    .querySelector('.container')
    .addEventListener('click', function (event) {
      containerClicked(event, currentTimeSections);
    });
  setTimeblockText(currentTimeSections);
};

function getCurrentTimeSections() {
  const currentTimeSections = localStorage.getItem(
    'timeblockObjects'
  );
  return currentTimeSections ? JSON.parse(currentTimeSections) : [];
}

function displayCurrentDate(currentTime) {
  document.getElementById('currentDay').textContent =
    currentTime.format('dddd, MMMM Do');
}

/*** functions for timeblock display below ***/
function displayTimeblockRows(currentTime) {
  const currentHour = currentTime.hour();
  for (let i = 9; i <= 17; i++) {
    const timeblock = createTimeblockRow(i);
    const hourCol = createCol(createHourDiv(i), 1);
    const textArea = createCol(createTextArea(i, currentHour), 10);
    const saveBtn = createCol(createSaveBtn(i), 1);
    appendTimeblockColumns(timeblock, hourCol, textArea, saveBtn);
    document.querySelector('.container').appendChild(timeblock);
  }
}

function createTimeblockRow(hourId) {
  const timeblock = document.createElement('div');
  timeblock.classList.add('row');
  timeblock.id = `timeblock-${hourId}`;
  return timeblock;
}

function createCol(element, colSize) {
  const col = document.createElement('div');
  col.classList.add(`col-${colSize}`, 'p-0');
  col.appendChild(element);
  return col;
}

function createHourDiv(hour) {
  const hourCol = document.createElement('div');
  hourCol.classList.add('hour');
  hourCol.textContent = formatHour(hour);
  return hourCol;
}

function formatHour(hour) {
  const hourString = String(hour);
  return moment(hourString, 'h').format('hA');
}

function createTextArea(hour, currentHour) {
  const textArea = document.createElement('textarea');
  textArea.classList.add(
    getTextAreaBackgroundClass(hour, currentHour)
  );
  return textArea;
}

function getTextAreaBackgroundClass(hour, currentHour) {
  return hour < currentHour
    ? 'past'
    : hour === currentHour
    ? 'present'
    : 'future';

  // alternative way to write this function:
  // if (hour < currentHour) {
  //   // 'past'
  // } else if (hour === currentHour) {
  //   // 'present'
  // } else {
  //   // 'future'
  // }
}

function createSaveBtn(hour) {
  const saveBtn = document.createElement('button');
  saveBtn.classList.add('saveBtn');
  saveBtn.textContent = 'Save';
  saveBtn.setAttribute('data-hour', hour);
  return saveBtn;
}

function appendTimeblockColumns(
  timeblockRow,
  hourCol,
  textAreaCol,
  saveBtnCol
) {
  const innerCols = [hourCol, textAreaCol, saveBtnCol];
  for (let col of innerCols) {
    timeblockRow.appendChild(col);
  }
}

/*** below are all local storage functions ***/
function containerClicked(event, timeblockList) {
  if (isSaveButton(event)) {
    const timeblockHour = getTimeblockHour(event);
    const textAreaValue = getTextAreaValue(timeblockHour);
    placeTimeblockInList(
      new TimeblockObj(timeblockHour, textAreaValue),
      timeblockList
    );
    saveTimeblockList(timeblockList);
  }
}

function isSaveButton(event) {
  return (
    event.target.matches('button') || event.target.matches('.fa-save')
  );
}

function getTimeblockHour(event) {
  return event.target.matches('.fa-save')
    ? event.target.parentElement.dataset.hour
    : event.target.dataset.hour;
}

function getTextAreaValue(timeblockHour) {
  return document.querySelector(
    `#timeblock-${timeblockHour} textarea`
  ).value;
}

function placeTimeblockInList(newTimeblockObj, timeblockList) {
  if (timeblockList.length > 0) {
    for (let savedTimeblock of timeblockList) {
      if (savedTimeblock.hour === newTimeblockObj.hour) {
        savedTimeblock.todo = newTimeblockObj.todo;
        return;
      }
    }
  }
  timeblockList.push(newTimeblockObj);
  return;
}

function saveTimeblockList(timeblockList) {
  localStorage.setItem(
    'timeblockObjects',
    JSON.stringify(timeblockList)
  );
}

function setTimeblockText(timeblockList) {
  if (timeblockList.length === 0) {
    return;
  }
  for (let timeblock of timeblockList) {
    document.querySelector(
      `#timeblock-${timeblock.hour} textarea`
    ).value = timeblock.todo;
  }
}
