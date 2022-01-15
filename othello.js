const EMPTY = 2;
const WHITE = 0;
const BLACK = 1;
const OUTSIDE = -2;


var board = new Array(10);
for (let i = 0; i < board.length; i++) {
    board[i] = new Array(10);
}
var turn = 1;
var flag = 0;
var color;


var w_second_time = 900; //
var b_second_time = 900; //

var timeflag = 0;

var w_timer;
var b_timer;


addListener(window, 'load', init);

function init() {　
    var w_time;
    var b_time;



    b_timer = window.setInterval(
        function() {
            if (b_second_time > 0) {
                if (turn % 2 == BLACK) {
                    b_second_time--;
                }
                if (b_second_time % 60 < 10) {
                    b_time = Math.floor(b_second_time / 60) + ":0" + b_second_time % 60;
                } else {
                    b_time = Math.floor(b_second_time / 60) + ":" + b_second_time % 60;
                }
                document.getElementById('b_time').innerHTML = b_time;
            } else if (b_second_time == 0) {
                window.alert("時間切れで黒の負けです\n White Win!");
                clearInterval(b_timer);
                timeflag++;
            }
        }, 1000);

    w_timer = window.setInterval(
        function() {
            if (w_second_time > 0) {
                if (turn % 2 == WHITE) {
                    w_second_time--;
                }
                if (w_second_time % 60 < 10) {
                    w_time = Math.floor(w_second_time / 60) + ":0" + w_second_time % 60;
                } else {
                    w_time = Math.floor(w_second_time / 60) + ":" + w_second_time % 60;
                }
                document.getElementById('w_time').innerHTML = w_time;
            } else {
                window.alert("時間切れで白の負けです\n Black Win!");
                clearInterval(w_timer);
                timeflag++;
            }
        }, 1000);


    startBoard();
    countPut(); //最初に置けるところを示すため
    put();


} //init
function countPut() {
    let count = 0; //1つの場所に置いたときに返る行の数
    let allcount = 0; //置ける場所の数
    //flag
    let b = 0;
    let w = 0;


    for (X = 1; X <= 8; X++) {
        for (Y = 1; Y <= 8; Y++) {
            if (board[X][Y] == BLACK) {
                b++;
            } else if (board[X][Y] == WHITE) {
                w++;
            }
        }
    }
    var B = document.getElementById('B.number');
    var W = document.getElementById('W.number');
    B.innerHTML = b;
    W.innerHTML = w
    for (let x = 1; x <= 8; x++) {
        for (let y = 1; y <= 8; y++) {
            count = 0;
            if (board[x][y] != EMPTY) {
                continue;
            } else {
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (i == 0 && j == 0) {
                            continue;
                        } else if (board[x + i][y + j] == (turn + 1) % 2) { //隣り合う石が違う色
                            let s = 1;
                            while (board[x + s * i][y + s * j] == (turn + 1) % 2) {
                                s++;
                            }
                            if (board[x + s * i][y + s * j] == (turn) % 2) { //先端が自分の色
                                count++;
                            }
                        }
                    } //j
                } //i

            } //その場所が開いている場合
            if (count) {
                allcount++;
                position = conversion(x, y);
                changeStyle(document.getElementById(position), "put");
            } else {
                position = conversion(x, y);
                changeStyle(document.getElementById(position), "normal");
            }
        } //y
    } //x
    if (allcount) {
        flag = 0;
        count = 0;
        allcount = 0;
    } else {
        console.log("hello flag:" + flag);
        if (turn % 2 == BLACK) { //

            changeStyle(document.getElementById("b_pass"), "pass");
            addListener(document.getElementById("b_pass"), "click", pass);

        } else if (turn % 2 == WHITE) {

            changeStyle(document.getElementById("w_pass"), "pass");
            addListener(document.getElementById("w_pass"), "click", pass);
        }
        //
    }
    if (flag >= 2) {
        window.alert('両者とも置ける場所がなくなったので、ゲーム終了となります');
        window.alert('black: ' + b + 'white: ' + w);
        if (b > w) {
            window.alert('Black Win!');
        } else if (w > b) {
            window.alert('White Win!');
        } else {
            window.alert('Draw!');
        }
        clearInterval(b_timer);
        clearInterval(w_timer);
    }
} //関数終わり


