import { rez } from "../Services/constantService";
import kvadr from "./kvadr";

export default function getpoint(x0, y0, cx, cy, kut, znak) {
    let a, b, c, tr, R;

    while (kut > Math.PI) {
        kut -= Math.PI;
    }

    x0 -= cx;
    y0 -= cy;
        
    R = Math.sqrt(Math.sqr(x0) + Math.sqr(y0));
    tr = znak * R * R * Math.sin(kut);

    a = 1 + y0 *y0 / (x0 * x0);
    b = 2 * y0 * tr / (x0 * x0);
    c = tr * tr / (x0 * x0) - R * R;

    rez = kvadr(a, b, c);
        
    if (rez) {
        let r1 = rez[0];
        let r2=rez[1];
        let r1y,r2y;
            
        r1y = (r1 * y0 + tr) / x0;
        r2y = (r2 * y0 + tr) / x0;
            
        if (Math.abs(Math.acos((x0 * r1 + y0 * r1y) / (Math.sqrt(Math.sqr(x0) + Math.sqr(y0)) * Math.sqrt(Math.sqr(r1) + Math.sqr(r1y)))) - kut) < 0.000000001) {
            rez[0] = r1 + cx;
            rez[1] = r1y + cy;
        } else {
            rez[0] = r2 + cx;
            rez[1]=r2y + cy;
        }
         
        return rez;
    } else {
        return null;
    }
}