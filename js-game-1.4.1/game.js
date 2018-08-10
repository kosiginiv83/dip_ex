'use strict';


class Vector {
  constructor(x=0, y=0) {
    this.x = x;
    this.y = y;
  }

  plus(obj) {
    if (obj instanceof Vector) {
      return new Vector(this.x + obj.x, this.y + obj.y);
    } else {
      throw new Error('Можно прибавлять к вектору только вектор типа Vector');
    }
  }

  times(mult) {
    return new Vector(this.x * mult, this.y * mult);
  }
}


class Actor {
  constructor( pos=new Vector(0, 0), size=new Vector(1, 1),
              speed=new Vector(0, 0) ) {
    this.pos = pos;
    this.size = size;
    this.speed = speed;

    for (let key in this) {
      if ( !(this[key] instanceof Vector) ) {
        throw new Error('Объект должен быть типа Vector');
      }
    }
  }

  act() {}

  get left() {
    return this.pos.x;
  }

  get top() {
    return this.pos.y;
  }

  get right() {
    return this.pos.x + this.size.x;
  }

  get bottom() {
    return this.pos.y + this.size.y;
  }

  get type() {
    return 'actor';
  }

  isIntersect(obj) {
    if (arguments.lenght === 0) {
      throw new Error('Функция должна вызываться с объектом типа Actor');
    } else if ( !(obj instanceof Actor) ) {
      throw new Error('Движущийся объект должен быть типа Actor');
    } else if (this === obj) {
      return false;
    } else {
      let horizontal = (obj.right > this.left + 1) && (obj.left < this.right - 1);
      let vertical = (obj.bottom > this.top + 1) && (obj.top < this.bottom - 1);

      return (horizontal || vertical) ? true : false;
    }
  }
}


class Level {
  constructor(grid=[], actors=[]) {
    this.grid = grid;
    this.actors = actors;
    this.player = this.actors[0];
    this.height = grid.length;
    this.width = (grid.length !== 0) ?
      Math.max( ...grid.map(i => i.length) ) :
      0;
    this.status = null;
    this.finishDelay = 1;
  }

  isFinished() {
    return (this.status !== null && this.finishDelay < 0) ? true : false;
  }

  actorAt(obj) {
    if ( arguments.lenght === 0 ) {
      throw new Error('Функция должна вызываться с объектом типа Actor');
    } else if ( !(obj instanceof Actor) ) {
      throw new Error('Движущийся объект должен быть типа Actor');
    } else {
      for (let item of this.actors) {
        if (obj !== item) {
          let horizontal = (obj.right > item.left) && (obj.left < item.right);
          let vertical = (obj.bottom > item.top) && (obj.top < item.bottom);
          if (horizontal || vertical) {
            return item;
          }
        }
      }
      return undefined;
    }
  }

  obstacleAt(moveTo, size) {
    for ( let item of [].slice(arguments) ) {
      if ( !(item instanceof Vector) ) {
        throw new Error('Объект должен быть типа Vector');
      }
    }

    const getObjAreas = () => {
      let horizontal = Math.ceil(moveTo.x + size.x);
      let vertical = Math.ceil(moveTo.y + size.y);
      let objAreas = [];
      for (let x = Math.floor(moveTo.x); x < horizontal; x++) {
        for (let y = Math.floor(moveTo.y); y < vertical; y++) {
          objAreas.push(new Array(x, y));
        }
      }
      return objAreas;
    }

    const isBorderWalls = (moveTo.x < 0) || (moveTo.y < 0) ||
      ( (moveTo.x + size.x) >= this.width );

    if ( (moveTo.y + size.y) >= this.height ) {
      return 'lava';
    } else if (isBorderWalls) {
      return 'wall';
    } else {
      let obstacles = [];
      let objAreas = getObjAreas();

      for (let item of objAreas) {
        let area = this.grid[ item[1] ][ item[0] ];
        if ( area !== undefined ) {
          obstacles.push(area);
        }
      }

      if ( obstacles.includes('lava') ) {
        return 'lava';
      } else if ( obstacles.includes('wall') ) {
        return 'wall';
      } else {
        return undefined;
      }
    }
  }

  removeActor(obj) {
    for ( let item of this.actors.entries() ) {
      if (item[1] === obj) {
        this.actors.splice(item[0], 1);
      }
    }
  }

  noMoreActors(objType) {
    for (let item of this.actors) {
      if (item.type === objType) {
        return false;
      }
    }
    return true;
  }

