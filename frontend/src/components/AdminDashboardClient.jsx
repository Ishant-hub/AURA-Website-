"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, ClipboardList, ShieldAlert, LogOut, Trash2, CheckSquare, Square, Plus, X } from "lucide-react";

export default function AdminDashboardClient({
  initialOrders,
  initialProducts,
  categories,
  inquiries,
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState(initialOrders);
  const [products, setProducts] = useState(initialProducts);
  const [inquiryList, setInquiryList] = useState(inquiries);

  // Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    slug: "",
    brand: "Aura",
    description: "",
    price: "",
    stock: "5",
    categoryId: categories[0]?.id || "",
    imageUrl: "",
    specs: {
      "FREQUENCY RANGE": "20Hz - 20kHz",
      "CONNECTIVITY": "XLR Balanced",
      "WEIGHT": "15kg",
    },
  });

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setNewProduct({ ...newProduct, name, slug });
  };

  const handleFormChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleSpecChange = (key, val) => {
    setNewProduct({
      ...newProduct,
      specs: {
        ...newProduct.specs,
        [key]: val,
      },
    });
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Create Product Action
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!newProduct.name || !newProduct.slug || !newProduct.price || !newProduct.categoryId) {
      setFormError("Please fill out all required fields.");
      return;
    }

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          specs: JSON.stringify(newProduct.specs),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFormSuccess("Product added successfully!");
        setProducts([data.product, ...products]);
        // Reset form
        setNewProduct({
          name: "",
          slug: "",
          brand: "Aura",
          description: "",
          price: "",
          stock: "5",
          categoryId: categories[0]?.id || "",
          imageUrl: "",
          specs: {
            "FREQUENCY RANGE": "20Hz - 20kHz",
            "CONNECTIVITY": "XLR Balanced",
            "WEIGHT": "15kg",
          },
        });
        setTimeout(() => {
          setShowAddForm(false);
          setFormSuccess("");
        }, 1500);
      } else {
        setFormError(data.message || "Failed to add product.");
      }
    } catch (err) {
      console.error(err);
      setFormError("A network error occurred.");
    }
  };

  // Delete Product Action
  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete product.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Update Order Status Action
  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setOrders(
          orders.map((o) => (o.id === id ? { ...o, status } : o))
        );
      } else {
        alert("Failed to update status.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Order Action
  const handleDeleteOrder = async (id) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setOrders(orders.filter((o) => o.id !== id));
      } else {
        alert("Failed to delete order.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle Inquiry Resolved
  const handleToggleInquiry = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isResolved: !currentStatus }),
      });

      if (res.ok) {
        setInquiryList(
          inquiryList.map((inq) =>
            inq.id === id ? { ...inq, isResolved: !currentStatus } : inq
          )
        );
      } else {
        alert("Failed to update inquiry.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="mt-32 px-4 md:px-margin-desktop max-w-container-max mx-auto min-h-screen pb-24">
      {/* Dashboard Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-white/5 pb-8">
        <div>
          <span className="font-label-caps text-xs text-primary tracking-[0.4em] font-semibold block mb-2 uppercase">
            REGISTRY MANAGEMENT
          </span>
          <h1 className="font-display-lg text-3xl text-white font-extralight tracking-tight">
            Aura Showroom Concierge Panel
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 border border-white/10 hover:border-error hover:text-error px-5 py-3 rounded-xl font-label-caps text-xs tracking-widest font-bold transition-colors uppercase cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> LOG OUT
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/5 mb-10 pb-1">
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 font-label-caps text-xs tracking-widest font-bold pb-4 border-b-2 transition-all ${
            activeTab === "orders"
              ? "text-primary border-primary"
              : "text-on-surface-variant/50 border-transparent hover:text-on-surface-variant"
          }`}
        >
          <ClipboardList className="w-4 h-4" /> ORDERS ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 font-label-caps text-xs tracking-widest font-bold pb-4 border-b-2 transition-all ${
            activeTab === "products"
              ? "text-primary border-primary"
              : "text-on-surface-variant/50 border-transparent hover:text-on-surface-variant"
          }`}
        >
          <Package className="w-4 h-4" /> PRODUCTS ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("inquiries")}
          className={`flex items-center gap-2 font-label-caps text-xs tracking-widest font-bold pb-4 border-b-2 transition-all ${
            activeTab === "inquiries"
              ? "text-primary border-primary"
              : "text-on-surface-variant/50 border-transparent hover:text-on-surface-variant"
          }`}
        >
          <ShieldAlert className="w-4 h-4" /> SHOWROOM BOOKINGS ({inquiryList.length})
        </button>
      </div>

      {/* ORDERS TAB */}
      {activeTab === "orders" && (
        <section className="glass-panel rounded-2xl overflow-hidden shadow-2xl border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-light">
              <thead className="bg-white/5 font-label-caps text-[10px] text-primary tracking-widest border-b border-white/10">
                <tr>
                  <th className="p-6">ORDER NUMBER</th>
                  <th className="p-6">RECIPIENT</th>
                  <th className="p-6">DATE</th>
                  <th className="p-6">AMOUNT</th>
                  <th className="p-6">DELIVERY STATUS</th>
                  <th className="p-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-on-surface-variant/60">
                      No orders recorded in the registry database.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/2 transition-colors">
                      <td className="p-6 font-mono text-white font-medium">{order.orderNumber}</td>
                      <td className="p-6">
                        <div className="font-normal text-white">{order.name}</div>
                        <div className="text-[10px] text-on-surface-variant/60">{order.email}</div>
                      </td>
                      <td className="p-6 text-on-surface-variant/80">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-6 font-mono text-white">
                        ${order.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-6">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-1.5 focus:border-primary focus:outline-none transition-colors text-white font-label-caps text-[9px] tracking-widest font-bold"
                        >
                          <option value="PLACED">PLACED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="p-6 text-right">
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-on-surface-variant/40 hover:text-error transition-colors p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === "products" && (
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display-lg text-lg text-white font-light">Inventory Listings</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-primary text-on-primary px-5 py-3 rounded-xl font-label-caps text-xs tracking-widest font-bold transition-all hover:scale-[1.01] active:scale-95 uppercase cursor-pointer"
            >
              {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showAddForm ? "CLOSE FORM" : "ADD PRODUCT"}
            </button>
          </div>

          {/* Add Product Form Panel */}
          {showAddForm && (
            <div className="glass-panel p-8 rounded-2xl border-white/10 shadow-2xl relative">
              <h3 className="font-label-caps text-xs text-primary tracking-widest font-bold mb-6 uppercase">
                NEW PRODUCT DETAILS
              </h3>
              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="font-label-caps text-[9px] text-on-surface-variant/60 tracking-wider font-bold block mb-1">
                      PRODUCT NAME *
                    </label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={handleNameChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-colors text-white text-xs font-medium"
                      placeholder="e.g. Acoustic Horizon Z1"
                    />
                  </div>
                  <div>
                    <label className="font-label-caps text-[9px] text-on-surface-variant/60 tracking-wider font-bold block mb-1">
                      SLUG (AUTO-GENERATED) *
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={newProduct.slug}
                      onChange={handleFormChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-colors text-white text-xs font-mono"
                      placeholder="acoustic-horizon-z1"
                    />
                  </div>
                  <div>
                    <label className="font-label-caps text-[9px] text-on-surface-variant/60 tracking-wider font-bold block mb-1">
                      BRAND *
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={newProduct.brand}
                      onChange={handleFormChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-colors text-white text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-label-caps text-[9px] text-on-surface-variant/60 tracking-wider font-bold block mb-1">
                      UNIT PRICE ($ USD) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={newProduct.price}
                      onChange={handleFormChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-colors text-white text-xs font-medium"
                      placeholder="12999"
                    />
                  </div>
                  <div>
                    <label className="font-label-caps text-[9px] text-on-surface-variant/60 tracking-wider font-bold block mb-1">
                      INITIAL STOCK *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={newProduct.stock}
                      onChange={handleFormChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-colors text-white text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-label-caps text-[9px] text-on-surface-variant/60 tracking-wider font-bold block mb-1">
                      COLLECTION / CATEGORY *
                    </label>
                    <select
                      name="categoryId"
                      value={newProduct.categoryId}
                      onChange={handleFormChange}
                      className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-colors text-white text-xs font-medium"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-label-caps text-[9px] text-on-surface-variant/60 tracking-wider font-bold block mb-1">
                    PRODUCT DESCRIPTION *
                  </label>
                  <textarea
                    name="description"
                    value={newProduct.description}
                    onChange={handleFormChange}
                    rows={3}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-colors text-white text-xs resize-none"
                    placeholder="Describe the acoustic architecture and aesthetic craftsmanship..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-label-caps text-[9px] text-on-surface-variant/60 tracking-wider font-bold block mb-1">
                      IMAGE LINK / URL
                    </label>
                    <input
                      type="text"
                      name="imageUrl"
                      value={newProduct.imageUrl}
                      onChange={handleFormChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-colors text-white text-xs"
                      placeholder="https://lh3.googleusercontent.com/..."
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="font-label-caps text-[8px] text-on-surface-variant/60 tracking-wider font-bold block mb-1">
                        WEIGHT SPEC
                      </label>
                      <input
                        type="text"
                        value={newProduct.specs.WEIGHT}
                        onChange={(e) => handleSpecChange("WEIGHT", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-colors text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-label-caps text-[8px] text-on-surface-variant/60 tracking-wider font-bold block mb-1">
                        FREQUENCY RANGE
                      </label>
                      <input
                        type="text"
                        value={newProduct.specs["FREQUENCY RANGE"]}
                        onChange={(e) => handleSpecChange("FREQUENCY RANGE", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-colors text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-label-caps text-[8px] text-on-surface-variant/60 tracking-wider font-bold block mb-1">
                        CONNECTIVITY
                      </label>
                      <input
                        type="text"
                        value={newProduct.specs.CONNECTIVITY}
                        onChange={(e) => handleSpecChange("CONNECTIVITY", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-colors text-white text-xs"
                      />
                    </div>
                  </div>
                </div>

                {formError && <p className="text-error text-xs font-semibold">{formError}</p>}
                {formSuccess && <p className="text-primary text-xs font-semibold">{formSuccess}</p>}

                <button
                  type="submit"
                  className="bg-primary text-on-primary px-8 py-3.5 rounded-xl font-label-caps text-xs tracking-widest font-bold hover:scale-[1.01] active:scale-95 transition-all shadow-lg hover:shadow-primary/20 uppercase"
                >
                  SAVE NEW PRODUCT
                </button>
              </form>
            </div>
          )}

          <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-light">
                <thead className="bg-white/5 font-label-caps text-[10px] text-primary tracking-widest border-b border-white/10">
                  <tr>
                    <th className="p-6">PRODUCT</th>
                    <th className="p-6">BRAND</th>
                    <th className="p-6">COLLECTION</th>
                    <th className="p-6">PRICE</th>
                    <th className="p-6">STOCK LEVEL</th>
                    <th className="p-6 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-white/2 transition-colors">
                      <td className="p-6 flex items-center gap-4">
                        <div className="w-10 h-10 glass-panel rounded-lg flex items-center justify-center p-1 bg-white/5 flex-shrink-0">
                          <img
                            src={product.images?.[0]?.url || "https://lh3.googleusercontent.com/aida-public/AB6AXuDTQvM7clTjbV9GXGsgT2LlH8V-R6p6eGDHt93Y6BGWFd6-b-A2DYNg2p1nNihAJ8BNukOsaKKU5GWLat5378nSFLIHUSyChj9nSmWkvJOUxn_ElPAf2xc5MaGzZOU8uTK9s8wyD4ab32n8SelqVqbvL8Mh07LtLb-IkjeHL7_mQPRmajrjm5pK-D8Aq-aHjIalfhSFhr5fBAGenKuG1xqIYC-o8W6jcIe0V1dnJj4cfX_g1olFbio4yCUxOq_e48SlT7dMa03_bXI"}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div>
                          <div className="font-normal text-white">{product.name}</div>
                          <div className="text-[10px] text-on-surface-variant/60 font-mono">{product.slug}</div>
                        </div>
                      </td>
                      <td className="p-6 font-semibold text-white uppercase tracking-wider">{product.brand}</td>
                      <td className="p-6 text-on-surface-variant/80 font-label-caps text-[10px] tracking-wider">
                        {product.category?.name || "UNCLASSIFIED"}
                      </td>
                      <td className="p-6 font-mono text-white">${product.price.toLocaleString()}</td>
                      <td className="p-6">
                        {product.stock === 0 || product.isOutOfStock ? (
                          <span className="text-[10px] font-label-caps text-error tracking-wider uppercase font-semibold">
                            SOLD OUT
                          </span>
                        ) : (
                          <span className="text-white font-normal">{product.stock} units</span>
                        )}
                      </td>
                      <td className="p-6 text-right">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-on-surface-variant/40 hover:text-error transition-colors p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* SHOWROOM BOOKINGS TAB */}
      {activeTab === "inquiries" && (
        <section className="glass-panel rounded-2xl overflow-hidden shadow-2xl border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-light">
              <thead className="bg-white/5 font-label-caps text-[10px] text-primary tracking-widest border-b border-white/10">
                <tr>
                  <th className="p-6">CLIENT</th>
                  <th className="p-6">CONTACT DETAILS</th>
                  <th className="p-6">MESSAGE / REQUESTS</th>
                  <th className="p-6">DATE</th>
                  <th className="p-6 text-center">RESOLVED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {inquiryList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-on-surface-variant/60">
                      No private showroom bookings recorded.
                    </td>
                  </tr>
                ) : (
                  inquiryList.map((inquiry) => (
                    <tr
                      key={inquiry.id}
                      className={`hover:bg-white/2 transition-colors ${
                        inquiry.isResolved ? "opacity-60" : ""
                      }`}
                    >
                      <td className="p-6 font-normal text-white">{inquiry.name}</td>
                      <td className="p-6">
                        <div className="text-white">{inquiry.phone}</div>
                        <div className="text-[10px] text-on-surface-variant/60">{inquiry.email || "No email"}</div>
                      </td>
                      <td className="p-6 text-on-surface-variant/80 max-w-sm whitespace-pre-wrap leading-relaxed">
                        {inquiry.message}
                      </td>
                      <td className="p-6 text-on-surface-variant/60">
                        {new Date(inquiry.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="p-6 text-center">
                        <button
                          onClick={() => handleToggleInquiry(inquiry.id, inquiry.isResolved)}
                          className={`mx-auto flex items-center justify-center p-1 rounded transition-colors ${
                            inquiry.isResolved
                              ? "text-primary hover:text-white"
                              : "text-on-surface-variant/40 hover:text-primary"
                          }`}
                        >
                          {inquiry.isResolved ? (
                            <CheckSquare className="w-5 h-5" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
