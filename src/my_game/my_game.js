"use strict";  // Operate in Strict mode such that variables must be declared before used!

import DyePack from "./dye_pack.js";
import Hero from "./hero.js";
import engine from "../engine/index.js";
import TextureRenderable from "../engine/renderables/texture_renderable_main.js";
import SpriteRenderable from "../engine/renderables/sprite_renderable.js";
import Patrol from "./patrol.js";
import Head from "./patrol_components/head.js";
import Wing from "./patrol_components/wing.js";
import GameObjectSet from "../engine/game_objects/game_object_set.js";

class MyGame extends engine.Scene {
    constructor() {
        super();

        //assets 
        this.kDyePackSprite = "assets/dye_pack.png";
        this.kBg = "assets/bg.png";
        this.kHero = "assets/dye.png";
        this.kSpriteSheet = "assets/SpriteSheet.png";

        // The camera to view the scene
        this.mCamera = null;

        this.mDyePacks = null;
        this.mHero = null;

        this.mHero = null;
        this.mBg = null;

        this.mMsg = null;
        
        this.mTestPatrol = null;
        this.mPatrols = null;
    
    }

    load() {
        //engine.texture.load(this.kDyePackSprite);
        engine.texture.load(this.kBg);
        //engine.texture.load(this.kHero);
        engine.texture.load(this.kSpriteSheet);
        
    }

    unload() {
        //engine.texture.unload(this.kDyePackSprite);
        engine.texture.unload(this.kBg);
        //engine.texture.unload(this.kHero);
        engine.texture.load(this.kSpriteSheet);
    }
        
    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(30, 27.5), // position of the camera
            200,                       // width of camera
            [0, 0, 800, 800]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
                // sets the background to gray
    

        this.mMsg = new engine.FontRenderable("Status Message");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(-65, -40);
        this.mMsg.setTextHeight(3); 

        this.mBg = new engine.TextureRenderable(this.kBg);
        this.mBg.getXform().setSize(400, 300);
        this.mBg.getXform().setPosition(30, 27.5);

        this.mHero = new Hero(this.kSpriteSheet, 30, 27.5);

        this.mDyePacks = new engine.GameObjectSet();

        this.mPatrols = new engine.GameObjectSet();
        this.mPatrols.addToSet(new Patrol(this.kSpriteSheet, 30, 27.5));
    }
    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
        this.mCamera.setViewAndCameraMatrix();
        this.mBg.draw(this.mCamera); 
        this.mDyePacks.draw(this.mCamera);
        this.mHero.draw(this.mCamera);
        this.mPatrols.draw(this.mCamera);

        this.mMsg.draw(this.mCamera);   // only draw status in the main camera
    }
    
    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update () {
        let msg = "Status: DyePacks(" + this.mDyePacks.size() + ") " + "Patrols() Autospawn()";


        // Move hero
        this.mHero.update(this.mCamera.mouseWCX(), this.mCamera.mouseWCY());

        // Get DyePack to spawn
        if (engine.input.isKeyClicked(engine.input.keys.Z)) {

            let dyePack = new DyePack(this.kSpriteSheet, 
                this.mCamera.mouseWCX(), this.mCamera.mouseWCY());
            
            //add to gameobject set
            this.mDyePacks.addToSet(dyePack);

            console.log(this.mDyePacks);
        }

        for (let i = 0; i < this.mDyePacks.size(); i++) {
            // if DyePack should be deleted
            if (this.mDyePacks.getObjectAt(i).getToDelete()) { 
                this.mDyePacks.removeFromSet(i);
            }
        }

        this.mDyePacks.update();
        this.mPatrols.update();
        this.mMsg.setText(msg);
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}
