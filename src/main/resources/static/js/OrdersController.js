var OrdersControllerModule = (function () {
    var showOrdersByTable = function () {
        RestControllerModule.getOrders({
        onSuccess: function(orderList){
            for(item in orderList){
                var prodList= orderList[item];
                _addNewOrder(item, prodList);
            }
        },
        onFailed :  function(error){
            window.alert("There is a problem with our servers. We apologize for the inconvince, please try again later");
        }
        });
    };

    var _addNewOrder = function(idmesa, orden){
        var tope = new Array();
        tope.push("Product");
        tope.push("Quantity");
        //tope.push("Price");


        var table = document.createElement("TABLE");
        table.border = "1";
        table.setAttribute("id","Table"+idmesa);

        var columnCount = 2;

        var row = table.insertRow(-1);
        var headerTable = document.createElement("TH");
        headerTable.setAttribute("colspan","3");
        headerTable.innerHTML = "Table "+idmesa;
        row.appendChild(headerTable);

        var row = table.insertRow(-1);
        for (var i = 0; i < columnCount; i++) {
            var headerCell = document.createElement("TH");
            headerCell.innerHTML = tope[i];
            row.appendChild(headerCell);
        }

        for (prod in orden.orderAmountsMap) {
            row = table.insertRow(-1);
            var cell = row.insertCell(-1);
            cell.innerHTML = prod;
            var cell = row.insertCell(-1);
            cell.innerHTML = orden.orderAmountsMap[prod];
            //var cell = row.insertCell(-1);
            //cell.innerHTML = orden.products[i].price;
        }

        var dvTable = document.getElementById("dvTables");
        dvTable.appendChild(document.createElement("BR"));
        dvTable.appendChild(table);
    }

    var updateOrder = function () {
    // todo implement
    };

    var deleteOrderItem = function (itemName) {
    // todo implement
    };

    var addItemToOrder = function (orderId, item) {
    // todo implement
    };

    return {
        showOrdersByTable: showOrdersByTable,
        updateOrder: updateOrder,
        deleteOrderItem: deleteOrderItem,
        addItemToOrder: addItemToOrder
    };
})();