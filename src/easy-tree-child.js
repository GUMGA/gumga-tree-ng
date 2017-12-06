const _ = require('lodash');

const TEMPLATE = `
  <style>
    .gumga-tree-over {
        border: 2px dashed #000;
    }
  </style>
  <div class="easy-tree-item">

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
      <ng-transclude class="easy-tree-item-child-transclude"></ng-transclude>
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
        };

        const getScopeItemChild = (elm) => {
            if (elm) {
                if (elm.nodeName == 'DIV' && elm.classList.contains('easy-tree-item-child')) {
                    return angular.element(elm).scope();
                } else {
                    return getScopeItemChild(elm.parentNode);
                }
            } else {
                return angular.element($element.find('.easy-tree-item')[0].parentNode).scope().$parent
            }
        };

        const containsChild = (dropChilds) => {
            return dropChilds.filter(elm => elm == ctrl.easyTreeCtrl.dragging.$child).length > 0
        };

        const itsWhatsMoving = (elm) => {
            return ctrl.easyTreeCtrl.dragging.$child === elm
        };

        const addDraggedIn = (dropChilds) => {
            dropChilds.push(angular.copy(ctrl.easyTreeCtrl.dragging.$child));
            if (Array.isArray(ctrl.easyTreeCtrl.dragging['$ctrl'].parent)) {
                ctrl.easyTreeCtrl.dragging['$ctrl'].parent = ctrl.easyTreeCtrl.dragging['$ctrl'].parent
                    .filter(itemParent => {
                        return !angular.equals(itemParent, ctrl.easyTreeCtrl.dragging.$child);
                    });
            }
            delete ctrl.easyTreeCtrl.dragging;
        };

        $element.find('.easy-tree-item-child, .easy-tree-item').bind('dragenter', function (e) {
            e.stopPropagation();
            e.preventDefault();
            if (!ctrl.easyTreeCtrl.dragging) {
                ctrl.easyTreeCtrl.dragging = getScopeItemChild(e.target);
            }
        });

        $element.find('.easy-tree-item-child, .easy-tree-item').bind('dragleave', function (e) {
            e.stopPropagation();
            e.preventDefault();
        });

        // $element.find('.easy-tree-item-child, .easy-tree-item').bind('dragend', function (e) {
        //     e.stopPropagation();
        //     e.preventDefault();
        //     console.log('aqui',angular.element('.easy-tree-item-child'))
        //     angular.element('.easy-tree-item-child').removeClass('gumga-tree-over')
        //     // angular.element(e.target).find('.easy-tree-item-child').addClass('gumga-tree-over');
        // });

        $element.find('.easy-tree-item-child, .easy-tree-item').bind('dragover', function (e) {
            angular.element('.easy-tree-item-child').removeClass('gumga-tree-over')
            let elm = angular.element(e.target);
            if (elm.hasClass('easy-tree-item-child')) {
                elm.addClass('gumga-tree-over')
            } else if (elm.parent().hasClass('easy-tree-item-child')){
                elm.parent().addClass('gumga-tree-over')
            }
            e.stopPropagation();
            e.preventDefault();
        });

        $element.find('.easy-tree-item-child, .easy-tree-item').bind('drop', function (e) {
            e.stopPropagation();
            e.preventDefault();
            angular.element('.easy-tree-item-child').removeClass('gumga-tree-over')
            if (ctrl.easyTreeCtrl.dragging) {
                $timeout(() => {
                    const dropScope = getScopeItemChild(e.target);
                    let dropChilds = dropScope['$ctrl'].getChilds(dropScope.$ctrl.field);
                    if (!containsChild(dropChilds) && !itsWhatsMoving(dropScope.$parent.$value)) {
                        addDraggedIn(dropChilds);
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
