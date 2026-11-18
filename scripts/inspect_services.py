import re

with open(r'c:\Users\Usuario\Downloads\Ludmila Ribeiro\Luxury-Website-Studio\artifacts\gente-bonita\src\App.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

items = re.findall(r"\{\s*label:\s*['\"]([^'\"]+)['\"],\s*price:\s*['\"]([^'\"]+)['\"]\s*\}", text)
print(f"Total price items in App.tsx: {len(items)}")
for label, price in items:
    print(f"  {label} -> {price}")
