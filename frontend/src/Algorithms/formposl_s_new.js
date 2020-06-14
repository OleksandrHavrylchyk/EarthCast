import { i_max, ost, v, index, posl, flag_min_ident } from "../Services/constantService";
import perev_vypukl_new from "./perev_vypukl_new";
import perev_vupykl_tr from "./perev_vupykl_tr";
import perevequal from "./perevequal";

export default function formposl_s_new (i, k, shv, rob) {
    if(i < i_max - 1) {
        let robi = new Array(k+1);

        for (let y = 0; y < k; y++) {
            robi[y] = rob[y];
        }

        robi[k] = i;

        for (let j = i+1; j < i_max; j++) {
            if (v[i][j] < shv) {
                formposl_s_new(j, k+1, v[i][j], robi); 
            }

            if (v[i][j] >= shv) {
                console.log(k);
                if (perevequal(index, robi, k) && (k >= flag_min_ident) && perev_vypukl_new(robi,k) && perev_vupykl_tr(robi, 0, k)) {
                    for (let p = 0; p < k+1; p++) { 
                        posl[index][p] = robi[p];
                        ost[index] = robi[k];
                    }

                    index++;
                    
                    formposl_s_new(i, 0, 100000, robi);
                }
            }
        }

        robi = null;
    }
  
    if ((i == i_max - 1)) {
       let robi = new Array(k+1);

        for(let y = 0; y < k; y++) {
            robi[y] = rob[y];
        }

        robi[k] = i;

       if (perevequal(index, robi, k) && (k >= flag_min_ident) && perev_vypukl_new(robi, k) && perev_vupykl_tr(robi, 0, k)) { 
            for(let p = 0; p < k+1; p++) { 
               posl[index][p] = robi[p];
            }

            ost[index] = robi[k];
            index++;
        }

        robi = null;
    }
}