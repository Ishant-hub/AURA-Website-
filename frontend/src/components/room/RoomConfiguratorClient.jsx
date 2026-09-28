"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowDown, Box, Sparkles, Check, X, ExternalLink, ShoppingBag } from "lucide-react";
import Room3DCanvas from "./Room3DCanvas";
import Room2DCanvas from "./Room2DCanvas";
import RoomControls from "./RoomControls";
import AcousticInsights from "./AcousticInsights";
import RecommendedSystem from "./RecommendedSystem";
import SoundPreviewSection from "./SoundPreviewSection";
import SaveDesignModal from "./SaveDesignModal";
import MyDesignsModal from "./MyDesignsModal";
import { useAuraConcierge } from "@/context/AuraConciergeContext";
import { useCart } from "@/context/CartContext";

const SAVED_DESIGNS_KEY = "aura_room_designs";

export default function RoomConfiguratorClient() {
  const { updateRoomContext, openConcierge } = useAuraConcierge();
  const { addToCart } = useCart();

  const studioRef = useRef(null);

  // Room State
  const [dimensions, setDimensions] = useState({
    length: 22,
    width: 16,
    height: 10,
    unit: "FT",
  });
  const [roomType, setRoomType] = useState("home-cinema");
  const [audioSetup, setAudioSetup] = useState("5.1");
  const [selectedSpeaker, setSelectedSpeaker] = useState("eclipse-x1");
  const [budget, setBudget] = useState(null);
  const [activeView, setActiveView] = useState("3d");
  const [cameraPreset, setCameraPreset] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [notification, setNotification] = useState("");
  const [itemAdded, setItemAdded] = useState(false);

  // Modal States
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isMyDesignsOpen, setIsMyDesignsOpen] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState([]);

  // Load saved designs from localStorage on mount
  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(SAVED_DESIGNS_KEY) ||
        localStorage.getItem("aura_room_designs_v1");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedDesigns(parsed);
        }
      }
    } catch (e) {
      console.warn("Could not load saved room designs from localStorage", e);
    }
  }, []);

  // Sync state with AURA AI Concierge
  useEffect(() => {
    updateRoomContext({
      dimensions,
      roomType,
      audioSetup,
      selectedSpeaker,
      budget,
      selectedEquipment,
    });
  }, [
    dimensions,
    roomType,
    audioSetup,
    selectedSpeaker,
    budget,
    selectedEquipment,
    updateRoomContext,
  ]);

  // Scroll to studio
  const handleStartDesigning = () => {
    studioRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Save Design with custom name
  const handleSaveDesign = (designName) => {
    try {
      const now = new Date();
      const design = {
        id: `design_${Date.now()}`,
        name: designName,
        createdAt: now.toISOString(),
        formattedDate: now.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        date: now.toLocaleDateString(),
        dimensions: { ...dimensions },
        roomType,
        audioSetup,
        selectedSpeaker,
        budget,
        activeView,
        selectedEquipment,
        listeningPosition: { x: 0, y: 1.15, z: dimensions.length * 0.15 },
      };

      const updated = [design, ...savedDesigns.filter((d) => d.id !== design.id)];
      localStorage.setItem(SAVED_DESIGNS_KEY, JSON.stringify(updated));
      setSavedDesigns(updated);

      setNotification(`Room design "${designName}" saved successfully.`);
      setTimeout(() => setNotification(""), 3500);
    } catch (e) {
      console.error("Save design error", e);
    }
  };

  // Load Design and restore complete room configuration
  const handleLoadDesign = (design) => {
    try {
      if (!design) return;
      if (design.dimensions) setDimensions(design.dimensions);
      if (design.roomType) setRoomType(design.roomType);
      if (design.audioSetup) setAudioSetup(design.audioSetup);
      if (design.selectedSpeaker) setSelectedSpeaker(design.selectedSpeaker);
      if (design.budget !== undefined) setBudget(design.budget);
      if (design.activeView) setActiveView(design.activeView);
      if (design.selectedEquipment !== undefined) setSelectedEquipment(design.selectedEquipment);
      setCameraPreset("reset");

      // Immediate sync to AURA AI Concierge
      updateRoomContext({
        dimensions: design.dimensions,
        roomType: design.roomType,
        audioSetup: design.audioSetup,
        selectedSpeaker: design.selectedSpeaker,
        budget: design.budget,
        selectedEquipment: design.selectedEquipment,
      });

      setNotification(`Loaded design: "${design.name}"`);
      setTimeout(() => setNotification(""), 3500);
    } catch (e) {
      console.error("Load design error", e);
    }
  };

  // Delete saved design
  const handleDeleteDesign = (designId) => {
    try {
      const updated = savedDesigns.filter((d) => d.id !== designId);
      localStorage.setItem(SAVED_DESIGNS_KEY, JSON.stringify(updated));
      setSavedDesigns(updated);
      setNotification("Saved room design removed.");
      setTimeout(() => setNotification(""), 3000);
    } catch (e) {
      console.error("Delete design error", e);
    }
  };

  // Reset Design to defaults
  const handleResetDesign = () => {
    setDimensions({
      length: 22,
      width: 16,
      height: 10,
      unit: "FT",
    });
    setRoomType("home-cinema");
    setAudioSetup("5.1");
    setSelectedSpeaker("eclipse-x1");
    setCameraPreset("reset");
    setSelectedEquipment(null);
    setNotification("Room parameters reset to flagship defaults.");
    setTimeout(() => setNotification(""), 3000);
  };

  const handleAddSelectedToCart = () => {
    if (!selectedEquipment) return;
    addToCart({
      id: selectedEquipment.id,
      name: selectedEquipment.name,
      price: selectedEquipment.price,
      slug: selectedEquipment.slug,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDTQvM7clTjbV9GXGsgT2LlH8V-R6p6eGDHt93Y6BGWFd6-b-A2DYNg2p1nNihAJ8BNukOsaKKU5GWLat5378nSFLIHUSyChj9nSmWkvJOUxn_ElPAf2xc5MaGzZOU8uTK9s8wyD4ab32n8SelqVqbvL8Mh07LtLb-IkjeHL7_mQPRmajrjm5pK-D8Aq-aHjIalfhSFhr5fBAGenKuG1xqIYC-o8W6jcIe0V1dnJj4cfX_g1olFbio4yCUxOq_e48SlT7dMa03_bXI=s0",
    });
    setItemAdded(true);
    setTimeout(() => setItemAdded(false), 2000);
  };

  return (
    <main className="min-h-screen pb-32">
      {/* 1. HERO SECTION */}
      <section className="relative pt-44 pb-24 px-4 md:px-margin-desktop max-w-container-max mx-auto text-center flex flex-col items-center">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

        <span className="font-label-caps text-xs text-primary tracking-[0.4em] font-semibold block mb-4 uppercase">
          AURA 3D ACOUSTIC STUDIO
        </span>

        <h1 className="font-display-lg text-4xl sm:text-5xl md:text-7xl text-white font-extralight tracking-tight max-w-4xl mb-6">
          DESIGN YOUR ROOM
        </h1>

        <p className="font-body-lg text-xl md:text-2xl text-primary font-light italic mb-4">
          &ldquo;Design the sound around your space.&rdquo;
        </p>

        <p className="font-body-md text-on-surface-variant/80 max-w-2xl text-base md:text-lg font-light leading-relaxed mb-10">
          Create your room, position your system, and discover the bespoke AURA setup designed for your space.
        </p>

        <button
          onClick={handleStartDesigning}
          className="bg-primary text-on-primary px-10 py-5 rounded-xl font-label-caps text-xs tracking-widest font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl hover:shadow-primary/25 flex items-center gap-3 cursor-pointer uppercase"
        >
          <span>START DESIGNING</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </button>
      </section>

      {/* 2. MAIN 3D / 2D STUDIO VIEWPORT */}
      <section
        ref={studioRef}
        className="px-4 md:px-margin-desktop max-w-container-max mx-auto space-y-8"
      >
        {/* Notification Banner */}
        {notification && (
          <div className="glass-panel p-4 rounded-xl border-primary/30 bg-primary/5 flex items-center justify-between animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-label-caps tracking-wider text-primary font-semibold">
                {notification}
              </span>
            </div>
            <button
              onClick={() => setNotification("")}
              className="text-on-surface-variant hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Viewport Frame */}
        <div className="relative w-full h-[520px] md:h-[680px] rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] bg-[#070707]">
          {/* Active Canvas */}
          {activeView === "3d" ? (
            <Room3DCanvas
              dimensions={dimensions}
              roomType={roomType}
              audioSetup={audioSetup}
              selectedEquipment={selectedEquipment}
              onSelectEquipment={setSelectedEquipment}
              cameraPreset={cameraPreset}
              onCameraPresetHandled={() => setCameraPreset(null)}
              onFallbackTo2D={() => setActiveView("2d")}
            />
          ) : (
            <Room2DCanvas
              dimensions={dimensions}
              audioSetup={audioSetup}
              roomType={roomType}
              selectedEquipment={selectedEquipment}
              onSelectEquipment={setSelectedEquipment}
            />
          )}

          {/* Interactive Selected Equipment Popover / Drawer */}
          {selectedEquipment && (
            <div className="absolute top-6 left-6 right-6 md:right-auto md:w-80 p-5 rounded-2xl bg-[#0E0E0E]/95 border border-primary/40 backdrop-blur-2xl shadow-2xl space-y-4 animate-[fadeIn_0.25s_ease-out] z-20">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-label-caps tracking-widest text-primary font-bold uppercase block mb-1">
                    {selectedEquipment.role}
                  </span>
                  <h4 className="text-sm font-semibold text-white">
                    {selectedEquipment.name}
                  </h4>
                  <p className="text-xs text-primary font-mono font-bold mt-0.5">
                    ${selectedEquipment.price.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedEquipment(null)}
                  className="p-1 text-on-surface-variant hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-label-caps tracking-widest uppercase font-semibold pt-1">
                <Link
                  href={`/product/${selectedEquipment.slug}`}
                  className="flex items-center justify-center gap-1 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-primary text-white transition-colors text-center"
                >
                  <ExternalLink className="w-3 h-3 text-primary" /> Details
                </Link>
                <button
                  onClick={handleAddSelectedToCart}
                  className="flex items-center justify-center gap-1 py-2 rounded-lg bg-primary text-on-primary hover:opacity-90 transition-opacity cursor-pointer"
                >
                  {itemAdded ? (
                    <>
                      <Check className="w-3 h-3" /> Added
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3 h-3" /> Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Floating Ask AURA button in 3D scene */}
          <div className="absolute bottom-6 right-6 z-20">
            <button
              onClick={() =>
                openConcierge(
                  `I am in the 3D Design Studio with a ${dimensions.length} × ${dimensions.width} × ${dimensions.height} ${dimensions.unit} ${roomType.replace("-", " ")} (${audioSetup}). Can you evaluate speaker placement and amplifier pairing?`
                )
              }
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#111111]/90 hover:bg-[#1a1a1a] border border-primary/40 hover:border-primary text-white text-xs font-label-caps tracking-widest uppercase font-semibold backdrop-blur-xl shadow-lg transition-all cursor-pointer"
            >
              <span className="text-primary font-bold">✦</span>
              <span>Ask AURA About This View</span>
            </button>
          </div>
        </div>

        {/* 3. ROOM CONTROLS */}
        <RoomControls
          dimensions={dimensions}
          setDimensions={setDimensions}
          roomType={roomType}
          setRoomType={setRoomType}
          audioSetup={audioSetup}
          setAudioSetup={setAudioSetup}
          budget={budget}
          setBudget={setBudget}
          selectedSpeaker={selectedSpeaker}
          setSelectedSpeaker={setSelectedSpeaker}
          savedDesignsCount={savedDesigns.length}
          onOpenSaveModal={() => setIsSaveModalOpen(true)}
          onOpenMyDesignsModal={() => setIsMyDesignsOpen(true)}
          onCameraPreset={setCameraPreset}
          onSaveDesign={() => setIsSaveModalOpen(true)}
          onLoadDesign={() => setIsMyDesignsOpen(true)}
          onResetDesign={handleResetDesign}
          activeView={activeView}
          setActiveView={setActiveView}
        />

        {/* 4. EXPERIENCE YOUR ROOM — SOUND PREVIEW */}
        <SoundPreviewSection
          dimensions={dimensions}
          roomType={roomType}
          audioSetup={audioSetup}
          selectedSpeaker={selectedSpeaker}
        />

        {/* 5. REAL-TIME ACOUSTIC ROOM INSIGHTS */}
        <AcousticInsights
          dimensions={dimensions}
          roomType={roomType}
          audioSetup={audioSetup}
        />

        {/* 6. RECOMMENDED AURA SYSTEM */}
        <RecommendedSystem
          dimensions={dimensions}
          roomType={roomType}
          audioSetup={audioSetup}
        />

        {/* 7. MODALS: SAVE DESIGN & MY DESIGNS */}
        <SaveDesignModal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          onSave={handleSaveDesign}
          currentConfig={{
            dimensions,
            roomType,
            audioSetup,
            selectedSpeaker,
          }}
        />

        <MyDesignsModal
          isOpen={isMyDesignsOpen}
          onClose={() => setIsMyDesignsOpen(false)}
          savedDesigns={savedDesigns}
          onLoadDesign={handleLoadDesign}
          onDeleteDesign={handleDeleteDesign}
        />
      </section>
    </main>
  );
}
