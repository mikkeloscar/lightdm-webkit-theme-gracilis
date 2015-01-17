var WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var MONTH = ["January", "February", "March", "April", "May", "June", "July",
             "August", "September", "October", "November", "December"];

function startTime() {
  var now = new Date();
  var hour = now.getHours();
  var min = now.getMinutes();
  var sec = now.getSeconds();
  var date = now.getDate();
  var month = MONTH[now.getMonth()];
  var day = WEEKDAY[now.getDay()];
  var year = now.getYear();

  hour = formatTime(hour);
  min = formatTime(min);
  sec = formatTime(sec);

  var fmt = day + ' ' + month + ' ' + date + ' - ' + hour + ':' + min + ':' + sec;

  document.getElementById('clock').innerHTML = fmt;

  setTimeout(startTime, 1000);
}

function formatTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

window.onload = startTime;
