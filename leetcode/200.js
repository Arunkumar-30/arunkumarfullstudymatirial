

var numIsland = function(grid){
    const visited = grid.map(row => row.map(cell => false));
    let islandCount = 0
    console.log(visited)

    return islandCount
}

grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
numIsland(grid)
