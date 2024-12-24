import { day1 } from "./solutions/day1";
import { day10 } from "./solutions/day10";
import { day11 } from "./solutions/day11";
import { day12 } from "./solutions/day12";
import { day13 } from "./solutions/day13";
import { day14 } from "./solutions/day14";
import { day15 } from "./solutions/day15";
import { day16 } from "./solutions/day16";
import { day17 } from "./solutions/day17";
import { day18 } from "./solutions/day18";
import { day19 } from "./solutions/day19";
import { day2 } from "./solutions/day2";
import { day20 } from "./solutions/day20";
import { day21 } from "./solutions/day21";
import { day22 } from "./solutions/day22";
import { day23 } from "./solutions/day23";
import { day24 } from "./solutions/day24";
import { day25 } from "./solutions/day25";
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
    14: day14,
    15: day15,
    16: day16,
    17: day17,
    18: day18,
    19: day19,
    20: day20,
    21: day21,
    22: day22,
    23: day23,
    24: day24,
    25: day25,
};

let day: number = -1;

if (process.argv.length >= 3)
    day = parseInt(process.argv[2] as string);
else {
    const daylist = Object.keys(days);
    day = parseInt(daylist[daylist.length-1]);
}

days[day]();