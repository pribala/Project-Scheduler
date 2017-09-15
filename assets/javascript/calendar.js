
//545118572679-qn8k1nb5d0udfc107r5rbevakgf8l6lb.apps.googleusercontent.com
// client secret VbW-HggFQs4DRC7AAn432Qq5
// api AIzaSyC1OytMavrY2A6FA4D7B_2uupW5exgJZJg
// Client ID and API key from the Developer Console
      var CLIENT_ID = '545118572679-qn8k1nb5d0udfc107r5rbevakgf8l6lb.apps.googleusercontent.com';

      // Array of API discovery doc URLs for APIs used by the quickstart
      var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      //var SCOPES = 'https://www.googleapis.com/auth/calendar';
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly"
      var authorizeButton = document.getElementById('authorize-button');
      var signoutButton = document.getElementById('signout-button');

      // var summary = $("#summary").val();
      //   var location = $("#location").val();
      //   var description = $("#description").val();
      //   var startTime = $("#startTime").val();
      //   var endTime = $("#endTime").val();

      /**
       *  On load, called to load the auth2 library and API client library.
       */
      function handleClientLoad() {
        gapi.load('client:auth2', initClient);
      }

      /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
      function initClient() {
        gapi.client.init({
          discoveryDocs: DISCOVERY_DOCS,
          clientId: CLIENT_ID,
          scope: SCOPES
        }).then(function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          authorizeButton.onclick = handleAuthClick;
          signoutButton.onclick = handleSignoutClick;
        });
      }

      /**
       *  Called when the signed in status changes, to update the UI
       *  appropriately. After a sign-in, the API is called.
       */
      function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          authorizeButton.style.display = 'none';
          signoutButton.style.display = 'block';
          //addUpcomingEvent();
          listUpcomingEvents();
        } else {
          authorizeButton.style.display = 'block';
          signoutButton.style.display = 'none';
        }
      }

      /**
       *  Sign in the user upon button click.
       */
      function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
      }

      /**
       *  Sign out the user upon button click.
       */
      function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
      }

      /**
       * Append a pre element to the body containing the given message
       * as its text node. Used to display the results of the API call.
       *
       * @param {string} message Text to be placed in pre element.
       */
      function appendPre(message) {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }

      /**
       * Print the summary and start datetime/date of the next ten events in
       * the authorized user's calendar. If no events are found an
       * appropriate message is printed.
       */
       $("#addEvent").on("click", function(e) {
        e.preventDefault();
        console.log("hi");
        var summary = $("#summary").val();
        //var location = $("#location").val();
        // var description = $("#description").val();
        var description = "hello";
        var location = "room";
        // var startTime = $("#startTime").val();
        // var endTime = $("#endTime").val();
        // var attendees = $("#attendees").val();
        var event = {
          'summary': summary,
          'location': location,
          'description': description,
          'start': {
            'dateTime': '2017-09-28T09:00:00-07:00',
            'timeZone': 'America/Los_Angeles'
          },
          'end': {
            'dateTime': '2017-09-28T09:00:00-07:00',
            'timeZone': 'America/Los_Angeles'
          },
          'attendees': [
            {'email': 'priya.balakrishnan@gmail.com'},
            {'email': 'andu_pri@yahoo.com'}
          ],
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
          appendPre('Upcoming events:');

          if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
              var event = events[i];
              var when = event.start.dateTime;
              if (!when) {
                when = event.start.date;
              }
              appendPre(event.summary + ' (' + when + ')')
            }
          } else {
            appendPre('No upcoming events found.');
          }
        });
      }

      function addUpcomingEvent(event) {
        console.log(event);
        // var summary = $("#summary").val();
        // var location = $("#location").val();
        // var description = $("#description").val();
        // var startTime = $("#startTime").val();
        // var endTime = $("#endTime").val();
        //var attendees = $("#attendees").val();
        // var event = {
        //   'summary': summary,
        //   'location': location,
        //   'description': description,
        //   'start': {
        //     'dateTime': startTime,
        //     'timeZone': 'America/Los_Angeles'
        //   },
        //   'end': {
        //     'dateTime': endTime,
        //     'timeZone': 'America/Los_Angeles'
        //   },
        //   'attendees': [
        //     {'email': 'priya.balakrishnan@gmail.com'},
        //     {'email': 'andu_pri@yahoo.com'}
        //   ],
        //   'reminders': {
        //     'useDefault': false,
        //     'overrides': [
        //       {'method': 'email', 'minutes': 24 * 60},
        //       {'method': 'popup', 'minutes': 10}
        //     ]
        //   }
        // };
        var request = gapi.client.calendar.events.insert({
  'calendarId': 'primary',
  'resource': event
});

request.execute(function(event) {
  console.log('Event created: ' + event.htmlLink);
});

}