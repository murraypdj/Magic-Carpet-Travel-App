from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from .models import Hotel
import requests
from decouple import config

weather_api_key = config('WEATHER_API_KEY')
rakuten_api_key = config('RAKUTEN_API_KEY')
RAKUTEN_app_secret = config('RAKUTEN_app_secret')
RAKUTEN_affiliate_id = config('RAKUTEN_affiliate_id')

@csrf_exempt
def search_hotels_view(request, middleClassCode, smallClassCode):
    
    base_url = 'https://app.rakuten.co.jp/services/api/Travel/SimpleHotelSearch/20170426?'

    params = {
        'applicationId': rakuten_api_key,
        'format': 'json',
        'affiliateId': RAKUTEN_affiliate_id,
        'largeClassCode': 'japan',
        'middleClassCode': middleClassCode,
        'smallClassCode': smallClassCode,
        'searchRadius': '1',
        'formatVersion': '2',
        'elements': 'hotelName,hotelImageUrl,hotelInformationUrl,userReview,serviceAverage,locationAverage,roomAverage,equipmentAverage,bathAverage,mealAverage,nearestStation'
    }

    response = requests.get(base_url, params=params)

    if response.status_code == 200:
        json_response = response.json()

        # Create a new hotel child with the API response
        hotel = Hotel.objects.create(
            hotel_name=json_response.get('hotelName', ''),
            hotel_image_url=json_response.get('hotelImageUrl', ''),
            hotel_information_url=json_response.get('hotelInformationUrl', ''),
            user_review=json_response.get('userReview', ''),
            service_average=json_response.get('serviceAverage', ''),
            location_average=json_response.get('locationAverage', ''),
            room_average=json_response.get('roomAverage', ''),
            equipment_average=json_response.get('equipmentAverage', ''),
            bath_average=json_response.get('bathAverage', ''),
            meal_average=json_response.get('mealAverage', ''),
            nearest_station=json_response.get('nearestStation', '')
        )

        # Convert the Hotel object to JSON
        hotel_json = {
            'hotelName': hotel.hotel_name,
            'hotelImageUrl': hotel.hotel_image_url,
            'hotelInformationUrl': hotel.hotel_information_url,
            'userReview': float(hotel.user_review),
            'serviceAverage': float(hotel.service_average),
            'locationAverage': float(hotel.location_average),
            'roomAverage': float(hotel.room_average),
            'equipmentAverage': float(hotel.equipment_average),
            'bathAverage': float(hotel.bath_average),
            'mealAverage': float(hotel.meal_average),
            'nearestStation': hotel.nearest_station
        }

        return JsonResponse(hotel_json)

    else:
        return JsonResponse({'error': f"Error {response.status_code}: {response.text}"})

def index(request):
    return render(request, 'index.html')

@csrf_exempt
def weather_view(request, city):
    api_url = f"http://api.weatherbit.io/v2.0/current?city={city}&key=" + weather_api_key

    try:
        response = requests.get(api_url)
        data = response.json()

        result = {
            "city_name": data["data"][0]["city_name"],
            "country_code": data["data"][0]["country_code"],
            "app_temp": data["data"][0]["app_temp"],
            "description": data["data"][0]["weather"]["description"],
            "temp": data["data"][0]["temp"]
        }

        return JsonResponse(result, status=200)

    except requests.RequestException as e:
        return JsonResponse({'error': f"Error making API call: {e}"}, status=500)