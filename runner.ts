import { day1 } from "./solutions/day1";
import { day2 } from "./solutions/day2";
import { day3 } from "./solutions/day3";

const days: {[key: number]: () => void;} = {
    1: day1,
    2: day2,
    3: day3,
};

let day: number = -1;

if (process.argv.length >= 3)
    day = parseInt(process.argv[2] as string);
else {
    const daylist = Object.keys(days);
    day = parseInt(daylist[daylist.length-1]);
}

days[day]();