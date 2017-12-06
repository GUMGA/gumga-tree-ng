const _ = require('lodash');

const TEMPLATE = `
  <div class="easy-tree-item">

    <div class="easy-tree-item-child" draggable="true">
      <span class="glyphicon glyphicon-chevron-right"
            ng-show="$ctrl.getChilds($ctrl.field).length > 0 && !($ctrl.opened)"
            data-ng-click="$ctrl.toogleChild(true);"></span>
      <span class="glyphicon glyphicon-chevron-down"
            ng-show="$ctrl.getChilds($ctrl.field).length > 0 && ($ctrl.opened)"
            data-ng-click="$ctrl.toogleChild(false);"></span>
      <ng-transclude></ng-transclude>
    </div>

    <easy-tree-child ng-show="($ctrl.opened)"
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

        $scope.$watch('$ctrl.easyTreeCtrl.options.actions.toggledAll', value => ctrl.opened = value);

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

        const addDroppedIn = (dropChilds) => {
            let copy = angular.copy(ctrl.easyTreeCtrl.dragging.$child);
            dropChilds.push(copy);
            if (Array.isArray(ctrl.easyTreeCtrl.dragging['$ctrl'].parent)) {
                ctrl.easyTreeCtrl.dragging['$ctrl'].parent = ctrl.easyTreeCtrl.dragging['$ctrl'].parent
                    .filter(itemParent => {
                        return !angular.equals(itemParent, ctrl.easyTreeCtrl.dragging.$child);
                    });
            }
            delete ctrl.easyTreeCtrl.dragging;
            return copy;
        };


        const execute = (fn) => {
            let child = ctrl.easyTreeCtrl.dragging ?  ctrl.easyTreeCtrl.$child : ctrl.easyTreeCtrl.dragging;
            let parent = ctrl.easyTreeCtrl.dragging ?  ctrl.easyTreeCtrl.dragging.$parent : ctrl.easyTreeCtrl.dragging;
            ctrl.easyTreeCtrl.options.events[fn]({
                $child: child,
                $parent: parent
            });
        };

        const isParentFrom = (child, dropScope) => {
            if (dropScope.$parent) {
                if (dropScope.$parent.$child)
                    if (dropScope.$parent.$child === child.$child)
                        return true;
                    else
                        return isParentFrom(child, dropScope.$parent)
            }
            return false;
        };

        $element.find('.easy-tree-item-child, .easy-tree-item').bind('dragenter', function (e) {
            e.stopPropagation();
            e.preventDefault();
        });

        $element.find('.easy-tree-item-child, .easy-tree-item').bind('drag', function (e) {
            e.stopPropagation();
            e.preventDefault();
            if (ctrl.easyTreeCtrl.options.actions.disableDrag) return;
            execute('beforeDrag');
            ctrl.easyTreeCtrl.dragging = getScopeItemChild(e.target);
            angular.element(e.target).addClass('gumga-tree-opacity');
            execute('afterDrag');
        });

        $element.find('.easy-tree-item-child, .easy-tree-item').bind('dragleave', function (e) {
            execute('beforeDragLeave');
            e.stopPropagation();
            e.preventDefault();
            execute('afterDragLeave');
        });

        $element.find('.easy-tree-item-child, .easy-tree-item').bind('dragend', function (e) {
            execute('beforeDragEnd');
            angular.element('.easy-tree-item-child').removeClass('gumga-tree-over');
            angular.element('.easy-tree-item-child').removeClass('gumga-tree-opacity');
            e.stopPropagation();
            e.preventDefault();
            execute('afterDragEnd');
        });

        $element.find('.easy-tree-item-child, .easy-tree-item').bind('dragover', function (e) {
            execute('beforeDragOver');
            e.stopPropagation();
            e.preventDefault();
            angular.element('.easy-tree-item-child').removeClass('gumga-tree-over')
            let elm = angular.element(e.target);
            if (elm.hasClass('easy-tree-item-child')) {
                elm.addClass('gumga-tree-over')
            } else if (elm.parent().hasClass('easy-tree-item-child')) {
                elm.parent().addClass('gumga-tree-over')
            } else {
                angular.element(angular.element(e.target).find('.easy-tree-item-child')[0]).parent().parent().parent().find('.easy-tree-item-child').addClass('gumga-tree-over')
            }
            execute('afterDragOver');
        });

        $element.find('.easy-tree-item-child, .easy-tree-item').bind('drop', function (e) {
            e.stopPropagation();
            e.preventDefault();
            if (ctrl.easyTreeCtrl.options.actions.disableDrop || ctrl.easyTreeCtrl.depth(ctrl.easyTreeCtrl.dragging) >= ctrl.easyTreeCtrl.options.actions.maxDepth) return;
            angular.element('.easy-tree-item-child').removeClass('gumga-tree-over');
            angular.element('.easy-tree-item-child').removeClass('gumga-tree-opacity');

            if (ctrl.easyTreeCtrl.dragging) {
                $timeout(() => {
                    const dropScope = getScopeItemChild(e.target);
                    ctrl.easyTreeCtrl.options.events.beforeDrop({$child: dropScope.$child, $parent: dropScope.$parent});
                    let dropChilds = dropScope['$ctrl'].getChilds(dropScope.$ctrl.field);
                    if (!containsChild(dropChilds) && !itsWhatsMoving(dropScope.$parent.$value) && !isParentFrom(ctrl.easyTreeCtrl.dragging, dropScope)) {
                        let dropped = addDroppedIn(dropChilds);
                        ctrl.easyTreeCtrl.options.events.afterDrop({$child: dropped, $parent: angular.element(e.target).scope()});
                    }
                });
            }
        });

        ctrl.$onInit = () => {
            ctrl.easyTreeCtrl.dragging = undefined;
            $timeout(() => applyScope($element.find('ng-transclude')));
        }

        ctrl.toogleChild = opened => {
            ctrl.easyTreeCtrl.options.events.beforeToggle({$ctrl: ctrl});
            ctrl.opened = opened;
            ctrl.easyTreeCtrl.options.events.toogle({$ctrl: ctrl});
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
