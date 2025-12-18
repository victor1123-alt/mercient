// CheckoutPage.tsx
import React, { useEffect, useState } from "react";
import { useCart } from "../context/CardContext";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import { Country, State, City } from "country-state-city";

/**
 * NOTE:
 * - Install: npm i country-state-city
 * - This component expects an API:
 *    GET  /api/shipping-prices       -> returns [{ state: "Lagos", price: 2500 }, ...]
 *    POST /api/create-payment        -> create payment (you already had this)
 */

const CheckoutPage: React.FC = () => {
  const { cartItems, totalAmount, clearCart } = useCart();

  // Shipping options from admin/backend
  const [shippingOptions, setShippingOptions] = useState<
    { state: string; price: number }[]
  >([]);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [selectedShippingState, setSelectedShippingState] = useState<string>("");
  const [shippingFee, setShippingFee] = useState<number>(0);

  // Delivery modal
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: "",
    email: "",
    phoneCode: "",
    phone: "",
    countryIso: "",
    countryName: "",
    stateIso: "",
    stateName: "",
    cityName: "",
  });

  // Local UI helpers (phone code list from Country object)
  const allCountries = Country.getAllCountries();

  // Final total includes shipping fee
  const finalTotal = (Number(totalAmount) || 0) + (shippingFee || 0);

  // Fetch shipping options from backend (admin-controlled)
  useEffect(() => {
    const loadShipping = async () => {
      try {
        const res = await fetch("/api/shipping-prices");
        if (!res.ok) throw new Error("Failed to load shipping prices");
        const data = await res.json();
        setShippingOptions(data);
      } catch (err) {
        console.error("Error loading shipping options:", err);
        // Optional fallback: show common states if backend unreachable
        setShippingOptions([
          { state: "Lagos", price: 2500 },
          { state: "Abuja (FCT)", price: 3500 },
          { state: "Rivers", price: 3500 },
          { state: "Kano", price: 4000 },
        ]);
      }
    };
    loadShipping();
  }, []);

  // Payment handler (sends cart + delivery + shipping to backend)
  const handleCheckout = async () => {
    // basic validation
    if (!deliveryInfo.fullName || !deliveryInfo.phone || !deliveryInfo.countryName) {
      alert("Please provide delivery information before proceeding.");
      return;
    }

    try {
      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalTotal,
          items: cartItems,
          shipping: {
            state: selectedShippingState,
            fee: shippingFee,
          },
          delivery: deliveryInfo,
        }),
      });

      const data = await res.json();
      if (data.payment_url) {
        // redirect to payment provider
        window.location.href = data.payment_url;
      } else {
        console.error("create-payment response:", data);
        alert("Payment URL not returned by backend.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Try again.");
    }
  };

  // When user picks a shipping state from modal
  const onSelectShipping = (opt: { state: string; price: number }) => {
    setSelectedShippingState(opt.state);
    setShippingFee(opt.price);
    setShowShippingModal(false);
  };

  // Save delivery data from modal
  const onSaveDelivery = (data: typeof deliveryInfo) => {
    setDeliveryInfo(data);
    setShowDeliveryModal(false);
  };

  return (
    <>
      <Navbar />
      <Hero
        title="Finalize Your Order"
        subtitle="Please review your cart, add delivery details, and complete your purchase securely."
      />

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT: Delivery Details */}
          <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Delivery Details</h2>

            <button
              onClick={() => setShowDeliveryModal(true)}
              className="bg-primary text-white py-2 px-4 rounded-lg mb-4 hover:opacity-90"
            >
              Add Delivery Details
            </button>

            {deliveryInfo.fullName ? (
              <div className="mb-4">
                <p className="font-semibold">{deliveryInfo.fullName}</p>
                <p className="text-sm">{deliveryInfo.email}</p>
                <p className="text-sm">
                  {deliveryInfo.phoneCode} {deliveryInfo.phone}
                </p>
                <p className="text-sm">
                  {deliveryInfo.countryName}
                  {deliveryInfo.stateName ? `, ${deliveryInfo.stateName}` : ""}{" "}
                  {deliveryInfo.cityName ? `, ${deliveryInfo.cityName}` : ""}
                </p>
              </div>
            ) : (
              <p className="mb-4 text-sm text-gray-600">No delivery details yet.</p>
            )}

            <h3 className="text-lg font-semibold mb-2">Shipping Method</h3>

            <button
              onClick={() => setShowShippingModal(true)}
              className="w-full bg-primary text-white py-2 rounded-lg mb-3 hover:opacity-90"
            >
              Select Shipping Location
            </button>

            {selectedShippingState ? (
              <p className="font-semibold mb-2">
                Selected: {selectedShippingState} — ₦{shippingFee.toLocaleString()}
              </p>
            ) : (
              <p className="text-sm text-gray-600 mb-2">No shipping location selected.</p>
            )}

            <textarea
              placeholder="Any note to the merchant..."
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 mb-4 resize-none dark:bg-gray-700 dark:text-white"
              rows={4}
            />
          </div>

          {/* RIGHT: Orders */}
          <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>

            <div className="flex flex-col gap-3 mb-4 max-h-96 overflow-y-auto">
              {cartItems.length === 0 && <p>No items in cart.</p>}

              {cartItems.map((item, index) => (
                <div
                  key={item.id ?? index}
                  className="flex justify-between items-center border-b border-gray-300 dark:border-gray-600 pb-2"
                >
                  <span>
                    {item.name} {item.size ? `(${item.size})` : ""} × {item.quantity ?? 1}
                  </span>
                  <span className="font-semibold">
                    ₦{((item.price ?? 0) * (item.quantity ?? 1)).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <p className="text-lg font-semibold">Subtotal: ₦{Number(totalAmount).toLocaleString()}</p>
              <p className="text-lg font-semibold">Shipping: ₦{shippingFee.toLocaleString()}</p>
              <p className="text-xl font-bold mt-2">Total: ₦{finalTotal.toLocaleString()}</p>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:opacity-90"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- Shipping Modal ---------------- */}
      {showShippingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-11/12 max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Choose Shipping Location</h2>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {shippingOptions.map((opt) => (
                <button
                  key={opt.state}
                  onClick={() => onSelectShipping(opt)}
                  className="w-full text-left p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {opt.state} — ₦{opt.price.toLocaleString()}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowShippingModal(false)}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ---------------- Delivery Modal ---------------- */}
      {showDeliveryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-2xl shadow-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                placeholder="Full Name"
                className="border rounded-lg p-2 dark:bg-gray-700 dark:text-white"
                value={deliveryInfo.fullName}
                onChange={(e) =>
                  setDeliveryInfo({ ...deliveryInfo, fullName: e.target.value })
                }
              />

              <input
                placeholder="Email"
                className="border rounded-lg p-2 dark:bg-gray-700 dark:text-white"
                value={deliveryInfo.email}
                onChange={(e) =>
                  setDeliveryInfo({ ...deliveryInfo, email: e.target.value })
                }
              />

              {/* Phone: country phone code selector + number */}
              <div className="flex gap-2">
                <select
                  className="border rounded-lg p-2 dark:bg-gray-700 dark:text-white"
                  value={deliveryInfo.phoneCode}
                  onChange={(e) =>
                    setDeliveryInfo({ ...deliveryInfo, phoneCode: e.target.value })
                  }
                >
                  <option value="">Code</option>
                  {allCountries.map((c) => (
                    <option key={c.isoCode} value={c.phonecode ?? c.callingCode?.[0] ?? ""}>
                      {c.flag ?? c.isoCode} {c.name} ({c.callingCode?.[0] ?? ""})
                    </option>
                  ))}
                </select>

                <input
                  placeholder="Phone number"
                  className="border rounded-lg p-2 flex-1 dark:bg-gray-700 dark:text-white"
                  value={deliveryInfo.phone}
                  onChange={(e) =>
                    setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })
                  }
                />
              </div>

              {/* Country */}
              <select
                className="border rounded-lg p-2 dark:bg-gray-700 dark:text-white"
                value={deliveryInfo.countryIso}
                onChange={(e) => {
                  const iso = e.target.value;
                  const c = Country.getCountryByCode(iso);
                  setDeliveryInfo({
                    ...deliveryInfo,
                    countryIso: iso,
                    countryName: c?.name || "",
                    stateIso: "",
                    stateName: "",
                    cityName: "",
                  });
                }}
              >
                <option value="">Select Country</option>
                {allCountries.map((c) => (
                  <option key={c.isoCode} value={c.isoCode}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* State (depends on country) */}
              <select
                className="border rounded-lg p-2 dark:bg-gray-700 dark:text-white"
                value={deliveryInfo.stateIso}
                onChange={(e) => {
                  const sIso = e.target.value;
                  const stateObj = State.getStateByCodeAndCountry(
                    sIso,
                    deliveryInfo.countryIso
                  );
                  setDeliveryInfo({
                    ...deliveryInfo,
                    stateIso: sIso,
                    stateName: stateObj?.name ?? "",
                    cityName: "",
                  });
                }}
                disabled={!deliveryInfo.countryIso}
              >
                <option value="">{deliveryInfo.countryIso ? "Select State" : "Select Country first"}</option>
                {deliveryInfo.countryIso &&
                  State.getStatesOfCountry(deliveryInfo.countryIso).map((s) => (
                    <option key={s.isoCode} value={s.isoCode}>
                      {s.name}
                    </option>
                  ))}
              </select>

              {/* City (depends on state+country) */}
              <select
                className="border rounded-lg p-2 dark:bg-gray-700 dark:text-white"
                value={deliveryInfo.cityName}
                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, cityName: e.target.value })}
                disabled={!deliveryInfo.stateIso}
              >
                <option value="">{deliveryInfo.stateIso ? "Select City" : "Select State first"}</option>
                {deliveryInfo.countryIso &&
                  deliveryInfo.stateIso &&
                  City.getCitiesOfState(deliveryInfo.countryIso, deliveryInfo.stateIso).map((ct) => (
                    <option key={ct.name} value={ct.name}>
                      {ct.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => onSaveDelivery(deliveryInfo)}
                className="bg-primary text-white py-2 px-4 rounded-lg"
              >
                Save & Close
              </button>

              <button
                onClick={() => setShowDeliveryModal(false)}
                className="bg-red-600 text-white py-2 px-4 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckoutPage;
