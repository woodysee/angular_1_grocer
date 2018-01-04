(()=>{

    angular.module("Client").controller("GroceryVM", GroceryVM).controller("AddVM", AddVM).controller("EditVM", EditVM);

    GroceryVM.$inject = ["GrocerySvc", "StoreSvc", "$document", "$scope", "$rootScope", "$state"];
    AddVM.$inject = ["GrocerySvc", "$scope", "$rootScope", "$state"];
    EditVM.$inject = ["GrocerySvc", "StoreSvc", "$scope", "$rootScope", "$state"];

    function GroceryVM(GrocerySvc, StoreSvc, $document, $scope, $rootScope, $state) {
        const vm = this;

        //Search bar
        vm.searchKeyword = "";
        vm.searchType = "name";
        vm.orderBy = "ASC";
        vm.searchGrocery = searchGrocery;

        //Search results
        vm.groceries = [];
        vm.searched = false; //Show search results count or no results found only after search btn is clicked
        vm.searchedSummary = ""; //Show a message summarising search results - count or no results found
        
        vm.edit = {};
        vm.editItem = editItem;

        vm.deleteItem = deleteItem;

        //Angular Bootstrap-UI Pagination component
        vm.pages = {
            currentPage: 1,
            maxSize: 5,
            totalItems: 0,
            itemsPerPage: 20,
            set: page => {
                vm.pages.currentPage = page;
            },
            changed: page => {
                console.log("Page changed to " + vm.pages.currentPage);
                searchGrocery(
                    vm.searchKeyword,
                    vm.searchType,
                    vm.orderBy,
                    vm.pages.itemsPerPage,
                    vm.pages.currentPage
                );
            }
        };

        $scope.$on("newStockCheck", () => {
            console.log("Checking the grocer's records for exactly: " + vm.searchKeyword);
            GrocerySvc.searchGrocery(vm.searchKeyword, vm.searchType, vm.orderBy, vm.pages.itemsPerPage, vm.pages.currentPage)
            .then((results) => {
                vm.groceries = results.data.rows;
            })
            .catch((error) => {
                console.log(error);
            });
        });

        //Search grocery
        function searchGrocery() {
            console.log("Searching grocer's records...");
            console.log(vm.searchKeyword);
            console.log(vm.searchType);
            console.log(vm.orderBy);
            console.log(vm.pages.itemsPerPage);
            console.log(vm.pages.currentPage);
            GrocerySvc.searchGrocery(
                vm.searchKeyword,
                vm.searchType,
                vm.orderBy,
                vm.pages.itemsPerPage,
                vm.pages.currentPage,
            ).then((results)=>{
                console.log(results.data);
                vm.groceries = results.data.rows;
                vm.pages.totalItems = results.data.count;
                $scope.numPages = Math.ceil(vm.pages.totalItems / vm.pages.itemsPerPage); //$scope.numPages comes from the Angular UI package
                vm.searched = true; //Shows search results count
                vm.searchedSummary = results.data.count == 0 ? `No results found for keyword: ${vm.searchKeyword}` : `${results.data.count} results found for keyword: ${vm.searchKeyword}`; //Search summary after submitting query
            }).catch((error)=>{
                console.log(error);
            })
        };

        //Edit product
        function editItem(item) {
            console.log("Editing product: " + item.id);
            GrocerySvc.getProduct(item.id).then((result)=>{
                // $rootScope.$broadcast("selectedProductToEdit");
                vm.edit = result.data;
                console.log(vm.edit);
                StoreSvc.selectProductToEdit(vm.edit);
                $state.go("Edit");
            }).catch((error)=>{
                console.log(error);
            });
        };

        //Delete product
        function deleteItem(item) {
            console.log("Deleting a product item: " + item.id);
            GrocerySvc.deleteProduct(item.id)
            .then((results) => {
                $rootScope.$broadcast("newStockCheck");
                console.log("Successfully deleted: This should be empty - ", results.data.rows);
            })
            .catch((error) => {
                console.log(error);
            });
        };

    };

    function AddVM(GrocerySvc, $scope, $rootScope, $state) {
        const vm = this;
        vm.add = {};
        vm.autoFillDummy = () => {
            console.log("Dummy values used:");
            vm.add = {
                upc12: 123456789012,
                brand: "Seefood Enterprises",
                name: "Not Hotdog"
            };
        };

        vm.clearDummy = () => {
            console.log("Dummy values used:");
            vm.add = {
                upc12: "",
                brand: "",
                name: ""
            };
        };

        vm.addRecord = () => {
            console.log("Form submitted with valid data: vm.add = ");
            console.log(vm.add);
            console.log(vm.add.upc12);
            console.log(vm.add.brand);
            console.log(vm.add.name);
            GrocerySvc.addProduct(vm.add).then(result => {
                console.log(result.data);
                // vm.searchKeyword = result.data.edit.name;
                $rootScope.$broadcast("newStockCheck");
                //Redirect goes here
                $state.go("Search");
            }).catch(error => {
                console.log(error);
            });
        };
    };

    function EditVM(GrocerySvc, StoreSvc, $scope, $rootScope, $state) {
        const vm = this;
        vm.edit = StoreSvc.selectProductToEdit(StoreSvc.edit);
        console.log(vm.edit);

        vm.updateProduct = () => {
            console.log("Form submitted with valid data:");
            console.log(vm.edit.id);
            console.log(vm.edit.upc12);
            console.log(vm.edit.brand);
            console.log(vm.edit.name);
            GrocerySvc.updateProduct(vm.edit)
            .then(result => {
                console.log(result.data);
                // vm.searchKeyword = result.data.edit.name;
                $rootScope.$broadcast("newStockCheck");
                $state.go("Search");
            }).catch(error => {
                console.log(error);
            });
        };
    };

})();