/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EasyTreeChild;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TEMPLATE = '\n  <div draggable="true">\n    <div class="item-child" ng-transclude></div>\n\n    <easy-tree-child ng-repeat="$value in $ctrl.getChilds($ctrl.field)" child="$value" field="{{$ctrl.field}}">\n      <ng-transclude></ng-transclude>\n    </easy-tree-child>\n\n  </div>\n\n';

var EasyTreeChild = (_EasyTreeChild = {
  transclude: true,
  require: '^parent',
  template: TEMPLATE
}, _defineProperty(_EasyTreeChild, 'require', {
  easyTreeCtrl: '^easyTree'
}), _defineProperty(_EasyTreeChild, 'bindings', {
  child: '=',
  field: '@'
}), _defineProperty(_EasyTreeChild, 'controller', ['$scope', '$attrs', '$timeout', '$element', '$transclude', '$compile', function ($scope, $attrs, $timeout, $element, $transclude, $compile) {
  var ctrl = this;

  var applyScope = function applyScope(elm) {
    if (elm && angular.element(elm).scope) {
      angular.element(elm).scope().$child = ctrl.child;
      if (angular.element(elm)[0]) {
        angular.forEach(angular.element(elm)[0].childNodes, function (child) {
          applyScope(child);
        });
      }
    }
  };

  ctrl.$onInit = function () {
    $timeout(function () {
      return applyScope($element.find('ng-transclude'));
    });
  };

  ctrl.fetchFromObject = function (obj, prop) {
    if (typeof obj === 'undefined') {
      return false;
    }
    var _index = prop.indexOf('.');
    if (_index > -1) {
      return ctrl.fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1));
    }
    return obj[prop];
  };

  ctrl.getChilds = function (field) {
    return ctrl.fetchFromObject(ctrl.child, field);
  };
}]), _EasyTreeChild);

EasyTreeChild.$inject = [];

exports.default = EasyTreeChild;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var EasyTree = {
  require: ['ngModel'],
  transclude: true,
  template: '\n    <div >\n      <div ng-repeat="$value in $ctrl.ngModel track by $index">\n        <easy-tree-child child="$value" field="{{$ctrl.children}}">\n          <ng-transclude></ng-transclude>\n        </easy-tree-child>\n      </div>\n    </div>\n  ',
  bindings: {
    ngModel: '=',
    children: '@'
  },
  controller: ['$scope', '$attrs', '$timeout', '$element', '$transclude', function ($scope, $attrs, $timeout, $element, $transclude) {
    var ctrl = this;

    ctrl.$onInit = function () {};
  }]
};

exports.default = EasyTree;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
      value: true
});

var _easyTree = __webpack_require__(1);

var _easyTree2 = _interopRequireDefault(_easyTree);

var _easyTreeChild = __webpack_require__(0);

var _easyTreeChild2 = _interopRequireDefault(_easyTreeChild);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//css
__webpack_require__(2);

//directives


if (!angular) {
      throw "ng-easy-tree require's AngularJS in window!!";
}

var _module = angular.module('ngEasyTree', []).component('easyTree', _easyTree2.default).component('easyTreeChild', _easyTreeChild2.default);

exports.default = _module.name;

/***/ })
/******/ ]);