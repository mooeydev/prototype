angular.module('mooey.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $location, $state, Auth, $ionicSideMenuDelegate, $ionicHistory, $ionicNativeTransitions) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  // Form data for the login modal
  $scope.loginData = {};
  $scope.ref = new Firebase("https://flickering-fire-3117.firebaseio.com");
  $scope.usersRef = $scope.ref.child('users');
  $scope.authData = $scope.ref.getAuth();

  // NOT IN USE || Creates the login modal that we will use later
  // $ionicModal.fromTemplateUrl('templates/login.html', {
  //   scope: $scope
  // }).then(function(modal) {
  //   $scope.modal = modal;
  // });

  //NOT IN USE || Creates native transitions when in iOS or Andriod environments
  // $ionicNativeTransitions.enable(true);

  // NOT IN USE || Closes login modal to close it
  // $scope.closeLogin = function() {
  //   $scope.modal.hide();
  // };

  // NOT IN USE || Opens the login modal
  // $scope.login = function() {
  //   $scope.modal.show();
  // };

  //Logs user out of Application
  $scope.logout = function(){
    Auth.$unauth();
    $ionicHistory.clearCache();
    $state.go('app.login');
    //TODO: Add a "Thanks for Mooing modal" 
  }

  //Login via email and password
  $scope.loginEmail = function(){
    var ref = new Firebase("https://flickering-fire-3117.firebaseio.com");

      ref.authWithPassword({
        email    : $scope.loginData.email,
        password : $scope.loginData.password
      }, function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
          //TODO: Tell the user that their login failed
        } else {
          console.log("Authenticated successfully with payload:", authData);
          $scope.closeLogin();
          //TODO: Change the menu view to say Logout, not Login
        }
      });
  };

  //Signup via email and password
  $scope.signupEmail = function(){  
    var ref = new Firebase("https://flickering-fire-3117.firebaseio.com");
 
    ref.createUser({
      email    : $scope.loginData.email,
      password : $scope.loginData.password
    }, function(error, userData) {
      if (error) {
        console.log("Error creating user:", error);
      } else {
        console.log("Successfully created user account with uid:", userData.uid);
        //TODO: Save this userData to the Firebase Database
        $scope.loginEmail();
      }
    });
  };

  //Signup & Login via Facebook
  $scope.loginFacebook = function(){
    var ref = new Firebase("https://flickering-fire-3117.firebaseio.com");

      // prefer pop-ups, so we don't navigate away from the page
        ref.authWithOAuthPopup("facebook", function(error, authData) {
          if (error) {
            if (error.code === "TRANSPORT_UNAVAILABLE") {
              // fall-back to browser redirects, and pick up the session
              // automatically when we come back to the origin page
              ref.authWithOAuthRedirect("facebook", function(error) {
                console.log("this didn't work either");
                $state.go('app.home');
                //TODO: For Chrome iOS users: Inform them to login with email & password
              });
            }
          } else if (authData) {
            // user authenticated with Firebase
            $state.go('app.home');
            console.log("Authenticated successfully with payload1:", authData);
            $scope.usersRef.child(authData.facebook.id).set({
              full_name: authData.facebook.displayName,
              gender: authData.facebook.cachedUserProfile.gender,
              picture:authData.facebook.profileImageURL
            });
            console.log('user saved');
          }
        });
      };
})

.controller('HomeCtrl', function($scope) {
  $scope.campaigns = [
    { title: 'Cancer Research', id: 1 },
    { title: 'Homelessness', id: 2 },
    { title: 'Diabetes', id: 3 },
    { title: 'Broken Bone', id: 4 }
  ];
})

//Individual Campaign Controller || campaign.html
.controller('CampaignCtrl', function($scope, $stateParams) {
  $scope.message = 'Testing';
})

//Create Campaign Controller || create.html
.controller('CreateCtrl', function($scope, $stateParams, Auth) {
  //reference to Firebase backend
  $scope.ref = new Firebase("https://flickering-fire-3117.firebaseio.com");

  //reference to firebase Users Store
  $scope.campaignRef = $scope.ref.child('campaigns');

  //Store new campaign information
  $scope.campaign = {
    name:'',
    target: '',
    goal: '',
    description: ''
  };

  //Save campaign information to firebase
  $scope.submit = function(){
    $scope.newCampaign = $scope.campaignRef.push();
    //TODO: Get UserID & Save it with the Campaign
    //TODO: Determine a way to save campaigns uniquely (Increment Up)
    $scope.newCampaign.set({
      name: $scope.campaign.name,
      target: $scope.campaign.target,
      goal: $scope.campaign.goal,
      description: $scope.campaign.description
    });
  }
});
