/**
 * Created by zoonman on 1/25/14.
 */

var instaApp = angular.module('instaApp', []);

instaApp.controller('instaCtrl', function ($scope) {

  var socket = io.connect();

  $scope.photos = [
  ];

  $scope.subscriptions = [];

  $scope.currentPhoto = {};
  $scope.currentUserData = {};
  $scope.quantity = 100;
  $scope.currentCommentText = '';

  $scope.setCurrentPhoto = function(photo) {
    $scope.currentPhoto = photo;
  }

  $scope.likePhoto = function(photo) {
    console.log($scope.currentUserData);
    console.log(photo);
    socket.emit("like",{mediaId: photo.id, accessToken: $scope.currentUserData.access_token});
    $scope.currentPhoto.likes.count += 1;
  }
  $scope.sendComment = function() {
    console.log($scope.currentPhoto);
    console.log($scope.currentCommentText);
    socket.emit("comment",{mediaId: $scope.currentPhoto.id, 'text': $scope.currentCommentText });
  }


  socket.on('message', function(msg) {
    var data, _i, _len, _ref, _updated = false, _delay=1;
    //console.log(msg);
    _ref = msg.message.data;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      data = _ref[_i];
      _updated = false;
      $scope.photos.forEach(function (element, index) {
        if (element.id == data.id) {
          $scope.photos[index] = data;
          _updated = true;
        };
      });

      if (!_updated) {
          $scope.photos.unshift(data);
      }
    }
    $scope.$apply();

  });

  socket.on('subscriptions', function (msg) {
    //console.log(msg);
  });

  socket.on('currentUserData', function (msg) {
    $scope.currentUserData = msg;
  });

});