'use strict';


class Vector {
  constructor(x=0, y=0) {
    this.x = x;
    this.y = y;
  }

  plus(obj) {
    try {
      if ( obj instanceof Vector ) {
        return new Vector( this.x + obj.x, this.y + obj.y );
      } else {
        throw new Error('Можно прибавлять к вектору только вектор типа Vector');
      }

    } catch(err) {
      console.log(err);
    }
  }

  times(mult) {
    return new Vector(this.x * mult, this.y * mult);
  }
}
/*
const start = new Vector(30, 50);
const moveTo = new Vector(5, 10);
const finish = start.plus(moveTo.times(2));

console.log(`Исходное расположение: ${start.x}:${start.y}`);
console.log(`Текущее расположение: ${finish.x}:${finish.y}`);
*/


class Actor {
  constructor( pos=new Vector(0, 0), size=new Vector(1, 1),
              speed=new Vector(0, 0) ) {
    try {
      this.pos = pos;
      this.size = size;
      this.speed = speed;

      for (let key in this) {
        if ( !(this[key] instanceof Vector) ) {
          throw new Error('Объект должен быть типа Vector');
        }
      }

    } catch(err) {
      console.log(err);
    }
  }

  act() {

  }

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
    try {
      if ( arguments.lenght === 0 ) {
        throw new Error('Функция должна вызываться с объектом типа Actor');
      } else if ( !(obj instanceof Actor) ) {
        throw new Error('Движущийся объект должен быть типа Actor');
      } else if ( this === obj ) {
        return false;
      } else {
        let horizontal = (obj.right >= this.left) && (obj.left <= this.right);
        let vertical = (obj.bottom >= this.top) && (obj.top <= this.bottom);

        return (horizontal || vertical) ? true : false;
      }

    } catch(err) {
      console.log(err);
    }
  }
}
/*
const items = new Map();
const player = new Actor();

items.set('Игрок', player);
items.set('Первая монета', new Actor(new Vector(10, 10)));
items.set('Вторая монета', new Actor(new Vector(15, 5)));

function position(item) {
  return ['left', 'top', 'right', 'bottom']
    .map(side => `${side}: ${item[side]}`)
    .join(', ');
}

function movePlayer(x, y) {
  player.pos = player.pos.plus(new Vector(x, y));
}

function status(item, title) {
  console.log(`${title}: ${position(item)}`);
  if (player.isIntersect(item)) {
    console.log(`Игрок подобрал ${title}`);
  }
}

items.forEach(status);
movePlayer(10, 10);
items.forEach(status);
movePlayer(5, -5);
items.forEach(status);
*/


class Level {
  constructor(grid=[], actors=[]) {
    this.grid = grid;
    this.actors = actors;
    //this.type = ;
    //Level.prototype.player = 'player';
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
    try {
      //console.log(this.actors);
      if ( arguments.lenght === 0 ) {
        throw new Error('Функция должна вызываться с объектом типа Actor');
      } else if ( !(obj instanceof Actor) ) {
        throw new Error('Движущийся объект должен быть типа Actor');
      } else {
        for (let item of this.actors) {
          if (obj !== item) {
            let horizontal = (obj.right >= item.left) && (obj.left <= item.right);
            let vertical = (obj.bottom >= item.top) && (obj.top <= item.bottom);
            if (horizontal || vertical) {
              return item;
            }
          }
        }

        return undefined;
      }

    } catch(err) {
      console.log(err);
    }
  }

  obstacleAt(moveTo, size) {
    try {
      for ( let item of [].slice(arguments) ) {
        console.log('item', item);
        if ( !(item instanceof Vector) ) {
          throw new Error('Объект должен быть типа Vector');
        }
      }

    } catch(err) {
      console.log(err);
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
    for ( let item of this.actors ) {
      if ( item.type === objType ) {
        return false;
      }
    }

    return true;
  }

  playerTouched(objType, actor={}) {
    while (this.status !== null) {
      if ( objType === 'lava' || objType === 'fireball') {
        this.status = 'lost';
      } else if ( objType === 'coin' && actor instanceof MyCoin ) {

      }
    }
  }

}


const grid = [
  [undefined, undefined],
  ['wall', 'wall']
];

function MyCoin(title) {
  this.type = 'coin';
  this.title = title;
}
MyCoin.prototype = Object.create(Actor);
MyCoin.constructor = MyCoin;

const goldCoin = new MyCoin('Золото');
const bronzeCoin = new MyCoin('Бронза');
const player = new Actor();
const fireball = new Actor();

const level = new Level(grid, [ goldCoin, bronzeCoin, player, fireball ]);

level.playerTouched('coin', goldCoin);
level.playerTouched('coin', bronzeCoin);

if (level.noMoreActors('coin')) {
  console.log('Все монеты собраны');
  console.log(`Статус игры: ${level.status}`);
}

const obstacle = level.obstacleAt(new Vector(1, 1), player.size);
if (obstacle) {
  console.log(`На пути препятствие: ${obstacle}`);
}

const otherActor = level.actorAt(player);
if (otherActor === fireball) {
  console.log('Пользователь столкнулся с шаровой молнией');
}


/*
const grid = [
  new Array(3),
  ['wall', 'wall', 'lava']
];
const level = new Level(grid);
runLevel(level, DOMDisplay);
*/
