var threeSum = function(nums) {
     nums.sort((a, b) => a - b);

    let result = [];

    for (let i = 0; i < nums.length - 2; i++) {

        // Skip duplicate first numbers
        if (i > 0 && nums[i] === nums[i - 1]) {
            continue;
        }

        let left = i + 1;
        let right = nums.length - 1;

        while (left < right) {

            let sum = nums[i] + nums[left] + nums[right];

            if (sum === 0) {

                result.push([nums[i], nums[left], nums[right]]);

                // Skip duplicate left values
                while (left < right && nums[left] === nums[left + 1]) {
                    left++;
                }

                // Skip duplicate right values
                while (left < right && nums[right] === nums[right - 1]) {
                    right--;
                }

                left++;
                right--;

            } else if (sum < 0) {

                left++;

            } else {

                right--;
            }
        }
    }

    return result;
};
let nums = [-1,0,1,2,-1,-4]

console.log(threeSum(nums))