import { day1 } from "./day1";
import { day2 } from "./day2";

const days: {[key: number]: () => void;} = {
    1: day1,
    2: day2,
};

let day: number = -1;

if (process.argv.length >= 3)
    day = parseInt(process.argv[2] as string);
else {
    const daylist = Object.keys(days);
    day = parseInt(daylist[daylist.length-1]);
}

days[day]();