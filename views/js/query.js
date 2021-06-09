angular.module("queryApp", []).controller("queryController", function ($scope) {
  $scope.queryData = {};
  $scope.whereClause = "";
  $scope.orderByClause = "";
  $scope.error = "No data.";
  window.addEventListener("message", (event) => {
    const message = event.data;
    if (message.status) {
      $scope.queryData = message.result;
      let sqlparse = SQLParser.parse($scope.queryData.sql);
      if (sqlparse.where) {
        $scope.whereClause = assembleWhereClause(sqlparse.where.conditions);
      } else {
        $scope.whereClause = "";
      }
      $scope.$digest();
    } else {
      $scope.error = message.result;
    }
  });
  angular.element(document).ready(function () {
    $("#mainContent").colResizable({
      liveDrag: true,
      gripInnerHtml: "<div class='grip'></div>",
      draggingClass: "dragging",
      resizeMode: "overflow",
      disabledColumns: [0],
    });
  });

  function assembleWhereClause(node, right) {
    if (node.left.constructor.name === "Op") {
      if (right) {
        return `(${assembleWhereClause(
          node.left
        )} ${node.operation.toUpperCase()} ${assembleWhereClause(
          node.right,
          true
        )})`;
      } else {
        return `${assembleWhereClause(
          node.left
        )} ${node.operation.toUpperCase()} ${assembleWhereClause(
          node.right,
          true
        )}`;
      }
    } else {
      return `${node.left.value} ${node.operation.toUpperCase()} ${
        node.right.quoteType || ""
      }${node.right.value}${node.right.quoteType || ""}`;
    }
  }
});
