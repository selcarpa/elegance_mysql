angular.module("queryApp", []).controller("queryController", function ($scope) {
  $scope.message = "Loading.";
  let vscode = acquireVsCodeApi();

  $scope.apply = function () {
    vscode.postMessage({
      page: {
        size: $scope.queryData.size,
        current: 0,
      },
      whereClause: $scope.queryData.whereClause,
      orderByClause: $scope.queryData.orderByClause,
      sql: $scope.queryData.sql,
    });
  };

  window.addEventListener("message", (event) => {
    const message = event.data;
    debugger;
    if (message.status) {
      $scope.queryData = message.result;
    } else {
      $scope.queryData = {};
      $scope.message = message.result;
    }
    $scope.$digest();
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
