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

    async def diagnose_plant(self, image_base64: str) -> Dict[str, str]:
        """
        Diagnose plant health from image using Claude (acting as plant doctor)
        
        Args:
            image_base64: Base64 encoded image
            
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
            # Call Claude with vision to diagnose the plant
            message = self.client.messages.create(
                model="claude-sonnet-4-5-20250929",
                max_tokens=2048,
                temperature=0,  # Deterministic for consistency
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
                                "text": """You are an expert plant pathologist and botanist specializing in plant health diagnosis.

Analyze this plant image and provide a complete health diagnosis in JSON format:

REQUIRED FIELDS (ALL MUST BE PROVIDED):
- issue_detected: The name of the disease/issue OR "No Issues Detected" if healthy (e.g., "Leaf Spot Disease", "Root Rot", "Spider Mites Infestation", "No Issues Detected")
- confidence_score: Your confidence as a decimal 0.0-1.0 (e.g., 0.87 for 87%)
- severity: MUST be one of: "Healthy", "Low Severity", "Medium Severity", "High Severity"
- recommendation: Comprehensive recommendation (2-4 sentences explaining what to do or continue doing)
- recovery_watering: ALWAYS provide watering guidance (e.g., "Water when top inch is dry, every 5-7 days", "Keep soil consistently moist")
- recovery_sunlight: ALWAYS provide light requirements (e.g., "Bright indirect light, 6-8 hours", "Full sun, 8+ hours daily")
- recovery_air_circulation: ALWAYS provide air flow guidance (e.g., "Good room ventilation is sufficient", "Ensure excellent airflow")
- recovery_temperature: ALWAYS provide temperature range (e.g., "Keep between 18-24°C", "Maintain 16-27°C")

CRITICAL REQUIREMENTS:
- ALL 8 fields must be present, even for healthy plants
- For healthy plants, provide MAINTENANCE care tips (not recovery tips)
- Be specific about the disease/pest name if sick
- Confidence score must be realistic (0.7-0.95 for clear issues, 0.95+ for healthy plants)
- Severity must match the issue (healthy plants = "Healthy")
- Recommendations must be actionable and detailed
- NEVER leave recovery fields empty or null

Return ONLY valid JSON, no markdown formatting.

Example for sick plant:
{
  "issue_detected": "Leaf Spot Disease",
  "confidence_score": 0.87,
  "severity": "Medium Severity",
  "recommendation": "Remove affected leaves immediately to prevent spread. Reduce watering frequency and ensure proper air circulation. Apply a fungicide spray every 7-10 days for 3 weeks. Keep the plant in a well-ventilated area and avoid getting water on the leaves.",
  "recovery_watering": "Reduce to once every 5-7 days",
  "recovery_sunlight": "Indirect bright light, 4-6 hours",
  "recovery_air_circulation": "Ensure good ventilation",
  "recovery_temperature": "Keep between 18-24°C"
}

Example for healthy plant:
{
  "issue_detected": "No Issues Detected",
  "confidence_score": 0.96,
  "severity": "Healthy",
  "recommendation": "Great news! Your plant is thriving! Continue your excellent care routine. The leaves look strong and healthy with good color. Keep up the consistent watering and light conditions.",
  "recovery_watering": "Continue current schedule, water when top inch of soil is dry",
  "recovery_sunlight": "Maintain bright indirect light, 6-8 hours daily",
  "recovery_air_circulation": "Good room ventilation is sufficient",
  "recovery_temperature": "Keep between 18-24°C for optimal growth"
}"""
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
            required_fields = ["issue_detected", "confidence_score", "severity", "recommendation", 
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
