🏫 Campus Navigation System

A web-based Campus Navigation System that helps users find routes between different locations on a college campus using BFS (Breadth-First Search) and Dijkstra's Algorithm.

The project represents the campus as a graph, where locations are nodes and paths between locations are edges with distances.

🎯 Project Objective

The main objective of this project is to provide an easy way for students and visitors to navigate around the campus.

The system can:

- Find a route between two campus locations
- Calculate the total distance
- Estimate walking time
- Display the selected route visually
- Demonstrate BFS and Dijkstra's algorithms
- Compare unweighted and weighted graph traversal

🚀 Features

- 🗺️ Interactive campus map
- 📍 Multiple campus locations
- 🔎 Route selection between locations
- 🔵 BFS route finding
- 🟢 Dijkstra's shortest-path algorithm
- 📏 Distance calculation
- 🚶 Estimated walking time
- ✨ Visual route highlighting
- ⚠️ Handles cases where a route is not available

🧠 Algorithms Used

1. Breadth-First Search (BFS)

BFS explores the graph level by level.

It is useful when we want to find a route with the minimum number of edges/steps.

The algorithm uses:

- Queue
- Visited set
- Previous-node map

Time Complexity: "O(V + E)"

Where:

- "V" = number of vertices
- "E" = number of edges

2. Dijkstra's Algorithm

Dijkstra's algorithm finds the shortest path based on distance when edges have different weights.

In this project, the weights represent approximate distances between campus locations.

The algorithm:

1. Starts from the selected source
2. Assigns distance "0" to the source
3. Assigns infinity to other nodes
4. Checks neighboring nodes
5. Updates distances when a shorter path is found
6. Reconstructs the final shortest route

Time Complexity: "O(V² + E)" in the current implementation.

🏗️ Graph Representation

The campus is represented using an adjacency list.

Example:

Main Gate
   |
C Block
   |
Parking
  / | \
 /  |  \
Football  Volleyball  Basketball
                    |
                  Cricket

Each connection contains a distance value.

For example:

Parking → Basketball = 120 meters

This allows Dijkstra's algorithm to calculate the shortest-distance route.

🛠️ Technologies Used

- HTML — Structure of the webpage
- CSS — Styling and campus-map design
- JavaScript — Graph creation, BFS, Dijkstra, distance calculation and route visualization
- SVG — Visual route lines

📂 Project Structure

Campus-Navigation-System-DAA-/
│
├── index.html
├── style.css
├── script.js
└── README.md

"index.html"

Contains the campus map, controls, locations and user interface.

"style.css"

Controls the appearance of the campus map, buttons, locations and route highlighting.

"script.js"

Contains the main functionality:

- Campus graph
- Graph edges and distances
- BFS
- Dijkstra
- Path reconstruction
- Distance calculation
- Walking-time calculation
- Route visualization

🚶 Walking Time

The system estimates walking time using an assumed average walking speed of approximately:

80 meters/minute

The calculation is:

Walking Time = Distance / Walking Speed

The walking time is an estimate and can be adjusted according to the actual campus environment.

📊 BFS vs Dijkstra

Feature| BFS| Dijkstra
Graph type| Unweighted| Weighted
Considers distance| ❌| ✅
Minimum number of edges| ✅| Not necessarily
Shortest physical route| ❌| ✅
Data structure| Queue| Distance + previous-node tracking
Use in this project| Demonstration/comparison| Distance-based navigation

💡 Why Both Algorithms?

Both algorithms are implemented to demonstrate the difference between unweighted and weighted graph traversal.

- BFS finds a route with the minimum number of connections.
- Dijkstra finds the route with the minimum total distance.

For real campus navigation, Dijkstra is more suitable because different paths have different distances.

🎓 Design and Algorithms (DAA) Concepts

This project demonstrates several concepts from Design and Analysis of Algorithms:

- Graph data structures
- Adjacency lists
- Graph traversal
- BFS
- Shortest-path algorithms
- Weighted graphs
- Time complexity
- Path reconstruction
- Algorithm comparison

🔮 Future Improvements

Possible future improvements include:

- 📍 GPS-based real campus locations
- 🧭 Real-time navigation
- 🚧 Blocked-path detection
- ♿ Accessible routes for wheelchair users
- 🌐 Backend/database integration
- 📱 Mobile application
- 🚶 More accurate walking-time estimation
- 🔄 Dynamic distances based on campus conditions

👨‍💻 Project

Campus Navigation System — DAA Project

Built as a web-based demonstration of graph algorithms for campus route finding.
