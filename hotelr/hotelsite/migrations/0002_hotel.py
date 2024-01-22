# Generated by Django 5.0.1 on 2024-01-22 11:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hotelsite', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Hotel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hotel_name', models.CharField(max_length=255)),
                ('hotel_image_url', models.URLField()),
                ('hotel_information_url', models.URLField()),
                ('user_review', models.DecimalField(decimal_places=2, max_digits=3)),
                ('service_average', models.DecimalField(decimal_places=2, max_digits=3)),
                ('location_average', models.DecimalField(decimal_places=2, max_digits=3)),
                ('room_average', models.DecimalField(decimal_places=2, max_digits=3)),
                ('equipment_average', models.DecimalField(decimal_places=2, max_digits=3)),
                ('bath_average', models.DecimalField(decimal_places=2, max_digits=3)),
                ('meal_average', models.DecimalField(decimal_places=2, max_digits=3)),
                ('nearest_station', models.CharField(max_length=100)),
            ],
        ),
    ]
