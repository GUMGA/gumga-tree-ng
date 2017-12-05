const _ = require('lodash');

const TEMPLATE = `
  <div>

    <div class="easy-tree-item-child" draggable="true">
      <span class="glyphicon glyphicon-chevron-right"
            ng-show="$ctrl.getChilds($ctrl.field).length > 0 && !$ctrl.opened"
            data-ng-click="$ctrl.toogleChild(true);"></span>
      <span class="glyphicon glyphicon-chevron-down"
            ng-show="$ctrl.getChilds($ctrl.field).length > 0 && $ctrl.opened"
            data-ng-click="$ctrl.toogleChild(false);"></span>
      <ng-transclude></ng-transclude>
    </div>

    <easy-tree-child ng-show="$ctrl.opened"
                     ng-repeat="$value in $ctrl.getChilds($ctrl.field)"
                     child="$value"
                     parent="$ctrl.child.filhos"
                     field="{{$ctrl.field}}">
      <ng-transclude></ng-transclude>
    </easy-tree-child>

  </div>

`;

const EasyTreeChild = {
    transclude: true,
    require: '^parent',
    template: TEMPLATE,
    require: {
        easyTreeCtrl: '^easyTree'
    },
    bindings: {
        child: '=',
        parent: '=',
        field: '@'
    },
    controller: ['$scope', '$attrs', '$timeout', '$element', '$transclude', '$compile', function ($scope, $attrs, $timeout, $element, $transclude, $compile) {
        let ctrl = this;

        const applyScope = (elm) => {
            if (elm && angular.element(elm).scope()) {
                angular.element(elm).scope().$child = ctrl.child;
                if (angular.element(elm)[0]) {
                    angular.forEach(angular.element(elm)[0].childNodes, child => {
                        applyScope(child);
                    })
                }
            }
        }

        const getScopeItemChild = (elm) => {
            if (elm.nodeName == 'DIV' && elm.classList.contains('easy-tree-item-child')) {
                return angular.element(elm).scope();
            } else {
                return getScopeItemChild(elm.parentNode);
            }
        }

        $element.find('.easy-tree-item-child').bind('dragenter', function (e) {
            e.stopPropagation();
            e.preventDefault();
            if (!ctrl.easyTreeCtrl.dragging) {
                ctrl.easyTreeCtrl.dragging = getScopeItemChild(e.target);
            }
        });

        $element.find('.easy-tree-item-child').bind('dragleave', function (e) {
            e.stopPropagation();
            e.preventDefault();
        });

        $element.find('.easy-tree-item-child').bind('dragover', function (e) {
            e.stopPropagation();
            e.preventDefault();
        });

        $element.find('.easy-tree-item-child').bind('drop', function (e) {
            e.stopPropagation();
            e.preventDefault();
            if (ctrl.easyTreeCtrl.dragging) {
                $timeout(() => {
                    const dropScope = getScopeItemChild(e.target);
                    let dropChilds = dropScope['$ctrl'].getChilds(dropScope.$ctrl.field);
                    // console.log("foi", dropScope);
                    // TODO RESOLVER QUANDO DROPA PRO ALEM
                    if (!dropChilds.filter(elm => elm == ctrl.easyTreeCtrl.dragging.$child).length > 0) {
                        dropChilds.push(angular.copy(ctrl.easyTreeCtrl.dragging.$child));
                        if (Array.isArray(ctrl.easyTreeCtrl.dragging['$ctrl'].parent)) {
                            ctrl.easyTreeCtrl.dragging['$ctrl'].parent = ctrl.easyTreeCtrl.dragging['$ctrl'].parent
                                .filter(itemParent => {
                                    return !angular.equals(itemParent, ctrl.easyTreeCtrl.dragging.$child);
                                });
                        }
                        delete ctrl.easyTreeCtrl.dragging;
                    }
                });
            }
        });

        ctrl.$onInit = () => {
            ctrl.easyTreeCtrl.dragging = undefined;
            $timeout(() => applyScope($element.find('ng-transclude')));
        }

        ctrl.toogleChild = opened => {
            ctrl.opened = opened;
        }

        ctrl.getDynamicAttribute = (obj, prop) => _.get(obj, prop);
        ctrl.setDynamicAttribute = (obj, prop, value) => _.set(obj, prop, value);

        ctrl.getChilds = (field) => {
            var childs = ctrl.getDynamicAttribute(ctrl.child, field);
            if (childs == undefined) {
                ctrl.setDynamicAttribute(ctrl.child, field, []);
                return ctrl.getChilds(field);
            }
            return childs;
        }

    }]
}

EasyTreeChild.$inject = [];

export default EasyTreeChild;
