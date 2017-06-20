//css
require('./easy-tree.css');

//directives
import EasyTree from  './easy-tree';
import EasyTreeChild from  './easy-tree-child';

if(!angular){
  throw "ng-easy-tree require's AngularJS in window!!";
}

const module = angular.module('ngEasyTree', [])
      .component('easyTree', EasyTree)
      .component('easyTreeChild', EasyTreeChild);

export default module.name;
