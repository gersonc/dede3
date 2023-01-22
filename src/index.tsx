import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import * as serviceWorker from './serviceWorker';
// import reportWebVitals from './reportWebVitals';
// import {Container} from "tsparticles-engine";



interface xyI {
    x: number,
    y: number
}

interface obstacleI {
    position: xyI,
    width: number,
    height: number
}

const c = App();

const obstaculos = {
    rock : 0,
    log : 1,
    snowball : 2,
    ice : 3,
    yeti : 4,
    ducks : 5
}

const gameStateList = {
    game : 0,
    lost : 1,
    win: 2
}

const levelList = {
    level1 : 0,
    level2 : 1,
    level3 : 2
}

const keys = {
    rigth:{
        pressed: false
    },
    left:{
        pressed: false
    },
    up:{
        pressed: false
    },
    down:{
        pressed: false
    }
}

let timeElapsedBF = 0;
let timeSinceStart = 0;
let timer = 0;
let PointsCeiling = true;
let PointsCeilingValue = 100;
let points = 0;
let done = false;


class Player {
    position: xyI = {
        x: 100,
        y: 100
    }
    velocity: xyI = {
        x: 0,
        y: 0
    }
    width: number = 50;
    height: number = 50;
    points: number = 0;
    image: HTMLImageElement = new Image();


    constructor() {
        this.image.src = 'assets/player.png';
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 50
        this.height = 50
        this.points = 0
    }

    hasCollided(obstacle: obstacleI) {
        if (this.position.x + this.width >= obstacle.position.x &&
            this.position.x <= obstacle.position.x + obstacle.width &&
            this.position.y + this.height >= obstacle.position.y &&
            this.position.y <= obstacle.position.y + obstacle.height) {
            gameHandler.gameState = gameStateList.lost
        }
    }

    draw() {
        c.props.container.drawImage(this.image, this.position.x, this.position.y, this.width + 20, this.height + 20)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}


class Obstacle {
    position: xyI = {
        x: 0,
        y: 0
    }
    width = 0
    height = 0
    speed = 0
    color = ''
    image: HTMLImageElement = new Image();
    image2: HTMLImageElement = new Image();
    constructor(posX: number, imagePath: string, imagePath2?: string) {
        this.position = {
            x: posX,
            y: c.props.canvas.height
        }
        this.image.src = imagePath;
        if (imagePath2 !== undefined) {
            this.image2.src = imagePath2;
        }
    }

    

    initialize() {

    }


    goUpHow(timeElapsedBF: any) {

    }

    goUp(timeElapsedBF: any) {
        this.position.y -= this.speed
        this.goUpHow(timeElapsedBF)
    }

    obsDraw() {
        c.props.canvas.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    obsUpdate(timeElapsedBF: any) {
        this.obsDraw()
        this.goUp(timeElapsedBF)
    }
}

class Rock extends Obstacle {
    width = 50
    height = 50
    speed = 5
    color = 'silver'
}

class Log extends Obstacle {
    position: xyI = {
        x: 0,
        y: 0
    }
    state = {
        vertical : 0,
        horizontal: 1
    }

    logState = 0;
    width = 150;
    height = 50;
    speed = 5;
    color = 'brown';
    image: HTMLImageElement;
    image2: HTMLImageElement;


    constructor(posX: number, imagePath: string, image2Path: string) {
        super(posX, imagePath, image2Path)
        this.position = {
            x: posX,
            y: c.props.canvas.height
        }
        this.image = new Image();
        this.image2 = new Image();
        this.image.src = imagePath
        this.image2.src = image2Path

    }
    
    initialize() {
        this.logState = (Math.floor(Math.random() * 2))
        if (this.logState === this.state.vertical) {
            this.width = 50
            this.height = 250
        } else {
            this.width = 150
            this.height = 50
        }
    }

    obsDraw() {
        if (this.logState === this.state.vertical) {
            c.props.canvas.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        } else {
            c.props.canvas.drawImage(this.image2, this.position.x, this.position.y, this.width, this.height)
        }
    }
}

class Snowball extends Obstacle {
    width = 70
    height = 70
    speed = 3
    color = 'white'

