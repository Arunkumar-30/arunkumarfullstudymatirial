function maxSubArray(nums) {

    let currentSum = nums[0];
    let maxSum = nums[0];

    for (let i = 1; i < nums.length; i++) {

        // Decide whether to start a new subarray or continue
        if (currentSum + nums[i] > nums[i]) {
            currentSum = currentSum + nums[i];
        } else {
            currentSum = nums[i];
        }

        // Update maximum sum
        if (currentSum > maxSum) {
            maxSum = currentSum;
        }
    }

    return maxSum;
}
const nums = [-2,1,-3,4,-1,2,1,-5,4]
console.log(maxSubArray(nums))