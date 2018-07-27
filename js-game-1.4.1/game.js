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

const start = new Vector(30, 50);
const moveTo = new Vector(5, 10);
const finish = start.plus(moveTo.times(2));

console.log(`Исходное расположение: ${start.x}:${start.y}`);
console.log(`Текущее расположение: ${finish.x}:${finish.y}`);



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


}


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


/*
const grid = [
  new Array(3),
  ['wall', 'wall', 'lava']
];
const level = new Level(grid);
runLevel(level, DOMDisplay);
*/
