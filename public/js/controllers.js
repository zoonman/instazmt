/**
 * Created by zoonman on 1/25/14.
 */

var instaApp = angular.module('instaApp', []);

instaApp.controller('instaCtrl', function ($scope) {
  $scope.photos = [
  ];

  $scope.subscriptions = [];

  $scope.currentPhoto = {};
  $scope.quantity = 100;

  $scope.setCurrentPhoto = function(photo) {
    $scope.currentPhoto = photo;
  }

  var socket = io.connect();
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

});