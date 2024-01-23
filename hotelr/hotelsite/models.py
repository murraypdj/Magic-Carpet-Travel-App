from django.db import models

class Hotel(models.Model):
    hotel_name = models.CharField(max_length=255)
    hotel_image_url = models.URLField()
    hotel_information_url = models.URLField()
    user_review = models.DecimalField(max_digits=3, decimal_places=2)
    service_average = models.DecimalField(max_digits=3, decimal_places=2)
    location_average = models.DecimalField(max_digits=3, decimal_places=2)
    room_average = models.DecimalField(max_digits=3, decimal_places=2)
    equipment_average = models.DecimalField(max_digits=3, decimal_places=2)
    bath_average = models.DecimalField(max_digits=3, decimal_places=2)
    meal_average = models.DecimalField(max_digits=3, decimal_places=2)
    nearest_station = models.CharField(max_length=100)

    def __str__(self):
        return self.hotel_name
