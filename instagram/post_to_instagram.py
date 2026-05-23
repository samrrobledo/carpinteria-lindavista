#!/usr/bin/env python3
"""Publica la siguiente imagen pendiente en Instagram via Graph API."""

import json
import os
import sys
import time
import urllib.request
import urllib.parse

POSTS_FILE = os.path.join(os.path.dirname(__file__), "posts.json")
BASE_URL = "https://carpinterialindavista.com.mx"

INSTAGRAM_USER_ID = os.environ.get("INSTAGRAM_USER_ID")
INSTAGRAM_ACCESS_TOKEN = os.environ.get("INSTAGRAM_ACCESS_TOKEN")


def graph_api(endpoint, params):
    url = f"https://graph.facebook.com/v19.0/{endpoint}"
    data = urllib.parse.urlencode(params).encode()
    req = urllib.request.Request(url, data=data)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())


def get_next_post(posts):
    for i, post in enumerate(posts):
        if not post.get("posted"):
            return i, post
    # All posted — reset the cycle
    for post in posts:
        post["posted"] = False
    return 0, posts[0]


def publish(image_url, caption):
    # Step 1: Create media container
    result = graph_api(f"{INSTAGRAM_USER_ID}/media", {
        "image_url": image_url,
        "caption": caption,
        "access_token": INSTAGRAM_ACCESS_TOKEN,
    })
    creation_id = result["id"]
    print(f"Media container created: {creation_id}")

    # Step 2: Wait for processing
    time.sleep(5)

    # Step 3: Publish
    result = graph_api(f"{INSTAGRAM_USER_ID}/media_publish", {
        "creation_id": creation_id,
        "access_token": INSTAGRAM_ACCESS_TOKEN,
    })
    print(f"Published! Post ID: {result['id']}")
    return result["id"]


def main():
    if not INSTAGRAM_USER_ID or not INSTAGRAM_ACCESS_TOKEN:
        print("ERROR: Set INSTAGRAM_USER_ID and INSTAGRAM_ACCESS_TOKEN")
        sys.exit(1)

    with open(POSTS_FILE, "r", encoding="utf-8") as f:
        posts = json.load(f)

    idx, post = get_next_post(posts)
    image_url = f"{BASE_URL}/{post['image']}"
    caption = post["caption"]

    print(f"Posting [{idx}]: {post['image']}")
    print(f"Image URL: {image_url}")

    publish(image_url, caption)

    posts[idx]["posted"] = True
    with open(POSTS_FILE, "w", encoding="utf-8") as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)

    print("posts.json updated.")


if __name__ == "__main__":
    main()
