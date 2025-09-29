// Spike Test → lonjakan user mendadak, lalu turun.

import http from "k6/http";
import { sleep } from "k6";

export let options = {
  stages: [
    { duration: "10s", target: 100 }, // spike
    { duration: "30s", target: 100 }, // tahan spike
    { duration: "10s", target: 0 }, // turun cepat
  ],
};

export default function () {
  http.get("https://suka-kehilangan-demo.masako.my.id", { responseType: "none" });
  sleep(1);
}
