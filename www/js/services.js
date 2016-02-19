angular.module('mooey.services', [])

.factory("Auth", function($firebaseAuth) {
	//Mooey's firebase database lives at the URI below
  var usersRef = new Firebase('https://flickering-fire-3117.firebaseio.com');
  return $firebaseAuth(usersRef);
})