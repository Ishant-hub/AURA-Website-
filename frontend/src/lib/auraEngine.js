/**
 * AURA AI — High-Fidelity Acoustic Intelligence & Recommendation Engine
 * Provides local-first, context-aware acoustic advice, product comparisons,
 * room calculations, and audio finder workflows using actual AURA catalogue data.
 */

export const AURA_CATALOGUE = [
  {
    id: "eclipse-x1",
    name: "Eclipse X1",
    slug: "eclipse-x1",
    category: "Loudspeakers",
    categorySlug: "speakers",
    price: 12999.00,
    brand: "Aura",
    tagline: "Flagship Floorstanding Loudspeaker",
    description: "The Eclipse X1 represents the pinnacle of acoustic engineering. A monolithic expression of pure sound, crafted for those who demand absolute fidelity and architectural presence.",
    specs: {
      "Drivers": "3x 8\" Woofers, 1x 1\" Beryllium Tweeter",
      "Amplification": "1500W Total Class D Active",
      "Frequency Range": "18Hz - 42kHz",
      "Connectivity": "XLR Balanced, WiFi 6E, Bluetooth 5.3",
      "Weight": "42kg / 92.5 lbs",
      "Dimensions": "120cm x 34cm x 34cm"
    },
    soundProfile: "Authoritative, subterranean low end with razor-sharp dynamic transients. Massive holographic soundstage.",
    bestFor: ["Home Cinema", "Orchestral Classical", "Large Listening Rooms", "High-Volume Dynamics"],
    roomSize: "Medium to Large (> 2,500 cu.ft)",
    idealPairing: "Vacuum Master Amp or Flux Reference A2",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTQvM7clTjbV9GXGsgT2LlH8V-R6p6eGDHt93Y6BGWFd6-b-A2DYNg2p1nNihAJ8BNukOsaKKU5GWLat5378nSFLIHUSyChj9nSmWkvJOUxn_ElPAf2xc5MaGzZOU8uTK9s8wyD4ab32n8SelqVqbvL8Mh07LtLb-IkjeHL7_mQPRmajrjm5pK-D8Aq-aHjIalfhSFhr5fBAGenKuG1xqIYC-o8W6jcIe0V1dnJj4cfX_g1olFbio4yCUxOq_e48SlT7dMa03_bXI=s0"
  },
  {
    id: "aether-mono-s1",
    name: "Aether Mono S1",
    slug: "aether-mono-s1",
    category: "Loudspeakers",
    categorySlug: "speakers",
    price: 12400.00,
    brand: "Aura",
    tagline: "Sculptural Floorstanding Loudspeaker",
    description: "A sculptural masterpiece of sonic engineering, featuring zero-point vibration isolation and carbon-fiber composite housing for uncolored acoustic purity.",
    specs: {
      "Drivers": "2x 10\" Woofers, 1x 2\" Midrange, 1x 1\" Ribbon Tweeter",
      "Amplification": "1200W Class D",
      "Frequency Range": "20Hz - 40kHz",
      "Connectivity": "XLR Balanced, Wi-Fi 6",
      "Weight": "38kg",
      "Dimensions": "115cm x 30cm x 30cm"
    },
    soundProfile: "Intimate, silky treble extension via ribbon tweeter, organic midrange texture, laser-precise imaging.",
    bestFor: ["Jazz", "Acoustic & Vocals", "Chamber Music", "Dedicated Music Rooms"],
    roomSize: "Medium to Large (1,800 - 4,000 cu.ft)",
    idealPairing: "Vacuum Master Amp & Orbit V3 Platter",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTQvM7clTjbV9GXGsgT2LlH8V-R6p6eGDHt93Y6BGWFd6-b-A2DYNg2p1nNihAJ8BNukOsaKKU5GWLat5378nSFLIHUSyChj9nSmWkvJOUxn_ElPAf2xc5MaGzZOU8uTK9s8wyD4ab32n8SelqVqbvL8Mh07LtLb-IkjeHL7_mQPRmajrjm5pK-D8Aq-aHjIalfhSFhr5fBAGenKuG1xqIYC-o8W6jcIe0V1dnJj4cfX_g1olFbio4yCUxOq_e48SlT7dMa03_bXI=s0"
  },
  {
    id: "pulse-monitor-r4",
    name: "Pulse Monitor R4",
    slug: "pulse-monitor-r4",
    category: "Loudspeakers",
    categorySlug: "speakers",
    price: 4400.00,
    brand: "Aura",
    tagline: "Active Reference Near-Field Monitors",
    description: "Compact near-field monitors for professional studio environments and discerning home setups demanding absolute tonal honesty.",
    specs: {
      "Drivers": "1x 5\" Mid-Woofer, 1x 0.75\" Tweeter",
      "Amplification": "300W Active Dual-Amp",
      "Frequency Range": "45Hz - 25kHz",
      "Connectivity": "XLR Balanced, Optical",
      "Weight": "8kg each",
      "Dimensions": "30cm x 18cm x 22cm"
    },
    soundProfile: "Dead-neutral, ultra-transparent, rapid transient response with exceptional spatial separation.",
    bestFor: ["Studio Mastering", "Intimate Music Rooms", "Small Apartments", "Desktop Audiophile"],
    roomSize: "Small to Medium (< 1,800 cu.ft)",
    idealPairing: "Command Core",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvNGujFOTNSuzmKFLLFZvSfoKlnCIyezvYgqjGJkOmU309vf-BMHc-W-jvZDRsKGolyzXbCGgmnHEJqzkQUWu1mSodQz2l9Af2xCwM9ixz0m0HSmDps_LErxnf6CiFUL4G8Ov9ZuPQ7vbn7RyGdJDaYOy_2ol-VdBzH8V6pi4ZgpWwQlBVeqRiBPnbMjGhyRzvdKoQLGiE2OTwvZ2S_MdAZ3bmdsm9qohfjeT_iv_6AnkNqs_2RXTtoD1t3ZsjL3SfBytDcbv1QNc=s0"
  },
  {
    id: "sonus-pro-h1",
    name: "Sonus Pro H1",
    slug: "sonus-pro-h1",
    category: "Headphones",
    categorySlug: "accessories",
    price: 2800.00,
    brand: "Aura",
    tagline: "Planar Magnetic Open-Back Headphones",
    description: "Open-back planar magnetic headphones designed for critical listening sessions with handcrafted lambskin cushions and carbon chassis.",
    specs: {
      "Driver Type": "Planar Magnetic (90mm)",
      "Impedance": "32 Ohms",
      "Frequency Response": "6Hz - 48kHz",
      "Sensitivity": "98dB/mW",
      "Weight": "420g",
      "Cable": "Detachable Silver-Plated XLR Balanced"
    },
    soundProfile: "Expansive airy treble, distortion-free sub-bass, zero acoustic compression.",
    bestFor: ["Critical Solo Listening", "Late Night Sessions", "Mastering"],
    roomSize: "Any (Personal Audio)",
    idealPairing: "Vacuum Master Amp Headphone Tap",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBabHelyRWNRyIJ0ULKYCzg4jSFRh4-GSwfCS-1x4MjcWGmKNjTui7x22BT5SEv0H_jOx83r828rVs5ls3h-Ua4ovoNg4Ji5wmlFXp1NQ1M58iSq0kOqxS_WGCJxJuUfkbvPuAU0rVzYWsuwMUydzgO_otHS_2WLHzE47FXV7yFChcNEYUg2IYRJGjxqIMPKumfLPIW1feC9mRI33Bmn75WmtwsrJHIIspfM4Y0yCN92a6YZEu7YdpTcvToEOO1WjWf-Wxc3IgICU=s0"
  },
  {
    id: "flux-reference-a2",
    name: "Flux Reference A2",
    slug: "flux-reference-a2",
    category: "Amplifiers",
    categorySlug: "amplifiers",
    price: 8950.00,
    brand: "Aura",
    tagline: "Flagship High-Power Tube Amplifier",
    description: "Reference-grade tube amplification with hand-wound transformers, pure silver internal wiring, and 4x KT150 beam tetrodes.",
    specs: {
      "Tube Configuration": "4x KT150, 2x 12AU7",
      "Power Output": "150W per channel RMS",
      "Total Harmonic Distortion": "< 0.05% at 100W",
      "Inputs": "3x RCA, 2x XLR Balanced",
      "Weight": "28kg",
      "Dimensions": "45cm x 38cm x 22cm"
    },
    soundProfile: "Sublime liquid midrange paired with commanding muscular bass grip that effortlessly drives challenging floorstanders.",
    bestFor: ["Driving Floorstanders", "High Dynamic Range", "Modern & Classical"],
    roomSize: "Medium to Grand",
    idealPairing: "Eclipse X1 or Aether Mono S1",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzPLeL_fNkS4MHyjESaApTR8NZmokCUQZxNBhmCqGx77-rdCXm0p1r1juCmXIfHxrnDCRpzQZZ3xJJsvVRPKMQuNo1dav5A24L0QPPbsbNRDLRV8r9pqBdb8a3k6aNaERiFpCN7Cea40SEc5likqo2z5MmkB53Z9eQ_msu34GpfW8-9lC0MqZjGeJ5A5QkfiPEMYp2lp2YqfgrGvuwRSoAQ4Ai6THt3XpoO1f6OjPcTo1e64QhaT8BHNnJg2Tcd2PYrgjuV_wdTpo=s0"
  },
  {
    id: "vacuum-master-amp",
    name: "Vacuum Master Amp",
    slug: "vacuum-master-amp",
    category: "Amplifiers",
    categorySlug: "amplifiers",
    price: 8200.00,
    brand: "Aura",
    tagline: "Pure Class-A Vacuum Tube Amplifier",
    description: "Reference-grade tube amplification featuring 4x KT88 valves delivering pure Class-A warmth, harmonic saturation, and musical soul.",
    specs: {
      "Tube Configuration": "4x KT88, 2x 12AX7",
      "Power Output": "100W per channel",
      "Total Harmonic Distortion": "< 0.1%",
      "Inputs": "2x RCA, 1x XLR Balanced",
      "Weight": "24kg",
      "Dimensions": "42cm x 35cm x 20cm"
    },
    soundProfile: "Velvety, three-dimensional acoustic bloom with rich even-order harmonics that bring vocalists into the room.",
    bestFor: ["Analog Vinyl Purists", "Vocal & Jazz Lovers", "Harmonic Richness"],
    roomSize: "Small to Medium",
    idealPairing: "Orbit V3 Platter + Aether Mono S1",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0tusR3YOw6Ym-te8NuXKRCCPvd5cxhaVrp1Z2WjpDCNaEypGRE1uVZURzcUDIQvymSPIT986ywZ1XIoOcq68zbp7awuk9CB9tqQ6Pl3e311Ys7A8x4C8uCMvVuaKrwWxKGqQ0HKobSW8ZIrS0QtnOy6cc_LDyXdOZFJEUFAaHE7MiRtFvvi4kvARSNidt-ojB2xF7yLYMZjI1KKV_yMD-WRg34VZx6yg07K69hVwP15mC6ZzCAbLw_7N6Je80J5EDgzt1lXE0FyA=s0"
  },
  {
    id: "orbit-v3-platter",
    name: "Orbit V3 Platter",
    slug: "orbit-v3-platter",
    category: "Turntables",
    categorySlug: "turntables",
    price: 6200.00,
    brand: "Aura",
    tagline: "Magnetic Levitation Reference Turntable",
    description: "Magnetic levitation bearing system for absolute silence, zero contact friction, and unmatched rotational inertia.",
    specs: {
      "Drive System": "Direct Drive, Magnetic Levitation",
      "Platter": "8kg Brushed Steel with Resonant Damping",
      "Tonearm": "9\" Carbon Fiber Gimbal",
      "Speeds": "33-1/3 RPM, 45 RPM",
      "Dimensions": "48cm x 40cm x 15cm",
      "Weight": "18kg"
    },
    soundProfile: "Zero mechanical noise floor. Black background against which vinyl micro-details emerge with crystalline realism.",
    bestFor: ["Audiophile Vinyl Collectors", "Pure Analog Playback"],
    roomSize: "Any",
    idealPairing: "Vacuum Master Amp + Phono Stage",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3EWlC44YeWj3fLTTVEnkqsTdJl9ESnKucTzO83D9T0-5gNNeiff2TJOouPnPTws8BWeaSIyfq8fJqebPt6yGtcq7pYaisdMWjQAoISBv0_C_lBSKW5rZT6eJ0jleX0uXc_og_ultV5giONoJOvmNI8HaTYKRafPggimVsm3Ir8ywIn0wy97A0KT8w_2aFJ0nXuoJRROrfqCzM_Pwr83KPcn9YCepwZX9hyni29ttPC0S8PPbFhjC_d7sFnUqGNrSwFuH0NDZwvs8=s0"
  },
  {
    id: "command-core",
    name: "Command Core",
    slug: "command-core",
    category: "Accessories",
    categorySlug: "accessories",
    price: 1150.00,
    brand: "Aura",
    tagline: "Universal Haptic Acoustic Controller",
    description: "Universal interface for the Aura ecosystem machined from a solid block of aluminum with haptic rotary dial and encrypted mesh control.",
    specs: {
      "Screen": "Minimalist High-Contrast OLED",
      "Casing": "Milled Sandblasted Aircraft Aluminum",
      "Connectivity": "Encrypted Low-Latency Mesh, Bluetooth 5.3",
      "Battery": "Up to 30 days per USB-C charge",
      "Dimensions": "12cm x 6cm x 1.2cm",
      "Weight": "150g"
    },
    soundProfile: "Zero signal degradation. Bit-perfect digital volume attenuation.",
    bestFor: ["Ecosystem Control", "Precision Volume & Zone Management"],
    roomSize: "Any",
    idealPairing: "All Aura Systems",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfiBlharM4IBX3TWZ6oeeoWpRoRe9dV5rG2r6EWY8IwKdAjWkk38LeBM8LeRvE0C4qcNzflSvWHOnJ_VjAnyAreNyfgWN-vbPi2EpDK_tsMf9bwVb6iQWK8URdmQjZ9hk3AGNHq5gLCsN0sXbcHM5BDtV9D9v5AlcNFdNWCRs3kZKdFoHmnARBxgMocV26sZ89QcPM-bRtJ46xf-TTbked_ur0pu7relej2f4VrAte8CRiUUQPBzWucdYuW3mTMnzn_H6hViXISV4=s0"
  }
];

