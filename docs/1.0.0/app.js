window.APILocation = {
  APILocation: 'http://minha-api'
}
angular.module('app', ['gumga.tree'])
  .controller('Ctrl', function ($http, $timeout, $scope) {
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

      ctrl.pessoas2 = [
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
              name: "Joaquim",
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
              name: "Pessoa 1",
              filhos: [
                  {
                      name: "Pessoa 2"
                  },
                  {
                      name: "Pessoa 3"
                  }
              ]
          })
      }

      ctrl.cliquei = ($child) => {
          $child.filhos.push({
              name: "Nova Pessoa"
          })
      }

      ctrl.random = function() {
          return "img/" + Math.round(Math.random() * 7) + ".png";
      }

      $timeout(function() {
          var i = 0
          while (i <= 4) {
              angular.element('.img-people')[i].src = 'img/' + i + ".png"
              i++;
          }
      })

  })