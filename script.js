
// ============================================================
// CAMPUS NAVIGATION SYSTEM
// BFS + DIJKSTRA + MAP HIGHLIGHTING
// ============================================================

const start = document.getElementById("start");
const destination = document.getElementById("destination");
const algorithm = document.getElementById("algorithm");

const button = document.getElementById("findRoute");

const result = document.getElementById("result");
const distance = document.getElementById("distance");
const time = document.getElementById("time");
const status = document.getElementById("status");

const campusMap = document.querySelector(".campus-map");


// ============================================================
// 1. CAMPUS GRAPH
// ============================================================
//
// IMPORTANT:
// The graph now follows the actual campus layout.
//
// Canteen is NOT used as a connection to the sports area.
//
// Sports area:
//
//              Football
//                  |
//              Parking
//             /    |    \
//     Volleyball Basketball Cricket
//                  |
//             Boys Hostel
//
// Bottom area:
//
// Main Gate -> Canteen
// Main Gate -> C Block
// C Block -> B Block -> A Block
//
// ============================================================

const roads = [

    // -----------------------------
    // MAIN ENTRANCE / BOTTOM AREA
    // -----------------------------

    ["Main Gate", "Canteen", 120],
    ["Main Gate", "C Block", 180],

    ["Canteen", "C Block", 100],

    ["C Block", "B Block", 100],
    ["B Block", "A Block", 100],

    // -----------------------------
    // CENTRAL PARKING
    // -----------------------------

    ["C Block", "Parking", 130],
    ["B Block", "Parking", 140],

    // -----------------------------
    // SPORTS AREA
    // -----------------------------

    ["Parking", "Football & Running", 180],
    ["Parking", "Volleyball", 120],
    ["Parking", "Basketball", 120],
    ["Parking", "Cricket", 150],

    // -----------------------------
    // BOYS HOSTEL
    // -----------------------------

    ["Cricket", "Boys Hostel", 120],
    ["Basketball", "Boys Hostel", 100],

    // -----------------------------
    // SPORTS CONNECTIONS
    // -----------------------------

    ["Football & Running", "Volleyball", 100],
    ["Volleyball", "Basketball", 90],
    ["Basketball", "Cricket", 100],

    // -----------------------------
    // GIRLS SIDE
    // -----------------------------

    ["A Block", "Girls Hostel", 150],
    ["Parking", "Girls Ground", 160],
    ["Girls Ground", "Girls Hostel", 120],

    // -----------------------------
    // CLASSROOM DESTINATIONS
    // -----------------------------

    ["A Block", "A Block 1st - CSD", 20],
    ["A Block", "A Block 2nd - AIML", 20],
    ["A Block", "A Block 3rd - CSE Core", 20],

    ["B Block", "B Block 5th - Auditorium", 25]
];


// ============================================================
// 2. BUILD GRAPH
// ============================================================

const graph = {};

function addLocation(name) {

    if (!graph[name]) {
        graph[name] = [];
    }
}


function addRoad(from, to, distanceValue) {

    addLocation(from);
    addLocation(to);

    graph[from].push({
        node: to,
        distance: distanceValue
    });

    graph[to].push({
        node: from,
        distance: distanceValue
    });
}


roads.forEach(function (road) {

    addRoad(
        road[0],
        road[1],
        road[2]
    );

});


// ============================================================
// 3. MAP ELEMENTS
// ============================================================

const mapElements = {

    "Main Gate":
        document.querySelector(".gate"),

    "Football & Running":
        document.querySelector(".football"),

    "Volleyball":
        document.querySelector(".volleyball"),

    "Basketball":
        document.querySelector(".basketball"),

    "Cricket":
        document.querySelector(".cricket"),

    "Boys Hostel":
        document.querySelector(".boys-hostel"),

    "Parking":
        document.querySelector(".parking"),

    "Girls Ground":
        document.querySelector(".girls-ground"),

    "Canteen":
        document.querySelector(".canteen"),

    "C Block":
        document.querySelector(".c-block"),

    "B Block":
        document.querySelector(".b-block"),

    "A Block":
        document.querySelector(".a-block"),

    "Girls Hostel":
        document.querySelector(".girls-hostel")
};


// ============================================================
// 4. CREATE SVG ROUTE LAYER
// ============================================================

let routeSvg =
    document.querySelector(".route-svg");


if (!routeSvg) {

    routeSvg =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );

    routeSvg.classList.add("route-svg");

    routeSvg.setAttribute(
        "width",
        "100%"
    );

    routeSvg.setAttribute(
        "height",
        "100%"
    );

    campusMap.appendChild(routeSvg);
}


// ============================================================
// 5. CLEAR PREVIOUS ROUTE
// ============================================================