/**
 * Generate context-aware greeting and initial suggestions
 */
export function generateContextualGreeting(context) {
  const { pathname, currentProduct, roomConfig } = context;

  // 1. On Product Detail Page
  if (pathname?.startsWith("/product/") && currentProduct) {
    return {
      message: `You are examining the ${currentProduct.name}. Would you like to know how its acoustic characteristics compare with our other flagship curations, or if it suits your specific room dimensions?`,
      quickActions: [
        { label: "Tell me about it", prompt: `Tell me about the sound profile and engineering of the ${currentProduct.name}` },
        { label: "Compare with alternative", prompt: `Compare the ${currentProduct.name} with an alternative speaker or amplifier` },
        { label: "Is it right for my room?", prompt: `What room size and acoustic environment is best for the ${currentProduct.name}?` },
        { label: "Ideal amplifier pairing", prompt: `Which AURA amplifier pairs best with the ${currentProduct.name}?` },
        { label: "Experience in Showroom", prompt: `I would like to book a private listening session to hear the ${currentProduct.name}` }
      ]
    };
  }

  // 2. On Design Your Room Configurator
  if (pathname === "/design-your-room") {
    if (roomConfig?.dimensions) {
      const { length, width, height, unit } = roomConfig.dimensions;
      const typeLabel = roomConfig.roomType ? roomConfig.roomType.replace("-", " ").toUpperCase() : "LISTENING ROOM";
      const setupLabel = roomConfig.audioSetup || "5.1";
      return {
        message: `I notice you are designing a ${length} × ${width} × ${height} ${unit || "FT"} ${typeLabel} with a ${setupLabel} configuration. How may I assist with driver dispersion, standing-wave boundary calculations, or component synergy?`,
        quickActions: [
          { label: "Recommend Complete System", prompt: "Recommend the ideal AURA audio components for this room configuration" },
          { label: "Acoustic Ratio Check", prompt: "Evaluate my room proportions and speaker positions for acoustic room modes" },
          { label: "Subwoofer Placement Tip", prompt: "Where should I position the subwoofer in this room layout?" },
          { label: "Amplifier Power Check", prompt: "Will the recommended amplifier have sufficient dynamic headroom for this room volume?" }
        ]
      };
    }

    return {
      message: "Welcome to the AURA 3D Design Studio. I am your acoustic consultant. Configure your room dimensions and audio setup above, and I will help you tailor the ideal high-fidelity hardware.",
      quickActions: [
        { label: "Start Room Recommendation", prompt: "Help me design an audio setup for my room" },
        { label: "Music Room vs Home Cinema", prompt: "What are the key acoustic differences between a dedicated Music Room and a Home Cinema?" },
        { label: "Golden Acoustic Ratio", prompt: "What are the ideal golden room dimensions for high-end acoustics?" }
      ]
    };
  }

  // 3. Category Pages
  if (pathname === "/speakers") {
    return {
      message: "Exploring our Loudspeakers collection. From the monolithic low-end power of the Eclipse X1 to the sculptural intimacy of the Aether Mono S1, how may I direct your listening requirements?",
      quickActions: [
        { label: "Eclipse X1 vs Aether Mono S1", prompt: "Compare the Eclipse X1 and the Aether Mono S1" },
        { label: "Find My Speaker", prompt: "Help me choose the right speaker for my space and genre" },
        { label: "Near-field Monitors", prompt: "Tell me about the Pulse Monitor R4 for smaller rooms" }
      ]
    };
  }

  if (pathname === "/amplifiers") {
    return {
      message: "You are viewing our reference Vacuum Tube Amplifiers. We offer high-wattage KT150 dynamics with the Flux Reference A2 and rich Class-A KT88 harmonic warmth with the Vacuum Master Amp. Which sonic path do you prefer?",
      quickActions: [
        { label: "Flux A2 vs Vacuum Master", prompt: "Compare the Flux Reference A2 and Vacuum Master Amp" },
        { label: "Tube vs Solid State", prompt: "Why does AURA use hand-crafted vacuum tube architectures?" },
        { label: "Best Match for Speakers", prompt: "Which amplifier should I choose for my loudspeakers?" }
      ]
    };
  }

  if (pathname === "/turntables") {
    return {
      message: "The Orbit V3 Platter employs magnetic levitation to achieve zero mechanical friction and a dead-silent background. Would you like to explore its tonearm geometry or pairing recommendations?",
      quickActions: [
        { label: "Magnetic Levitation Explained", prompt: "How does magnetic levitation improve turntable sound quality?" },
        { label: "Vinyl Setup Consultation", prompt: "What components do I need for a complete high-end vinyl system?" }
      ]
    };
  }

  if (pathname === "/book-demo") {
    return {
      message: "Preparing to reserve your private listening demo. Would you like assistance choosing which flagship loudspeaker or tube amplifier pairing to request for your showroom audition in Milan, Munich, New York, or London?",
      quickActions: [
        { label: "Showroom Demo Advice", prompt: "Which products should I request to hear during my showroom demo?" },
        { label: "What happens in a demo?", prompt: "What is included in an AURA private showroom listening session?" }
      ]
    };
  }

  // Default Home / Universal Welcome
  return {
    message: "Welcome to AURA. I am your personal audio concierge. Whether you are curating a reference two-channel vinyl system, designing a bespoke cinema room, or exploring acoustic synergy, I am here to guide you.",
    quickActions: [
      { label: "Find My Audio Setup", prompt: "Help me find the right audio setup for my needs" },
      { label: "Design My Room in 3D", prompt: "I want to design my room in 3D" },
      { label: "Compare Flagship Speakers", prompt: "Compare Eclipse X1 and Aether Mono S1" },
      { label: "Book a Showroom Demo", prompt: "I would like to book a private listening session" }
    ]
  };
}

