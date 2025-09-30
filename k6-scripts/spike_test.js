// Spike Test → lonjakan user mendadak, lalu turun.

import http from "k6/http";
import { sleep } from "k6";

const ENDPOINT = "https://suka-kehilangan-demo.masako.my.id";
export let options = {
  stages: [
    { duration: "10s", target: 100 }, // spike
    { duration: "30s", target: 100 }, // tahan spike
    { duration: "10s", target: 0 }, // turun cepat
  ],
};

export default function () {
  http.get(ENDPOINT, { responseType: "none" });
  sleep(1);
}
