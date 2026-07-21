var productExceptSelf = function(nums) {
    const n = nums.length;
    console.log(n)

    const prefix = new Array(n);
    const suffix = new Array(n);
    const answer = new Array(n);

    // Prefix
    prefix[0] = 1;
    console.log(prefix)

    for (let i = 1; i < n; i++) {
        prefix[i] = prefix[i - 1] * nums[i - 1];
        console.log(prefix)
    }

    // Suffix
    suffix[n - 1] = 1;

    for (let i = n - 2; i >= 0; i--) {
        console.log(i,n-2,"i")
        suffix[i] = suffix[i + 1] * nums[i + 1];
    }

    // Answer
    for (let i = 0; i < n; i++) {
        answer[i] = prefix[i] * suffix[i];
    }

    return answer;
};

const nums = [1,2,3,4]
console.log(productExceptSelf(nums))