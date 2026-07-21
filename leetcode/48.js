var rotate = function(matrix) {
    let n = matrix.length;
    console.log(n)

    // Step 1: Transpose the matrix
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {

            // Swap matrix[i][j] and matrix[j][i]
            let temp = matrix[i][j];

            matrix[i][j] = matrix[j][i];

            matrix[j][i] = temp;
        }
    }

    // Step 2: Reverse every row
    for (let i = 0; i < n; i++) {

        let left = 0;
        let right = n - 1;

        while (left < right) {

            // Swap left and right elements
            let temp = matrix[i][left];

            matrix[i][left] = matrix[i][right];

            matrix[i][right] = temp;

            left++;
            right--;
        }
    }
};
let matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

rotate(matrix);

console.log(matrix);