    hSpeed = 5

    initialize() {
        let snowballState = (Math.floor(Math.random() * 2))
        if (snowballState === 0) {
            this.hSpeed *= -1
        }
    }

    goUpHow(timeElapsedBF: any) {
        this.position.x -= this.hSpeed
        if (this.position.x >= c.props.canvas.width || this.position.x <= 0) {
            this.hSpeed *= -1
        }
    }
}

class Ice extends Obstacle {
    width = 140
    height = 200
    speed = 5
    color = 'CadetBlue'
}

class Yeti extends Obstacle {

    state = {
        warning : 0,
        coming : 1
    }

    currState = this.state.warning
    timer = 0
    hSpeed = 10

    width = 70
    height = 50
    speed = 0
    color = 'orange'

    goUpHow(timeElapsedBF: any) {
        if (this.currState === this.state.warning) {
            this.position.y = c.props.canvas.height - this.height
            this.timer += timeElapsedBF
            if (this.timer >= 2) {
                this.position.y = c.props.canvas.height
                this.color = 'red'
                this.width = 70
                this.height = 100
                this.speed = 15
                this.currState = this.state.coming
            }
        } else if (this.currState === this.state.coming) {
            this.hSpeed *= -1
            this.position.x += this.hSpeed
        }
    }
}

class Ducks extends Obstacle {
    width = 200
    height = 50
    speed = 3
    color = 'green'

    hSpeed = 2

    initialize() {
        let duckState = (Math.floor(Math.random() * 2))
        if (duckState === 0) {
            this.hSpeed *= -1
        }
    }

    goUpHow(timeElapsedBF: any) {
        this.position.x -= this.hSpeed
    }
}

class Spawner {

    timer = 0
    obstacleList: any[] = [];

    spUpdate(timeElapsedBF: any, player: Player) {

        this.timer += timeElapsedBF

        if (this.timer > 1) {

            if (gameHandler.gameLevel === levelList.level1) {

                let newObsNumber = Math.floor(Math.random() * 2);
                switch (newObsNumber) {
                    case obstaculos.rock:
                        this.obstacleList.push(new Rock(Math.floor(Math.random() * c.props.canvas.width), 'assets/rock.png'));
                        break;
                    case obstaculos.log:
                        this.obstacleList.push(new Log(Math.floor(Math.random() * c.props.canvas.width), 'assets/vlog.png', 'assets/hlog.png'));
                        break;
                }

            } else if (gameHandler.gameLevel === levelList.level2) {

                let newObsNumber = Math.floor(Math.random() * 4);
                switch (newObsNumber) {
                    case obstaculos.rock:
                        this.obstacleList.push(new Rock(Math.floor(Math.random() * c.props.canvas.width), 'assets/rock.png'));
                        break;
                    case obstaculos.log:
                        this.obstacleList.push(new Log(Math.floor(Math.random() * c.props.canvas.width), 'assets/vlog.png', 'assets/hlog.png'));
                        break;
                    case obstaculos.snowball:
                        this.obstacleList.push(new Snowball(Math.floor(Math.random() * c.props.canvas.width),'assets/snowball.png'));
                        break;
                    case obstaculos.ice:
                        this.obstacleList.push(new Ice(Math.floor(Math.random() * c.props.canvas.width),'assets/ice.png'));
                        break;
                }

            } else if (gameHandler.gameLevel === levelList.level3) {

                let newObsNumber = Math.floor(Math.random() * 6)

                switch (newObsNumber) {
                    case obstaculos.rock:
                        this.obstacleList.push(new Rock(Math.floor(Math.random() * c.props.canvas.width), 'assets/rock.png'));
                        break;
                    case obstaculos.log:
                        this.obstacleList.push(new Log(Math.floor(Math.random() * c.props.canvas.width), 'assets/vlog.png', 'assets/hlog.png'));
                        break;
                    case obstaculos.snowball:
                        this.obstacleList.push(new Snowball(Math.floor(Math.random() * c.props.canvas.width),'assets/snowball.png'));
                        break;
                    case obstaculos.ice:
                        this.obstacleList.push(new Ice(Math.floor(Math.random() * c.props.canvas.width),'assets/ice.png'));
                        break;
                    case obstaculos.yeti:
                        this.obstacleList.push(new Yeti(Math.floor(Math.random() * c.props.canvas.width),'assets/yeti.png'));
                        break;
                    case obstaculos.ducks:
                        this.obstacleList.push(new Ducks(Math.floor(Math.random() * c.props.canvas.width),'assets/patinhos.png'));
                        break;
                }
            }


            this.obstacleList[this.obstacleList.length - 1].initialize();
            this.timer = 0;
        }

        for (let x in this.obstacleList) {
            this.obstacleList[x].obsUpdate(timeElapsedBF);
            player.hasCollided(this.obstacleList[x]);
        }

        for (let x in this.obstacleList) {
            if (this.obstacleList[x].position.y < 0 - this.obstacleList[x].height) {
                this.obstacleList.splice(+x, 1);
            }
        }
    }
}

class gameHandler {
    static gameState = gameStateList.game;
    static gameLevel = levelList.level1;

