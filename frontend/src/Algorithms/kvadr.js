export default function kvadr(a, b, c) {
    let rez;
    let D = b*b - 4*a*c;

    if (D > 0) {
        rez[0] = (-b + Math.sqrt(D)) / (2 * a);
        rez[1 ]= (-b - Math.sqrt(D)) / (2 * a);

        return rez;
    } else {
        return null;
    }
}