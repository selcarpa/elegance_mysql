angular.module("queryApp", []).controller("queryController", function ($scope) {
  $scope.message = "Loading.";
  let vscode = acquireVsCodeApi();

  $scope.apply = function () {
    vscode.postMessage({
      page: {
        size: $scope.queryData.page.size,
        current: $scope.queryData.page.current,
      },
      whereClause: $scope.queryData.whereClause,
      orderByClause: $scope.queryData.orderByClause,
      sql: $scope.queryData.sql,
    });
  };

  window.addEventListener("message", (event) => {
    const message = event.data;
    console.log("Recived elegance mysql message");
    console.log(event.data);
    if (message.status) {
      $scope.queryData = message.result;
      $("#pagination-container").pagination({
        dataSource: Array.from(
          { length: message.result.page.total },
          (x, i) => i
        ),
        pageSize: message.result.page.size,
        pageNumber:$scope.queryData.page.current+1,
        showGoInput: true,
        showGoButton: true,
        callback: function (data, pagination) {
          if (pagination.pageNumber !== $scope.queryData.page.current + 1) {
            $scope.queryData.page.current = pagination.pageNumber - 1;
            $scope.apply();
          }
        },
      });
    } else {
      $scope.queryData = {};
      $scope.message = message.result;
    }
    $scope.$digest();
    $("#mainContent").colResizable({
      liveDrag: true,
      gripInnerHtml: "<div class='grip'></div>",
      draggingClass: "dragging",
      resizeMode: "overflow",
      disabledColumns: [0],
    });
  });
  angular.element(document).ready(function () {
    document.body.addEventListener('contextmenu', e => {
      // e.preventDefault(); // cancel the built-in context menu
    });
  });
});
