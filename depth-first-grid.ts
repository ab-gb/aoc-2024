export type Grid = string[][];
export type Coordinate = [number, number];

export interface Region {
    name: string;
    coordinates: Coordinate[];
}

export const findContiguousRegions = (grid: Grid): Region[] => {
    const rows = grid.length;
    const cols = grid[0].length;
    const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
    const directions: Coordinate[] = [
        [-1, 0], // Top
        [1, 0],  // Bottom
        [0, -1], // Left
        [0, 1]   // Right
    ];

    const clusters: Coordinate[][] = [];

    // recursively depth-first search for contiguous regions
    const dfs =(r: number, c: number, char: string, cluster: Coordinate[]) => {
        if (isOutOfBounds(r,c,rows,cols)) return; // Out of bounds
        if (visited[r][c] || grid[r][c] !== char) return; // Already visited or different character

        visited[r][c] = true;
        cluster.push([r, c]);

        for (const [dr, dc] of directions) {
            dfs(r + dr, c + dc, char, cluster);
        }
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!visited[r][c]) {
                const cluster: Coordinate[] = [];
                dfs(r, c, grid[r][c], cluster);
                clusters.push(cluster);
            }
        }
    }

    // create regions from clusters
    const regions: Region[] = clusters.map(cluster => {
        const [r, c] = cluster[0];
        return {
            name: grid[r][c],
            coordinates: cluster
        };
    });

    return regions;
}

const isOutOfBounds = ( r: number, c: number, rows: number, cols: number): boolean => {
    return r < 0 || r >= rows || c < 0 || c >= cols;
}

export const showExample = () => {
    // Example usage
    const grid: Grid = [
        ['a', 'a', 'b', 'b'],
        ['a', 'a', 'b', 'c'],
        ['d', 'd', 'c', 'c'],
        ['d', 'e', 'e', 'c']
    ];

    const result = findContiguousRegions(grid);
    console.log(result);
}