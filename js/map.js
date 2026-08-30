// ============================================================================
// MAP.JS - Sistema de mapa, colisões e navegação
// ============================================================================

class TileMap {
    constructor() {
        this.tiles = [];
        this.width = CONFIG.MAP_WIDTH / CONFIG.TILE_SIZE;
        this.height = CONFIG.MAP_HEIGHT / CONFIG.TILE_SIZE;
        this.obstacles = [];
        this.coverPoints = [];
        this.spawnPoints = {};
        this.generateFavelaMap();
    }

    generateFavelaMap() {
        // Initialize tile grid
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x] = 0; // 0 = walkable, 1 = wall, 2 = obstacle
            }
        }

        // Create favela structures
        this.createHouses();
        this.createStreets();
        this.createObstacles();
        this.createCoverPoints();
        this.createSpawnPoints();
    }

    createHouses() {
        // Cluster de casas
        const houses = [
            { x: 2, y: 2, w: 4, h: 3 },
            { x: 8, y: 2, w: 4, h: 3 },
            { x: 14, y: 2, w: 4, h: 3 },
            { x: 2, y: 7, w: 4, h: 3 },
            { x: 8, y: 7, w: 4, h: 3 },
            { x: 14, y: 7, w: 4, h: 3 },
            { x: 2, y: 12, w: 4, h: 3 },
            { x: 8, y: 12, w: 4, h: 3 },
            { x: 14, y: 12, w: 4, h: 3 },
            { x: 5, y: 16, w: 3, h: 3 },
            { x: 10, y: 16, w: 3, h: 3 },
            { x: 15, y: 16, w: 3, h: 3 }
        ];

        houses.forEach(house => {
            for (let y = house.y; y < house.y + house.h; y++) {
                for (let x = house.x; x < house.x + house.w; x++) {
                    if (y < this.height && x < this.width) {
                        this.tiles[y][x] = 1; // Wall
                    }
                }
            }
            
            // Add some interior walkable areas
            if (house.w > 3 && house.h > 3) {
                const ix = house.x + 1;
                const iy = house.y + 1;
                this.tiles[iy][ix] = 0; // Interior walkable
            }
        });
    }

    createStreets() {
        // Horizontal streets
        for (let y = 5; y < this.height; y += 6) {
            for (let x = 0; x < this.width; x++) {
                if (this.tiles[y][x] !== 1) this.tiles[y][x] = 0;
            }
        }

        // Vertical streets
        for (let x = 6; x < this.width; x += 7) {
            for (let y = 0; y < this.height; y++) {
                if (this.tiles[y][x] !== 1) this.tiles[y][x] = 0;
            }
        }

        // Main streets wider
        for (let x = 0; x < this.width; x++) {
            this.tiles[5][x] = 0;
            this.tiles[6][x] = 0;
        }

        for (let y = 0; y < this.height; y++) {
            this.tiles[y][6] = 0;
            this.tiles[y][7] = 0;
        }
    }

    createObstacles() {
        // Walls and barriers
        const barriers = [
            { x: 3, y: 5, w: 2, h: 1 }, // Gate
            { x: 10, y: 11, w: 1, h: 2 }, // Wall
            { x: 15, y: 5, w: 1, h: 2 }, // Barrier
        ];

        barriers.forEach(b => {
            for (let y = b.y; y < b.y + b.h; y++) {
                for (let x = b.x; x < b.x + b.w; x++) {
                    if (y < this.height && x < this.width) {
                        this.obstacles.push({
                            x: x * CONFIG.TILE_SIZE,
                            y: y * CONFIG.TILE_SIZE,
                            width: CONFIG.TILE_SIZE,
                            height: CONFIG.TILE_SIZE,
                            solid: true
                        });
                    }
                }
            }
        });

        // Parked cars
        const cars = [
            { x: 100, y: 200, w: 50, h: 30 },
            { x: 300, y: 150, w: 50, h: 30 },
            { x: 800, y: 400, w: 50, h: 30 }
        ];

        cars.forEach(car => {
            this.obstacles.push({
                x: car.x,
                y: car.y,
                width: car.w,
                height: car.h,
                solid: true,
                type: 'car'
            });
        });

        // Container and junk
        const debris = [
            { x: 1200, y: 300, w: 60, h: 40 },
            { x: 600, y: 800, w: 70, h: 50 }
        ];

        debris.forEach(d => {
            this.obstacles.push({
                x: d.x,
                y: d.y,
                width: d.w,
                height: d.h,
                solid: true,
                type: 'debris'
            });
        });
    }

    createCoverPoints() {
        // Behind walls
        this.coverPoints.push({ x: 120, y: 200, type: 'wall' });
        this.coverPoints.push({ x: 320, y: 180, type: 'wall' });
        this.coverPoints.push({ x: 800, y: 300, type: 'wall' });
        this.coverPoints.push({ x: 1200, y: 450, type: 'wall' });

        // Behind cars
        this.coverPoints.push({ x: 130, y: 215, type: 'car' });
        this.coverPoints.push({ x: 330, y: 165, type: 'car' });
        this.coverPoints.push({ x: 830, y: 415, type: 'car' });

        // Behind containers
        this.coverPoints.push({ x: 1240, y: 330, type: debris' });
        this.coverPoints.push({ x: 640, y: 830, type: 'debris' });
    }

    createSpawnPoints() {
        this.spawnPoints = {
            POLICE: [
                { x: 100, y: 100 },
                { x: 150, y: 150 },
                { x: 200, y: 80 }
            ],
            BOPE: [
                { x: 120, y: 120 },
                { x: 180, y: 100 }
            ],
            FACTION_A: [
                { x: 1400, y: 1000 },
                { x: 1450, y: 1050 },
                { x: 1500, y: 1000 }
            ],
            FACTION_B: [
                { x: 1300, y: 900 },
                { x: 1350, y: 950 }
            ],
            MILITIA: [
                { x: 1200, y: 1100 },
                { x: 1250, y: 1100 }
            ]
        };
    }

    isWalkable(x, y, radius = 15) {
        const checkCollision = (cx, cy) => {
            for (let obs of this.obstacles) {
                if (UTILS.rectCollide(cx - radius, cy - radius, radius * 2, radius * 2,
                    obs.x, obs.y, obs.width, obs.height)) {
                    return false;
                }
            }
            return true;
        };

        return checkCollision(x, y);
    }

    getRandomSpawnPoint(team) {
        const points = this.spawnPoints[team] || this.spawnPoints.POLICE;
        return points[UTILS.randomInt(0, points.length - 1)];
    }

    getCoverPointNear(x, y, range = 200) {
        const nearby = this.coverPoints.filter(cp => 
            UTILS.distance(cp.x, cp.y, x, y) < range
        );
        return nearby.length > 0 ? nearby[UTILS.randomInt(0, nearby.length - 1)] : null;
    }

    getObstacles() {
        return this.obstacles;
    }

    raycast(x1, y1, x2, y2) {
        for (let obs of this.obstacles) {
            const intersection = UTILS.lineIntersect(
                x1, y1, x2, y2,
                obs.x, obs.y, obs.x + obs.width, obs.y
            ) || UTILS.lineIntersect(
                x1, y1, x2, y2,
                obs.x, obs.y + obs.height, obs.x + obs.width, obs.y + obs.height
            ) || UTILS.lineIntersect(
                x1, y1, x2, y2,
                obs.x, obs.y, obs.x, obs.y + obs.height
            ) || UTILS.lineIntersect(
                x1, y1, x2, y2,
                obs.x + obs.width, obs.y, obs.x + obs.width, obs.y + obs.height
            );

            if (intersection) return false;
        }
        return true;
    }

    getVisibleTile(x1, y1, x2, y2) {
        return this.raycast(x1, y1, x2, y2);
    }
}

const map = new TileMap();
