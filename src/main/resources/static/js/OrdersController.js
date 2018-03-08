var OrdersControllerModule = (function () {
    var showOrdersByTable = function () {
        RestControllerModule.getOrders({
            onSuccess: function (orderList) {
                orders = orderList;
                for (var item in orderList) {
                    var prodList = orderList[item];
                    _addNewOrder(item, prodList);
                }
            },
            onFailed: function (error) {
                window.alert("There is a problem with our servers. We apologize for the inconvince, please try again later");
            }
        });
    };

    var _addNewOrder = function (idmesa, orden) {
        var tope = [];
        tope.push("Product");
        tope.push("Quantity");
        //tope.push("Price");


        var table = document.createElement("TABLE");
        table.id = "Table" + idmesa;
        table.className = "table table-dark table-bordered";

        var columnCount = 2;

        var row = table.insertRow(-1);
        var headerTable = document.createElement("TH");
        headerTable.setAttribute("colspan", "3");
        headerTable.innerHTML = "Table " + idmesa;
        row.appendChild(headerTable);

        row = table.insertRow(-1);
        for (var i = 0; i < columnCount; i++) {
            var headerCell = document.createElement("TH");
            headerCell.innerHTML = tope[i];
            row.appendChild(headerCell);
        }

        for (prod in orden.orderAmountsMap) {
            row = table.insertRow(-1);
            var cell = row.insertCell(-1);
            cell.innerHTML = prod;
            cell = row.insertCell(-1);
            cell.innerHTML = orden.orderAmountsMap[prod];
            //var cell = row.insertCell(-1);
            //cell.innerHTML = orden.products[i].price;
        }

        var dvTable = document.getElementById("dvTables");
        dvTable.appendChild(document.createElement("BR"));
        dvTable.appendChild(table);
    };


    var _constructActiveOrder = function () {
        var o = _getActiveOrder();
        var p = _constructProductsActiveOrder();
        return p + ',\"tableNumber\":' + o + '}';
    };

    var _getActiveOrder = function () {
        return document.getElementById("TableSel").value;
    };

    var _constructProductsActiveOrder = function () {
        var p = document.getElementById("products");
        p = p.children;
        var str = '{\"orderAmountsMap\":{';
        for (var i = 0; i < p.length; i++) {
            if (i == p.length - 1) {
                str += '\"' + p[i].children[0].children[0].value + '\":' + p[i].children[1].children[0].value + '}';
            } else {
                str += '\"' + p[i].children[0].children[0].value + '\":' + p[i].children[1].children[0].value + ',';
            }
        }
        return str;

    };

    var updateOrder = function () {
        RestControllerModule.updateOrder(_constructActiveOrder(),
            {
                onSuccess: function (response) {
                    window.alert("Order has been updated");
                    RestControllerModule.getOrders({
                        onSuccess: function (orderList) {
                            orders = orderList;
                        }, onFailed: function (error) {
                        }
                    })
                },
                onFailed: function (error) {
                    console.log(error);
                }
            })
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