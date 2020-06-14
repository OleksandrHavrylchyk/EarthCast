let pointArray = [
{
    "mag": "4.8",
    "depth": "33",
    "lat": "38.6",
    "lon": "143.24",
    "time": "0"
},
{
    "mag": "6",
    "depth": "33",
    "lat": "38.32",
    "lon": "142.52",
    "time": "249"
},
{
    "mag": "6.2",
    "depth": "33",
    "lat": "38.54",
    "lon": "143.2",
    "time": "278.00"
},
{
    "mag": "4.9",
    "depth": "33",
    "lat": "38.4",
    "lon": "142.69",
    "time": "413.00"
},
{
    "mag": "6.1",
    "depth": "25.4",
    "lat": "38.39",
    "lon": "142.63",
    "time": "435.00" 
},
{
    "mag": "5.4",
    "depth": "33",
    "lat": "38.48",
    "lon": "143.14",
    "time": "568.00"
},
{
    "mag": "4.9",
    "depth": "33",
    "lat": "38.36",
    "lon": "143.29",
    "time": "590.00" 
},
{
    "mag": "4.9",
    "depth": "33",
    "lat": "38.58",
    "lon": "143.32",
    "time": "1130" 
},
{
    "mag": "5.4",
    "depth": "33",
    "lat": "38.7",
    "lon": "143.12",
    "time": "1132.00"
},
{
    "mag": "5.3",
    "depth": "33",
    "lat": "38.66",
    "lon": "142.98",
    "time": "1250.00"
},
{
    "mag": "5.3",
    "depth": "33",
    "lat": "38.1",
    "lon": "143.32",
    "time": "1570.00"
},
{
    "mag": "4.7",
    "depth": "33",
    "lat": "38.58",
    "lon": "143.16",
    "time": "1660.00"
},
{
    "mag": "5",
    "depth": "33",
    "lat": "38.85",
    "lon": "143.07",
    "time": "1720"
}
];

let i_max = 13;
let ost = [];
let pro = [];
let pro1 = [];
let index = 0;
let posl = new Array(100000).fill(0).map(() => new Array(100).fill(0));
const param_prognoz = 2200;
let v = new Array(100).fill(0).map(() => new Array(100).fill(0));
let t1;
let t2;
let t3;
let rez;
let x_traject = 0;
let y_traject = 0;
let flag_traject = 0;
let flag_start_vyzol = 2;
let flagshv = 2;
let flag_vupykl = 0;
let flag_vupykl_tr = 0;
const flag_min_ident = 2;

export {pointArray, i_max, ost, pro, pro1, index, posl, param_prognoz, v, t1, t2, t3, rez, x_traject, y_traject, flag_traject,
flag_start_vyzol, flagshv, flag_vupykl, flag_vupykl_tr, flag_min_ident}