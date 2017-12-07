window.APILocation = {
  APILocation: 'http://minha-api'
}
angular.module('app', ['gumga.tree'])
  .controller('Ctrl', function ($http, $timeout) {
    var ctrl = this;

    $http.get('https://api.github.com/repos/gumga/gumga-tree-ng/releases')
      .then(function (resp) {
        ctrl.exemplo = resp.data;
      });

      ctrl.options = {
          events: {
              toggle: () => {
              }
          },
          actions: {
          },
          conditions: {
              disabled: (child) => {
                  return child.name == 'Bloqueado';
              }
          }
      };

      $timeout(function() {
          ctrl.options.actions.toggleAll()
      })

      ctrl.pessoas = [
          {
              name: 'Maria',
              filhos: [
                  {
                      name: "Regina"
                  }
              ]
          },
          {
              name: "Bloqueado",
              filhos: [
                  {
                      name: "Lucas"
                  },
                  {
                      name: "Mariana"
                  }
              ]
          }
      ]


      ctrl.coloca = () => {
          ctrl.pessoas.push({
              name: "Joaquem",
              filhos: [
                  {
                      name: "Rose"
                  },
                  {
                      name: "Mora"
                  }
              ]
          })
      }


      ctrl.adiciona = () => {
          ctrl.pessoas[0].filhos.push({
              name: "Teste1",
              filhos: [
                  {
                      name: "Teste2"
                  },
                  {
                      name: "Teste3"
                  }
              ]
          })
      }

      ctrl.cliquei = ($child) => {
          $child.filhos.push({
              name: "Inserindo"
          })
      }

  })