/**
 * Main AI Engine response processor.
 * Analyzes user prompt, context, and conversation history,
 * then returns a structured response object.
 */
export async function processAuraQuery(userQuery, context, history = []) {
  const query = userQuery.trim().toLowerCase();
  const { currentProduct, roomConfig } = context;

  // Simulate calm, premium thinking duration
  await new Promise((r) => setTimeout(r, 650));

  // 0. ROOM CONFIGURATOR / SOUND PREVIEW INTENT
  if (
    query.includes("sound like") ||
    query.includes("how does this room sound") ||
    query.includes("sound preview") ||
    query.includes("sound character") ||
    (query.includes("hear") && (query.includes("room") || query.includes("speaker") || query.includes("setup")))
  ) {
    if (roomConfig && roomConfig.dimensions) {
      const {
        dimensions,
        roomType = "home-cinema",
        audioSetup = "5.1",
        selectedSpeaker = "eclipse-x1",
      } = roomConfig;

      const speakerMentioned = query.includes("eclipse")
        ? "Eclipse X1"
        : query.includes("aether")
        ? "Aether Mono S1"
        : query.includes("pulse")
        ? "Pulse Monitor R4"
        : null;

      const targetSpeaker =
        speakerMentioned ||
        (selectedSpeaker.includes("aether")
          ? "Aether Mono S1"
          : selectedSpeaker.includes("pulse")
          ? "Pulse Monitor R4"
          : "Eclipse X1");

      const isFeet = dimensions.unit === "FT";
      const vol = Math.round(dimensions.length * dimensions.width * dimensions.height);
      const volCuFt = isFeet ? vol : Math.round(vol * 35.3147);

      let roomAcousticDesc = "";
      if (volCuFt < 1800) {
        roomAcousticDesc =
          "an intimate acoustic space with immediate, punchy low-end and tightly focused stereophonic imaging";
      } else if (volCuFt > 3500) {
        roomAcousticDesc =
          "a grand listening salon where high-volume air displacement allows natural reverb dispersion and an expansive holographic soundstage";
      } else {
        roomAcousticDesc =
          "a balanced medium studio offering effortless dynamic headroom and cohesive acoustic pressurization";
      }

      let speakerSonicVoicing = "";
      if (targetSpeaker === "Eclipse X1") {
        speakerSonicVoicing =
          "With the **Eclipse X1**, expect subterranean bass authority reaching down to 18Hz, immense visceral dynamic punch, and an authoritative soundstage that effortlessly commands this room.";
      } else if (targetSpeaker === "Aether Mono S1") {
        speakerSonicVoicing =
          "With the **Aether Mono S1**, the ribbon tweeter delivers ultra-delicate high-frequency air, organic vocal textures, and laser-precise imaging without cabinet resonance.";
      } else {
        speakerSonicVoicing =
          "With the **Pulse Monitor R4**, you achieve pinpoint near-field clarity, fast transient speed, and tightly controlled bass ideal for critical listening.";
      }

      const setupDesc =
        audioSetup === "5.1.2"
          ? "Dolby Atmos height modules add vertical spatial envelopment."
          : audioSetup !== "2.0"
          ? "The dedicated subwoofer handles sub-80Hz pressure, allowing your main speakers to focus purely on crystalline midrange."
          : "Pure reference two-channel stereo delivers pristine phase coherence and focus.";

      return {
        type: "text",
        content:
          `In your **${dimensions.length} × ${dimensions.width} × ${dimensions.height} ${dimensions.unit}** ${(roomType || "").replace("-", " ")} configured with **${audioSetup}**:\n\n` +
          `• **Room Acoustics**: Your space is ${roomAcousticDesc}.\n` +
          `• **Acoustic Character with ${targetSpeaker}**: ${speakerSonicVoicing}\n` +
          `• **Multi-Channel Field**: ${setupDesc}\n\n` +
          `🎧 **Audition It Now**: Click **▶ Preview Sound** in the **Experience Your Room** panel right in the 3D studio to hear an illustrative 7-second audio preview tailored to this configuration.`,
        followUpChips: [
          {
            label: `Compare with ${targetSpeaker === "Eclipse X1" ? "Aether Mono S1" : "Eclipse X1"}`,
            prompt: `What would this room sound like with the ${targetSpeaker === "Eclipse X1" ? "Aether Mono S1" : "Eclipse X1"}?`,
          },
          { label: "Book Showroom Audition", prompt: "I want to hear this setup in person at an AURA showroom" },
        ],
      };
    }
  }
  // 1. DIRECT PRODUCT COMPARISON INTENTS
  if (
    query.includes("compare") ||
    (query.includes("difference") && (query.includes("eclipse") || query.includes("aether") || query.includes("amp") || query.includes("speaker"))) ||
    query.includes("vs")
  ) {
    if (query.includes("eclipse") && query.includes("aether")) {
      const p1 = AURA_CATALOGUE.find((p) => p.slug === "eclipse-x1");
      const p2 = AURA_CATALOGUE.find((p) => p.slug === "aether-mono-s1");
      return {
        type: "product_comparison",
        content: `Here is how our two flagship floorstanders compare. Both represent masterworks of acoustics, yet they are voiced for distinct sonic priorities:`,
        comparison: {
          title: "Flagship Loudspeaker Architectural Comparison",
          item1: p1,
          item2: p2,
          verdict: `Choose the **Eclipse X1** if you desire subterranean bass down to 18Hz, 1500W of effortless active power, and large-scale cinematic or orchestral grandeur. Choose the **Aether Mono S1** if your priority is intimate vocal clarity, delicate ribbon-tweeter harmonic air, and acoustic or jazz reproduction in a dedicated listening room.`
        },
        followUpChips: [
          { label: "Pair Eclipse X1 with Amp", prompt: "Which amplifier pairs best with Eclipse X1?" },
          { label: "Place in 3D Room", prompt: "I want to design my room around these speakers" },
          { label: "Book Demo for both", prompt: "Can I audition both speakers in a showroom demo?" }
        ]
      };
    }

    if (query.includes("flux") || query.includes("vacuum") || query.includes("tube") || query.includes("amp")) {
      const p1 = AURA_CATALOGUE.find((p) => p.slug === "flux-reference-a2");
      const p2 = AURA_CATALOGUE.find((p) => p.slug === "vacuum-master-amp");
      return {
        type: "product_comparison",
        content: `Our two vacuum tube amplifiers cater to different acoustic scales and sonic temperaments:`,
        comparison: {
          title: "AURA Vacuum Tube Amplification Comparison",
          item1: p1,
          item2: p2,
          verdict: `The **Flux Reference A2** utilizes 4x KT150 tubes producing 150W/channel of muscular power with supreme bass grip, ideal for large towers like the Eclipse X1. The **Vacuum Master Amp** deploys classic KT88 valves in pure Class-A delivering 100W/channel with legendary golden-era warmth, harmonic richness, and intimate holographic vocals.`
        },
        followUpChips: [
          { label: "Which suits Jazz?", prompt: "Which amplifier is best for jazz and vocal recordings?" },
          { label: "Turntable Integration", prompt: "How do these amps work with the Orbit V3 turntable?" }
        ]
      };
    }
  }

  // 2. PRODUCT SPECIFIC QUERIES
  const mentionedProduct = AURA_CATALOGUE.find((p) =>
    query.includes(p.name.toLowerCase()) || query.includes(p.slug.replace("-", " "))
  ) || (currentProduct ? AURA_CATALOGUE.find((p) => p.id === currentProduct.id || p.slug === currentProduct.slug) : null);

  if (mentionedProduct && (query.includes("tell me") || query.includes("specs") || query.includes("about") || query.includes("price") || query.includes("feature"))) {
    return {
      type: "product_card",
      content: `The **${mentionedProduct.name}** ($${mentionedProduct.price.toLocaleString()}) is our ${mentionedProduct.tagline.toLowerCase()}.\n\n${mentionedProduct.description}\n\n**Sonic Character**: ${mentionedProduct.soundProfile}\n**Recommended Room**: ${mentionedProduct.roomSize}\n**Recommended Synergy**: ${mentionedProduct.idealPairing}`,
      product: mentionedProduct,
      followUpChips: [
        { label: "View Specifications", prompt: `What are the technical specs of the ${mentionedProduct.name}?` },
        { label: "Is it right for my room?", prompt: `Will the ${mentionedProduct.name} work in my room?` },
        { label: "Experience in Showroom", prompt: `I want to hear the ${mentionedProduct.name} in person` }
      ]
    };
  }

  // 3. GENRE & MUSICAL PREFERENCES
  if (query.includes("jazz") || query.includes("vocal") || query.includes("acoustic") || query.includes("classical") || query.includes("vinyl") || query.includes("warm")) {
    const speakers = AURA_CATALOGUE.find((p) => p.slug === "aether-mono-s1");
    const amp = AURA_CATALOGUE.find((p) => p.slug === "vacuum-master-amp");
    const turntable = AURA_CATALOGUE.find((p) => p.slug === "orbit-v3-platter");

    return {
      type: "recommendation_bundle",
      content: `For acoustic jazz, intimate vocals, and rich analog vinyl playback, we recommend an organic Class-A vacuum tube chain paired with ribbon-tweeter precision:`,
      bundle: {
        title: "The AURA Acoustic & Analog Master Suite",
        total: speakers.price + amp.price + turntable.price,
        items: [speakers, amp, turntable],
        rationale: `The ribbon tweeter on the **Aether Mono S1** captures the breath of brass and upright bass resonance without glare, while the **Vacuum Master Amp** (KT88 tubes) renders three-dimensional harmonic body. The magnetic-levitation **Orbit V3 Platter** eliminates vinyl surface friction for uncompromised micro-detail.`
      },
      followUpChips: [
        { label: "Explore 3D Room Studio", prompt: "I want to visualize this setup in 3D" },
        { label: "Book Showroom Audition", prompt: "Book a demo to hear this jazz setup in person" }
      ]
    };
  }

  // 4. HOME CINEMA & HIGH DYNAMICS
  if (query.includes("movie") || query.includes("cinema") || query.includes("theater") || query.includes("bass") || query.includes("surround") || query.includes("5.1") || query.includes("7.1")) {
    const mains = AURA_CATALOGUE.find((p) => p.slug === "eclipse-x1");
    const amp = AURA_CATALOGUE.find((p) => p.slug === "flux-reference-a2");
    const controller = AURA_CATALOGUE.find((p) => p.slug === "command-core");

    return {
      type: "recommendation_bundle",
      content: `For reference-grade home cinema and high-dynamic theater reproduction, dynamic headroom and ultra-low frequency control are paramount:`,
      bundle: {
        title: "AURA Reference Theater System",
        total: mains.price + amp.price + controller.price,
        items: [mains, amp, controller],
        rationale: `The **Eclipse X1** provides 1500W of active power reaching down to 18Hz for seismic movie transients. Driven by the **Flux Reference A2**, dialogue clarity remains crystalline even during complex cinematic sequences. Central control is orchestrated via the **Command Core**.`
      },
      followUpChips: [
        { label: "Configure in 3D Room", prompt: "I want to configure a 5.1 room in 3D" },
        { label: "Subwoofer Integration", prompt: "Does this setup need an additional subwoofer?" }
      ]
    };
  }

  // 5. ROOM SIZE & ACOUSTIC MATCHING
  if (query.match(/\d+\s*(by|x|\*)\s*\d+/) || query.includes("room size") || query.includes("sq ft") || query.includes("square foot") || query.includes("small room") || query.includes("large room")) {
    const matches = query.match(/(\d+)\s*(?:by|x|\*)\s*(\d+)/i);
    let l = 20, w = 15;
    if (matches) {
      l = parseInt(matches[1]);
      w = parseInt(matches[2]);
    }
    const h = 10;
    const sqFt = l * w;
    const cuFt = sqFt * h;

    let recProduct;
    let explanation;

    if (cuFt < 1800) {
      recProduct = AURA_CATALOGUE.find((p) => p.slug === "pulse-monitor-r4");
      explanation = `Your ${l} × ${w} ft space (approx. ${sqFt} sq.ft / ${cuFt} cu.ft) is an intimate acoustic volume. Massive floorstanders would overload the room with modal bass boom. Our active **Pulse Monitor R4** monitors ($4,400) will deliver pristine stereo imaging without room resonance.`;
    } else if (cuFt < 3500) {
      recProduct = AURA_CATALOGUE.find((p) => p.slug === "aether-mono-s1");
      explanation = `Your ${l} × ${w} ft space (${sqFt} sq.ft / ${cuFt} cu.ft) is a golden medium-sized listening room. The **Aether Mono S1** ($12,400) or **Eclipse X1** ($12,999) paired with our **Flux Reference A2** will pressurize this space with majestic presence and pinpoint holographic depth.`;
    } else {
      recProduct = AURA_CATALOGUE.find((p) => p.slug === "eclipse-x1");
      explanation = `With ${sqFt} sq.ft (${cuFt} cu.ft), you have a grand acoustic hall. You need the full displacement of the **Eclipse X1** ($12,999) with its 3x 8" woofers and 1500W internal amplification to maintain effortless SPL and physical bass impact.`;
    }

    return {
      type: "product_card",
      content: `${explanation}\n\nWould you like to step into our 3D Room Configurator to test speaker boundary distances in this exact room size?`,
      product: recProduct,
      followUpChips: [
        { label: "Open in 3D Configurator", prompt: "I want to design my room in 3D" },
        { label: "Optimal Listening Position", prompt: `Where should I sit in a ${l}x${w} room for the best sound?` },
        { label: "Book a Demo", prompt: "Book a showroom demo" }
      ]
    };
  }

  // 6. BUDGET QUERIES
  if (query.includes("budget") || query.includes("cost") || query.includes("price") || query.includes("lakh") || query.includes("$")) {
    let budgetCap = 30000;
    if (query.includes("5 lakh") || query.includes("500000") || query.includes("6000") || query.includes("10000") || query.includes("10k")) {
      budgetCap = 10000;
    } else if (query.includes("15k") || query.includes("15000") || query.includes("20k") || query.includes("20000")) {
      budgetCap = 22000;
    }

    const affordable = AURA_CATALOGUE.filter((p) => p.price <= budgetCap).slice(0, 3);

    return {
      type: "text",
      content: `Within your investment target, here are our premier AURA recommendations:\n\n` +
        affordable.map((p) => `• **${p.name}** (${p.category}) — $${p.price.toLocaleString()} · *${p.tagline}*`).join("\n\n") +
        `\n\nEach item is engineered to integrate seamlessly into a growing high-fidelity ecosystem. Would you like to view detailed specifications or audition one in our showroom?`,
      followUpChips: affordable.map((p) => ({
        label: p.name,
        prompt: `Tell me about the ${p.name}`
      }))
    };
  }

  // 7. BOOK DEMO REFERRAL
  if (query.includes("demo") || query.includes("showroom") || query.includes("listen in person") || query.includes("audition") || query.includes("visit")) {
    return {
      type: "text",
      content: `AURA maintains exclusive private listening salons in **Milan**, **Munich**, **New York**, and **London**.\n\nOur master acoustic technicians prepare personalized hardware sessions with your choice of music, reference tube amplification, and acoustic room tuning.\n\nWould you like me to guide you to our reservation concierge?`,
      followUpChips: [
        { label: "Reserve Showroom Session", prompt: "I would like to book a private listening session" },
        { label: "Which showroom is closest?", prompt: "Where are the AURA private showrooms located?" }
      ]
    };
  }

  // 8. 3D ROOM CONFIGURATOR INTENT
  if (query.includes("design my room") || query.includes("3d") || query.includes("configurator") || query.includes("placement") || query.includes("position")) {
    return {
      type: "text",
      content: `You can access our interactive **3D Design Studio** directly at [/design-your-room](/design-your-room).\n\nIn the 3D studio, you can:\n• Adjust room length, width, and ceiling height in Feet or Meters\n• Toggle between 2.0 Stereo, 2.1, 5.1 Surround, and 5.1.2 Dolby Atmos\n• Orbit, pan, and inspect speakers from the listener sweet spot\n• Toggle between 3D visualization and an architectural 2D blueprint\n• Receive real-time acoustic ratio guidance and save your design`,
      followUpChips: [
        { label: "Launch 3D Configurator", prompt: "Take me to the Design Your Room page" },
        { label: "Ideal Speaker Placement", prompt: "What is the recommended angle for stereo speakers?" }
      ]
    };
  }

  // 9. GENERAL ACOUSTIC CONSULTATION (DEFAULT RICH CONCIERGE RESPONSE)
  return {
    type: "text",
    content: `As your AURA audio concierge, I can assist you with:\n\n1. **Acoustic Matching**: Finding the ideal speaker and amplifier pairing for your room dimensions and musical tastes.\n2. **Product Comparisons**: Evaluating the nuanced differences between our active floorstanders and vacuum tube amplifiers.\n3. **3D Room Design**: Sizing speakers, subwoofers, and acoustic treatment in our interactive 3D studio.\n4. **Showroom Auditions**: Arranging a private listening session at our Milan, Munich, New York, or London salons.\n\nWhat would you like to explore first?`,
    followUpChips: [
      { label: "Find My Audio Setup", prompt: "Help me find the right audio setup for my needs" },
      { label: "Compare Eclipse X1 & Aether Mono S1", prompt: "Compare Eclipse X1 and Aether Mono S1" },
      { label: "Design My Room in 3D", prompt: "I want to design my room in 3D" },
      { label: "Book Showroom Demo", prompt: "I want to book a private listening session" }
    ]
  };
}
