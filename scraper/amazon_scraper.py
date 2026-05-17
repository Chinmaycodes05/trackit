from playwright.sync_api import sync_playwright
import re

def scrape_amazon(url):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.set_extra_http_headers({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept-Language": "en-IN,en;q=0.9"
        })

        page.goto(url, wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(3000)

        # Extract product title
        try:
            page.wait_for_selector("#productTitle", timeout=5000)
            title = page.locator("#productTitle").inner_text().strip()
        except:
            try:
                title = page.title().strip()
            except:
                title = "Title not found"

        # Extract all prices and pick the first one over ₹1000
        html = page.content()
        prices = re.findall(r'₹[\d,]+', html)
        
        price = "Price not found"
        for p_val in prices:
            # Remove ₹ and commas to get number
            number = int(p_val.replace("₹", "").replace(",", ""))
            if number > 1000:
                price = p_val
                break

        browser.close()

        return {
            "title": title,
            "price": price,
            "store": "Amazon India",
            "url": url
        }

import sys
import json

if __name__ == "__main__":
    if len(sys.argv) > 1:
        url = sys.argv[1]
    else:
        url = "https://www.amazon.in/dp/B09G9HD6PD"
    
    result = scrape_amazon(url)
    print(json.dumps(result))