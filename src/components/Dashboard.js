import React, { useState, useEffect } from "react";
import ChartComponent from "./ChartComponent";
import axios from "axios";

const tabs = ["Summary", "Chart", "Statistics", "Analysis", "Settings"];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Chart");
  const [selectedRange, setSelectedRange] = useState(7);
  const [totalValue, setTotalValue] = useState(null);
  const [percentageChange, setPercentageChange] = useState(null);
  const [change, setChange] = useState(null);
  const [changeValue, setChangeValue] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const url =
        selectedRange === "max"
          ? "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=max"
          : `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${selectedRange}`;

      try {
        const response = await axios.get(url);
        const prices = response.data.prices;

        const latestPrice = prices[prices.length - 1][1];
        const initialPrice = prices[0][1];

        const priceChange = latestPrice - initialPrice;
        const percentage = ((priceChange / initialPrice) * 100).toFixed(2);

        setTotalValue(latestPrice.toLocaleString("en-US"));
        setChangeValue(priceChange);
        setChange(priceChange.toLocaleString("en-US"));
        setPercentageChange(`${percentage}%`);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [selectedRange]);

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ textAlign: "left", marginBottom: "20px" }}>
        <div style={{ fontSize: "36px", fontWeight: "bold", color: "#454242" }}>
          {totalValue ? `${totalValue} USD` : "Loading..."}
        </div>
        <div
          style={{
            fontSize: "18px",
            color: changeValue >= 0 ? "#4caf50" : "#f44336",
          }}
        >
          {change ? `${change} (${percentageChange})` : "Loading..."}
        </div>
      </div>

      <nav style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 15px",
              border: "none",
              borderBottom: activeTab === tab ? "3px solid #4f46e5" : "none",
              background: "transparent",
              color: activeTab === tab ? "#4f46e5" : "#000",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      {activeTab === "Chart" && (
        <ChartComponent
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
        />
      )}

      <div>
        {activeTab === "Summary" && <div>Summary Content</div>}
        {activeTab === "Statistics" && <div>Statistics Content</div>}
        {activeTab === "Analysis" && <div>Analysis Content</div>}
        {activeTab === "Settings" && <div>Settings Content</div>}
      </div>
    </div>
  );
};

export default Dashboard;
