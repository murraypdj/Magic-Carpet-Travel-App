from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from .models import Hotel, WeatherData
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
def weather_view(request, city, state):
    api_url = f"http://api.weatherbit.io/v2.0/current?city={city},{state}&key=d57506729d474e038baa3c3f5b80f157"

    try:
        response = requests.get(api_url)
        data = response.json()

        # Assuming 'app_temp' is present in the response, adjust this according to the actual structure
        app_temp = data.get('data', [])[0].get('app_temp', None)

        if app_temp is not None:
            # If the key 'app_temp' is found, return a JsonResponse
            return JsonResponse({'app_temp': app_temp})
        else:
            # If 'app_temp' is not present in the response, return an error response
            return JsonResponse({'error': 'Invalid data structure'}, status=500)

    except requests.RequestException as e:
        return JsonResponse({'error': f"Error making API call: {e}"}, status=500)
    city = city
    state = state
    api_url = "http://api.weatherbit.io/v2.0/current?&city=" + city + "," + state + "&key="
    

    headers = {
        'Content-Type': 'application/json',
    }

    try:
        response = requests.get(api_url + weather_api_key, headers=headers)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            json_response = response.json()

            # Create a new WeatherData instance and populate it with the data
            weather_data = WeatherData(
                app_temp=json_response['data'][0]['app_temp'],
                aqi=json_response['data'][0]['aqi'],
                city_name=json_response['data'][0]['city_name'],
                clouds=json_response['data'][0]['clouds'],
                country_code=json_response['data'][0]['country_code'],
                datetime=json_response['data'][0]['datetime'],
                dewpt=json_response['data'][0]['dewpt'],
                h_angle=json_response['data'][0]['h_angle'],
                lat=json_response['data'][0]['lat'],
                lon=json_response['data'][0]['lon'],
                ob_time=json_response['data'][0]['ob_time'],
                precip=json_response['data'][0]['precip'],
                pres=json_response['data'][0]['pres'],
                rh=json_response['data'][0]['rh'],
                snow=json_response['data'][0]['snow'],
                sunrise=json_response['data'][0]['sunrise'],
                sunset=json_response['data'][0]['sunset'],
                temp=json_response['data'][0]['temp'],
                uv=json_response['data'][0]['uv'],
                vis=json_response['data'][0]['vis'],
                wind_cdir=json_response['data'][0]['wind_cdir'],
                wind_cdir_full=json_response['data'][0]['wind_cdir_full'],
                wind_dir=json_response['data'][0]['wind_dir'],
                wind_spd=json_response['data'][0]['wind_spd'],
            )
            
            # Save the WeatherData instance to the database
            weather_data.save()

            # Convert the WeatherData instance to JSON and return as a response
            response_data = {
                'app_temp': str(weather_data.app_temp),
                'aqi': weather_data.aqi,
                'city_name': weather_data.city_name,
                'clouds': weather_data.clouds,
                'country_code': weather_data.country_code,
                'datetime': str(weather_data.datetime),
                'dewpt': str(weather_data.dewpt),
                'h_angle': str(weather_data.h_angle),
                'lat': str(weather_data.lat),
                'lon': str(weather_data.lon),
                'ob_time': str(weather_data.ob_time),
                'precip': str(weather_data.precip),
                'pres': str(weather_data.pres),
                'rh': weather_data.rh,
                'snow': str(weather_data.snow),
                'sunrise': str(weather_data.sunrise),
                'sunset': str(weather_data.sunset),
                'temp': str(weather_data.temp),
                'uv': str(weather_data.uv),
                'vis': str(weather_data.vis),
                'wind_cdir': weather_data.wind_cdir,
                'wind_cdir_full': weather_data.wind_cdir_full,
                'wind_dir': weather_data.wind_dir,
                'wind_spd': str(weather_data.wind_spd),
            }

            return JsonResponse(response_data)

        else:
            print(f"Error: {response.status_code} - {response.text}")
            return JsonResponse({'error': 'Failed to fetch weather data'})

    except requests.RequestException as e:
        print(f"Error making API call: {e}")
        return JsonResponse({'error': 'Error making API call'})
