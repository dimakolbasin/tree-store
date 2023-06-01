import { Item } from "./interfaces";

export default class TreeStore {
    private readonly items: Item[] = [];
    private readonly idMap: Map<number | string, Item> = new Map();
    private readonly cache: Map<string, { result: Item | Item[] }> = new Map();

    constructor (items: Item[]) {
        this.items = items;
        this.buildIdMap();
    }

    public getAll (): Item[] {
        return this.items;
    }

    public getItem (id: number | string): Item | null  {
        const cacheKey = `getItem:${id}`;

        if (this.cache.has(cacheKey)) {
            const cachedResult = this.getCachedResult(cacheKey);
            if (cachedResult) return cachedResult as Item;
        }

        const item = this.idMap.get(id) || null;
        if (!item) return null;

        this.setCachedResult(cacheKey, item);
        return item;
    }

    public getChildren (id: number | string): Item[] {
        const cacheKey = `getChildren:${id}`;

        if (this.cache.has(cacheKey)) {
            const cachedResult = this.getCachedResult(cacheKey);
            if (cachedResult) return cachedResult as Item[]
        }

        const children: Item[] = [];

        for (const item of this.items) {
            if (item.parent === id) children.push(item);
        }

        this.setCachedResult(cacheKey, children);
        return children;
    }

    public getAllChildren (id: number | string): Item | Item[] {
        const cacheKey = `getAllChildren:${id}`;

        if (this.cache.has(cacheKey)) {
            const cachedResult = this.getCachedResult(cacheKey);
            if (cachedResult) return cachedResult;
        }

        const allChildren: Item[] = [];
        const stack: Item[] = this.getChildren(id);

        while (stack.length) {
            const child = stack.pop();
            if (child) {
                allChildren.push(child);
                const grandchildren = this.getChildren(child.id);
                stack.push(...grandchildren);
            }
        }

        this.setCachedResult(cacheKey, allChildren);
        return allChildren;
    }

    public getAllParents (id: number | string): Item | Item[] | null {
        const cacheKey = `getAllParents:${id}`;

        if (this.cache.has(cacheKey)) {
            const cachedResult = this.getCachedResult(cacheKey);
            if (cachedResult) return cachedResult;
        }

        const allParents: Item[] = [];
        let currentItem: Item | null = this.getItem(id);

        while (currentItem) {
            const parentItem = this.getItem(currentItem.parent);
            if (parentItem) {
                allParents.unshift(parentItem);
                currentItem = parentItem;
            } else {
                break;
            }
        }
        if (!allParents.length) return null;

        const sortedParents = allParents.sort((a, b) => a.id - b.id);
        this.setCachedResult(cacheKey, sortedParents);
        return sortedParents;
    }

    private buildIdMap(): void {
        for (const item of this.items) {
            this.idMap.set(item.id, item);
        }
    }

    private getCachedResult(cacheKey: string): Item | Item[] | null {
        const cachedItem = this.cache.get(cacheKey);

        if (cachedItem) return cachedItem.result;

        return null;
    }

    private setCachedResult(cacheKey: string, result: Item | Item[]): void {
        const expiresAt = 300000; //5 minutes
        this.cache.set(cacheKey, { result });

        setTimeout(() => {
            this.cache.delete(cacheKey);
        }, expiresAt);
    }
}