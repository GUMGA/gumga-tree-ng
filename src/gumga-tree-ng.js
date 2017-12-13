const GumgaTreeNg = {
    require: ['ngModel'],
    transclude: true,
    template: `
    <div ng-class="{'gumga-tree-ng-bg-xadrez': !$ctrl.ngModel || $ctrl.ngModel.length <= 0}">
      <div ng-repeat="$value in $ctrl.ngModel">
        <gumga-tree-ng-child child="$value" parent="$ctrl.ngModel" field="{{$ctrl.children}}">
          <ng-transclude></ng-transclude>
        </gumga-tree-ng-child>
      </div>
    </div>
  `,
    bindings: {
        ngModel: '=',
        children: '@',
        options: '=?'
    },
    controller: ['$scope', '$attrs', '$timeout', '$element', '$transclude', function ($scope, $attrs, $timeout, $element, $transclude) {
        let ctrl = this;

        ctrl.$onInit = () => {
            ctrl.options = angular.merge({
                events: {
                    beforeDrop: (obj) => {},
                    afterDrop: (obj) => {},
                    beforeDrag: (obj) => {},
                    afterDrag: (obj) => {},
                    beforeDragLeave: (obj) => {},
                    afterDragLeave: (obj) => {},
                    beforeDragEnd: (obj) => {},
                    afterDragEnd: (obj) => {},
                    beforeDragOver: (obj) => {},
                    afterDragOver: (obj) => {},
                    beforeToggle: (ctrl) => {},
                    toggle: (ctrl) => {}
                },
                actions: {
                    disableDrag: false,
                    disableDrop: false,
                    toggledAll: false,
                    depth: ctrl.depth,
                    toggleAll: ctrl.toggleAll,
                    collapse: ctrl.collapse,
                    expand: ctrl.expand,
                    removeAll: ctrl.removeAll,
                    scope: ctrl.scope
                },
                conditions: {
                    disabled: () => false
                }
            }, ctrl.options);
        };

        ctrl.getChilds = () => {
            return ctrl.ngModel
        };

        ctrl.depth = (ctrl) => {
            let size = 0;
            while (ctrl.$parent) {
                ctrl = ctrl.$parent;
                if (ctrl.$child) {
                    size++
                }
            }
            return size;
        };

        ctrl.collapse = (ctrl) => {
            ctrl.opened = false;
        };

        ctrl.expand = (ctrl) => {
            ctrl.opened = true;
        };

        ctrl.toggleAll = () => {
            ctrl.options.actions.toggledAll = !ctrl.options.actions.toggledAll;
        };

        ctrl.removeAll = () => {
            ctrl.ngModel = []
        };

        ctrl.scope = () => {
            return $element.find('.gumga-tree-ng-item-child').scope()
        };

    }]
}

export default GumgaTreeNg;
