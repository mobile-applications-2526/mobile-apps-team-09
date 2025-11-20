from app.models.activity import ActivityType

def get_activity_title(activity_type, plant_name=None):
    if activity_type == ActivityType.WATERED:
        return f"Watered {plant_name}" if plant_name else "Watered plant"
    elif activity_type == ActivityType.PLANT_ADDED:
        return "Added new plant to collection"
    elif activity_type == ActivityType.DIAGNOSIS:
        return "Completed a plant health check"
    return "Activity"
