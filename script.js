const container = document.querySelector(".maze");

// Size of columns
let columns;
// Size of rows
let rows;
// Matrix scale
let size;

const initialPositionIndex = 0;
let finalPositionIndex;
let visited = [];
let currentDivIndex = 0;

const clearMaze = () => {
  document.querySelector(".maze").innerHTML = "";
  columns = null;
  rows = null;
  size = null;
  finalPositionIndex = null;
  visited = [];
  currentDivIndex = 0;
};

const calcDistance = index => {
  return (
    Math.abs(
      Math.ceil(finalPositionIndex / columns) - Math.ceil(index / columns)
    ) + Math.abs((finalPositionIndex % columns) - (index % columns))
  );
};

const heuristicHandler = divs => {
  container.querySelectorAll("div").forEach(e => {
    const index = e.getAttribute("data-index");
    e.innerText = calcDistance(index);
    e.setAttribute("data-heuristic", e.innerText);
  });
};

const generateMaze = () => {
  clearMaze();
  const text = document.querySelector("textarea").value;
  try {
    const matrix = JSON.parse(text);
    columns = matrix[0].length;
    rows = matrix.length;
    size = columns * rows;

    container.style.width = columns * 52 + "px";

    // Index for data-index attribute
    let index = 0;
    matrix.forEach(row => {
      row.forEach(value => {
        let div = document.createElement("div");

        // If start point, set first div in walked way
        if (index === 0) {
          div.classList.add("me");
          visited.push(div);
        }
        // If wall, set wall class
        else if (value === 0) {
          div.classList.add("wall");
        }
        // If end point, set final index and end class
        else if (value === 9) {
          div.classList.add("d3");
          finalPositionIndex = index;
        }

        div.setAttribute("data-index", index++);
        container.appendChild(div);
      });
    });
    heuristicHandler();
  } catch (e) {
    alert("Invalid Input");
  }
};

const getDiv = index => {
  return document.querySelector("[data-index='" + index + "']");
};

const getAboveDiv = index => {
  const div = getDiv(index - columns);
  if (
    index > columns &&
    !div.classList.contains("wall") &&
    div.getAttribute("data-visited") !== "true"
  ) {
    return div;
  }
};

const getBelowDiv = index => {
  const div = getDiv(columns + index);
  if (
    index + columns < size &&
    !div.classList.contains("wall") &&
    div.getAttribute("data-visited") !== "true"
  ) {
    return div;
  }
};

const getRightDiv = index => {
  const div = getDiv(index + 1);
  if (
    (index + 1) % columns != 0 &&
    !div.classList.contains("wall") &&
    div.getAttribute("data-visited") !== "true"
  ) {
    return div;
  }
};

const getLeftDiv = index => {
  const div = getDiv(index - 1);
  if (
    index % columns > 0 &&
    !div.classList.contains("wall") &&
    div.getAttribute("data-visited") !== "true"
  ) {
    return div;
  }
};

const findWayOptions = (index, lastDiv) => {
  const ways = [
    getAboveDiv(index),
    getBelowDiv(index),
    getRightDiv(index),
    getLeftDiv(index)
  ].filter(option => option);

  // Retrieve ways indexes
  const indexes = ways.map(e => e.getAttribute("data-heuristic"));

  const minIndex = Math.min(...indexes);

  // If no way found, then come back (returning last visited div)
  if (ways.length == 0) {
    return visited[visited.indexOf(lastDiv) - 1];
  }
  // Else go to div that have smallest way
  else {
    return ways.find(e => e.getAttribute("data-heuristic") == minIndex);
  }
};

const run = () => {
  setTimeout(function() {
    let lastDiv = visited[visited.length - 1];
    lastDiv.setAttribute("data-visited", true);
    lastDiv.classList.remove("me");
    lastDiv = findWayOptions(currentDivIndex, lastDiv);
    lastDiv.setAttribute("data-visited", "true");
    lastDiv.setAttribute("class", "me");
    currentDivIndex = parseInt(lastDiv.getAttribute("data-index"));
    visited.push(lastDiv);
    if (currentDivIndex != finalPositionIndex) {
      run();
    }
  }, 300);
};
