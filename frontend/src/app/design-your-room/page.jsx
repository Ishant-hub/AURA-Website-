import React from "react";
import RoomConfiguratorClient from "@/components/room/RoomConfiguratorClient";

export const metadata = {
  title: "AURA | Design Your Room – 3D Audio Configurator",
  description:
    "Design the sound around your space. Create your room, position your system, and discover the bespoke AURA setup designed for your space.",
};

export const dynamic = "force-dynamic";

export default function DesignYourRoomPage() {
  return <RoomConfiguratorClient />;
}