function clearHighlight() {

    routeSvg.innerHTML = "";


    Object.keys(mapElements).forEach(
        function (name) {

            const element =
                mapElements[name];

            if (!element) {
                return;
            }

            element.classList.remove(
                "route-node"
            );

            element.classList.remove(
                "route-start"
            );

            element.classList.remove(
                "route-end"
            );
        }
    );
}


// ============================================================
// 6. GET LOCATION CENTER
// ============================================================

function getElementCenter(element) {

    const mapRect =
        campusMap.getBoundingClientRect();

    const rect =
        element.getBoundingClientRect();


    return {

        x:
            rect.left -
            mapRect.left +
            rect.width / 2,

        y:
            rect.top -
            mapRect.top +
            rect.height / 2
    };
}


// ============================================================
// 7. DRAW ROUTE
// ============================================================

function drawRoute(path) {

    clearHighlight();


    if (!path || path.length === 0) {
        return;
    }


    // -----------------------------
    // Highlight locations
    // -----------------------------

    path.forEach(
        function (location, index) {

            const element =
                mapElements[location];


            if (!element) {
                return;
            }


            element.classList.add(
                "route-node"
            );


            if (index === 0) {

                element.classList.add(
                    "route-start"
                );
            }


            if (
                index ===
                path.length - 1
            ) {

                element.classList.add(
                    "route-end"
                );
            }
        }
    );


    // -----------------------------
    // Draw lines
    // -----------------------------

    for (
        let i = 0;
        i < path.length - 1;
        i++
    ) {

        const fromElement =
            mapElements[path[i]];

        const toElement =
            mapElements[path[i + 1]];


        if (
            !fromElement ||
            !toElement
        ) {
            continue;
        }


        const from =
            getElementCenter(
                fromElement
            );

        const to =
            getElementCenter(
                toElement
            );


        const line =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "line"
            );


        line.setAttribute(
            "x1",
            from.x
        );

        line.setAttribute(
            "y1",
            from.y
        );

        line.setAttribute(
            "x2",
            to.x
        );

        line.setAttribute(
            "y2",
            to.y
        );


        line.classList.add(
            "route-line"
        );


        routeSvg.appendChild(line);
    }
}


// ============================================================
// 8. BFS
// ============================================================

function bfs(
    startNode,
    targetNode
) {

    const queue = [startNode];

    const visited =
        new Set();

    const previous = {};


    visited.add(startNode);


    while (queue.length > 0) {

        const current =
            queue.shift();


        if (
            current ===
            targetNode
        ) {
            break;
        }


        const neighbors =
            graph[current] || [];


        for (
            const neighbor
            of neighbors
        ) {

            const next =
                neighbor.node;


            if (
                !visited.has(next)
            ) {

                visited.add(next);

                previous[next] =
                    current;

                queue.push(next);
            }
        }
    }


    if (
        startNode !== targetNode &&
        previous[targetNode] ===
        undefined
    ) {

        return null;
    }


    return reconstructPath(
        previous,
        startNode,
        targetNode
    );
}


// ============================================================
// 9. DIJKSTRA
// ============================================================

function dijkstra(
    startNode,
    targetNode
) {

    const distances = {};
    const previous = {};

    const unvisited =
        new Set(
            Object.keys(graph)
        );


    Object.keys(graph).forEach(
        function (node) {

            distances[node] =
                Infinity;
        }
    );


    distances[startNode] = 0;


    while (
        unvisited.size > 0
    ) {

        let current = null;

        let smallestDistance =
            Infinity;


        unvisited.forEach(
            function (node) {

                if (
                    distances[node] <
                    smallestDistance
                ) {

                    smallestDistance =
                        distances[node];

                    current = node;
                }
            }
        );


        if (current === null) {
            break;
        }


        unvisited.delete(
            current
        );


        if (
            current === targetNode
        ) {
            break;
        }


        graph[current].forEach(
            function (neighbor) {

                const next =
                    neighbor.node;

                const newDistance =
                    distances[current] +
                    neighbor.distance;


                if (
                    newDistance <
                    distances[next]
                ) {

                    distances[next] =
                        newDistance;

                    previous[next] =
                        current;
                }
            }
        );
    }


    if (
        startNode !== targetNode &&
        distances[targetNode] ===
        Infinity
    ) {

        return null;
    }


    return {

        path:
            reconstructPath(
                previous,
                startNode,
                targetNode
            ),

        distance:
            distances[targetNode]
    };
}


// ============================================================
// 10. RECONSTRUCT PATH
// ============================================================

function reconstructPath(
    previous,
    startNode,
    targetNode
) {

    const path = [];

    let current =
        targetNode;


    while (
        current !== undefined
    ) {

        path.unshift(current);


        if (
            current ===
            startNode
        ) {
            break;
        }


        current =
            previous[current];
    }


    if (
        path[0] !==
        startNode
    ) {

        return null;
    }


    return path;
}


// ============================================================
// 11. DISTANCE
// ============================================================

