$(document).ready(function(){
  var database = firebase.database();
  // declare global variables for different sections of code
  var summary = "";
  var location = "";
  var startTime ="";
  var endTime = "";
 
  var attendees = "";
  var invitees = "";
  //var currentUser = localStorage.getItem("current-user");

  var url = window.location.search;
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
  var calOwner = queryString ? queryString.split('&')[0] : queryString.slice(0);
  console.log(calOwner);
  var currentUser = queryString ? queryString.split('&')[1] : queryString.slice(1);
  console.log(currentUser);
$("#addEvent").on("click", function(e){
  e.preventDefault();localStorage.getItem("current-user")
  
  //if logged in user is not equal to calendar owner then push into firebase under /pending-events
  //else add event into calendar
  summary = $("#summary").val().trim();
  location = $("#location").val().trim();
  startTime = new Date($("#startTime").val().trim());
  var formattedStartDate = moment(startTime, "YYYY/MM/DD HH:mm").unix();
  //console.log(formattedStartDate);
  endTime = new Date($("#endTime").val().trim());
  var formattedEndDate = moment(endTime, "YYYY/MM/DD HH:mm").unix();
  //console.log(formattedEndDate);
  //datetimes must be in this format YYYY-MM-DDTHH:MM:SS.MMM+HH:MM
  ////So that's year, month, day, the letter T, hours, minutes, seconds, miliseconds, + or -, timezoneoffset in hours and minutes
  attendees = $("#attendees").val().trim();
  invitees = splitStr(attendees);
  //var currentUser = localStorage.getItem("currentUser");
  //currentUser = "priya.balakrishnan@gmail.com";
  if(currentUser !== calOwner) {
    console.log("diff user");
    //Add event to the pending requests list and database
    database.ref('pending-events/').push({
      summary: summary,
      location: location,
      startTime: formattedStartDate,
      endTime: formattedEndDate,
      attendees: attendees,
      currentUser: currentUser,
    });
               
    //Clear the input fields after data is added to database
    $("#summary").text("");
    $("#location").text("");
    $("#startTime").val("");
    $("#endTime").val("");
    $("#attendees").val("");
          
    var row = $("<tr>");
    var col1 = $("<td>");
    col1.text(summary);
    var col2 = $("<td>");
    col2.text(location);
    var col3 = $("<td>");
    col3.text(moment(startTime, "X").format("YYYY/MM/DD HH:mm"));
    var col4 = $("<td>");
    col4.text(moment(endTime, "X").format("YYYY/MM/DD HH:mm"));
    var col5 = $("<td>");
    col5.text(currentUser);
    var col6 = $("<td>");
    col6.text(attendees);
    //if logged in user same as calendar owner allow to add events to cal and delete it from firebase
    // delete, edit button deletes,edits from firebase
    var dataButtons = $("<td>");
    var btn = $("<span>");
    btn.attr("id", "delete");
    btn.html("<i class='fa fa-trash' aria-hidden='true'>");
    btn.addClass("btnClass");
    var editBtn = $("<span>");
    editBtn.attr("id", "edit");
    editBtn.html("<i class='fa fa-pencil' aria-hidden='true'></i>");
    editBtn.addClass("btnClass");
    var addBtn = $("<span>");
    addBtn.attr("id", "addToCal");
    addBtn.html('<i class="fa fa-check" aria-hidden="true"></i>');
    addBtn.addClass("btnClass");
    dataButtons.append(addBtn).append(btn).append(editBtn);
    row.append(col1).append(col2).append(col3).append(col4).append(col5).append(col6).append(dataButtons);
    $("#pendingEvents").append(row);
  }else {
    console.log("same user");
    // Add the new event to the Google Calendar
    var event = {
      'summary': summary,
      'location': location,
      'start': {
        'dateTime': startTime.toISOString(),
        'timeZone': 'America/New_York'
      },
      'end': {
        'dateTime': endTime.toISOString(),
        'timeZone': 'America/New_York'
      },
      // 'attendees': [
      //   {'email': 'priya.balakrishnan@gmail.com'},
      //   {'email': 'andu_pri@yahoo.com'}
      // ],
      'attendees': invitees,
      'reminders': {
        'useDefault': false,
        'overrides': [
          {'method': 'email', 'minutes': 24 * 60},
          {'method': 'popup', 'minutes': 10}
        ]
      }
    };
    console.log(summary);
    console.log(event);
    addUpcomingEvent(event);
  } 
});
});  

function listUpcomingEvents() {
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  }).then(function(response) {
    var events = response.result.items;
    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }
        
        var row = $("<tr>");
        var td1 = $("<td>");
        td1.text(event.summary);
        var td2 = $("<td>");
        td2.text(when);
        row.append(td1).append(td2);
        $("#event-data").append(row);
      }
    } else {
      //appendPre('No upcoming events found.');
    }
  });
}

function splitStr(str) {
  var strArray = str.split(",");
  var emails = [];
  strArray.forEach(function(item) {
    // create an array of attendees object- email: 'value'
    emails.push(
      {"email": item.trim()});
  });
    console.log(emails);
    return emails;
}

function addUpcomingEvent(event) {
  console.log(event);
        
  var request = gapi.client.calendar.events.insert({
    'calendarId': 'primary',
    'resource': event,
    'sendNotifications': true
  });

  request.execute(function(event) {
  console.log('Event created: ' + event.htmlLink);
});

}


