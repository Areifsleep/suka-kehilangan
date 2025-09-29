// Stress Test → naikin user terus sampai titik gagal.

import http from "k6/http";
import { sleep } from "k6";

export let options = {
  stages: [
    { duration: "30s", target: 20 },
    { duration: "30s", target: 50 },
    { duration: "30s", target: 100 },
    { duration: "30s", target: 200 },
    { duration: "30s", target: 0 },
  ],
};

export default function () {
  http.get("https://suka-kehilangan-demo.masako.my.id", { responseType: "none" });
  sleep(1);
}
