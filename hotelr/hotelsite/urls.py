from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('search_hotels_view/<str:middleClassCode>/<str:smallClassCode>/', views.search_hotels_view, name='search_hotels_view'),
    path('weather_view/<str:city>/', views.weather_view, name='weather_view'),
    path('chat_view/<str:usrquery>/', views.chat_view, name='chat_view'),
]