  playerTouched(objType, actor={}) {
    if (this.status === null) {
      if (objType === 'lava' || objType === 'fireball') {
        this.status = 'lost';
      } else if (objType === 'coin' && actor instanceof Actor) {
        this.removeActor(actor);
        this.status = ( this.noMoreActors(objType) ) ? 'won' : this.status;
      }
    }
  }

}


class LevelParser {
  constructor(dictionary) {
    this.dictionary = dictionary;
  }

  actorFromSymbol(symbol=undefined) {
    if (symbol && this.dictionary) {
      const isInDict = symbol in this.dictionary;
      const isFunction = (typeof this.dictionary[symbol]) === 'function';
      if (isInDict && isFunction) {
        return this.dictionary[symbol];
      }
    } else {
      return undefined;
    }
  }

  obstacleFromSymbol(symbol) {
    switch (symbol) {
      case 'x':
        return 'wall';
        break;
      case '!':
        return 'lava';
        break;
      default:
        return undefined;
    }
  }

  createGrid(strings) {
    let grid = [];
    for (let string of strings) {
      let row = [];
      for (let symbol of string) {
        row.push( this.obstacleFromSymbol(symbol) );
      }
      grid.push(row);
    }
    return grid;
  }

  createActors(strings) {
    let actors = [];
    for ( let [rowIndex, string] of strings.entries() ) {
      for (let cellIndex = 0; cellIndex < string.length; cellIndex++) {
        let cls = this.actorFromSymbol(string[cellIndex]);
        if (cls) {
          let obj = new cls( new Vector(cellIndex, rowIndex) );
          if (obj instanceof Actor) {
            actors.push(obj);
          }
        }
      }
    }
    return (actors.length > 0) ? actors : [];
  }

  parse(rowsList) {
    return new Level( this.createGrid(rowsList),
                      this.createActors(rowsList) );
  }
}


class Fireball extends Actor {
  constructor(pos, speed) {
    super();
    this.pos = pos;
    this.speed = speed;
    this.size = new Vector(1, 1);
  }

  get type() {
    return 'fireball';
  }

  getNextPosition(time=1) {
    return this.speed.times(time).plus(this.pos);
  }

  handleObstacle() {
    this.speed = this.speed.times(-1);
  }

  act(time, level) {
    let nextPos = this.getNextPosition(time);
    let obstacle = level.obstacleAt(nextPos, this.size);

    switch (obstacle) {
      case undefined:
        this.pos = nextPos;
        break;
      case 'lava':
        level.status = 'lost';
        break;
      default:
        this.handleObstacle();
    }
  }
}


class HorizontalFireball extends Fireball {
  constructor() {
    super();
    this.speed = new Vector(2, 0);
  }
}


class VerticalFireball extends Fireball {
  constructor() {
    super();
    this.speed = new Vector(0, 2);
  }
}


class FireRain extends Fireball {
  constructor(position) {
    super();
    this.speed = new Vector(0, 3);
    this.pos = position;
    this.initPos = this.pos;
  }

  handleObstacle() {
    this.pos = this.initPos;
  }
}


class Coin extends Actor {
  constructor(position) {
    super();
    this.pos = (position) ? position.plus( new Vector(0.2, 0.1) ) : this.pos;
    this.initPos = this.pos;
    this.size = new Vector(0.6, 0.6);
    this.springSpeed = 8;
    this.springDist = 0.07;
    this.spring = Math.random() * 2*Math.PI;
  }

  get type() {
    return 'coin';
  }

  updateSpring(time=1) {
    this.spring = this.spring + this.springSpeed * time;
  }

  getSpringVector() {
    return new Vector( 0, (Math.sin(this.spring) * this.springDist) );
  }

  getNextPosition(time) {
    this.updateSpring(time);
    return this.getSpringVector().plus(this.initPos);
  }

  act(time) {
    this.pos = this.getNextPosition(time);
  }
}


class Player extends Actor {
  constructor(position) {
    super();
    if (position) this.pos = position.plus( new Vector(0, -0.5) );
    this.size = new Vector(0.8, 1.5);
  }

  get type() {
    return 'player';
  }
}



let levelsStr = loadLevels();

levelsStr.then( (value) => {
  let levels = JSON.parse(value);

  const dictionary = {
    '@': Player,
    'o': Coin,
    '=': HorizontalFireball,
    '|': VerticalFireball,
    'v': FireRain
  };

  let parser = new LevelParser(dictionary);
  let display = DOMDisplay;
  runGame(levels, parser, display).then( () => {alert('Вы выиграли!')} );
});


//function runLevel(level, Display)
//var display = new Display(document.body, level);
