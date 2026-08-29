// Configuration file
const CONFIG = {
    CANVAS_WIDTH: 0,
    CANVAS_HEIGHT: 0,
    GAME_WIDTH: 1200,
    GAME_HEIGHT: 800,
    TILE_SIZE: 40,
    
    // Camera
    CAMERA_SMOOTHING: 0.1,
    
    // Physics
    GRAVITY: 0.5,
    FRICTION: 0.85,
    
    // Player
    PLAYER_SPEED: 4,
    PLAYER_DIAGONAL_SPEED: 2.8,
    PLAYER_SIZE: 15,
    PLAYER_MAX_HP: 100,
    PLAYER_LEAN_DISTANCE: 20,
    
    // Weapons
    BULLET_SPEED: 12,
    BULLET_SIZE: 3,
    MAX_BULLETS: 500,
    
    // NPC
    NPC_SIZE: 14,
    NPC_SPEED: 3,
    NPC_DIAGONAL_SPEED: 2.1,
    NPC_DETECTION_RANGE: 300,
    NPC_REACTION_TIME: 200,
    NPC_AIM_SPEED: 0.08,
    NPC_ACCURACY: {
        POLICE: 0.7,
        BOPE: 0.85,
        FACTION: 0.65,
        MILITIA: 0.75
    },
    NPC_SHOOT_DELAY: {
        POLICE: 400,
        BOPE: 300,
        FACTION: 350,
        MILITIA: 380
    },
    
    // Grenades
    GRENADE_SIZE: 8,
    GRENADE_THROW_SPEED: 8,
    GRENADE_MAX_DISTANCE: 200,
    GRENADE_EXPLOSION_RADIUS: 80,
    GRENADE_EXPLOSION_DAMAGE: 60,
    
    // Graphics
    GRAPHICS_QUALITY: 'medium',
    TARGET_FPS: 60,
    FRAME_TIME: 1000 / 60,
    
    // Groups
    GROUPS: {
        PLAYER: 0,
        POLICE: 1,
        BOPE: 2,
        FACTION: 3,
        MILITIA: 4,
        CIVILIAN: 5
    },
    
    // Audio
    AUDIO_ENABLED: true,
    
    // Minimap
    MINIMAP_SCALE: 0.15,
    
    // Pathfinding
    PATHFIND_UPDATE_INTERVAL: 500,
    PATHFIND_GRID_SIZE: 40
};

// Initialize canvas dimensions
function initializeConfig() {
    const container = document.getElementById('game-container');
    CONFIG.CANVAS_WIDTH = window.innerWidth;
    CONFIG.CANVAS_HEIGHT = window.innerHeight;
    
    if (CONFIG.CANVAS_WIDTH < 768) {
        CONFIG.GAME_WIDTH = 960;
        CONFIG.GAME_HEIGHT = 640;
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    CONFIG.CANVAS_WIDTH = window.innerWidth;
    CONFIG.CANVAS_HEIGHT = window.innerHeight;
    if (window.gameInstance) {
        window.gameInstance.onWindowResize();
    }
});