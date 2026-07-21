var removeDuplicates = function(nums) {

    if (nums.length <= 2) return nums.length;

    let k = 2;  // first two elements always allowed

    for (let i = 2; i < nums.length; i++) {

        if (nums[i] !== nums[k - 2]) {
            nums[k] = nums[i];
            k++;
        }
    }

    return k;
};
console.log(removeDuplicates([1,1,1,2,2,3]));