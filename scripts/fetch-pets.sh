#!/usr/bin/env bash
# Fetches placeholder pet + shelter-story photos from free prototyping/demo
# photo services. These are NOT licensed for production use — replace with
# owned/licensed assets before shipping to real users.
set -euo pipefail
cd "$(dirname "$0")/../src/assets/pets"

# Dogs (deterministic by id)
curl -fsSL "https://placedog.net/600/750?id=10" -o biscuit.jpg
curl -fsSL "https://placedog.net/600/750?id=21" -o waffles.jpg
curl -fsSL "https://placedog.net/600/750?id=33" -o pretzel.jpg
curl -fsSL "https://placedog.net/600/750?id=44" -o meatball.jpg

# Cats
curl -fsSL "https://cataas.com/cat?width=600&height=750&_=1" -o clementine.jpg
curl -fsSL "https://cataas.com/cat?width=600&height=750&_=2" -o miso.jpg
curl -fsSL "https://cataas.com/cat?width=600&height=750&_=3" -o juniper.jpg
curl -fsSL "https://cataas.com/cat?width=600&height=750&_=4" -o pickle.jpg

# Shelter story photos
curl -fsSL "https://placedog.net/700/900?id=51" -o story-0.jpg
curl -fsSL "https://cataas.com/cat?width=700&height=900&_=5" -o story-1.jpg
curl -fsSL "https://placedog.net/700/900?id=62" -o story-2.jpg

echo "Fetched $(ls *.jpg | wc -l) photos"
