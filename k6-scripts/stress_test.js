// Stress Test → naikin user terus sampai titik gagal.

import http from "k6/http";
import { sleep } from "k6";

const ENDPOINT = "https://suka-kehilangan.masako.my.id";

export let options = {
  stages: [
    { duration: "10s", target: 20 },
    { duration: "10s", target: 50 },
    { duration: "10s", target: 100 },
    { duration: "10s", target: 200 },
    { duration: "10s", target: 300 },
    { duration: "10s", target: 400 },
    { duration: "10s", target: 500 },
    { duration: "30s", target: 0 },
  ],
};

export default function () {
  http.get(ENDPOINT);
  sleep(1);
}
