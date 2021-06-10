angular.module("queryApp", []).controller("queryController", function ($scope) {
  $scope.queryData = {};
  $scope.error = "No data.";
  let vscode = acquireVsCodeApi();

  $scope.apply = function () {
    vscode.postMessage({
      limitValue: $scope.queryData.limitValue,
      whereClause: $scope.queryData.whereClause,
      orderByClause: $scope.queryData.orderByClause,
      sql: $scope.queryData.sql,
    });
  };

  window.addEventListener("message", (event) => {
    const message = event.data;
    if (message.status) {
      $scope.queryData = message.result;
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
});
