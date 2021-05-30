angular.module("queryApp", []).controller("queryController", function ($scope) {
  $scope.queryData = {
    columns: [
      "this",
      "is",
      "a",
      "very",
      "long",
      "example",
    ],
    rows: [
      {
        this: "this",
        is: "is",
        a: "a",
        very: "very",
        long:
          "looooooooooooooooooooooooooooooong",
        example: "examply",
      },
      {
        this: "this",
        is: "is",
        a: "a",
        very: "very",
        long:
          "looooooooooooooooooooooooooooooong",
        example: "examply",
      },
      {
        this: "this",
        is: "is",
        a: "a",
        very: "very",
        long:
          "looooooooooooooooooooooooooooooong",
        example: "examply",
      },
      {
        this: "this",
        is: "is",
        a: "a",
        very: "very",
        long:
          "looooooooooooooooooooooooooooooong",
        example: "examply",
      },
      {
        this: "this",
        is: "is",
        a: "a",
        very: "very",
        long:
          "looooooooooooooooooooooooooooooong",
        example: "examply",
      },
      {
        this: "this",
        is: "is",
        a: "a",
        very: "very",
        long:
          "looooooooooooooooooooooooooooooong",
        example: "examply",
      },
      {
        this: "this",
        is: "is",
        a: "a",
        very: "very",
        long:
          "looooooooooooooooooooooooooooooong",
        example: "examply",
      },
      {
        this: "this",
        is: "is",
        a: "a",
        very: "very",
        long:
          "looooooooooooooooooooooooooooooong",
        example: "examply",
      },
      {
        this: "this",
        is: "is",
        a: "a",
        very: "very",
        long:
          "looooooooooooooooooooooooooooooong",
        example: "examply",
      },
      {
        this: "this",
        is: "is",
        a: "a",
        very: "very",
        long:
          "looooooooooooooooooooooooooooooong",
        example: "examply",
      },
      {
        this: "this",
        is: "is",
        a: "a",
        very: "very",
        long:
          "looooooooooooooooooooooooooooooong",
        example: "examply",
      },
      {
        this: "this",
        is: "is",
        a: "a",
        very: "very",
        long:
          "looooooooooooooooooooooooooooooong",
        example: "examply",
      },
    ],
  };
  $scope.queryData={};
  angular.element(document).ready(function () {
    $("#mainContent").colResizable({
      liveDrag: true,
      gripInnerHtml: "<div class='grip'></div>",
      draggingClass: "dragging",
      resizeMode: "overflow",
      disabledColumns: [0]
    });
  });

});
