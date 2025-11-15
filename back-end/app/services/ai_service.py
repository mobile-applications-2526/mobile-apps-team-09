"""
AI Service for plant identification using Claude
"""

import anthropic
import os
from typing import Optional, Dict
from app.core.logging import get_logger

logger = get_logger(__name__)


class AIService:
    """
    Service for AI-powered plant identification
    """

    def __init__(self):
        """Initialize Anthropic Claude client"""
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            logger.warning("ANTHROPIC_API_KEY not configured - AI identification disabled")
            self.client = None
            return
        
        self.client = anthropic.Anthropic(api_key=api_key)

    async def identify_plant(self, image_base64: str) -> Dict[str, str]:
        """
        Identify plant species from image using Claude (acting as botanist)
        
        Args:
            image_base64: Base64 encoded image
            
        Returns:
            Dict with complete plant species information matching database schema:
                - scientific_name: Standardized binomial nomenclature
                - common_name: Most widely used common name
                - watering_frequency_days: Integer days between watering
                - sunlight_hours_needed: Integer hours of light per day
                - sunlight_type: Enum (indirect, bright indirect, etc.)
                - humidity_preference: Enum (low, medium, high)
                - temperature_min: Integer minimum temperature in Celsius
                - care_difficulty: Enum (easy, medium, hard)
        """
        if not self.client:
            raise ValueError("AI service not configured. Please add ANTHROPIC_API_KEY to .env")
        
        try:
            # Call Claude with vision to identify the plant
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
                                "text": """You are a professional botanist and plant taxonomist specializing in plant identification.

Analyze this plant image and provide complete botanical information in JSON format:

REQUIRED FIELDS (use exact format specified):
- scientific_name: The EXACT binomial nomenclature (Genus species). Use accepted name, NOT synonyms. Examples: "Epipremnum aureum", "Monstera deliciosa"
- common_name: Most widely used common name. Examples: "Golden Pothos", "Snake Plant", "Peace Lily"
- watering_frequency_days: Integer number of days between watering (e.g., 7, 14, 21)
- sunlight_hours_needed: Integer hours of light needed per day (e.g., 4, 6, 8)
- sunlight_type: MUST be one of: "indirect", "low to bright indirect", "bright indirect", "low to medium indirect", "bright direct"
- humidity_preference: MUST be one of: "low", "medium", "high"
- temperature_min: Integer minimum temperature in Celsius (e.g., 10, 15, 18)
- care_difficulty: MUST be one of: "easy", "medium", "hard"

CRITICAL REQUIREMENTS:
- Scientific names: binomial nomenclature, capitalize Genus, lowercase species (e.g., "Spathiphyllum wallisii")
- Numbers must be integers (no strings, no decimals)
- Enums must match exactly (case-sensitive)
- Always use the SAME scientific name for the same species (prevents duplicates)

Return ONLY valid JSON, no markdown formatting.

Example format:
{
  "scientific_name": "Spathiphyllum wallisii",
  "common_name": "Peace Lily",
  "watering_frequency_days": 5,
  "sunlight_hours_needed": 4,
  "sunlight_type": "low to medium indirect",
  "humidity_preference": "high",
  "temperature_min": 16,
  "care_difficulty": "medium"
}

If you cannot identify the plant:
{
  "scientific_name": "Unknown species",
  "common_name": "Unknown Plant",
  "watering_frequency_days": 7,
  "sunlight_hours_needed": 6,
  "sunlight_type": "bright indirect",
  "humidity_preference": "medium",
  "temperature_min": 15,
  "care_difficulty": "medium"
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
            
            plant_info = json.loads(response_text)
            
            # Validate required fields
            required_fields = [
                "scientific_name", "common_name", "watering_frequency_days", 
                "sunlight_hours_needed", "sunlight_type", "humidity_preference",
                "temperature_min", "care_difficulty"
            ]
            missing_fields = [field for field in required_fields if field not in plant_info]
            if missing_fields:
                logger.error(f"Missing required fields in AI response: {missing_fields}")
                raise ValueError(f"AI response missing required fields: {missing_fields}")
            
            # Normalize scientific name format (Genus species)
            scientific_parts = plant_info['scientific_name'].strip().split()
            if len(scientific_parts) >= 2:
                plant_info['scientific_name'] = f"{scientific_parts[0].capitalize()} {scientific_parts[1].lower()}"
            
            logger.info(f"Plant identified: {plant_info['scientific_name']} ({plant_info['common_name']})")
            return plant_info
            
        except Exception as e:
            logger.error(f"Failed to identify plant: {e}")
            # Return unknown plant with default values matching database schema
            return {
                "scientific_name": "Unknown species",
                "common_name": "Unknown Plant",
                "watering_frequency_days": 7,
                "sunlight_hours_needed": 6,
                "sunlight_type": "bright indirect",
                "humidity_preference": "medium",
                "temperature_min": 15,
                "care_difficulty": "medium"
            }


# Singleton instance
ai_service = AIService()
