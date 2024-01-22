from django.db import models

class WeatherData(models.Model):
    app_temp = models.DecimalField(max_digits=5, decimal_places=2)
    aqi = models.IntegerField()
    city_name = models.CharField(max_length=100)
    clouds = models.IntegerField()
    country_code = models.CharField(max_length=2)
    datetime = models.DateTimeField()
    dewpt = models.DecimalField(max_digits=5, decimal_places=2)
    h_angle = models.DecimalField(max_digits=5, decimal_places=2)
    lat = models.DecimalField(max_digits=8, decimal_places=5)
    lon = models.DecimalField(max_digits=8, decimal_places=5)
    ob_time = models.DateTimeField()
    precip = models.DecimalField(max_digits=5, decimal_places=2)
    pres = models.DecimalField(max_digits=6, decimal_places=2)
    rh = models.IntegerField()
    snow = models.DecimalField(max_digits=5, decimal_places=2)
    sunrise = models.TimeField()
    sunset = models.TimeField()
    temp = models.DecimalField(max_digits=5, decimal_places=2)
    uv = models.DecimalField(max_digits=5, decimal_places=2)
    vis = models.DecimalField(max_digits=5, decimal_places=2)
    wind_cdir = models.CharField(max_length=20)
    wind_cdir_full = models.CharField(max_length=50)
    wind_dir = models.IntegerField()
    wind_spd = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"Weather data for {self.city_name} at {self.datetime}"

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
