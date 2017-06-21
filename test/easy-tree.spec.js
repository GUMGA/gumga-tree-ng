describe('EasyTreeSpect', function(){
  const mox = angular.mock;

  beforeEach(function(){
    mox.module('ngEasyTree')
  });

  beforeEach(inject(function($compile, $rootScope) {
    console.log($compile)
  }));


  it('test jasmine', () => {
    expect(true).toEqual(true);
  });

});
