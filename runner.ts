import { day1 } from "./solutions/day1";
import { day10 } from "./solutions/day10";
import { day11 } from "./solutions/day11";
import { day12 } from "./solutions/day12";
import { day13 } from "./solutions/day13";
import { day2 } from "./solutions/day2";
import { day3 } from "./solutions/day3";
import { day4 } from "./solutions/day4";
import { day5 } from "./solutions/day5";
import { day6 } from "./solutions/day6";
import { day7 } from "./solutions/day7";
import { day8 } from "./solutions/day8";
import { day9 } from "./solutions/day9";

const days: {[key: number]: () => void;} = {
    1: day1,
    2: day2,
    3: day3,
    4: day4,
    5: day5,
    6: day6,
    7: day7,
    8: day8,
    9: day9,
    10: day10,
    11: day11,
    12: day12,
    13: day13,
};

let day: number = -1;

if (process.argv.length >= 3)
    day = parseInt(process.argv[2] as string);
else {
    const daylist = Object.keys(days);
    day = parseInt(daylist[daylist.length-1]);
}

days[day]();