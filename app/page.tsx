"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import DemoDuaAxes from "./components/DualAxisChart";

export default function Home() {
  return (
    <div className="flex flex-col">
      <main className="flex-grow bg-white w-auto p-10">
        <DemoDuaAxes />
      </main>
    </div>
  );
}
