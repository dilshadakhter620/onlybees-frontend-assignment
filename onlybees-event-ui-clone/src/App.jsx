import { useEffect, useState } from "react";
import "./App.css";

const mockEventData = {
  sections: [
    { id: "vip-1", name: "VIP Section A", price: 5000, available: 45, total: 50 },
    { id: "vip-2", name: "VIP Section B", price: 5000, available: 38, total: 50 },
    { id: "premium-1", name: "Premium Section", price: 3500, available: 120, total: 150 },
    { id: "general-1", name: "General Admission A", price: 2000, available: 200, total: 250 },
    { id: "general-2", name: "General Admission B", price: 2000, available: 180, total: 250 },
    { id: "standing", name: "Standing Area", price: 1500, available: 300, total: 400 }
  ]
};

function App() {
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState(null);
  const [selections, setSelections] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://concertsapi.onlybees.in/api/sections/availability");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setEventData(data);
      } catch {
        setEventData(mockEventData);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const updateQty = (id, type) => {
    setSelections(prev => {
      const qty = prev[id] || 0;
      const section = eventData.sections.find(s => s.id === id);
      if (type === "inc" && qty < section.available) return { ...prev, [id]: qty + 1 };
      if (type === "dec" && qty > 0) return { ...prev, [id]: qty - 1 };
      return prev;
    });
  };

  const totalQty = Object.values(selections).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(selections).reduce((sum, [id, qty]) => {
    const sec = eventData?.sections.find(s => s.id === id);
    return sec ? sum + sec.price * qty : sum;
  }, 0);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Loading event details...</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <img
              src="https://onlybees.in/favicon.ico"
              alt="OnlyBees Icon"
              className="header-icon"
            />
            <img
              src="https://concerts.onlybees.in/_next/static/media/OnlyBees_light.3cfb6be4.svg"
              alt="OnlyBees Logo"
              className="header-logo"
            />
          </div>
        </div>
      </header>

      {/* Event Hero */}
      <section className="event-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-poster">
              <img
                src="https://concerts.onlybees.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmohombi_flyer.959f436b.png&w=1080&q=75"
                alt="Event Poster"
              />
            </div>
            <div className="hero-details">
              <h1>Mohombi Live in Shillong</h1>
              <div className="event-info">
                <div className="info-item">
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Saturday, 15th March 2025</span>
                </div>
                <div className="info-item">
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>6:00 PM onwards</span>
                </div>
                <div className="info-item">
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>JN Stadium, Polo Ground, Shillong</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Layout */}
      <section className="venue-layout">
        <div className="container">
          <h2>Venue Layout</h2>
          <div className="venue-image">
            <img
              src="https://concerts.onlybees.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FStage.a5e7e11c.png&w=1920&q=75"
              alt="Venue Layout"
            />
          </div>
        </div>
      </section>

      {/* Ticket Selection */}
      <section className="ticket-selection">
        <div className="container">
          <h2>Select Your Tickets</h2>
          <div className="ticket-grid">
            {eventData.sections.map(section => {
              const qty = selections[section.id] || 0;
              return (
                <div key={section.id} className="ticket-card">
                  <div className="ticket-header">
                    <div>
                      <h3>{section.name}</h3>
                      <p className="ticket-availability">{section.available} of {section.total} available</p>
                    </div>
                    <div>
                      <p className="ticket-price">₹{section.price}</p>
                      <p className="price-label">per ticket</p>
                    </div>
                  </div>

                  <div className="ticket-controls">
                    <button onClick={() => updateQty(section.id, "dec")} disabled={qty === 0}>−</button>
                    <span>{qty}</span>
                    <button onClick={() => updateQty(section.id, "inc")} disabled={qty >= section.available}>+</button>
                  </div>

                  {qty > 0 && (
                    <div className="ticket-subtotal">
                      <span>Subtotal</span>
                      <span>₹{section.price * qty}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Checkout Bar */}
      {totalQty > 0 && (
        <div className="checkout-bar">
          <div className="checkout-content">
            <div className="checkout-summary">
              <div className="summary-item">
                <p className="summary-label">Total Tickets</p>
                <p className="summary-value">{totalQty}</p>
              </div>
              <div className="summary-item">
                <p className="summary-label">Total Amount</p>
                <p className="summary-value-price">₹{totalPrice}</p>
              </div>
            </div>
            <button className="checkout-btn" onClick={() => alert(`Checkout initiated!\nTickets: ${totalQty}\nAmount: ₹${totalPrice}`)}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;