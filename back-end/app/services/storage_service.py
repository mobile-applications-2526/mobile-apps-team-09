"""
Supabase Storage Service for handling file uploads
"""

import uuid
from typing import Optional
from pathlib import Path
import asyncio
from functools import partial
from supabase import create_client, Client
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class StorageService:
    """
    Service for managing file uploads to Supabase Storage
    """

    def __init__(self):
        """Initialize Supabase client"""
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            logger.warning("Supabase credentials not configured - storage service disabled")
            self.client = None
            return
        
        self.client: Client = create_client(
            settings.SUPABASE_URL, 
            settings.SUPABASE_KEY
        )
        
        # Bucket names
        self.PLANT_IMAGES_BUCKET = "plant-images"
        self.DIAGNOSIS_IMAGES_BUCKET = "diagnosis-images"


    async def upload_plant_image(
        self, 
        file_content: bytes, 
        user_id: int, 
        plant_id: int,
        file_extension: str = "jpg"
    ) -> str:
        """
        Upload plant image to Supabase Storage
        
        Args:
            file_content: Image file bytes
            user_id: User ID (for organization)
            plant_id: Plant ID
            file_extension: File extension
            
        Returns:
            Public URL of uploaded image
        """
        if not self.client:
            raise ValueError("Supabase Storage is not configured. Please add SUPABASE_URL and SUPABASE_KEY to .env")
            
        try:
            # Organize by user folders
            filename = f"{user_id}/plant_{plant_id}_{uuid.uuid4()}.{file_extension}"
            
            # Run the sync upload in a thread pool
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                None,
                partial(
                    self.client.storage.from_(self.PLANT_IMAGES_BUCKET).upload,
                    path=filename,
                    file=file_content,
                    file_options={"content-type": f"image/{file_extension}"}
                )
            )
            
            public_url = self.client.storage.from_(self.PLANT_IMAGES_BUCKET).get_public_url(filename)
            
            logger.info(f"Plant image uploaded: {filename}")
            return public_url
            
        except Exception as e:
            error_msg = str(e)
            logger.error(f"Failed to upload plant image: {error_msg}")

            # Provide helpful error messages
            if "Bucket not found" in error_msg or "404" in error_msg:
                raise ValueError(
                    f"Storage bucket '{self.PLANT_IMAGES_BUCKET}' not found. "
                    "Please create the bucket in Supabase Storage with public access enabled."
                )
            elif "permission" in error_msg.lower() or "403" in error_msg:
                raise ValueError(
                    "Permission denied. Make sure the bucket has public access enabled "
                    "and you're using the correct Supabase key."
                )
            else:
                raise ValueError(f"Failed to upload image: {error_msg}")

    async def upload_diagnosis_image(
        self, 
        file_content: bytes, 
        user_id: int, 
        diagnosis_id: Optional[int] = None,
        file_extension: str = "jpg"
    ) -> str:
        """
        Upload diagnosis image to Supabase Storage
        
        Args:
            file_content: Image file bytes
            user_id: User ID
            diagnosis_id: Optional diagnosis ID (might not exist yet)
            file_extension: File extension
            
        Returns:
            Public URL of uploaded image
        """
        if not self.client:
            raise ValueError("Supabase Storage is not configured. Please add SUPABASE_URL and SUPABASE_KEY to .env")
            
        try:
            # Generate filename with UUID for uniqueness
            unique_id = diagnosis_id or uuid.uuid4()
            filename = f"{user_id}/diagnosis_{unique_id}_{uuid.uuid4()}.{file_extension}"
            
            # Run the sync upload in a thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                None,
                partial(
                    self.client.storage.from_(self.DIAGNOSIS_IMAGES_BUCKET).upload,
                    path=filename,
                    file=file_content,
                    file_options={"content-type": f"image/{file_extension}"}
                )
            )
            
            public_url = self.client.storage.from_(self.DIAGNOSIS_IMAGES_BUCKET).get_public_url(filename)
            
            logger.info(f"Diagnosis image uploaded: {filename}")
            return public_url
            
        except Exception as e:
            error_msg = str(e)
            logger.error(f"Failed to upload diagnosis image: {error_msg}")

            # Provide helpful error messages
            if "Bucket not found" in error_msg or "404" in error_msg:
                raise ValueError(
                    f"Storage bucket '{self.DIAGNOSIS_IMAGES_BUCKET}' not found. "
                    "Please create the bucket in Supabase Storage with public access enabled."
                )
            elif "permission" in error_msg.lower() or "403" in error_msg:
                raise ValueError(
                    "Permission denied. Make sure the bucket has public access enabled "
                    "and you're using the correct Supabase key."
                )
            else:
                raise ValueError(f"Failed to upload image: {error_msg}")

    async def delete_image(self, bucket_name: str, file_path: str) -> bool:
        """
        Delete an image from Supabase Storage
        
        Args:
            bucket_name: Name of the bucket
            file_path: Path to file in bucket (extracted from URL)
            
        Returns:
            True if deleted successfully
        """
        try:
            response = self.client.storage.from_(bucket_name).remove([file_path])
            logger.info(f"Image deleted: {file_path}")
            return True
        except Exception as e:
            logger.error(f"Failed to delete image: {e}")
            return False

    def extract_file_path_from_url(self, url: str, bucket_name: str) -> Optional[str]:
        """
        Extract file path from Supabase Storage URL
        
        Args:
            url: Full Supabase Storage URL
            bucket_name: Bucket name
            
        Returns:
            File path within bucket
        """
        try:
            parts = url.split(f"/{bucket_name}/")
            if len(parts) == 2:
                return parts[1]
            return None
        except Exception as e:
            logger.error(f"Failed to extract file path: {e}")
            return None


storage_service = StorageService()
