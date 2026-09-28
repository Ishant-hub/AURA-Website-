"use client";

import React from "react";

export default function Room2DCanvas({
  dimensions,
  audioSetup,
  roomType,
  selectedEquipment,
  onSelectEquipment,
}) {
  const isFeet = dimensions.unit === "FT";
  const length = dimensions.length;
  const width = dimensions.width;
  const unit = dimensions.unit;

  // SVG Coordinate space (viewBox padding 80)
  const padding = 70;
  const svgWidth = 600;
  const svgHeight = (length / width) * 440;
  const viewBoxWidth = svgWidth + padding * 2;
  const viewBoxHeight = svgHeight + padding * 2;

  // Normalized coordinate positions inside the room
  const roomX = padding;
  const roomY = padding;
  const rW = svgWidth;
  const rH = svgHeight;

  // Front stage Y
  const frontY = roomY + 45;
  // Listening sweet spot Y (~ 38% from back wall)
  const sweetSpotY = roomY + rH * 0.65;
  const centerX = roomX + rW / 2;

  // Speaker spread
  const spreadX = rW * 0.32;

  // Interactive items in 2D
  const equipmentItems = [
    {
      id: "front-left",
      name: "Eclipse X1 (Left)",
      role: "Main Loudspeaker",
      category: "Loudspeakers",
      price: 12999.0,
      slug: "eclipse-x1",
      x: centerX - spreadX,
      y: frontY,
      w: 24,
      h: 28,
      angle: 25,
    },
    {
      id: "front-right",
      name: "Eclipse X1 (Right)",
      role: "Main Loudspeaker",
      category: "Loudspeakers",
      price: 12999.0,
      slug: "eclipse-x1",
      x: centerX + spreadX,
      y: frontY,
      w: 24,
      h: 28,
      angle: -25,
    },
  ];

  if (audioSetup !== "2.0") {
    equipmentItems.push({
      id: "subwoofer",
      name: "Monolith Reference Subwoofer",
      role: "Subwoofer",
      category: "Loudspeakers",
      price: 8900.0,
      slug: "eclipse-x1",
      x: centerX - spreadX - 35,
      y: frontY + 10,
      w: 30,
      h: 30,
      isSub: true,
    });
  }

  if (audioSetup === "5.1" || audioSetup === "7.1" || audioSetup === "5.1.2") {
    equipmentItems.push({
      id: "center-speaker",
      name: "Aura Reference Center",
      role: "Center Channel",
      category: "Loudspeakers",
      price: 5200.0,
      slug: "eclipse-x1",
      x: centerX,
      y: frontY - 10,
      w: 42,
      h: 16,
    });

    equipmentItems.push({
      id: "surround-left",
      name: "Aura Surround Sat L",
      role: "Surround Satellite",
      category: "Loudspeakers",
      price: 4400.0,
      slug: "pulse-monitor-r4",
      x: roomX + 25,
      y: sweetSpotY,
      w: 18,
      h: 22,
      angle: 90,
    });

    equipmentItems.push({
      id: "surround-right",
      name: "Aura Surround Sat R",
      role: "Surround Satellite",
      category: "Loudspeakers",
      price: 4400.0,
      slug: "pulse-monitor-r4",
      x: roomX + rW - 25,
      y: sweetSpotY,
      w: 18,
      h: 22,
      angle: -90,
    });
  }

  if (audioSetup === "7.1") {
    equipmentItems.push({
      id: "rear-surround-left",
      name: "Aura Rear Sat L",
      role: "Surround Satellite",
      category: "Loudspeakers",
      price: 4400.0,
      slug: "pulse-monitor-r4",
      x: centerX - rW * 0.22,
      y: roomY + rH - 25,
      w: 18,
      h: 22,
      angle: 180,
    });

    equipmentItems.push({
      id: "rear-surround-right",
      name: "Aura Rear Sat R",
      role: "Surround Satellite",
      category: "Loudspeakers",
      price: 4400.0,
      slug: "pulse-monitor-r4",
      x: centerX + rW * 0.22,
      y: roomY + rH - 25,
      w: 18,
      h: 22,
      angle: 180,
    });
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4 bg-[#0A0A0A] select-none overflow-hidden">
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full max-h-full"
        style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.8))" }}
      >
        <defs>
          {/* Subtle grid pattern */}
          <pattern id="blueprintGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1f1f1f" strokeWidth="0.5" />
          </pattern>
          {/* Radial acoustic wave gradient for Sub */}
          <radialGradient id="subWaveGrad">
            <stop offset="0%" stopColor="#f2ca50" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#f2ca50" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#f2ca50" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Room Interior Floor & Grid */}
        <rect
          x={roomX}
          y={roomY}
          width={rW}
          height={rH}
          fill="#111111"
          stroke="#333333"
          strokeWidth="2"
        />
        <rect
          x={roomX}
          y={roomY}
          width={rW}
          height={rH}
          fill="url(#blueprintGrid)"
          opacity="0.8"
        />

        {/* Dimension Labels Outside Walls */}
        <text
          x={centerX}
          y={roomY - 20}
          textAnchor="middle"
          fill="#d0c5af"
          fontSize="13"
          fontFamily="monospace"
          fontWeight="600"
          letterSpacing="2"
        >
          WIDTH: {width} {unit}
        </text>
        <text
          x={roomX - 25}
          y={roomY + rH / 2}
          textAnchor="middle"
          fill="#d0c5af"
          fontSize="13"
          fontFamily="monospace"
          fontWeight="600"
          letterSpacing="2"
          transform={`rotate(-90 ${roomX - 25} ${roomY + rH / 2})`}
        >
          LENGTH: {length} {unit}
        </text>

        {/* Front Wall Media Display */}
        <rect
          x={centerX - rW * 0.22}
          y={roomY}
          width={rW * 0.44}
          height="8"
          fill="#050505"
          stroke="#f2ca50"
          strokeWidth="1.5"
        />
        <text
          x={centerX}
          y={roomY + 18}
          textAnchor="middle"
          fill="#f2ca50"
          fontSize="9"
          fontFamily="monospace"
          letterSpacing="1.5"
        >
          CINEMA DISPLAY / FRONT STAGE
        </text>

        {/* Subwoofer Acoustic Wavefronts */}
        {audioSetup !== "2.0" && (
          <g>
            <circle
              cx={centerX - spreadX - 35}
              cy={frontY + 10}
              r="60"
              fill="url(#subWaveGrad)"
            />
            <circle
              cx={centerX - spreadX - 35}
              cy={frontY + 10}
              r="45"
              fill="none"
              stroke="#f2ca50"
              strokeWidth="0.75"
              strokeDasharray="4 4"
              opacity="0.5"
            />
            <circle
              cx={centerX - spreadX - 35}
              cy={frontY + 10}
              r="75"
              fill="none"
              stroke="#f2ca50"
              strokeWidth="0.5"
              strokeDasharray="4 4"
              opacity="0.3"
            />
          </g>
        )}

        {/* Acoustic Dispersion Triangles (Stereo Spread from L & R to Sweet Spot) */}
        <path
          d={`M ${centerX - spreadX} ${frontY + 10} L ${centerX} ${sweetSpotY} L ${centerX + spreadX} ${frontY + 10}`}
          fill="none"
          stroke="#f2ca50"
          strokeWidth="1.2"
          strokeDasharray="5 5"
          opacity="0.6"
        />

        {/* Listening Sweet Spot Crosshair */}
        <g transform={`translate(${centerX}, ${sweetSpotY})`}>
          <circle r="12" fill="none" stroke="#f2ca50" strokeWidth="1" opacity="0.7" />
          <circle r="3" fill="#f2ca50" />
          <line x1="-18" y1="0" x2="18" y2="0" stroke="#f2ca50" strokeWidth="0.8" opacity="0.6" />
          <line x1="0" y1="-18" x2="0" y2="18" stroke="#f2ca50" strokeWidth="0.8" opacity="0.6" />
          <text
            x="0"
            y="26"
            textAnchor="middle"
            fill="#f2ca50"
            fontSize="10"
            fontFamily="monospace"
            letterSpacing="1"
          >
            SWEET SPOT (LISTENER)
          </text>
        </g>

        {/* Listening Sofa Silhouette */}
        <rect
          x={centerX - 70}
          y={sweetSpotY + 5}
          width="140"
          height="45"
          rx="6"
          fill="#1c1b1b"
          stroke="#333333"
          strokeWidth="1.5"
        />
        <text
          x={centerX}
          y={sweetSpotY + 32}
          textAnchor="middle"
          fill="#777777"
          fontSize="9"
          fontFamily="monospace"
        >
          LISTENING SOFA
        </text>

        {/* Interactive Equipment Nodes */}
        {equipmentItems.map((item) => {
          const isSelected = selectedEquipment?.id === item.id;
          return (
            <g
              key={item.id}
              onClick={() => onSelectEquipment?.(item)}
              className="cursor-pointer group"
              transform={`translate(${item.x}, ${item.y})`}
            >
              {/* Highlight Halo if Selected */}
              {isSelected && (
                <rect
                  x={-item.w / 2 - 6}
                  y={-item.h / 2 - 6}
                  width={item.w + 12}
                  height={item.h + 12}
                  rx="6"
                  fill="none"
                  stroke="#f2ca50"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                  className="animate-pulse"
                />
              )}

              {/* Main equipment block */}
              <rect
                x={-item.w / 2}
                y={-item.h / 2}
                width={item.w}
                height={item.h}
                rx="3"
                fill={isSelected ? "#2a2412" : "#191919"}
                stroke={isSelected ? "#f2ca50" : "#555555"}
                strokeWidth="1.5"
                className="transition-colors group-hover:stroke-primary"
              />

              {/* Gold speaker driver icon */}
              <circle r={item.w * 0.22} fill="#262626" stroke="#f2ca50" strokeWidth="0.8" />
              <circle r="2" fill="#f2ca50" />

              {/* Equipment Label */}
              <text
                x="0"
                y={item.h / 2 + 13}
                textAnchor="middle"
                fill={isSelected ? "#f2ca50" : "#d0c5af"}
                fontSize="9"
                fontFamily="monospace"
                fontWeight="500"
              >
                {item.name.split(" ")[0]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
