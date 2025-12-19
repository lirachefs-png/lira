from PIL import Image, ImageDraw, ImageFont
import json
import os
from datetime import datetime

def parse_date(date_str):
    try:
        # Duffel date format is YYYY-MM-DD
        dt = datetime.strptime(date_str, '%Y-%m-%d')
        # Return format like "06 JAN"
        return dt.strftime('%d %b').upper()
    except:
        return date_str

def create_premium_story(deal):
    # Config
    template_path = "assets/template_premium.png"
    output_path = "offer_story_premium.png"
    
    try:
        # --- Data Parsing for Duffel API ---
        # Duffel Offer Structure:
        # {
        #   "total_amount": "100.00",
        #   "total_currency": "EUR",
        #   "slices": [ { "segments": [ { "origin": { "iata_code": "LIS" }, "destination": ..., "departing_at": "..." } ] } ]
        # }
        
        price_amount = deal.get('total_amount', '0')
        currency = deal.get('total_currency', 'EUR')
        
        # Get first slice (outbound)
        first_slice = deal['slices'][0]
        segments = first_slice['segments']
        
        origin = segments[0]['origin']['iata_code']
        destination = segments[-1]['destination']['iata_code']
        
        # Date from first segment departure
        raw_date = segments[0]['departing_at'].split('T')[0]
        date_formatted = parse_date(raw_date)
        
        # -----------------------------------
        
        base_img = Image.open(template_path).convert("RGBA")
        width, height = base_img.size
        
        # Transparent Overlay
        overlay = Image.new('RGBA', base_img.size, (0,0,0,0))
        draw = ImageDraw.Draw(overlay)
        
        # Card Dimensions
        card_w = width * 0.85
        card_h = height * 0.4
        card_x = (width - card_w) / 2
        card_y = (height - card_h) / 2
        
        # Semi-transparent background
        draw.rectangle(
            [(card_x, card_y), (card_x + card_w, card_y + card_h)],
            fill=(255, 255, 255, 230)
        )
        # Gold strip
        draw.rectangle(
            [(card_x, card_y), (card_x + card_w, card_y + 10)],
            fill=(184, 134, 11)
        )

        # Composite
        img = Image.alpha_composite(base_img, overlay)
        draw_final = ImageDraw.Draw(img)
        
        # Fonts
        try:
            font_route = ImageFont.truetype("arialbd.ttf", 90)
            font_price = ImageFont.truetype("arialbd.ttf", 140)
            font_label = ImageFont.truetype("arial.ttf", 40)
            font_btn = ImageFont.truetype("arialbd.ttf", 50)
        except:
            font_route = ImageFont.load_default()
            font_price = ImageFont.load_default()
            font_label = ImageFont.load_default()
            font_btn = ImageFont.load_default()

        # Colors
        color_primary = (0, 0, 50) 
        color_accent = (184, 134, 11)
        color_gray = (100, 100, 100)

        center_x = width / 2
        
        def draw_centered(text, font, y, color):
            bbox = draw_final.textbbox((0,0), text, font=font)
            w = bbox[2] - bbox[0]
            draw_final.text((center_x - w/2, y), text, font=font, fill=color)

        # Draw Content
        draw_centered("OFERTA RELÂMPAGO", font_label, card_y + 40, color_accent)
        draw_centered(f"{origin}  ✈  {destination}", font_route, card_y + 120, color_primary)
        draw_centered(f"Ida: {date_formatted}", font_label, card_y + 230, color_gray)
        
        currency_symbol = "€" if currency == "EUR" else currency
        draw_centered(f"{currency_symbol} {price_amount}", font_price, card_y + 300, color_primary)
        
        # Fake Button
        btn_w = card_w * 0.8
        btn_h = 100
        btn_x = center_x - btn_w/2
        btn_y = card_y + card_h + 50
        
        draw_final.rectangle(
            [(btn_x, btn_y), (btn_x + btn_w, btn_y + btn_h)],
            fill=(0, 122, 255)
        )
        
        bbox = draw_final.textbbox((0,0), "VER NO SITE >", font=font_btn)
        w_text = bbox[2] - bbox[0]
        draw_final.text((center_x - w_text/2, btn_y + 20), "VER NO SITE >", font=font_btn, fill=(255,255,255))

        # Save
        img = img.convert("RGB")
        img.save(output_path)
        print(f"✅ Design Premium criado em: {output_path}")
        
    except Exception as e:
        print(f"❌ Erro ao criar imagem: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    if os.path.exists("latest_deals.json"):
        with open("latest_deals.json", "r") as f:
            deals = json.load(f)
            if deals:
                create_premium_story(deals[0])
            else:
                print("⚠️ JSON vazio.")
    else:
        print("⚠️ Rode flight_hunter.py primeiro.")
