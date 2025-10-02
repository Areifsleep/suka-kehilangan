// Soak Test → user stabil tapi lama, buat cek memory leak/stabilitas.

import http from "k6/http";
import { sleep } from "k6";

const ENDPOINT = "https://suka-kehilangan-demo.masako.my.id";

export let options = {
  vus: 20, // jumlah user tetap
  duration: "30m", // jalan lama (misal 30 menit)
};

export default function () {
  http.get(ENDPOINT);
  sleep(1);
}
