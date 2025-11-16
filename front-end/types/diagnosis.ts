import { DiagnosisHistoryItem } from "@/services/DiagnosisService";

// UI-friendly diagnosis item for displaying in lists
export interface DiagnosisItem {
  id: string;
  plantName: string;
  disease: string;
  severity: "High" | "Medium" | "Low" | "Healthy";
  severityColor: string;
  confidence: string; // e.g., "87%"
  confidenceColor: string;
  date: string; // e.g., "Today, 2:30 PM"
  sortDate: string; // ISO date string for sorting
  imageUri: string;
}

export const mapSeverityToSimple = (
  severity: "Healthy" | "Low Severity" | "Medium Severity" | "High Severity"
): "High" | "Medium" | "Low" | "Healthy" => {
  switch (severity) {
    case "High Severity":
      return "High";
    case "Medium Severity":
      return "Medium";
    case "Low Severity":
      return "Low";
    case "Healthy":
      return "Healthy";
    default:
      return "Medium";
  }
};

export const getSeverityConfig = (
  severity: "High" | "Medium" | "Low" | "Healthy"
): { color: string; confidenceColor: string } => {
  switch (severity) {
    case "Healthy":
      return { color: "#4CAF50", confidenceColor: "#4CAF50" };
    case "High":
      return { color: "#FB2C36", confidenceColor: "#FB2C36" };
    case "Medium":
      return { color: "#FF6900", confidenceColor: "#FF6900" };
    case "Low":
      return { color: "#F0B100", confidenceColor: "#D08700" };
    default:
      return { color: "#FF6900", confidenceColor: "#FF6900" };
  }
};

export const formatRelativeDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return "Just now";
  } else if (diffMins < 60) {
    return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
  } else if (diffHours < 24) {
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `Today, ${time}`;
  } else if (diffDays === 1) {
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `Yesterday, ${time}`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
};

// Convert DiagnosisHistoryItem from backend to DiagnosisItem for UI
export const convertToDiagnosisItem = (
  backendData: DiagnosisHistoryItem
): DiagnosisItem => {
  const simpleSeverity = mapSeverityToSimple(backendData.severity);
  const severityConfig = getSeverityConfig(simpleSeverity);
  const confidencePercent = Math.round(backendData.confidence_score * 100);

  return {
    id: backendData.id.toString(),
    plantName: backendData.plant_name || "Unknown Plant",
    disease: backendData.issue_detected,
    severity: simpleSeverity,
    severityColor: severityConfig.color,
    confidence: `${confidencePercent}%`,
    confidenceColor: severityConfig.confidenceColor,
    date: formatRelativeDate(backendData.created_at),
    sortDate: backendData.created_at,
    imageUri: backendData.image_url || "",
  };
};
