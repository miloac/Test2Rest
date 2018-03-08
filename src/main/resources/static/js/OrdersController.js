var orders;
var OrdersControllerModule = (function () {
    var showOrdersByTable = function () {
        var callback = {
            onSuccess: function () {
                for (var item in orders) {
                    var prodList = orders[item];
                    _addNewOrder(item, prodList);
                }
            },
            onFsiled: function () {
            }
        };
        _getOrders(callback);
    };

    var _getOrders = function (callback) {
        RestControllerModule.getOrders({
            onSuccess: function (orderList) {
                orders = orderList;
                callback.onSuccess();
            },
            onFailed: function (error) {
                console.log(error);
                window.alert("There is a problem with our servers. We apologize for the inconvince, please try again later");
            }
        });

    };

    var _noOpCallback = function () {
        return {
            onSuccess: function () {
            }, onFailed: function () {

            }
        }
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
        var p = document.getElementById("Products");
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
                    _getOrders(_noOpCallback());
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

    var updateView = function () {
        var callback = {
            onSuccess: function () {
                _populateUpdateView();
            },
            onFailed: function () {

            }
        };
        _getOrders(callback);
    };

    var _populateUpdateView = function () {
        var select = document.getElementById("TableSel");
        for (var i in orders) {
            var opt = document.createElement('option');
            opt.value = i;
            opt.innerText = "Table " + i;
            select.appendChild(opt);
        }
        changeOrderUpdate(select.value);
    };

    var changeOrderUpdate = function (tableNumber) {
        _deleteUpdateViewTable();
        var productsRow = document.getElementById("Products");
        for (var i in orders[tableNumber]["orderAmountsMap"]) {
            var row = document.createElement("div");
            row.className = "row mb-1";
            row.id = i;

            var col = document.createElement("div");
            col.className = "col-md-3";
            var inputProd = document.createElement("input");
            inputProd.type = "text";
            inputProd.className = "form-control";
            inputProd.value = i;

            col.appendChild(inputProd);
            row.appendChild(col);

            col = document.createElement("div");
            col.className = "col-md-3";
            var inputQuant = document.createElement("input");
            inputQuant.type = "text";
            inputQuant.className = "form-control";
            inputQuant.value = orders[tableNumber]["orderAmountsMap"][i];

            col.appendChild(inputQuant);
            row.appendChild(col);

            col = document.createElement("div");
            col.className = "col-md-1";
            var buttonUpdate = document.createElement("button");
            buttonUpdate.onclick = function (ev) {
                OrdersControllerModule.updateOrder()
            };
            buttonUpdate.className = "btn btn-primary";
            buttonUpdate.innerText = "Update";

            col.appendChild(buttonUpdate);
            row.appendChild(col);

            col = document.createElement("div");
            col.className = "col-md-1";
            var buttonDelete = document.createElement("button");
            buttonDelete.className = "btn btn-danger";
            buttonDelete.innerText = "Delete";
            buttonDelete.id = "buttonDelete" + i;
            buttonDelete.onclick = function (ev) {
                OrdersControllerModule.deleteOrderItem(ev.path[2].id);
            };
            col.appendChild(buttonDelete);
            row.appendChild(col);
            productsRow.appendChild(row);
        }
    };

    var _deleteUpdateViewTable = function () {
        var productsRow = document.getElementById("Products");
        while (productsRow.firstChild) {
            productsRow.removeChild(productsRow.firstChild);
        }
    };

    return {
        showOrdersByTable: showOrdersByTable,
        updateOrder: updateOrder,
        deleteOrderItem: deleteOrderItem,
        addItemToOrder: addItemToOrder,
        updateView: updateView,
        changeOrderUpdate: changeOrderUpdate
    };
})
();