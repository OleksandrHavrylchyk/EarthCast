import { i_max, flagshv, flag_start_vyzol, index } from "../Services/constantService";
import formposl_s_new from "./formposl_s_new";


export default function execute() {
    //index = 0;
    if( flag_start_vyzol == 1) {
        //formposl1(0, 0, 0, 0);
    }

    if (flag_start_vyzol == 2) {
        let robi = new Array(i_max);

        if (flagshv == 1) {
            //formposl_(0, 0, 0);
        }

        if (flagshv == 2) {
            formposl_s_new(0, 0, 100000, robi);
        }

        console.log(index);
    }
}