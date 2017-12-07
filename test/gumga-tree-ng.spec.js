describe('GumgaTreeSpec', function(){
  const mox = angular.mock;

  beforeEach(function(){
    mox.module('gumga.tree')
  });

  beforeEach(inject(function($compile, $rootScope) {
    console.log($compile)
  }));


  it('test jasmine', () => {
    expect(true).toEqual(true);
  });

});
