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

        $timeout(function () {
            ctrl.options.actions.toggleAll()
        })

        ctrl.pessoas = [
            {
                name: 'Maria',
                img: "https://randomuser.me/api/portraits/women/84.jpg",
                ativo: true,
                filhos: [
                    {
                        name: "Regina",
                        ativo: false,
                        img: "https://randomuser.me/api/portraits/women/83.jpg"
                    }
                ]
            },
            {
                name: "Bloqueado",
                img: "https://randomuser.me/api/portraits/women/75.jpg",
                ativo: true,
                filhos: [
                    {
                        name: "Lucas",
                        ativo: true,
                        img: "https://randomuser.me/api/portraits/men/23.jpg"
                    },
                    {
                        name: "Mariana",
                        ativo: false,
                        img: "https://randomuser.me/api/portraits/women/82.jpg"
                    }
                ]
            }
        ]

        ctrl.pessoas2 = [
            {
                name: 'Maria',
                ativo: true,
                img: "https://randomuser.me/api/portraits/women/73.jpg",
                filhos: [
                    {
                        name: "Regina",
                        ativo: false,
                        img: "https://randomuser.me/api/portraits/women/84.jpg"
                    }
                ]
            },
            {
                name: "Bloqueado",
                ativo: true,
                img: "https://randomuser.me/api/portraits/women/75.jpg",
                filhos: [
                    {
                        name: "Lucas",
                        ativo: true,
                        img: "https://randomuser.me/api/portraits/men/22.jpg"
                    },
                    {
                        name: "Mariana",
                        ativo: true,
                        img: "https://randomuser.me/api/portraits/women/20.jpg"
                    }
                ]
            }
        ]


        ctrl.coloca = () => {
            ctrl.pessoas.push({
                name: "Joaquim",
                ativo: true,
                img: "https://randomuser.me/api/portraits/women/45.jpg",
                filhos: [
                    {
                        name: "Rose",
                        ativo: false,
                        img: "https://randomuser.me/api/portraits/women/80.jpg"

                    },
                    {
                        name: "Mora",
                        ativo: true,
                        img: "https://randomuser.me/api/portraits/women/79.jpg"
                    }
                ]
            })
        }


        ctrl.adiciona = () => {
            ctrl.pessoas[0].filhos.push({
                name: "Pessoa 1",
                ativo: true,
                img: "https://randomuser.me/api/portraits/women/46.jpg",
                filhos: [
                    {
                        name: "Pessoa 2",
                        ativo: false,
                        img: "https://randomuser.me/api/portraits/men/20.jpg"
                    },
                    {
                        name: "Pessoa 3",
                        ativo: true,
                        img: "https://randomuser.me/api/portraits/men/19.jpg"
                    }
                ]
            })
        }

        ctrl.cliquei = ($child) => {
            $child.filhos.push({
                name: "Nova Pessoa",
                ativo: true,
                img: "https://randomuser.me/api/portraits/men/" + Math.round(Math.random() * 100) + ".jpg"

            })
        }

        ctrl.random = function () {
            return "img/" + Math.round(Math.random() * 100) + ".png";
        }

    })