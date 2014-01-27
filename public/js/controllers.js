/**
 * Created by zoonman on 1/25/14.
 */

var instaApp = angular.module('instaApp', []);

instaApp.controller('instaCtrl', function ($scope) {
  $scope.photos = [{
      id: "641626190680971481_1018917069",
      link: 'http://test.com/',
      images: {
        thumbnail: {
          height: 150,
          url: "http://distilleryimage11.s3.amazonaws.com/0d143cbe863c11e3916c120c289588fb_5.jpg",
          width: 150
        }
      }
    }
  ];

  $scope.subscriptions = [];

  $scope.currentPhoto = {};
  $scope.quantity = 100;

  $scope.setCurrentPhoto = function(photo) {
    $scope.currentPhoto = photo;
  }

  var socket = io.connect();
  socket.on('message', function(msg) {
    var data, _i, _len, _ref, _updated = false;
    console.log(msg);
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
        // console.dir($scope.photos);
      }
    }
    $scope.$apply();
  });

  socket.on('subscriptions', function (msg) {
    console.log(msg);
  });

});