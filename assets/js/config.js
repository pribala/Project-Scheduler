// Initialize firebase and use Google authentication to sign in
  var config = {
    apiKey: "AIzaSyBcw3W-DcM65Zb0uXj3k-MW6diEZpwRNAc",
    authDomain: "project-scheduler-f8312.firebaseapp.com",
    databaseURL: "https://project-scheduler-f8312.firebaseio.com",
    projectId: "project-scheduler-f8312",
    storageBucket: "project-scheduler-f8312.appspot.com",
    messagingSenderId: "744021836761"
  };
firebase.initializeApp(config);
//Google sign in functionality
var provider = new firebase.auth.GoogleAuthProvider();

$(document).ready(function() { 
	var status = false; 
	var user = {};
	var userData = {};	
  	// Sign in button
  	$("#signIn").click(function(e) {
  		e.preventDefault();
	  	// If user is not logged in status is false, login user
	  	if(!status){
	      	firebase.auth().signInWithRedirect(provider);
	    }else {
	      	firebase.auth().signOut().then(function() {
		      // Sign-out successful.
		      status = false;
		      $("#signIn").text("Login");
		      console.log('Signout Succesfull')
		    }).catch(function(error) {
		      // An error happened.
		      console.log('Signout Failed')  
		    });
    	}
  	});


  	firebase.auth().getRedirectResult().then(function(result) {
	    if (result.credential) {
	      // This gives you a Google Access Token. You can use it to access the Google API.
	      var token = result.credential.accessToken;
	      status = true;
	      $("#signIn").text("Logout");
	    }
	    // The signed-in user info.
	    user = result.user;
	    //Use local storage for storing logged in user email
	    // Clear absolutely everything stored previously in localStorage
	}).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      console.log(errorCode);
      var errorMessage = error.message;
      console.log(errorMessage);
      // The email of the user's account used.
      var email = error.email;
      console.log(email);
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      console.log(credential)
	});

	$("#users").on("click", function(e){
		if(!status){
			Materialize.toast("Sign In to view users!", 4000);
		}
		e.preventDefault();
		sessionStorage.clear();
		userData['status'] = status;
	    userData['currentUser'] = user.email;
	    sessionStorage.setItem('userData', JSON.stringify(userData));
		location.href = "users.html";
	}); 	
});
