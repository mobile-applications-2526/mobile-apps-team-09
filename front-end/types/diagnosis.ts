export interface DiagnosisItem {
  id: string;
  plantName: string;
  disease: string;
  severity: "High" | "Medium" | "Low";
  severityColor: string;
  confidence: string;
  confidenceColor: string;
  date: string;
  sortDate: string;
  imageUri: string;
}

export const getSeverityConfig = (
  severity: "High" | "Medium" | "Low"
): { color: string; confidenceColor: string } => {
  switch (severity) {
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
