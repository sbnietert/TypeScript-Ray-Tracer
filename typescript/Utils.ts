module RT {
    export type Class<T> = { new (): T; };
    export type Dictionary<T> = { [id: string]: T; };

    export module Utils {
        export function set<T>(dest: T, src: T): void {
            for (var key in src) {
                if (src.hasOwnProperty(key)) {
                    (<any>dest)[key] = (<any>src)[key];
                }
            }
        }
    }
}