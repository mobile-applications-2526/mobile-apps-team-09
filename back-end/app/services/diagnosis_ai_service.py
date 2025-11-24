"""
AI Service for plant health diagnosis using Claude
"""

import anthropic
import os
from typing import Dict
from app.core.logging import get_logger

logger = get_logger(__name__)


class DiagnosisAIService:
    """
    Service for AI-powered plant health diagnosis
    """

    def __init__(self):
        """Initialize Anthropic Claude client"""
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            logger.warning("ANTHROPIC_API_KEY not configured - AI diagnosis disabled")
            self.client = None
            return
        
        self.client = anthropic.Anthropic(api_key=api_key)

    async def diagnose_plant(self, image_base64: str, user_location: str = None) -> Dict[str, str]:
        """
        Diagnose plant health from image using Claude (acting as plant doctor)
        
        Args:
            image_base64: Base64 encoded image
            user_location: Optional user location string (e.g. "Brussels, Belgium")
            
        Returns:
            Dict with complete diagnosis information:
                - issue_detected: Name of issue or "No Issues Detected"
                - confidence_score: Float 0.0-1.0
                - severity: "Healthy", "Low Severity", "Medium Severity", "High Severity"
                - recommendation: Full text recommendation
                - recovery_watering: Watering guidance (optional)
                - recovery_sunlight: Sunlight guidance (optional)
                - recovery_air_circulation: Air circulation guidance (optional)
                - recovery_temperature: Temperature guidance (optional)
        """
        if not self.client:
            raise ValueError("AI service not configured. Please add ANTHROPIC_API_KEY to .env")
        
        try:
            # Construct context string if location is provided
            context_str = ""
            if user_location:
                context_str = f"\n\nCONTEXT: The user is located in {user_location}. Please consider the typical climate/season for this location at the current time when diagnosing."

            # Call Claude with vision to diagnose the plant
            message = self.client.messages.create(
                model="claude-sonnet-4-5-20250929",
                max_tokens=2048,
                temperature=0,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image",
                                "source": {
                                    "type": "base64",
                                    "media_type": "image/jpeg",
                                    "data": image_base64,
                                },
                            },
                            {
                                "type": "text",
                                "text": f"""You are an expert plant pathologist and botanist specializing in plant health diagnosis.{context_str}

Analyze this plant image and provide a complete health diagnosis in JSON format:

REQUIRED FIELDS (ALL MUST BE PROVIDED):
- plant_common_name: The SHORT common name of the plant (1-2 words ONLY, e.g., "Snake Plant", "Monstera", "Peace Lily", "Tomato Plant"). NEVER include scientific names in parentheses.
- issue_detected: The name of the disease/issue OR "No Issues Detected" if healthy (e.g., "Leaf Spot Disease", "Root Rot", "Spider Mites Infestation", "No Issues Detected")
- confidence_score: Your confidence as a decimal 0.0-1.0 (e.g., 0.87 for 87%)
- severity: MUST be one of: "Healthy", "Low Severity", "Medium Severity", "High Severity"
- recommendation: DETAILED recommendation (5-7 sentences). Include specific action steps, timeline for recovery/maintenance, what to watch for, and preventive measures. Be thorough and educational.
- recovery_watering: BRIEF watering guidance (1-2 sentences) (e.g., "Water every 5-7 days", "Keep soil moist")
- recovery_sunlight: BRIEF light requirements (1-2 sentences) (e.g., "Bright indirect light", "Full sun 8+ hours")
- recovery_air_circulation: BRIEF air flow guidance (1-2 sentences) (e.g., "Good ventilation", "Improve airflow")
- recovery_temperature: BRIEF temperature range in CELSIUS ONLY (1-2 sentences) (e.g., "18-24°C", "16-27°C")

CRITICAL REQUIREMENTS:
- ALL 9 fields must be present, even for healthy plants
- plant_common_name: Use SHORT common name (1-2 words max). Examples: "Ice Plant" NOT "Ice Plant (Carpobrotus)", "Snake Plant" NOT "Snake Plant (Sansevieria)"
- For healthy plants, provide MAINTENANCE care tips (not recovery tips)
- recovery_temperature: MUST use Celsius (°C) ONLY, NEVER use Fahrenheit (°F)
- Be specific about the disease/pest name if sick
- Confidence score must be realistic (0.7-0.95 for clear issues, 0.95+ for healthy plants)
- Severity must match the issue (healthy plants = "Healthy")
- Recommendations should be detailed and informative (5-7 sentences with specific action steps)
- NEVER leave recovery fields empty or null

Return ONLY valid JSON, no markdown formatting.

Example for sick plant:
{{
  "plant_common_name": "Tomato Plant",
  "issue_detected": "Leaf Spot Disease",
  "confidence_score": 0.87,
  "severity": "Medium Severity",
  "recommendation": "Remove all affected leaves immediately to prevent the fungal infection from spreading to healthy foliage. Apply a copper-based or neem oil fungicide spray every 7-10 days for the next 3-4 weeks, following product instructions carefully. Water only at the soil level to avoid splashing water on leaves, as moisture on foliage promotes fungal growth. Improve air circulation around the plant by spacing it away from other plants and ensuring good ventilation in the room. Monitor new growth closely for any signs of spots appearing and remove them promptly if detected. As a preventive measure going forward, maintain consistent but not excessive watering and ensure adequate spacing between plants.",
  "recovery_watering": "Every 5-7 days at soil level",
  "recovery_sunlight": "Bright indirect light, 4-6 hours",
  "recovery_air_circulation": "Excellent ventilation, space from other plants",
  "recovery_temperature": "18-24°C"
}}

Example for healthy plant:
{{
  "plant_common_name": "Monstera Deliciosa",
  "issue_detected": "No Issues Detected",
  "confidence_score": 0.96,
  "severity": "Healthy",
  "recommendation": "Your plant is in excellent health with vibrant, well-formed foliage and no signs of disease or pest damage. Continue your current care routine as it's clearly working well for this plant. The coloration indicates proper nutrient levels and adequate light exposure, so maintain the consistent watering schedule and lighting conditions. Consider fertilizing every 4-6 weeks during the growing season with a balanced fertilizer to support continued healthy growth. Watch for any changes in leaf color or texture which could indicate the need for care adjustments.",
  "recovery_watering": "When top 2-3 cm is dry",
  "recovery_sunlight": "Bright indirect light, 6-8 hours",
  "recovery_air_circulation": "Good room ventilation",
  "recovery_temperature": "18-24°C"
}}"""
                            }
                        ],
                    }
                ],
            )
            
            # Parse Claude's response
            response_text = message.content[0].text
            
            # Extract JSON from response (Claude might wrap it in markdown)
            import json
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0].strip()
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0].strip()
            
            diagnosis_info = json.loads(response_text)
            
            # Validate required fields
            required_fields = ["plant_common_name", "issue_detected", "confidence_score", "severity", "recommendation", 
                             "recovery_watering", "recovery_sunlight", "recovery_air_circulation", "recovery_temperature"]
            missing_fields = [field for field in required_fields if field not in diagnosis_info]
            if missing_fields:
                logger.error(f"Missing required fields in AI response: {missing_fields}")
                raise ValueError(f"AI response missing required fields: {missing_fields}")
            
            # Validate confidence score is between 0 and 1
            if not 0.0 <= diagnosis_info['confidence_score'] <= 1.0:
                logger.warning(f"Invalid confidence score: {diagnosis_info['confidence_score']}, clamping to 0-1")
                diagnosis_info['confidence_score'] = max(0.0, min(1.0, diagnosis_info['confidence_score']))
            
            logger.info(f"Plant diagnosed: {diagnosis_info['issue_detected']} ({diagnosis_info['confidence_score']:.0%} confidence)")
            return diagnosis_info
            
        except Exception as e:
            logger.error(f"Failed to diagnose plant: {e}")
            # Return unknown diagnosis with default care tips
            return {
                "plant_common_name": "Unknown Plant",
                "issue_detected": "Unable to Diagnose",
                "confidence_score": 0.0,
                "severity": "Unknown",
                "recommendation": "Could not analyze plant health from image. Please try again with a clearer photo showing the plant's leaves and any visible issues.",
                "recovery_watering": "Water when top 1-2 inches of soil are dry",
                "recovery_sunlight": "Provide bright indirect light, 6-8 hours daily",
                "recovery_air_circulation": "Ensure good room ventilation",
                "recovery_temperature": "Maintain temperature between 18-24°C"
            }


# Singleton instance
diagnosis_ai_service = DiagnosisAIService()
