import { pointArray, t1, t2, t3, v1, v2, v3, v, flag_vupykl } from "../Services/constantService";

export default function perev_vypukl_new (rob, k) {
    if(flag_vupykl == 1) {
        for(let i = 2; i < k; i++) {
            v1 = v[rob[i-2]][rob[i-1]];
            v2 = v[rob[i-1]][rob[i]];
            v3 = v[rob[i]][rob[i+1]];
            t1 = pointArray[rob[i-1]].time - pointArray[rob[i-2]].time;
            t2 = pointArray[rob[i]].time - pointArray[rob[i-2]].time;
            t3 = pointArray[rob[i+1]].time - pointArray[rob[i-2]].time;
            if(v2 >= v1 + (v3-v1) * (t2-t1) / (t3-t1)) {
                return 0;
            }
        } 
    }

    return 1;
}