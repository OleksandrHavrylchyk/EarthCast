import { posl } from "../Services/constantService";

export default function perevequal(index, rob, k) {
    let flag;

    for(let i = 0; i < index; i++) {
        flag = 0;
        for (let j = 0; j <= k; j++) {
            if (posl[i][j] != rob[j]) {
                flag++;
            }
        }

        if (flag == 0) {
            return 0;
        }
    }

    return 1;
}