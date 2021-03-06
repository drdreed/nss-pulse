"use strict";

app.controller("AuthCtrl", function ($scope, $rootScope, $location, AuthFactory, UserFactory) {

  $scope.loginContainer = true;
  $scope.registerContainer = false;
  $scope.login ={
    email: "",
    password: ""
  };

  if($location.path() === "/logout"){
    AuthFactory.logout();
    $rootScope.user = null;
    $location.url("/auth");
  }

  let logMeIn = (loginStuff) => {
    AuthFactory.authenticate(loginStuff).then(didLogin=>{
      return UserFactory.getUser(didLogin.uid);
    }).then(userCreds => {
      $rootScope.user = userCreds;
      $scope.login = {};
      $scope.register = {};
      $location.url("/dashboard");
    });
  };

  $scope.setLoginContainer = () => {
    $scope.loginContainer = true;
    $scope.registerContainer = false;
  };

  $scope.setRegisterContainer = () => {
    $scope.loginContainer = false;
    $scope.registerContainer = true;
  };

  $scope.registerUser = (registerNewUser) => {
    AuthFactory.registerWithEmail(registerNewUser).then(didRegister => {
      registerNewUser.uid = didRegister.uid;
      return UserFactory.addUser(registerNewUser);
    })
    .then(registerComplete => {
      logMeIn(registerNewUser);
    });
  };

  $scope.loginUser = (loginNewUser) => {
    logMeIn(loginNewUser);
  };
});
