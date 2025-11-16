import api from "./apiService";

export interface PlantIdentificationResponse {
  scientific_name: string;
  common_name: string;
  species_id: number;
}

export interface CreatePlantRequest {
  species_id: number;
  plant_name: string;
  location: string;
  last_watered: string; // ISO date string
  acquired_date?: string; // ISO date string
}

export interface PlantResponse {
  id: number;
  user_id: number;
  species_id: number;
  plant_name: string;
  location: string;
  last_watered: string;
  acquired_date: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

class PlantService {
  /**
   * Identify plant from image using AI
   */
  async identifyPlant(imageUri: string): Promise<PlantIdentificationResponse> {
    try {
      const formData = new FormData();

      // @ts-ignore - React Native FormData handles file objects differently
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "plant.jpg",
      });

      const response = await api.post<PlantIdentificationResponse>(
        "/plants/identify",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error identifying plant:", error);
      const errorMessage =
        error.response?.data?.detail || "Failed to identify plant";
      if (errorMessage.includes("file type") || errorMessage.includes("PNG")) {
        throw new Error(
          "Invalid file type. Only PNG, JPEG, and WebP images are allowed."
        );
      }
      throw new Error(errorMessage);
    }
  }

  /**
   * Create a new plant
   */
  async createPlant(data: CreatePlantRequest): Promise<PlantResponse> {
    try {
      const response = await api.post<PlantResponse>("/plants", data, {
        timeout: 30000,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error creating plant:", error);
      throw new Error(error.response?.data?.detail || "Failed to create plant");
    }
  }

  /**
   * Upload plant image
   */
  async uploadPlantImage(
    plantId: number,
    imageUri: string
  ): Promise<{ image_url: string }> {
    try {
      const formData = new FormData();

      // @ts-ignore - React Native FormData handles file objects differently
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: `plant_${plantId}.jpg`,
      });

      const response = await api.post<{ image_url: string }>(
        `/uploads/plant/${plantId}/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error uploading plant image:", error);
      const errorMessage =
        error.response?.data?.detail || "Failed to upload image";
      if (errorMessage.includes("file type") || errorMessage.includes("PNG")) {
        throw new Error(
          "Invalid file type. Only PNG, JPEG, and WebP images are allowed."
        );
      }
      throw new Error(errorMessage);
    }
  }

  /**
   * Get all plants for current user
   */
  async getMyPlants(): Promise<PlantResponse[]> {
    try {
      const response = await api.get<PlantResponse[]>("/plants");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching plants:", error);
      throw new Error(error.response?.data?.detail || "Failed to fetch plants");
    }
  }

  /**
   * Get single plant by ID
   */
  async getPlantById(id: number): Promise<PlantResponse> {
    try {
      const response = await api.get<PlantResponse>(`/plants/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching plant:", error);
      throw new Error(error.response?.data?.detail || "Failed to fetch plant");
    }
  }

  /**
   * Update plant
   */
  async updatePlant(
    id: number,
    data: Partial<CreatePlantRequest>
  ): Promise<PlantResponse> {
    try {
      const response = await api.put<PlantResponse>(`/plants/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error("Error updating plant:", error);
      throw new Error(error.response?.data?.detail || "Failed to update plant");
    }
  }

  /**
   * Delete plant
   */
  async deletePlant(id: number): Promise<void> {
    try {
      await api.delete(`/plants/${id}`);
    } catch (error: any) {
      console.error("Error deleting plant:", error);
      throw new Error(error.response?.data?.detail || "Failed to delete plant");
    }
  }
}

export default new PlantService();