function changeStyle(elem, clazz) {
    elem.className = clazz;
}

function conversion(x, y) {
    let alpha, position;
    switch (y) {
        case 1:
            alpha = 'a';
            break;
        case 2:
            alpha = 'b';
            break;
        case 3:
            alpha = 'c';
            break;
        case 4:
            alpha = 'd';
            break;
        case 5:
            alpha = 'e';
            break;
        case 6:
            alpha = 'f';
            break;
        case 7:
            alpha = 'g';
            break;
        case 8:
            alpha = 'h';
            break;
    } //switch
    position = alpha + x;
    return position;
}

function inverseConversion(position) {
    var alpha = position.substring(0, 1);
    var x = position.substring(1, 2);
    switch (alpha) {
        case 'a':
            y = 1;
            break;
        case 'b':
            y = 2;
            break;
        case 'c':
            y = 3;
            break;
        case 'd':
            y = 4;
            break;
        case 'e':
            y = 5;
            break;
        case 'f':
            y = 6;
            break;
        case 'g':
            y = 7;
            break;
        case 'h':
            y = 8;
            break;
    }
    return [x, y];
}

function changeBoard() { //viewboardのようなもの
    let x, y;
    let position;
    for (x = 1; x <= 8; x++) {
        for (y = 1; y <= 8; y++) {
            position = conversion(x, y);
            if (board[x][y] == BLACK) {
                changeStyle(document.getElementById(position), "black");
            } else if (board[x][y] == WHITE) {
                changeStyle(document.getElementById(position), "white");
            }
        }
        //y
    } //x  
    window.event.returnValue = false;

} //関数終わり

function put() {
    for (let x = 1; x <= 8; x++) {
        for (let y = 1; y <= 8; y++) {
            var position = conversion(x, y);
            addListener(document.getElementById(position), 'click', subPut);
        } //
    } //
}



function subPut() {
    let position = getID(this);
    let xy = inverseConversion(position);
    x = xy[0];
    y = xy[1];
    x = parseInt(x);

    let count = 0;
    if (!timeflag) { //時間切れでないとき
        if (board[x][y] == EMPTY) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i == 0 && j == 0) {
                        continue;
                    } else if (board[x + i][y + j] == (turn + 1) % 2) { //隣り合う石が違う色
                        let s = 1;
                        while (board[x + s * i][y + s * j] == (turn + 1) % 2) {
                            s++;
                        }
                        if (board[x + s * i][y + s * j] == (turn) % 2) { //先端が自分の色
                            for (let t = 1; t < s; t++) {
                                board[x + t * i][y + t * j] = (turn) % 2;
                                count++;
                            }
                        } else {
                            continue;
                        }

                    } else {
                        continue;
                    }
                } //j
            } //i
            if (count) {
                realPut();
            } else {
                window.alert("挟める石がないので、置き直してください");
            }
        } //その場所が開いている場合
    } //timeflag
} //関数終わり

function realPut() {


    console.log("turn" + turn);
    board[x][y] = turn % 2;
    changeBoard();


    //


    turn++;
    countPut();
    console.log("flag:" + flag);
}



function startBoard() {
    for (let x = 0; x <= 9; x++) {
        for (let y = 0; y <= 9; y++) {
            board[x][y] = OUTSIDE;
        }
    }
    for (x = 1; x <= 8; x++) {
        for (y = 1; y <= 8; y++) {
            board[x][y] = EMPTY;
        }
    }

    board[4][4] = WHITE; //
    board[4][5] = BLACK;
    board[5][4] = BLACK;
    board[5][5] = WHITE;
    changeBoard();

}

function getID(ele) {
    var id_value = ele.id;
    return id_value;

}


function pass() {
    if (turn % 2 == BLACK) {
        changeStyle(document.getElementById("b_pass"), "nopass");
        removeListener(document.getElementById("b_pass"), "click", pass);
        console.log("helloblack");
    } else {
        changeStyle(document.getElementById("w_pass"), "nopass");
        removeListener(document.getElementById("w_pass"), "click", pass);
        console.log("hellowhite");
    }

    turn++;
    flag++;
    countPut();
}