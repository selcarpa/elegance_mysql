angular.module("queryApp", []).controller("queryController", function ($scope) {
  $scope.queryData = {
    columns: ["this", "is", "a", "very", "long", "example"],
    rows: [
      {
        this: "this",
        is: "is",
        a: "a",
        very: "very",
        long: "looooooooooooooooooooooooooooooong",
        example: "examply",
      },
      {
        this: "this",
        is: "is",
        a: "a",
        very: "very",
        long: "looooooooooooooooooooooooooooooong",
        example: "examply",
      },
      {
        this: "this",
        is: "is",
        a: "a",
        very: "very",
        long: "looooooooooooooooooooooooooooooong",
        example: "examply",
      },
      {
        this: "this",
        is: "is",
        a: "a",
        very: "very",
        long: "looooooooooooooooooooooooooooooong",
        example: "examply",
      },
      {
        this: "this",
        is: "is",
        a: "a",
        very: "very",
        long: "looooooooooooooooooooooooooooooong",
        example: "examply",
      },
      {
        this: "this",
        is: "is",
        a: "a",
        very: "very",
        long: "looooooooooooooooooooooooooooooong",
        example: "examply",
      },
      {
        this: "this",
        is: "is",
        a: "a",
        very: "very",
        long: "looooooooooooooooooooooooooooooong",
        example: "examply",
      },
      {
        this: "this",
        is: "is",
        a: "a",
        very: "very",
        long: "looooooooooooooooooooooooooooooong",
        example: "examply",
      },
      {
        this: "this",
        is: "is",
        a: "a",
        very: "very",
        long: "looooooooooooooooooooooooooooooong",
        example: "examply",
      },
      {
        this: "this",
        is: "is",
        a: "a",
        very: "very",
        long: "looooooooooooooooooooooooooooooong",
        example: "examply",
      },
      {
        this: "this",
        is: "is",
        a: "a",
        very: "very",
        long: "looooooooooooooooooooooooooooooong",
        example: "examply",
      },
      {
        this: "this",
        is: "is",
        a: "a",
        very: "very",
        long: "looooooooooooooooooooooooooooooong",
        example: "examply",
      },
    ],
  };
  $scope.queryData = {};
  $scope.error = "No data.";
  angular.element(document).ready(function () {
    $("#mainContent").colResizable({
      liveDrag: true,
      gripInnerHtml: "<div class='grip'></div>",
      draggingClass: "dragging",
      resizeMode: "overflow",
      disabledColumns: [0],
    });
  });
  window.addEventListener("message", (event) => {
    const message = event.data;
    if (message.status) {
      $scope.queryData = message.result;
    } else {
      $scope.error = message.result;
    }
  });
});
