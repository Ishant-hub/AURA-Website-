const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.setting.deleteMany();

  console.log("Database cleared.");

  // Create admin user
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      name: "AURA Admin",
      email: "admin@aurashowroom.com",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });
  console.log("Admin user created.");

  // Create categories
  const speakersCategory = await prisma.category.create({
    data: { name: "LOUDSPEAKERS", slug: "speakers" },
  });
  const amplifiersCategory = await prisma.category.create({
    data: { name: "AMPLIFIERS", slug: "amplifiers" },
  });
  const turntablesCategory = await prisma.category.create({
    data: { name: "TURNTABLES", slug: "turntables" },
  });
  const accessoriesCategory = await prisma.category.create({
    data: { name: "ACCESSORIES", slug: "accessories" },
  });
  console.log("Categories created.");

  // Products and Images definitions
  const products = [
    {
      name: "Eclipse X1",
      slug: "eclipse-x1",
      description: "The Eclipse X1 represents the pinnacle of acoustic engineering. A monolithic expression of pure sound, crafted for those who demand absolute fidelity and architectural presence.",
      price: 12999.00,
      brand: "Aura",
      stock: 5,
      isFeatured: true,
      categoryId: speakersCategory.id,
      specs: JSON.stringify({
        "DRIVERS": "3x 8\" Woofers, 1x 1\" Tweeter",
        "AMPLIFICATION": "1500W Total Class D",
        "FREQUENCY RANGE": "18Hz - 42kHz",
        "CONNECTIVITY": "XLR, WiFi 6E, Bluetooth 5.3",
        "WEIGHT": "42kg / 92.5 lbs",
        "DIMENSIONS": "120cm x 34cm x 34cm"
      }),
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTQvM7clTjbV9GXGsgT2LlH8V-R6p6eGDHt93Y6BGWFd6-b-A2DYNg2p1nNihAJ8BNukOsaKKU5GWLat5378nSFLIHUSyChj9nSmWkvJOUxn_ElPAf2xc5MaGzZOU8uTK9s8wyD4ab32n8SelqVqbvL8Mh07LtLb-IkjeHL7_mQPRmajrjm5pK-D8Aq-aHjIalfhSFhr5fBAGenKuG1xqIYC-o8W6jcIe0V1dnJj4cfX_g1olFbio4yCUxOq_e48SlT7dMa03_bXI"
    },
    {
      name: "Aether Mono S1",
      slug: "aether-mono-s1",
      description: "A sculptural masterpiece of sonic engineering, featuring zero-point vibration isolation and carbon-fiber composite housing.",
      price: 12400.00,
      brand: "Aura",
      stock: 3,
      isFeatured: true,
      categoryId: speakersCategory.id,
      specs: JSON.stringify({
        "DRIVERS": "2x 10\" Woofers, 1x 2\" Midrange, 1x 1\" Ribbon Tweeter",
        "AMPLIFICATION": "1200W Class D",
        "FREQUENCY RANGE": "20Hz - 40kHz",
        "CONNECTIVITY": "XLR Balanced, Wi-Fi",
        "WEIGHT": "38kg",
        "DIMENSIONS": "115cm x 30cm x 30cm"
      }),
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTQvM7clTjbV9GXGsgT2LlH8V-R6p6eGDHt93Y6BGWFd6-b-A2DYNg2p1nNihAJ8BNukOsaKKU5GWLat5378nSFLIHUSyChj9nSmWkvJOUxn_ElPAf2xc5MaGzZOU8uTK9s8wyD4ab32n8SelqVqbvL8Mh07LtLb-IkjeHL7_mQPRmajrjm5pK-D8Aq-aHjIalfhSFhr5fBAGenKuG1xqIYC-o8W6jcIe0V1dnJj4cfX_g1olFbio4yCUxOq_e48SlT7dMa03_bXI"
    },
    {
      name: "Sonus Pro H1",
      slug: "sonus-pro-h1",
      description: "Open-back planar magnetic headphones designed for critical listening sessions.",
      price: 2800.00,
      brand: "Aura",
      stock: 15,
      isFeatured: false,
      categoryId: speakersCategory.id,
      specs: JSON.stringify({
        "DRIVER TYPE": "Planar Magnetic (90mm)",
        "IMPEDANCE": "32 Ohms",
        "FREQUENCY RESPONSE": "6Hz - 48kHz",
        "SENSITIVITY": "98dB/mW",
        "WEIGHT": "420g",
        "CABLE": "Detachable XLR Balanced"
      }),
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBabHelyRWNRyIJ0ULKYCzg4jSFRh4-GSwfCS-1x4MjcWGmKNjTui7x22BT5SEv0H_jOx83r828rVs5ls3h-Ua4ovoNg4Ji5wmlFXp1NQ1M58iSq0kOqxS_WGCJxJuUfkbvPuAU0rVzYWsuwMUydzgO_otHS_2WLHzE47FXV7yFChcNEYUg2IYRJGjxqIMPKumfLPIW1feC9mRI33Bmn75WmtwsrJHIIspfM4Y0yCN92a6YZEu7YdpTcvToEOO1WjWf-Wxc3IgICU"
    },
    {
      name: "Pulse Monitor R4",
      slug: "pulse-monitor-r4",
      description: "Compact near-field monitors for professional studio environments and discerning home setups.",
      price: 4400.00,
      brand: "Aura",
      stock: 8,
      isFeatured: false,
      categoryId: speakersCategory.id,
      specs: JSON.stringify({
        "DRIVERS": "1x 5\" Mid-Woofer, 1x 0.75\" Tweeter",
        "AMPLIFICATION": "300W Active",
        "FREQUENCY RANGE": "45Hz - 25kHz",
        "CONNECTIVITY": "XLR Balanced",
        "WEIGHT": "8kg each",
        "DIMENSIONS": "30cm x 18cm x 22cm"
      }),
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvNGujFOTNSuzmKFLLFZvSfoKlnCIyezvYgqjGJkOmU309vf-BMHc-W-jvZDRsKGolyzXbCGgmnHEJqzkQUWu1mSodQz2l9Af2xCwM9ixz0m0HSmDps_LErxnf6CiFUL4G8Ov9ZuPQ7vbn7RyGdJDaYOy_2ol-VdBzH8V6pi4ZgpWwQlBVeqRiBPnbMjGhyRzvdKoQLGiE2OTwvZ2S_MdAZ3bmdsm9qohfjeT_iv_6AnkNqs_2RXTtoD1t3ZsjL3SfBytDcbv1QNc"
    },
    {
      name: "Flux Reference A2",
      slug: "flux-reference-a2",
      description: "Reference-grade tube amplification with hand-wound transformers and pure silver internal wiring.",
      price: 8950.00,
      brand: "Aura",
      stock: 4,
      isFeatured: true,
      categoryId: amplifiersCategory.id,
      specs: JSON.stringify({
        "TUBE CONFIGURATION": "4x KT150, 2x 12AU7",
        "POWER OUTPUT": "150W per channel",
        "TOTAL HARMONIC DISTORTION": "< 0.05%",
        "INPUTS": "3x RCA, 2x XLR Balanced",
        "WEIGHT": "28kg",
        "DIMENSIONS": "45cm x 38cm x 22cm"
      }),
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzPLeL_fNkS4MHyjESaApTR8NZmokCUQZxNBhmCqGx77-rdCXm0p1r1juCmXIfHxrnDCRpzQZZ3xJJsvVRPKMQuNo1dav5A24L0QPPbsbNRDLRV8r9pqBdb8a3k6aNaERiFpCN7Cea40SEc5likqo2z5MmkB53Z9eQ_msu34GpfW8-9lC0MqZjGeJ5A5QkfiPEMYp2lp2YqfgrGvuwRSoAQ4Ai6THt3XpoO1f6OjPcTo1e64QhaT8BHNnJg2Tcd2PYrgjuV_wdTpo"
    },
    {
      name: "Vacuum Master Amp",
      slug: "vacuum-master-amp",
      description: "Reference-grade tube amplification with hand-wound transformers and pure silver internal wiring.",
      price: 8200.00,
      brand: "Aura",
      stock: 6,
      isFeatured: false,
      categoryId: amplifiersCategory.id,
      specs: JSON.stringify({
        "TUBE CONFIGURATION": "4x KT88, 2x 12AX7",
        "POWER OUTPUT": "100W per channel",
        "TOTAL HARMONIC DISTORTION": "< 0.1%",
        "INPUTS": "2x RCA, 1x XLR Balanced",
        "WEIGHT": "24kg",
        "DIMENSIONS": "42cm x 35cm x 20cm"
      }),
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0tusR3YOw6Ym-te8NuXKRCCPvd5cxhaVrp1Z2WjpDCNaEypGRE1uVZURzcUDIQvymSPIT986ywZ1XIoOcq68zbp7awuk9CB9tqQ6Pl3e311Ys7A8x4C8uCMvVuaKrwWxKGqQ0HKobSW8ZIrS0QtnOy6cc_LDyXdOZFJEUFAaHE7MiRtFvvi4kvARSNidt-ojB2xF7yLYMZjI1KKV_yMD-WRg34VZx6yg07K69hVwP15mC6ZzCAbLw_7N6Je80J5EDgzt1lXE0FyA"
    },
    {
      name: "Orbit V3 Platter",
      slug: "orbit-v3-platter",
      description: "Magnetic levitation bearing system for absolute silence and rotational stability.",
      price: 6200.00,
      brand: "Aura",
      stock: 5,
      isFeatured: false,
      categoryId: turntablesCategory.id,
      specs: JSON.stringify({
        "DRIVE SYSTEM": "Direct Drive, Magnetic Levitation",
        "PLATTER": "8kg Brushed Steel",
        "TONEARM": "9\" Carbon Fiber",
        "SPEEDS": "33-1/3 RPM, 45 RPM",
        "DIMENSIONS": "48cm x 40cm x 15cm",
        "WEIGHT": "18kg"
      }),
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3EWlC44YeWj3fLTTVEnkqsTdJl9ESnKucTzO83D9T0-5gNNeiff2TJOouPnPTws8BWeaSIyfq8fJqebPt6yGtcq7pYaisdMWjQAoISBv0_C_lBSKW5rZT6eJ0jleX0uXc_og_ultV5giONoJOvmNI8HaTYKRafPggimVsm3Ir8ywIn0wy97A0KT8w_2aFJ0nXuoJRROrfqCzM_Pwr83KPcn9YCepwZX9hyni29ttPC0S8PPbFhjC_d7sFnUqGNrSwFuH0NDZwvs8"
    },
    {
      name: "Command Core",
      slug: "command-core",
      description: "Universal interface for Aura ecosystem with haptic feedback and encrypted mesh control.",
      price: 1150.00,
      brand: "Aura",
      stock: 20,
      isFeatured: false,
      categoryId: accessoriesCategory.id,
      specs: JSON.stringify({
        "SCREEN": "Minimalist OLED Touch Screen",
        "CASING": "Sandblasted Aluminum",
        "CONNECTIVITY": "Encrypted Mesh, Bluetooth 5.3",
        "BATTERY": "Up to 30 days rechargeable",
        "DIMENSIONS": "12cm x 6cm x 1.2cm",
        "WEIGHT": "150g"
      }),
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfiBlharM4IBX3TWZ6oeeoWpRoRe9dV5rG2r6EWY8IwKdAjWkk38LeBM8LeRvE0C4qcNzflSvWHOnJ_VjAnyAreNyfgWN-vbPi2EpDK_tsMf9bwVb6iQWK8URdmQjZ9hk3AGNHq5gLCsN0sXbcHM5BDtV9D9v5AlcNFdNWCRs3kZKdFoHmnARBxgMocV26sZ89QcPM-bRtJ46xf-TTbked_ur0pu7relej2f4VrAte8CRiUUQPBzWucdYuW3mTMnzn_H6hViXISV4"
    }
  ];

  function get4KImageUrl(url) {
    if (!url) return "";
    if (url.includes("lh3.googleusercontent.com")) {
      const base = url.split("=")[0];
      return `${base}=s0`;
    }
    return url;
  }

  for (const prod of products) {
    const { imageUrl, ...prodData } = prod;
    const createdProduct = await prisma.product.create({
      data: prodData
    });
    
    await prisma.productImage.create({
      data: {
        url: get4KImageUrl(imageUrl),
        productId: createdProduct.id
      }
    });
    console.log(`Product ${createdProduct.name} seeded.`);
  }

  // Seed default settings
  await prisma.setting.createMany({
    data: [
      { key: "site_name", value: "AURA | Luxe Audio" },
      { key: "contact_email", value: "concierge@aurashowroom.com" },
      { key: "showroom_address", value: "AURA Private Showroom, Milan, Italy" }
    ]
  });

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
