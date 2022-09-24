// function countDown(fromNumber) {
//     console.log(fromNumber);

//     let nextNumber = fromNumber - 1;

//     if (nextNumber > 0) {
//         countDown(nextNumber);
//     }
// }
// countDown(10);

// for (let i = 0; i < 10; i++) {
//     console.log(i);
// }


// const ekspresiFungsional = function() {
//     return 'ini nilai yang dikembalikan oleh fungsi anonimus';
// }();

// console.log(ekspresiFungsional);

class Stepper {
    map;
    start;
    end;

    constructor(map, start, end) {
        this.map = map;
        this.start = start;
        this.end = end;
    }

    // in the form x, y
    getTileLetter(coordinate) {
        return this.map[coordinate[0]][coordinate[1]];
    }

    // param in form x, y
    findPossibleNextTile(coordinate) {
        const possibleTilesCoordinate = [];
        const currentTile = this.getTileLetter(coordinate);

        // max 4 possible tiles
        if ((coordinate[0] - 1 >= 0 && coordinate[0] - 1 <= this.map.length) && this.getTileLetter([coordinate[0] - 1, coordinate[1]]) !== currentTile) possibleTilesCoordinate.push([coordinate[0] - 1, coordinate[1]]);
        if ((coordinate[0] + 1 >= 0 && coordinate[0] - 1 <= this.map.length) && this.getTileLetter([coordinate[0] + 1, coordinate[1]]) !== currentTile) possibleTilesCoordinate.push([coordinate[0] + 1, coordinate[1]]);

        if ((coordinate[1] - 1 >= 0 && coordinate[0] - 1 <= this.map[0].length) && this.getTileLetter([coordinate[0], coordinate[1] - 1]) !== currentTile) possibleTilesCoordinate.push([coordinate[0], coordinate[1] - 1]);
        if ((coordinate[1] + 1 >= 0 && coordinate[0] - 1 <= this.map[0].length) && this.getTileLetter([coordinate[0], coordinate[1] + 1]) !== currentTile) possibleTilesCoordinate.push([coordinate[0], coordinate[1] + 1]);

        return possibleTilesCoordinate;
    }

    run() {
        let pos = this.start;
        let retryCount = 0;

        // checkpoint contain pos and num of step as obj
        let checkPoint = {
            pos: null,
            num: 0,
        };

        while(true) {
            if (pos === this.end) break;
        
            const next = this.findPossibleNextTile(pos);
            console.log(next)
            if (next.length === 0 && checkPoint.pos === null) break;

            checkPoint.pos = pos;
            checkPoint.num++;

            if (next.length < retryCount && checkPoint.pos === pos) break;
            if (next[retryCount] === pos) {
                try {
                    pos = next[retryCount+1];
                } catch (e) {
                    break;
                }
            } else {
                pos = next[retryCount];
            }
        }

        return checkPoint.num;
    }
}

function solution(mapMatrix, start, end) {
    const stepper = new Stepper(mapMatrix, start, end);
  
    console.log(stepper.run());
}
solution([
    [ "R", "R", "R", "L", "R"  ],
    [ "L", "L", "L", "L", "L"  ],
    [ "R", "L", "R", "R", "R"  ],
    [ "R", "L", "L", "L", "L"  ],
    [ "R", "R", "R", "R", "R"  ] 
], [0,0], [1,1])