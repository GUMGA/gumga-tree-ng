const EasyTree = {
  require: ['ngModel'],
  transclude: true,
  template:  `
    <div >
      <div ng-repeat="$value in $ctrl.ngModel track by $index">
        <easy-tree-child child="$value" field="{{$ctrl.children}}">
          <ng-transclude></ng-transclude>
        </easy-tree-child>
      </div>
    </div>
  `,
  bindings: {
    ngModel: '=',
    children: '@'
  },
  controller: ['$scope','$attrs','$timeout','$element', '$transclude', function($scope,$attrs,$timeout,$element, $transclude){
    let ctrl = this;

    ctrl.$onInit = () => {
    }

  }]
}

export default EasyTree;
