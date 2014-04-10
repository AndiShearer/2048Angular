var LEFT = 97;
var UP = 119;
var RIGHT = 100;
var DOWN = 115;

var LAST = 3;

var app = angular.module('myModule', []);
app.controller('GameCtrl', function ($scope) {
  $scope.score = "0";
  $scope.cells = [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null]
  ];
  $scope.movementInput = "";
  fillRandomCell($scope.cells);

  $scope.onKeyPressed = function (ev) {
    $scope.movementInput = $scope.movementInput.substr(0, 0);

    var legalMoveMade = false;
    if (ev.which == LEFT) {
      legalMoveMade = moveToLeftAndAddNumbers($scope);
    }
    else if (ev.which == UP) {
      $scope.cells = rotateRight($scope.cells);
      legalMoveMade = moveToLeftAndAddNumbers($scope);
      $scope.cells = rotateRight(rotateRight(rotateRight($scope.cells)));
    }
    else if (ev.which == RIGHT) {
      $scope.cells = rotateRight(rotateRight($scope.cells));
      legalMoveMade = moveToLeftAndAddNumbers($scope);
      $scope.cells = rotateRight(rotateRight($scope.cells));
    }
    else if (ev.which == DOWN) {
      $scope.cells = rotateRight(rotateRight(rotateRight($scope.cells)));
      legalMoveMade = moveToLeftAndAddNumbers($scope);
      $scope.cells = rotateRight($scope.cells);
    }
    if (legalMoveMade) {
      fillRandomCell($scope.cells);
    }
  }
});

function moveToLeftAndAddNumbers($scope) {
  var hasMoved = moveAllToLeft($scope.cells);
  var numbersAdded = addNumbers($scope.cells, $scope);
  if (hasMoved || numbersAdded) {
    moveAllToLeft($scope.cells);
    return true;
  }
  return false;
}

function addNumbers(grid, $scope) {
  var numbersAdded = false;
  for (var row in grid) {
    for (var column in grid[row]) {
      if (column > 0 && grid[row][column] != null && grid[row][column - 1] == grid[row][column]) {
        grid[row][column - 1] = grid[row][column] + grid[row][column];
        grid[row][column] = null;
        $scope.score = parseInt($scope.score) + grid[row][column - 1] + "";
        numbersAdded = true;
      }
    }
  }
  return numbersAdded;
}

function getClassForCell(row, column) {
  return ".cell" + row + column;
}
var fillRandomCell = function (grid) {
  var done = false;
  do {
    var randomY = Math.floor(Math.random() * (grid.length));
    var randomX = Math.floor(Math.random() * (grid[0].length));
    if (grid[randomY][randomX] == null) {
      grid[randomY][randomX] = Math.random() >= 0.9 ? 4 : 2;
      $(getClassForCell(randomY, randomX)).addClass("new");
      setTimeout(function () {
        $(getClassForCell(randomY, randomX)).removeClass("new");
      }, 200);
      done = true;
    }
  } while (!done);
};

function findFirstEmpty(row) {
  for (var i = 0; i <= LAST; i++) {
    if (row[i] == null || row[i] === undefined) {
      return i;
    }
  }
}

function createEmptyGrid(width, height) {
  var resultGrid = [];
  for (var i = 0; i < width; i++) {
    resultGrid[i] = [new Array(height)];
  }
  return resultGrid;
}

function rotateRight(sourceGrid) {
  var width = sourceGrid.length;
  var height = sourceGrid[0].length;

  var resultGrid = createEmptyGrid(width, height);
  for (var row = 0; row < width; row++) {
    for (var column = 0; column < height; column++) {
      resultGrid[height - 1 - column][row] = sourceGrid[row][column];
    }
  }
  return resultGrid;
}

function moveAllToLeft(grid) {
  var moved = false;
  grid.forEach(function (row) {
    for (var i = 1; i <= LAST; i++) {
      if (row[i] != null) {
        var firstEmpty = findFirstEmpty(row);
        if (firstEmpty != null && firstEmpty < i) {
          row[firstEmpty] = row[i];
          row[i] = null;
          moved = true;
        }
      }
    }
  })
  return moved;
}

