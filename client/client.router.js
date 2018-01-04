(()=>{
    angular.module("Client").config(Router);
    Router.$inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider"];

    function Router($stateProvider,$urlRouterProvider,$locationProvider){
        $locationProvider.hashPrefix(""); /* by default '!' */
        $locationProvider.html5Mode(true); /*Needed for removal of hashbang in Client root URL (i.e. #!)*/
        $stateProvider
            .state('Search', {
                url: '/',
                templateUrl: "/views/product.search.html",
                controller : "GroceryVM",
                controllerAs : "vm"
            })
            .state('Add', {
                url: '/add',
                templateUrl: "/views/product.add.html",
                controller : "AddVM",
                controllerAs : "vm"
            })
            .state('Edit', {
                url: '/edit',
                templateUrl: "/views/product.edit.html",
                controller : "EditVM",
                controllerAs : "vm"
            });

            $urlRouterProvider.otherwise("/");
    };

})();