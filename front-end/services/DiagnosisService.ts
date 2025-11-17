import api from "./apiService";

// Backend response from /api/v1/plants/diagnose
export interface DiagnosisAIResponse {
  issue_detected: string;
  confidence_score: number; // 0.0 to 1.0
  severity: "Healthy" | "Low Severity" | "Medium Severity" | "High Severity";
  recommendation: string;
  recovery_watering: string;
  recovery_sunlight: string;
  recovery_air_circulation: string;
  recovery_temperature: string;
}

// Backend response from /api/v1/diagnoses endpoints
export interface DiagnosisHistoryItem {
  id: number;
  user_id: number;
  plant_id: number | null; // Optional for standalone diagnoses
  plant_name?: string;
  issue_detected: string;
  confidence_score: number; // 0.0 to 1.0
  severity: "Healthy" | "Low Severity" | "Medium Severity" | "High Severity";
  recommendation: string;
  image_url?: string | null;
  recovery_watering: string;
  recovery_sunlight: string;
  recovery_air_circulation: string;
  recovery_temperature: string;
  created_at: string; // ISO date string
}

// Request body for creating diagnosis
export interface CreateDiagnosisRequest {
  plant_id: number;
  issue_detected: string;
  confidence_score: number;
  severity: string;
  recommendation: string;
  recovery_watering: string;
  recovery_sunlight: string;
  recovery_air_circulation: string;
  recovery_temperature: string;
  image_url?: string;
}

class DiagnosisService {
  /**
   * Diagnose plant health from image using AI
   * This does NOT save to database - just returns AI analysis
   */
  async diagnoseImage(imageUri: string): Promise<DiagnosisAIResponse> {
    const formData = new FormData();

    // @ts-ignore - React Native FormData handles file objects differently
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "plant.jpg",
    });

    const response = await api.post<DiagnosisAIResponse>(
      "/plants/diagnose",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  }

  /**
   * Save a diagnosis to history (after getting AI results)
   */
  async saveDiagnosis(
    data: CreateDiagnosisRequest
  ): Promise<DiagnosisHistoryItem> {
    const response = await api.post<DiagnosisHistoryItem>(
      "/diagnoses",
      data
    );
    return response.data;
  }

  /**
   * Get all diagnoses for the current user
   */
  async getDiagnosisHistory(
    skip: number = 0,
    limit: number = 100
  ): Promise<DiagnosisHistoryItem[]> {
    const response = await api.get<DiagnosisHistoryItem[]>(
      `/diagnoses/?skip=${skip}&limit=${limit}`
    );
    return response.data;
  }

  /**
   * Get a single diagnosis by ID
   */
  async getDiagnosisById(id: number): Promise<DiagnosisHistoryItem> {
    const response = await api.get<DiagnosisHistoryItem>(
      `/diagnoses/${id}`
    );
    return response.data;
  }

  /**
   * Get all diagnoses for a specific plant
   */
  async getDiagnosesForPlant(
    plantId: number,
    skip: number = 0,
    limit: number = 100
  ): Promise<DiagnosisHistoryItem[]> {
    const response = await api.get<DiagnosisHistoryItem[]>(
      `/diagnoses/plant/${plantId}?skip=${skip}&limit=${limit}`
    );
    return response.data;
  }

  /**
   * Delete a diagnosis from history
   */
  async deleteDiagnosis(id: number): Promise<void> {
    await api.delete(`/diagnoses/${id}`);
  }
}

export default new DiagnosisService();
