import { normalization } from "./normalization";
import { pointArray, i_max, posl, index, param_prognoz, flag_traject } from "../Services/constantService";
import point_cirkle_optim from "./circle_optim";

export function createForecast() {
    // for (let j1 = 0; j1 < 1000; j1++) {
    //     pro.push([0, 0]);
    // }

    let i1, i2, i3, i, j, j1;
    for (i = 0; i < index; i++) {
        for(j = 0; j < i_max; j++) {
            if ((posl[i][j] > 0) && (posl[i][j+1] == 0)) {
                j1 = j;
            }

            if (j1 >= 2) {
                i3 = posl[i][j1];
                i2 = posl[i][j1-1];
                i1 = posl[i][j1-2];

                for (let chas = 0; chas < param_prognoz; chas++) {
                  point_cirkle_optim(i1, i2, i3, chas);
                }

                flag_traject=0;
            }
        }
    }
}

function forecast(point) {
    let s1 = 0;
    let s2 = 0;

    let p = 0;
    for (let i = 1; i < i_max; i++) {
        p = 1
        for (let j = 0; j < i_max; j++) {
            if ((normalization(pointArray[i-1], pointArray[j]) < 0.0000000001) && (j != i-1)) {
                return null;
            }

            if (j != i-1) {
                p = p*normalization(point, pointArray[j])/normalization(pointArray[i-1], pointArray[j]);
            }
        }

        s1 += pointArray[i].x*p;
        s2 += pointArray[i].y*p;
    }

    return {
        x: s1,
        y: s2
    }
}