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
        # Convert the API response to a simplified JSON format
        hotels = []
        for hotel_data in json_response.get('hotels', []):
            basic_info = hotel_data[0].get('hotelBasicInfo', {})
            rating_info = hotel_data[1].get('hotelRatingInfo', {})

            hotel = {
                'hotelName': basic_info.get('hotelName', ''),
                'hotelImageUrl': basic_info.get('hotelImageUrl', ''),
                'hotelInformationUrl': basic_info.get('hotelInformationUrl', ''),
                'userReview': basic_info.get('userReview', ''),
                'serviceAverage': float(rating_info.get('serviceAverage', 0)),
                'locationAverage': float(rating_info.get('locationAverage', 0)),
                'roomAverage': float(rating_info.get('roomAverage', 0)),
                'equipmentAverage': float(rating_info.get('equipmentAverage', 0)),
                'bathAverage': float(rating_info.get('bathAverage', 0)),
                'mealAverage': float(rating_info.get('mealAverage', 0)),
                'nearestStation': basic_info.get('nearestStation', '')
            }

            hotels.append(hotel)

        return JsonResponse({'hotels': hotels})

    
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