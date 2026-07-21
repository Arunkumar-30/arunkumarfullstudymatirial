// let list1 = [1,2,4]
// let list2 = [1,3,4]
// let list3 = [...list1, ...list2]

// for (let i = 0; i < list3.length; i++) {
//     for (let j = i + 1; j < list3.length; j++) {
//         if (list3[i] > list3[j]) {
//             let temp = list3[j]
//             list3[j] = list3[i]
//             list3[i] = temp
//         }
//     }
// }

// console.log(list3)
var mergeTwoLists = function(list1, list2) {

    let dummy = new ListNode(0);
    console.log(dummy)
    let current = dummy;

    while (list1 !== null && list2 !== null) {

        if (list1.val <= list2.val) {
            current.next = list1;

            list1 = list1.next;
            console.log(list1)
        } else {
            current.next = list2;
            list2 = list2.next;
        }

        current = current.next;
    }

    // Attach remaining nodes
    if (list1 !== null) {
        current.next = list1;
    } else {
        current.next = list2;
    }

    return dummy.next;
};
