export class Node<T> {
    data: T;
    next: Node<T> | null = null;
    prev: Node<T> | null = null;

    constructor(data: T) {
        this.data = data;
    }
}

export class LinkedList<T> {
    head: Node<T> | null = null;
    tail: Node<T> | null = null;

    // Add item to the end of the list
    append(data: T): void {
        const newNode = new Node(data);
        if (!this.tail) {
            this.head = this.tail = newNode;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
    }

    // Replace a specific node with two items
    replaceNode(node: Node<T>, item1: T, item2: T): void {
        if (!node) {
            throw new Error("Invalid node.");
        }

        // Create new nodes for the replacement items
        const node1 = new Node(item1);
        const node2 = new Node(item2);

        // Link node1 and node2
        node1.next = node2;
        node2.prev = node1;

        // Link surrounding nodes to the new nodes
        if (node.prev) {
            node.prev.next = node1;
            node1.prev = node.prev;
        } else {
            this.head = node1; // Update head if replacing the first node
        }

        if (node.next) {
            node2.next = node.next;
            node.next.prev = node2;
        } else {
            this.tail = node2; // Update tail if replacing the last node
        }
    }

    // Print list for debugging
    printList(): void {
        let current = this.head;
        const items = [];
        while (current) {
            items.push(current.data);
            current = current.next;
        }
        console.log(items.join(" "));
    }

	length(): number {
		let current = this.head;
		let count = 0;
		while (current) {
			count++;
			current = current.next;
		}
		return count;
	}
}

// Example usage
const dll = new LinkedList<number>();
dll.append(1);
dll.append(2);
dll.append(3);
dll.append(4);

console.log("Original list:");
dll.printList();

// Replace the second node with 5 and 6
if (dll.head && dll.head.next) {
    dll.replaceNode(dll.head.next, 5, 6);
}

console.log("Modified list:");
dll.printList();
