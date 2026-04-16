import React from 'react';
import { AlertCircle, CheckCircle2, User, Users, UsersRound } from 'lucide-react';
import './Badge.css';

export function Badge({ type, status }) {
  if (type === 'availability') {
    const isAvailable = status === 'available';
    const isLimited = status === 'limited';
    const isSoldOut = status === 'soldOut';
    
    let text = 'Available';
    let className = 'badge-available';
    let Icon = CheckCircle2;
    
    if (isLimited) {
      text = 'Limited';
      className = 'badge-limited';
      Icon = AlertCircle;
    } else if (isSoldOut) {
      text = 'Sold Out';
      className = 'badge-soldOut';
      Icon = AlertCircle;
    }

    return (
      <span className={`badge ${className}`}>
        <Icon size={14} className="badge-icon" />
        {text}
      </span>
    );
  }

  if (type === 'crowd') {
    const isLow = status === 'low';
    const isMedium = status === 'medium';
    const isHigh = status === 'high';
    
    let text = 'Low';
    let className = 'badge-crowd-low';
    let Icon = User;
    
    if (isMedium) {
      text = 'Medium';
      className = 'badge-crowd-medium';
      Icon = Users;
    } else if (isHigh) {
      text = 'Peak Hours';
      className = 'badge-crowd-high';
      Icon = UsersRound;
    }

    return (
      <span className={`badge ${className}`}>
        <Icon size={14} className="badge-icon" />
        {text}
      </span>
    );
  }

  return null;
}
