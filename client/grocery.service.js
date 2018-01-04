(() => {

    angular.module("Client").service("GrocerySvc", ["$http", GrocerySvc]).service("StoreSvc", [StoreSvc]);

    function GrocerySvc($http) {
        const svc = this;

        svc.searchGrocery = (keyword, searchType, orderBy, itemsPerPage, currentPage) => {
            return $http.get(`/api/products?keyword=${keyword}&searchType=${searchType}&orderBy=${orderBy}&itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`);
        };
        
        svc.getProduct = (id) => {
            return $http.get("/api/products/" + id);
        };

        svc.addProduct = (product) => {
            console.log(product);
            return $http.post("/api/products", product);
        };

        svc.updateProduct = (product) => {
            console.log(product);
            return $http.put("/api/products", product);
        };

        //Post by body over request
        svc.submitSearch = (value) => {
            const jsObject = {
                key: value
            };
            return $http.post("/api/products", jsObject);
        };

        //Delete product
        svc.deleteProduct = (id) => {
            console.log(id);
            return $http.delete("/api/products/"+ id);
        };

    };

    //Single source of truth between controllers/viewmodels
    function StoreSvc() {
        const store = this;
        store.edit = {};

        store.selectProductToEdit = (result) => {
            console.log(result);
            return store.edit = result;
        };

    };

})();