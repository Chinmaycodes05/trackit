import undetected_chromedriver as uc
import re
import time

def scrape_flipkart(product_name):
    options = uc.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    driver = uc.Chrome(options=options)

    # Search Google for the product price on Flipkart
    search_query = product_name.replace(" ", "+")
    url = f"https://www.google.com/search?q={search_query}+price+flipkart"
    
    print("Searching Google for Flipkart price...")
    driver.get(url)
    time.sleep(4)

    html = driver.page_source
    
    # Find all prices in Google results
    prices = re.findall(r'₹[\d,]+', html)
    print(f"Prices found: {prices[:10]}")

    # Get first price over 1000
    price = "Price not found"
    for p_val in prices:
        number = int(p_val.replace("₹", "").replace(",", ""))
        if number > 1000:
            price = p_val
            break

    driver.quit()

    return {
        "title": product_name,
        "price": price,
        "store": "Flipkart",
    }


# --- TEST ---
if __name__ == "__main__":
    result = scrape_flipkart("Apple iPhone 13 128GB")
    if result:
        print(f"Product : {result['title']}")
        print(f"Price   : {result['price']}")
        print(f"Store   : {result['store']}")