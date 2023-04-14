import requests
import json
import re
from tqdm import tqdm
import time

# Replace YOUR_API_KEY with your actual Steam API key
API_KEY = 'YOUR_API_KEY'

# Get the list of all games on Steam
response = requests.get(f'http://api.steampowered.com/ISteamApps/GetAppList/v2/?key={API_KEY}')

# Parse the list of games
games = response.json()['applist']['apps']
with open("Top5000games.txt", "r", encoding="utf-8") as top_games:
    top_games_names = top_games.read().splitlines()

# Iterate through the list of games and retrieve their metadata
game_data = []

for game in tqdm(games, desc="Downloading games..."):
    if (game['name'] in top_games_names):
        appid = game['appid']
        response_veredict = False
        while response_veredict is not True:
            response = requests.get(f'http://store.steampowered.com/api/appdetails/?appids={appid}&key={API_KEY}&cc=us&l=en')
            if response.status_code == 200:
                response_veredict = True
            elif response.status_code == 429:
                print("Too many requests! Waiting 2 minutes!")
                time.sleep(120)
                print("Resuming job!")
            else:
                print(f'An error has ocurred ({response.status_code}), waiting 10 seconds!')
                time.sleep(10)
                print("Resuming job!")
        try:
            data = response.json()[str(appid)]['data']
            if data.get('type') == 'game':
                game_data.append(data)
                # print(data)
        except KeyError:
            response_veredict = True
with open("raw_data.json", "w") as raw_file:
    raw_file.write(json.dumps(game_data, indent=4))
    
# Parse the metadata to extract the release year and popularity statistics for each game
# game_stats = []
# year_games = []
# for data in tqdm(game_data, desc="Storing by year..."):
#     if data.get('release_date'):
#         # print(data['release_date']['date'])
#         year = re.search(r"\d{4}", data['release_date']['date'])
#         year = int(year.group()) if year is not None else 0
#         # print(year)
#         if year == 2022:
#             year_games.append(data)

# with open("raw_data_year.json", "w") as raw_file_year:
#     raw_file_year.write(json.dumps(year_games, indent=4))