export function gauss (n, a) {
    let i, j, k, l, k1, n1, r, s;
    let x = [];

    n1 = n + 1;

    for (k = 0; k < n; k++) {
        x[k] = 0;
    }

    for (k = 0; k < n ;k++) {
        k1 = k + 1;
        s = a[k][k];
        j = k;

        for (i = k1; i < n; i++) {
            r = a[i][k];

            if (r*r > s*s) {
                s = r;
                j = i;
            }
        }

        if (j != k) {
            for (i = k; i < n1; i++) {
                r = a[k][i];
                a[k][i] = a[j][i];
                a[j][i] = r;
            }
        }

        for (j = k1; j < n1; j++) {
            a[k][j] = a[k][j] / s;

            for (i = k1; i < n; i++) { 
                r = a[i][k];
                for (j = k1; j < n1; j++) {
                    a[i][j] = a[i][j] - a[k][j] * r;
                }
            }
        }
    }

    if (s != 0) {
        for (i = n-1; i >= 0; i--) {
            s = a[i][n1-1];

            for (j = i+1; j < n; j++){
                s = s - a[i][j] * x[j];
            }

            x[i] = s;
        }
        return x;
    } else {
        return null;
    }
}