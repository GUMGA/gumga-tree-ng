const _ = require('lodash');

const TEMPLATE = `
  <div class="gumga-tree-ng-item">

    <div class="gumga-tree-ng-item-child" draggable="{{!$ctrl.gumgaTreeNgCtrl.options.conditions.disabled($ctrl.child)}}">
      <span class="glyphicon glyphicon-chevron-right"
            ng-show="$ctrl.getChilds($ctrl.field).length > 0 && !($ctrl.opened)"
            data-ng-click="$ctrl.toggleChild(true);"></span>
      <span class="glyphicon glyphicon-chevron-down"
            ng-show="$ctrl.getChilds($ctrl.field).length > 0 && ($ctrl.opened)"
            data-ng-click="$ctrl.toggleChild(false);"></span>
      <ng-transclude></ng-transclude>
    </div>

    <gumga-tree-ng-child ng-show="($ctrl.opened)"
                     ng-repeat="$value in $ctrl.getChilds($ctrl.field)"
                     child="$value"
                     parent="$ctrl.child.filhos"
                     field="{{$ctrl.field}}">
      <ng-transclude class="gumga-tree-ng-item-child-transclude"></ng-transclude>
    </gumga-tree-ng-child>

  </div>

`;

const GumgaTreeNgChild = {
    transclude: true,
    require: '^parent',
    template: TEMPLATE,
    require: {
        gumgaTreeNgCtrl: '^gumgaTreeNg'
    },
    bindings: {
        child: '=',
        parent: '=',
        field: '@'
    },
    controller: ['$scope', '$attrs', '$timeout', '$element', '$transclude', '$compile', function ($scope, $attrs, $timeout, $element, $transclude, $compile) {
        let ctrl = this;

        $scope.$watch('$ctrl.gumgaTreeNgCtrl.options.actions.toggledAll', value => ctrl.opened = value);

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
                if (elm.nodeName == 'DIV' && elm.classList.contains('gumga-tree-ng-item-child')) {
                    return angular.element(elm).scope();
                } else {
                    return getScopeItemChild(elm.parentNode);
                }
            } else {
                return angular.element($element.find('.gumga-tree-ng-item')[0].parentNode).scope().$parent
            }
        };

        const containsChild = (dropChilds) => {
            return dropChilds.filter(elm => elm == ctrl.gumgaTreeNgCtrl.dragging.$child).length > 0
        };

        const itsWhatsMoving = (elm) => {
            return ctrl.gumgaTreeNgCtrl.dragging.$child === elm
        };

        const addDroppedIn = (dropChilds) => {
            let copy = angular.copy(ctrl.gumgaTreeNgCtrl.dragging.$child);
            dropChilds.push(copy);
            if (Array.isArray(ctrl.gumgaTreeNgCtrl.dragging['$ctrl'].parent)) {
                ctrl.gumgaTreeNgCtrl.dragging['$ctrl'].parent = ctrl.gumgaTreeNgCtrl.dragging['$ctrl'].parent
                    .filter(itemParent => {
                        return !angular.equals(itemParent, ctrl.gumgaTreeNgCtrl.dragging.$child);
                    });
            }
            delete ctrl.gumgaTreeNgCtrl.dragging;
            return copy;
        };


        const execute = (fn) => {
            let child = ctrl.gumgaTreeNgCtrl.dragging ?  ctrl.gumgaTreeNgCtrl.$child : ctrl.gumgaTreeNgCtrl.dragging;
            let parent = ctrl.gumgaTreeNgCtrl.dragging ?  ctrl.gumgaTreeNgCtrl.dragging.$parent : ctrl.gumgaTreeNgCtrl.dragging;
            ctrl.gumgaTreeNgCtrl.options.events[fn]({
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

        $element.find('.gumga-tree-ng-item-child, .gumga-tree-ng-item').bind('dragenter', function (e) {
            e.stopPropagation();
            e.preventDefault();
        });

        $element.find('.gumga-tree-ng-item-child, .gumga-tree-ng-item').bind('drag', function (e) {
            e.stopPropagation();
            e.preventDefault();
            if (ctrl.gumgaTreeNgCtrl.options.actions.disableDrag) return;
            execute('beforeDrag');
            ctrl.gumgaTreeNgCtrl.dragging = getScopeItemChild(e.target);
            angular.element(e.target).addClass('gumga-tree-opacity');
            execute('afterDrag');
        });

        $element.find('.gumga-tree-ng-item-child, .gumga-tree-ng-item').bind('dragleave', function (e) {
            execute('beforeDragLeave');
            e.stopPropagation();
            e.preventDefault();
            execute('afterDragLeave');
        });

        $element.find('.gumga-tree-ng-item-child, .gumga-tree-ng-item').bind('dragend', function (e) {
            execute('beforeDragEnd');
            angular.element('.gumga-tree-ng-item-child').removeClass('gumga-tree-over');
            angular.element('.gumga-tree-ng-item-child').removeClass('gumga-tree-opacity');
            e.stopPropagation();
            e.preventDefault();
            execute('afterDragEnd');
        });

        $element.find('.gumga-tree-ng-item-child, .gumga-tree-ng-item').bind('dragover', function (e) {
            execute('beforeDragOver');
            e.stopPropagation();
            e.preventDefault();
            angular.element('.gumga-tree-ng-item-child').removeClass('gumga-tree-over')
            let elm = angular.element(e.target);
            if (elm.hasClass('gumga-tree-ng-item-child')) {
                elm.addClass('gumga-tree-over')
            } else if (elm.parent().hasClass('gumga-tree-ng-item-child')) {
                elm.parent().addClass('gumga-tree-over')
            } else {
                angular.element(angular.element(e.target).find('.gumga-tree-ng-item-child')[0]).parent().parent().parent().find('.gumga-tree-ng-item-child').addClass('gumga-tree-over')
            }
            execute('afterDragOver');
        });

        $element.find('.gumga-tree-ng-item-child, .gumga-tree-ng-item').bind('drop', function (e) {
            e.stopPropagation();
            e.preventDefault();
            if (ctrl.gumgaTreeNgCtrl.options.actions.disableDrop) return;
            angular.element('.gumga-tree-ng-item-child').removeClass('gumga-tree-over');
            angular.element('.gumga-tree-ng-item-child').removeClass('gumga-tree-opacity');

            if (ctrl.gumgaTreeNgCtrl.dragging) {
                $timeout(() => {
                    const dropScope = getScopeItemChild(e.target);
                    if (!(ctrl.gumgaTreeNgCtrl.depth(dropScope) >= ctrl.gumgaTreeNgCtrl.options.actions.maxDepth)) {

                        ctrl.gumgaTreeNgCtrl.options.events.beforeDrop({
                            $child: dropScope.$child,
                            $parent: dropScope.$parent
                        });
                        let dropChilds = dropScope['$ctrl'].getChilds(dropScope.$ctrl.field);
                        if (!containsChild(dropChilds) && !itsWhatsMoving(dropScope.$parent.$value) && !isParentFrom(ctrl.gumgaTreeNgCtrl.dragging, dropScope)) {
                            let dropped = addDroppedIn(dropChilds);
                            ctrl.gumgaTreeNgCtrl.options.events.afterDrop({
                                $child: dropped,
                                $parent: angular.element(e.target).scope()
                            });
                        }
                    }
                });
            }
        });

        ctrl.$onInit = () => {
            ctrl.gumgaTreeNgCtrl.dragging = undefined;
            $timeout(() => applyScope($element.find('ng-transclude')));
        }

        ctrl.toggleChild = opened => {
            ctrl.gumgaTreeNgCtrl.options.events.beforeToggle({$ctrl: ctrl});
            ctrl.opened = opened;
            ctrl.gumgaTreeNgCtrl.options.events.toggle({$ctrl: ctrl});
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

GumgaTreeNgChild.$inject = [];

export default GumgaTreeNgChild;
