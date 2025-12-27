import React from "react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import "./StatCard.css";

const StatCard = ({ title, value, trend, trendLabel, icon, neutral }) => {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <div className="all_stat-card">
      <div className="all_stat-icon">{icon}</div>
      <div className="all_stat-header">
        <h3>{title}</h3>
      </div>
      <div className="all_stat-value">{value}</div>

      {trend !== undefined && (
        <div className="all_stat-trend">
          <span
            className={`all_trend-text ${
              neutral ? "neutral" : isPositive ? "positive" : "negative"
            }`}
          >
            {isPositive ? (
              <ArrowUp size={12} className="all_trend-icon" />
            ) : isNegative ? (
              <ArrowDown size={12} className="all_trend-icon" />
            ) : (
              <Minus size={12} className="all_trend-icon" />
            )}
            {Math.abs(trend)}%
          </span>
          <span className="all_trend-label">
            {trendLabel || "vs previous period"}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
