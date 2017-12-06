//css
require('./gumga-tree-ng.css');

//directives
import GumgaTreeNg from './gumga-tree-ng';
import GumgaTreeNgChild from './gumga-tree-ng-child';

if(!angular){
  throw "ng-easy-tree require's AngularJS in window!!";
}

const module = angular.module('gumga.tree', [])
      .component('gumgaTreeNg', GumgaTreeNg)
      .component('gumgaTreeNgChild', GumgaTreeNgChild);

export default module.name;
