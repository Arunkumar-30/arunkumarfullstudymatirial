// nums = [1,2,3,1]

function containDuplicate(nums){
    for(let i= 0; i<nums.length;i++){
        for(let j=i+1; j<nums.length;j++){
            if(nums[i] === nums[j]){
                return true
            }
        }
        
    }
    return false
}

nums =[2,14,18,22,22]
console.log(containDuplicate(nums))