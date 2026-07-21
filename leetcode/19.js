class ListNode {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
}

let head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);
head.next.next.next = new ListNode(4);
head.next.next.next.next = new ListNode(5);

function removeNthFromEnd(head, n) {
    console.log("Head =", head.val);
    console.log("n =", n);

    return head;
}

function printList(head) {
    while (head) {
        console.log(head.val);
        head = head.next;
    }
}

let result = removeNthFromEnd(head, 2);

console.log("Final List:");
printList(result);