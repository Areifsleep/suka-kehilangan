// Load Test → naikin user perlahan ke beban target normal.

import http from "k6/http";
import { sleep } from "k6";

const ENDPOINT = "https://suka-kehilangan-demo.masako.my.id";

export let options = {
  stages: [
    { duration: "1m", target: 10 }, // ramp up
    { duration: "3m", target: 10 }, // hold
    { duration: "1m", target: 0 }, // ramp down
  ],
};

export default function () {
  http.get(ENDPOINT);
  sleep(1);
}
