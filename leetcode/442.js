nums = [4, 3, 2, 7, 8, 3, 1]
// console.log(findDuplicates(nums))

// function findDuplicates(nums) {
//     let res = []
//     for (let i = 0; i < nums.length; i++) {
//         let index = Math.abs(nums[i]) - 1
//         if (nums[index] < 0) {
//             res.push(index + 1)
//         } else {
//             nums[index] = -nums[index]
//         }
//     }
//     return res
// }
res =[]
for(let i = 0; i<nums.length;i++){
    for(let j = i+1; j<nums.length;j++){
        if(nums[i] === nums[j]){
            res.push(nums[i])
        }
        }

}
console.log(res)