const EasyTree = {
  require: ['ngModel'],
  transclude: true,
  template:  `
    <div >
      <div ng-repeat="$value in $ctrl.ngModel">
        <easy-tree-child child="$value" parent="$ctrl.ngModel" field="{{$ctrl.children}}">
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

    ctrl.getChilds = () => {
      return ctrl.ngModel
    }

  }]
}

export default EasyTree;
