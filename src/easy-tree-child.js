const TEMPLATE = `
  <div draggable="true">
    <div class="item-child" ng-transclude></div>

    <easy-tree-child ng-repeat="$value in $ctrl.getChilds($ctrl.field)" child="$value" field="{{$ctrl.field}}">
      <ng-transclude></ng-transclude>
    </easy-tree-child>

  </div>

`;

const EasyTreeChild = {
  transclude: true,
  require : '^parent',
  template: TEMPLATE,
  require: {
    easyTreeCtrl: '^easyTree'
  },
  bindings: {
    child: '=',
    field: '@'
  },
  controller: ['$scope','$attrs','$timeout','$element', '$transclude', '$compile', function($scope,$attrs,$timeout,$element, $transclude, $compile){
    let ctrl = this;

    const applyScope = (elm) => {
        if(elm && angular.element(elm).scope){
          angular.element(elm).scope().$child = ctrl.child;
          if(angular.element(elm)[0]){
            angular.forEach(angular.element(elm)[0].childNodes, child => {
              applyScope(child);
            })
          }
        }
    }

    ctrl.$onInit = () => {
       $timeout(() => applyScope($element.find('ng-transclude')));
    }

    ctrl.fetchFromObject = (obj, prop) => {
      if(typeof obj === 'undefined') {
          return false;
      }
      var _index = prop.indexOf('.')
      if(_index > -1) {
          return ctrl.fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1));
      }
      return obj[prop];
    }

    ctrl.getChilds = (field) => {
      return ctrl.fetchFromObject(ctrl.child, field);
    }

  }]
}

EasyTreeChild.$inject = [];

export default EasyTreeChild;
