'use strict';


class Vector {
  constructor(x=0, y=0) {
    this.x = x;
    this.y = y;
  }

  plus(obj) {
    try {
      if (obj instanceof Vector) {
        return new Vector(this.x, this.y);
      } else {
        throw 'Можно прибавлять к вектору только вектор типа Vector';
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


/*
const grid = [
  new Array(3),
  ['wall', 'wall', 'lava']
];
const level = new Level(grid);
runLevel(level, DOMDisplay);
*/
