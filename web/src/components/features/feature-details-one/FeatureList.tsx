import type { JSX } from "react";
import { type Tour } from "../../../api/tours";

interface FeatureListProps {
  tour: Tour;
}

const FeatureList = ({ tour }: FeatureListProps) => {
  // Build single line text with all information
  const parts: string[] = [];

  if (tour.duration) {
    parts.push(`Duration: ${tour.duration}`);
  }

  if (tour.type) {
    parts.push(`Type: ${tour.type}`);
  }

  if (tour.groupSize) {
    parts.push(`Group Size: ${tour.groupSize}`);
  }

  if (tour.languages && tour.languages.length > 0) {
    parts.push(`Languages: ${tour.languages.join(", ")}`);
  } else if (tour.packages && tour.packages.length > 0) {
    const languages = [...new Set(tour.packages.map(pkg => pkg.language))];
    if (languages.length > 0) {
      parts.push(`Languages: ${languages.join(", ")}`);
    }
  }

  if (tour.availableTimes && Array.isArray(tour.availableTimes) && tour.availableTimes.length > 0) {
    parts.push(`Available Times: ${tour.availableTimes.join(", ")}`);
  }

  const singleLineText = parts.length > 0 ? parts.join(" • ") : "No information available";

  return (
    <div className="tg-tour-details-feature-list-single-line" style={{ 
      padding: '15px 0',
      fontSize: '15px',
      lineHeight: '1.6',
      color: '#666'
    }}>
      {singleLineText}
    </div>
  );
}

export default FeatureList