function calculatePathDistance(
    path
) {

    if (
        !path ||
        path.length < 2
    ) {

        return 0;
    }


    let total = 0;


    for (
        let i = 0;
        i < path.length - 1;
        i++
    ) {

        const from =
            path[i];

        const to =
            path[i + 1];


        const road =
            graph[from].find(
                function (edge) {

                    return (
                        edge.node ===
                        to
                    );
                }
            );


        if (road) {

            total +=
                road.distance;
        }
    }


    return total;
}


// ============================================================
// 12. WALKING TIME
// ============================================================

function calculateWalkingTime(
    distanceValue
) {

    const walkingSpeed = 80;

    const minutes =
        distanceValue /
        walkingSpeed;


    if (minutes < 1) {
        return "< 1 min";
    }


    return (
        Math.ceil(minutes) +
        " min"
    );
}


// ============================================================
// 13. ROUTE DISPLAY
// ============================================================

function createRouteHTML(
    path,
    selectedAlgorithm
) {

    let html = "";

    html += "<strong>🧭</strong>";

    html +=
        "<p><b>Route found!</b></p>";

    html +=
        '<div class="route-path">';


    path.forEach(
        function (location, index) {

            html +=
                '<div class="route-location">';

            html +=
                "<span>" +
                (index + 1) +
                "</span>";

            html +=
                "<b>" +
                location +
                "</b>";

            html += "</div>";


            if (
                index <
                path.length - 1
            ) {

                html +=
                    '<div class="route-arrow">↓</div>';
            }
        }
    );


    html += "</div>";


    html +=
        "<p>Algorithm: <b>" +
        selectedAlgorithm.toUpperCase() +
        "</b></p>";


    return html;
}


// ============================================================
// 14. FIND ROUTE
// ============================================================

button.addEventListener(
    "click",
    function () {

        const startLocation =
            start.value;

        const destinationLocation =
            destination.value;

        const selectedAlgorithm =
            algorithm.value;


        clearHighlight();


        // -----------------------------
        // SAME LOCATION
        // -----------------------------

        if (
            startLocation ===
            destinationLocation
        ) {

            result.innerHTML =
                "<strong>📍</strong>" +
                "<p>You are already at <b>" +
                startLocation +
                "</b>.</p>";


            distance.textContent =
                "0 m";

            time.textContent =
                "0 min";

            status.textContent =
                "Same location";


            drawRoute([
                startLocation
            ]);


            return;
        }


        let path = null;

        let totalDistance = 0;


        // -----------------------------
        // BFS
        // -----------------------------

        if (
            selectedAlgorithm ===
            "bfs"
        ) {

            path =
                bfs(
                    startLocation,
                    destinationLocation
                );


            if (path) {

                totalDistance =
                    calculatePathDistance(
                        path
                    );
            }
        }


        // -----------------------------
        // DIJKSTRA
        // -----------------------------

        else {

            const route =
                dijkstra(
                    startLocation,
                    destinationLocation
                );


            if (route) {

                path =
                    route.path;

                totalDistance =
                    route.distance;
            }
        }


        // -----------------------------
        // NO ROUTE
        // -----------------------------

        if (!path) {

            result.innerHTML =
                "<strong>❌</strong>" +
                "<p>No route found between <b>" +
                startLocation +
                "</b> and <b>" +
                destinationLocation +
                "</b>.</p>";


            distance.textContent =
                "—";

            time.textContent =
                "—";

            status.textContent =
                "No route";


            return;
        }


        // -----------------------------
        // HIGHLIGHT MAP
        // -----------------------------

        drawRoute(path);


        // -----------------------------
        // DISPLAY RESULT
        // -----------------------------

        result.innerHTML =
            createRouteHTML(
                path,
                selectedAlgorithm
            );


        distance.textContent =
            totalDistance +
            " m";


        time.textContent =
            calculateWalkingTime(
                totalDistance
            );


        status.textContent =
            selectedAlgorithm === "bfs"
                ? "BFS route highlighted"
                : "Dijkstra route highlighted";


        console.log(
            "Algorithm:",
            selectedAlgorithm
        );

        console.log(
            "Route:",
            path
        );

        console.log(
            "Distance:",
            totalDistance,
            "meters"
        );
    }
);


// ============================================================
// 15. CLEAR HIGHLIGHT WHEN SELECTION CHANGES
// ============================================================

start.addEventListener(
    "change",
    function () {

        clearHighlight();

        status.textContent =
            "Ready";
    }
);


destination.addEventListener(
    "change",
    function () {

        clearHighlight();

        status.textContent =
            "Ready";
    }
);


algorithm.addEventListener(
    "change",
    function () {

        clearHighlight();

        status.textContent =
            "Ready";
    }
);


// ============================================================
// 16. DEBUG
// ============================================================

console.log(
    "Campus Navigation System loaded successfully."
);

console.log(
    "Campus Graph:",
    graph
);