    static changeToLose() {
        if (this.gameState === gameStateList.lost) {
            this.gameState = gameStateList.game;
        } else {
            this.gameState = gameStateList.lost;
        }
    }

    static changeToWin(){
        if (this.gameState === gameStateList.win) {
            this.gameState = gameStateList.game;
        } else {
            this.gameState = gameStateList.win;
        }
    }

    static changeLevel(level: number) {
        this.gameLevel = level;
    }
}

const spawner = new Spawner();
const player = new Player();


function animate() {

    requestAnimationFrame(animate)

    // Particles()
    if (gameHandler.gameState === gameStateList.game) {
        c.props.canvas.clearRect(0, 0, c.props.canvas.width, c.props.canvas.height);

        if (timeSinceStart !== 0) {
            timeElapsedBF = +new Date();
            timeElapsedBF -= timeSinceStart;
            timeElapsedBF /= 1000;
        }

        timeSinceStart = +new Date();

        spawner.spUpdate(timeElapsedBF, player);

        //Player Movement

        player.update();
        player_movement();

        //Points
        timer += timeElapsedBF;
        player.points = Math.floor(timer);
        document.getElementById("Points")!.textContent = String(player.points);

        //Definir o teto de pontos
        if(PointsCeiling){
            PointsCeilingValue = +getPointLimit();
            PointsCeiling = false;
        }

        //Verificar se o jogador ganha
        if(player.points === PointsCeilingValue)
            gameHandler.changeToWin();
    }

    if (gameHandler.gameState === gameStateList.lost) {
        spawner.obstacleList.splice(0, spawner.obstacleList.length);
        c.props.canvas.fillStyle = 'brown';
        c.props.canvas.fillRect(100, 100, c.props.canvas.width - 200, c.props.canvas.height - 200);
        c.props.canvas.fillStyle = 'white';
        c.props.canvas.font = "30px Arial";
        c.props.canvas.fillText("Perdeste!", c.props.canvas.width / 2 - 100, c.props.canvas.height / 2 - 100);
        //Por pontos a zero
        player.points = 0;
        timer = 0;
    }

    if(gameHandler.gameState === gameStateList.win){
        spawner.obstacleList.splice(0, spawner.obstacleList.length);
        c.props.canvas.fillStyle = 'yellow';
        c.props.canvas.fillRect(100, 100, c.props.canvas.width - 200, c.props.canvas.height - 200);
        c.props.canvas.fillStyle = 'Black';
        c.props.canvas.font = '30px Arial';
        c.props.canvas.fillText("Ganhaste!", c.props.canvas.width / 2 - 100, c.props.canvas.height / 2 - 100);

        //Por pontos a zero
        player.points = 0;
        timer = 0;
    }
}
animate();

document.addEventListener('keydown', ({keyCode}) => {
    switch(keyCode){
        case 37://Left
            keys.left.pressed = true;
            break;
        case 40://Down
            keys.down.pressed = true;
            break;
        case 39://Right
            keys.rigth.pressed = true;
            break;
        case 38://Up
            keys.up.pressed = true;
            break;
    }
})

document.addEventListener('keyup', ({keyCode}) => {
    switch(keyCode){
        case 37://Left
            keys.left.pressed = false;
            break;
        case 40://Down
            keys.down.pressed = false;
            break;
        case 39://Right
            keys.rigth.pressed = false;
            break;
        case 38://Up
            keys.up.pressed = false;
            break;
    }
})

document.getElementById("b1")!.addEventListener("click", () => { onButtonPress(levelList.level1) });
document.getElementById("b2")!.addEventListener("click", () => { onButtonPress(levelList.level2) });
document.getElementById("b3")!.addEventListener("click", () => { onButtonPress(levelList.level3) });

function player_movement(){
    if((keys.rigth.pressed && player.position.x + player.width + 5 <= c.props.canvas.width) && (keys.down.pressed && player.position.y + player.height + 5 <= c.props.canvas.height)){
        player.velocity.x = 5/2;
        player.velocity.y = 5/2;
        //Diagonal direita e baixo
    }else if((keys.rigth.pressed && player.position.x + player.width + 5 <= c.props.canvas.width) && (keys.up.pressed && player.position.y - 5 >= 0 )){
        player.velocity.x = 5/2;
        player.velocity.y = -5/2;
        //Diagonal direita e cima
    }else if((keys.left.pressed && player.position.x - 5 >= 0) && (keys.down.pressed && player.position.y + player.height + 5 <= c.props.canvas.height)){
        player.velocity.x = -5/2;
        player.velocity.y = 5/2;
        //Diagonal esquerda e baixo
    }else if((keys.left.pressed && player.position.x - 5 >= 0) && (keys.up.pressed && player.position.y - 5 >= 0 )){
        player.velocity.x = -5/2;
        player.velocity.y = -5/2;
        //Diagonal esquerda e cima
    }else if(keys.rigth.pressed && player.position.x + player.width + 5 <= c.props.canvas.width){
        player.velocity.x = 5;
        //Horizontal direita
    }else if(keys.left.pressed && player.position.x - 5 >= 0){
        player.velocity.x = -5;
        //Horizontal esquerda
    }else{
        player.velocity.x = 0;
        //Quando não se está a mexer
    }
    if(keys.down.pressed && player.position.y + player.height + 5 <= c.props.canvas.height){
        player.velocity.y = 5;
        //Vertical baixo
    }else if(keys.up.pressed && player.position.y - 5 >= 0 ){
        player.velocity.y = -5;
        //Vertical cima
    }else{
        player.velocity.y = 0;
        //Quando não se está a mexer
    }
}
function onButtonPress(level: number){

    if (gameHandler.gameState === gameStateList.win) {
        timer = 0;
        points = 0;
        gameHandler.changeToWin();
    }

    if(gameHandler.gameState === gameStateList.lost){
        timer = 0;
        points = 0;
        gameHandler.changeToLose();
    }
    gameHandler.changeLevel(level);
}
async function getPointLimit(){
    var response = await fetch("https://www.randomnumberapi.com/api/v1.0/random?min=100&max=1000&count=5");
    var data = await response.json();
    done = true;
    if(data[3]/10 < 50)
        return data[3] + 20;
    else
        return data[3];
}

function Particles(){
    if(gameHandler.gameState === gameStateList.win || gameHandler.gameState === gameStateList.lost){
        c.props.style.visibility = "visible";
    }else{
        c.props.style.visibility = "hidden";
    }

}

ReactDOM.render(
    <React.StrictMode>
        <div className="App">
            <div className="container-particle">
                <App/>
            </div>
            <br/>
            <p className="Points" id="Points">Text</p>
            <span id="b1" className="navigator">Level 1</span>
            <span id="b2" className="navigator">Level 2</span>
            <span id="b3" className="navigator">Level 3</span>
        </div>

    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();