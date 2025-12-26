import React from "react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import "./StatCard.css";

const StatCard = ({ title, value, trend, trendLabel, icon, neutral }) => {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-header">
        <h3>{title}</h3>
      </div>
      <div className="stat-value">{value}</div>

      {trend !== undefined && (
        <div className="stat-trend">
          <span
            className={`trend-text ${
              neutral ? "neutral" : isPositive ? "positive" : "negative"
            }`}
          >
            {isPositive ? (
              <ArrowUp size={12} className="trend-icon" />
            ) : isNegative ? (
              <ArrowDown size={12} className="trend-icon" />
            ) : (
              <Minus size={12} className="trend-icon" />
            )}
            {Math.abs(trend)}%
          </span>
          <span className="trend-label">
            {trendLabel || "vs previous period"}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
