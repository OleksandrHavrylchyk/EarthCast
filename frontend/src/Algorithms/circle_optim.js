import { pointArray, pro, v } from "../Services/constantService.js"
import { normalization1, normalization } from "normalization.js";
import { gauss } from "gauss.js";

export function point_cirkle_optim (i1, i2, i3, n) {
    let t3 = chas - pointArray[i3].time;

    if (((pointArray[i1].x - pointArray[i2].x) * (pointArray[i3].x - pointArray[i2].x)
    + (pointArray[i3].y - pointArray[i2].y) * (pointArray[i1].y - pointArray[i2].y)) < 0 && (t3 > 0)) {
        let d, a, b = [[]];

        for (let i = 0; i < 2; i++) {
            a[i] = [[[]]];
            b[i] = [[[]]];
        }

        let v1, v2, v3, o1, rob, rob1;

        o1.x = 0;
        o1.y = 0;

        a[0][0] = pointArray[i2].x - pointArray[i3].x;
        a[0][1] = pointArray[i2].y - pointArray[i3].y;
        a[0][2] = (Math.sqr(normalization1(pointArray[i2], o1)) - Math.sqr(normalization1(pointArray[i3], o1))) / 2.;
        a[1][0] = pointArray[i2].x - pointArray[i1].x;
        a[1][1] = pointArray[i2].y - pointArray[i1].y;
        a[1][2] = (Math.sqr(normalization1(pointArray[i2], o1)) - sqr(normalization1(pointArray[i1], o1))) / 2.;

        b = a;
        d = gauss(2, b);

        let centr1, centr;

        centr1.x = d[0];
        centr1.y = d[1];

        let R = normalization1(centr1, pointArray[i1]);

        centr.x = centr1.x;
        centr.y = centr1.y;

        v1 = v[i1][i2];
        v2 = v[i2][i3];
        t1 = pointArray[i2].time - pointArray[i1].time;
        t2 = pointArray[i3].time - pointArray[i2].time;

        let miu = 2*Math.log(v1/v2) / t2;
        let c = v1 * Math.exp(miu * t1 / 2);

        let l, kut;
        l = c * (1 - Math.exp(-1 * miu * t3)) / miu;
        kut = l / R;

        let znak;
        if ((pointArray[i2].x - centr.x) * (pointArray[i3].y - centr.y) 
            - (pointArray[i2].y - centr.y) * (pointArray[i3].x - centr.x) > 0) {
            znak = 1;
        } else {
            znak = -1;
        }
        // NOTE: Need to implement this method
        rez = getpoint(pointArray[i3].x, pointArray[i3].y, centr.x, centr.y, kut, znak);

        if ((rez != null) && (rez[0] > 0) && (rez[0] < 1000) && (rez[1] < 1000) && (rez[1] > 0)) {
            if (((x_traject != rez[0]) || (y_traject != rez[1])) && (flag_traject == 1)) {
                pro[rez[0]][rez[1]]++;
                if (((Math.abs(rez[0] - x_traject) >= 2) || (Math.abs(rez[1] - y_traject) >= 2))
                    && ((Math.abs(rez[0] - x_traject) < 20)) && ((Math.abs(rez[1] - y_traject) < 20))) {
                    let mx = rez[0] - x_traject;
                    let my = rez[1] - y_traject;
                    
                    let ix, iy, max;
                    max = (Math.abs(mx) > Math.abs(my)) ? Math.abs(mx) : Math.abs(my);

                    for (let z = 1; z < max; z++) {
                        ix = x_traject * z / (max) + rez[0] * (1-z / (max));
                        iy = y_traject * z / (max) + rez[1] * (1-z / (max));
                        pro[ix][iy]++;
                    }
                }

                x_traject = rez[0];
                y_traject = rez[1];
            }
           
            if (flag_traject == 0) {
                pro[rez[0]][rez[1]]++;
                x_traject = rez[0];
                y_traject = rez[1];
                flag_traject = 1;
            }
        }

        delete a;
        delete b;
        delete d;
    }

    if ((((pointArray[i1].x - pointArray[i2].x) * (pointArray[i3].x - pointArray[i2].x) +
        (pointArray[i3].y - pointArray[i2].y) * (pointArray[i1].y - pointArray[i2].y)) >= 0) && (t3 > 0)) {
        
        // NOTE: Need to check this method in c++
        let eps = 3 * (random(2) - 0.5);
        let _x, _y, rob, rob1;
        
        rob1.x = pointArray[i3].x;
        rob1.y = pointArray[i3].y;
        rob.x = pointArray[i2].x;
        rob.y = pointArray[i2].y;

        let par = v[i2][i3] * t3 * 0.89;
        
        _x = rob1.x - par * (rob1.x - rob.x + eps) / normalization1(rob, rob1);
        _y = rob1.y - par * (rob1.y - rob.y + eps) / normalization1(rob, rob1);

        if ((_x > 0) && (_x < 1000) && (_y > 0) && (_y < 1000) && ((x_traject != _x) || (y_traject != _y)) && (flag_traject == 1)) {  
            pro1[_x][_y]++;
            x_traject = _x;
            y_traject = _y; 
        }

        if (flag_traject == 0) {
            pro1[_x][_y]++;
            x_traject = _x;
            y_traject = _y;
            flag_traject = 1;
        }
    }
}
        /*let k = 0;
        let znakx, znaky;

        while (k < n) {
            if ((rob1.x > centr.x) && (rob1.y < centr.y)) {
                if (rob.y <= centr.y + (rob.x - centr.x) * (rob1.y - centr.y) / (rob1.x - centr.x)) {
                    znakx = 1;
                } else {
                    znakx = -1;
                }
            }

            if ((rob1.x < centr.x) && (rob1.y < centr.y)) {
                if (rob.y <= centr.y + (rob.x - centr.x) * (rob1.y - centr.y) / (rob1.x-centr.x)) {
                    znakx = -1;
                } else {
                    znakx = 1;
                }
            }

            if ((rob1.x < centr.x) && (rob1.y >= centr.y)) {
                if (rob.y <= centr.y + (rob.x - centr.x) * (rob1.y - centr.y) / (rob1.x - centr.x)) {
                    znakx = 1;
                } else {
                    znakx = -1;
                }
            }

            if ((rob1.x > centr.x) && (rob1.y >= centr.y)) {
                if (rob.y <= centr.y + (rob.x - centr.x) * (rob1.y - centr.y) / (rob1.x - centr.x)) {
                    znakx = -1;
                } else {
                    znakx = 1;
                }
            }

            if ((rob1.x == centr.x) && (rob1.y < centr.y))
                if (rob.x < centr.x) {
                    znakx = 1;
                } else {
                    znakx = -1;
                }

            rob.x = rob1.x;
            rob.y = rob1.y;
            rob1.x += znakx;

            if (rob1.y > centr.y) {
                znaky = 1;
            }

            if (rob1.y < centr.y) {
                znaky = -1;
            }

            if (Math.abs(rob1.x - centr.x) >= R) {
                znaky *= -1;
                rob1.x -= znakx;
            }

            rob1.y = centr.y + znaky * Math.sqrt(Math.abs(R*R - Math.sqr(rob1.x - centr.x)));

            if (Math.abs(rob1.x - centr.x) < R) {

                if ((rob1.x > 0) && (rob1.y > 0) && (rob.x > 0) && (rob.y > 0) && Math.abs(rob1.y - rob.y) > 0) {
                    let robi = Math.abs(rob1.y - rob.y);

                    for (let gh = 0; gh < robi; gh++) {
                        let tmpx = (rob1.x) * gh / robi + rob.x * (1 - gh / robi), tmpy = (rob1.y) * gh / robi + rob.y * (1 - gh / robi);

                        if (((x_traject != tmpx) || (y_traject != tmpy)) && (flag_traject == 1)) {
                            pro[tmpx][tmpy]++;
                            x_traject = tmpx;
                            y_traject = tmpy;
                        }

                        if (flag_traject == 0) {
                            pro[tmpx][tmpy]++;
                            x_traject = tmpx;
                            y_traject = tmpy;
                            flag_traject = 1;
                        }
                    }
                }
            }
            k++;
        }
    }

    if (((pointArray[i1].x - pointArray[i2].x) * (pointArray[i3].x - pointArray[i2].x)
        + (pointArray[i3].y - pointArray[i2].y) * (pointArray[i1].y - pointArray[i2].y) >= 0)) {
    // NOTE: Need to check random function behavior in c++
        eps = 2 * (random(2) - 0.5);

        let rob, rob1, _x, _y;

        rob1.x = pointArray[i3].x;
        rob1.y = pointArray[i3].y;
        rob.x = pointArray[i2].x;
        rob.y = pointArray[i2].y;

        _x=rob.x;
        _y=rob.y;

        let j = normalization(rob, rob1);
        let i = 0;

        for (let i = 0; i < normalization(rob, rob1) + n; i++) {
            if (i < normalization(rob,rob1)) { 
                _x = rob.x + i * (rob1.x - rob.x) / normalization(rob, rob1);
                _y = rob.y + i * (rob1.y - rob.y) / normalization(rob, rob1);  
            }

            if ((i >= normalization(rob, rob1)) && (normalization(rob, rob1) > 0)) {
                if ((_x > 0) && (_y > 0) && (_x < 1000) && (_y < 530)) {
                    if ((( x_traject != _x) || (y_traject != _y)) && (flag_traject == 1)) {
                        pro[_x][_y]++;
                        x_traject = _x;
                        y_traject = _y;    
                    }
                }

                if (flag_traject == 0) {
                    pro[_x][_y]++;
                    x_traject = _x;
                    y_traject = _y;
                    flag_traject = 1; 
                }

                _x = rob.x + j * (rob1.x - rob.x + eps) / norm(rob, rob1);
                _y = rob.y + j * (rob1.y - rob.y + eps) / norm(rob, rob1);   
                j--;
            }
        }
    }
    flag_traject=0;
}*/