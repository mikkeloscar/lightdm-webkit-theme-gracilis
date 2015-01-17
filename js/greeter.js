var DEBUG = true;
var auth_pending = null;

function setupUserList() {
  var lastSelected = localStorage.getItem("last_selected");
  var list = document.getElementById("username");
  for (var i in lightdm.users) {
    var user = lightdm.users[i];
    var selected = "";
    if (lastSelected === user.name) {
      selected = " selected";
      startAuthentication(user.name);
    }
    $(list).append('<option value="' + user.name + '"' + selected + '>' +
                   user.name +'</option>');
  }
}

function debugListUsers() {
  log("Users:");
  for (var i in lightdm.users) {
    log("  " + lightdm.users[i].name);
  }
  log("");
}

function debugListSessions() {
  log("Sessions:");
  for (var i in lightdm.sessions) {
    log("  " + lightdm.sessions[i].name);
  }
  log("");
}

/**
 * UI Initialization.
 */
$(document).ready(function () {
  // debug info
  debugListUsers();
  debugListSessions();

  setupUserList();

  $("#shutdown").on("click", function () {
    lightdm.shutdown();
  });
  $("#reboot").on("click", function () {
    lightdm.restart();
  });

  // set focus on password field
  $("#password").focus();

  // listen for form submit
  $("form").on("submit", function (e) {
    e.preventDefault();
    login();
  });

  $("#username").on("change", function (e) {
    e.preventDefault();
    var user = $(this).val();
    // clear password field
    startAuthentication(user);
    $("#password").val("");
  });
});

function startAuthentication(user) {
  log("startAuthentication(" + user + ")");

  if (auth_pending) {
    lightdm.cancel_authentication();
    log("authentication cancelled!");
  }

  localStorage.setItem("last_selected", user);

  selectedUser = user;

  auth_pending = true;

  lightdm.start_authentication(user);
}

function login() {
  lightdm.provide_secret($("#password").val());
  log("done");
}

/**
 * Lightdm Callbacks
 */
function show_prompt(text) {
    log("show_prompt(" + text + ")");
    $('#password').val("");
    $('#password').focus();
}

function authentication_complete() {
  log("authentication_complete()");
  auth_pending = false;
  if (lightdm.is_authenticated) {
    log("authenticated !");
    lightdm.login(lightdm.authentication_user, lightdm.default_session);
  } else {
    log("not authenticated !");
    startAuthentication($("#username").val());
    $("#password").val("");
  }
}

function show_message(text) {
  msgWrap = document.getElementById("statusArea");
  showMsg = document.getElementById("showMsg");
  showMsg.innerHTML = text;
  if (text.length > 0) {
    $("#passwordArea").hide();
    $(msgWrap).show();
  }
}

function show_error(text) {
  show_message(text);
}

/**
 * Logs.
 */
function log(text) {
  if (DEBUG) {
    $("#output").append('> ' + text);
    $("#output").append('\n');
  }
}
