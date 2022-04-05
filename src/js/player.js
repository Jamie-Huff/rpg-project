/**
 * A class that wraps up our top down player logic. It creates, animates and moves a sprite in
 * response to WASD keys. Call its update method from the scene's update and call its destroy
 * method when you're done with the player.
 */
export default class Player {
  constructor(scene, x, y, scale) {
    this.scene = scene;

    const anims = scene.anims;
    anims.create({
      key: "player-walk-down",
      frames: anims.generateFrameNumbers("charmander-movement", { start: 0, end: 2 }),
      frameRate: 8,
      repeat: -1
    });
    anims.create({
      key: "player-walk-back",
      frames: anims.generateFrameNumbers("charmander-movement", { start: 3, end: 5 }),
      frameRate: 8,
      repeat: -1
    });
    anims.create({
      key: "player-walk-left",
      frames: anims.generateFrameNumbers("charmander-movement", { start: 6, end: 8 }),
      frameRate: 8,
      repeat: -1
    });
    anims.create({
      key: "player-walk-diagnol-down",
      frames: anims.generateFrameNumbers("charmander-movement", { start: 9, end: 11 }),
      frameRate: 8,
      repeat: -1
    });
    anims.create({
      key: "player-walk-diagnol-up",
      frames: anims.generateFrameNumbers("charmander-movement", { start: 12, end: 14 }),
      frameRate: 8,
      repeat: -1
    });
    anims.create({
      key: "player-attack-down",
      frames: anims.generateFrameNumbers("charmander-movement", { start: 27, end: 28 }),
      frameRate: 8,
      repeat: -1
    });
    anims.create({
      key: "player-attack-up",
      frames: anims.generateFrameNumbers("charmander-movement", { start: 29, end: 30 }),
      frameRate: 8,
      repeat: -1
    });
    anims.create({
      key: "player-attack-side",
      frames: anims.generateFrameNumbers("charmander-movement", { start: 31, end: 32 }),
      frameRate: 8,
      repeat: -1
    });
    anims.create({
      key: "player-attack-down-heavy",
      frames: anims.generateFrameNumbers("charmander-movement", { start: 21, end: 22 }),
      frameRate: 8,
      repeat: -1
    });
    anims.create({
      key: "player-attack-side-heavy",
      frames: anims.generateFrameNumbers("charmander-movement", { start: 23, end: 24 }),
      frameRate: 8,
      repeat: -1
    });
    anims.create({
      key: "player-attack-up-heavy",
      frames: anims.generateFrameNumbers("charmander-movement", { start: 25, end: 26 }),
      frameRate: 8,
      repeat: -1
    });

    this.sprite = scene.physics.add
      .sprite(x, y, "charmander-movement", 0)
      .setSize(16 * 5, 16 * 5)
      .setOffset(0, 0);

    this.sprite.anims.play("player-walk-back");

    this.keys = scene.input.keyboard.createCursorKeys();
    this.keys['A'] = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.keys['S'] = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    // this.keys.push(scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A))
  }

  freeze() {
    this.sprite.body.moves = false;
  }

  update() {
    const keys = this.keys;
    const sprite = this.sprite;
    const speed = 300;
    const scene = this.scene
    const prevVelocity = sprite.body.velocity.clone();
    const lastPressed = this.lastPressed
    const runningAnimationForA = this.runningAnimationForA

    if (this.runningAnimationForA === undefined) {
      this.runningAnimationForA = false
    }
    if (this.runningAnimationForS === undefined) {
      this.runningAnimationForS = false
    }

    // Stop any previous movement from the last frame
    sprite.body.setVelocity(0);

    // Horizontal movement
    if (keys.left.isDown) {
      sprite.body.setVelocityX(-speed);
    } else if (keys.right.isDown) {
      sprite.body.setVelocityX(speed);
    }

    // Vertical movement
    if (keys.up.isDown) {
      sprite.body.setVelocityY(-speed);
    } else if (keys.down.isDown) {
      sprite.body.setVelocityY(speed);
    }

    if (keys.A.isUp && this.runningAnimationForA === true) {
      this.runningAnimationForA = false
    }
    console.log(keys.A.isDown)
    console.log(this.runningAnimationForA)
    console.log('should we run the animation for a?', keys.A.isDown && this.runningAnimationForA === false)

    // Normalize and scale the velocity so that sprite can't move faster along a diagonal
    sprite.body.velocity.normalize().scale(speed);
    // Update the animation last and give left/right/down animations precedence over up animations
    if (keys.left.isDown && keys.down.isDown) {
      sprite.setFlipX(false);
      sprite.anims.play("player-walk-diagnol-down", true);
      this.lastPressed = 10
    } else if (keys.right.isDown && keys.down.isDown) {
      sprite.setFlipX(true);
      sprite.anims.play("player-walk-diagnol-down", true);
      this.lastPressed = 10
    } else if (keys.left.isDown && keys.up.isDown) {
      sprite.setFlipX(false);
      sprite.anims.play("player-walk-diagnol-up", true);
      this.lastPressed = 13
    } else if (keys.right.isDown && keys.up.isDown) {
      sprite.setFlipX(true);
      sprite.anims.play("player-walk-diagnol-up", true);
      this.lastPressed = 13
    } else if (keys.left.isDown) {
      sprite.setFlipX(false);
      sprite.anims.play("player-walk-left", true);
      this.lastPressed = 7
    } else if (keys.right.isDown) {
      sprite.setFlipX(true);
      sprite.anims.play("player-walk-left", true);
      this.lastPressed = 7
    } else if (keys.down.isDown) {
      sprite.anims.play("player-walk-down", true);
      this.lastPressed = 1
    } else if (keys.right.isDown) {
      sprite.anims.play("player-walk-left", true);
      sprite.setFlipX(true);
      this.lastPressed = 7
    } else if (keys.up.isDown) {
      sprite.anims.play("player-walk-back", true);
      this.lastPressed = 4
    } else if (keys.A.isDown) {
      if (this.lastPressed === 1) {
        sprite.anims.play("player-attack-down", true)
      }
      else if (this.lastPressed === 4) {
        sprite.anims.play("player-attack-up", true)
      }
      else if (this.lastPressed === 7) {
        sprite.anims.play("player-attack-side", true)
      }
      this.runningAnimationForA = true
    } else if (keys.S.isDown) {
      if (this.lastPressed === 1) {
        sprite.anims.play("player-attack-down-heavy", true)
      }
      else if (this.lastPressed === 4) {
        sprite.anims.play("player-attack-up-heavy", true)
      }
      else if (this.lastPressed === 7) {
        sprite.anims.play("player-attack-side-heavy", true)
      }
      this.runningAnimationForS = true
    } else {
      if (this.lastPressed === undefined) {
        this.lastPressed = 1
      }
      // If we were moving & now we're not, then pick a single idle frame to use
      sprite.setTexture("charmander-movement", this.lastPressed);
    }
  }

  init() {

  }

  destroy() {
    this.sprite.destroy();
  }
}
