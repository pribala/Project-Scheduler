// Initialize firebase and use Google authentication to sign in
var config = {
	apiKey: "AIzaSyDmKpVmVd3N_dA4wAKrxX6L-pqxDvDXNAk",
	authDomain: "scheduler-708c6.firebaseapp.com",
	databaseURL: "https://scheduler-708c6.firebaseio.com",
	projectId: "scheduler-708c6",
	storageBucket: "",
	messagingSenderId: "545118572679"
};
firebase.initializeApp(config);

//Google sign in functionality
var provider = new firebase.auth.GoogleAuthProvider();
	
$(document).ready(function() { 
	var status = false; 	
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
	      $("#signIn").text("Signout");
	    }
	    // The signed-in user info.
	    var user = result.user;
	    //console.log(user.email);
	    //Use local storage for storing logged in user email
	    // Clear absolutely everything stored previously in localStorage
	    localStorage.clear();
	    // Store the user email into localStorage
        localStorage.setItem("current-user", user.email);
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
	      console.log(credential);
	});

	$("#students").on("click", function(e){
		e.preventDefault();
		location.href = "students.html?"+localStorage.getItem("current-user");
	}); 	
	 	
     //  // And display that name for the user using "localStorage.getItem"
      // console.log(localStorage.getItem("current-user"));
     // 
});