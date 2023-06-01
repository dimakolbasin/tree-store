import TreeStore from "../src/TreeStore";
import { items } from "../src/mock";

describe('TreeStore', () => {
    let ts: TreeStore;

    beforeEach(() => {
        ts = new TreeStore(items);
    });

    describe('getAll', () => {
        it('should return the initial array of elements', () => {
            expect(ts.getAll()).toEqual(items);
        });
    });

    describe('getItem', () => {
        it('should return the item with the specified id', () => {
            expect(ts.getItem(7)).toEqual({ id: 7, parent: 4, type: null });
        });

        it('should return null for non-existent id', () => {
            expect(ts.getItem(100)).toBeNull();
        });
    });

    describe('getChildren', () => {
        it('should return an array of children for the specified id', () => {
            expect(ts.getChildren(4)).toEqual([
                { id: 7, parent: 4, type: null },
                { id: 8, parent: 4, type: null },
            ]);
        });

        it('should return an empty array for id with no children', () => {
            expect(ts.getChildren(8)).toEqual([]);
        });
    });

    describe('getAllChildren', () => {
        it('should return an array of all children for the specified id', () => {
            expect(ts.getAllChildren(2)).toEqual([
                { id: 6, parent: 2, type: 'test' },
                { id: 5, parent: 2, type: 'test' },
                { id: 4, parent: 2, type: 'test' },
                { id: 8, parent: 4, type: null },
                { id: 7, parent: 4, type: null },
            ]);
        });

        it('should return an empty array for id with no children', () => {
            expect(ts.getAllChildren(7)).toEqual([]);
        });
    });

    describe('getAllParents', () => {
        it('should return an array of all parents for the specified id', () => {
            expect(ts.getAllParents(7)).toEqual([
                { id: 1, parent: 'root' },
                { id: 2, parent: 1, type: 'test' },
                { id: 4, parent: 2, type: 'test' }
            ]);
        });

        it('should return an empty array for id with no parents', () => {
            expect(ts.getAllParents(1)).toBeNull();
        });
    });
});