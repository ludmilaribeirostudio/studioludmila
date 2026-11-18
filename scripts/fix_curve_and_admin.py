# 1. Update contentService.ts
cs_path = r'c:\Users\Usuario\Downloads\Ludmila Ribeiro\Luxury-Website-Studio\artifacts\gente-bonita\src\lib\contentService.ts'
with open(cs_path, 'r', encoding='utf-8') as f:
    cs = f.read()

cs = cs.replace(
    'export function resetSiteContent(): void {',
    'export function resetSiteContent(): SiteContent {'
)
cs = cs.replace(
    "    console.error('Erro ao resetar conteúdo do site:', err);\n  }\n}",
    "    console.error('Erro ao resetar conteúdo do site:', err);\n  }\n  return DEFAULT_SITE_CONTENT;\n}"
)
with open(cs_path, 'w', encoding='utf-8') as f:
    f.write(cs)
print('contentService.ts updated')

# 2. Update AdminPage.tsx to use siteForm instead of siteContentForm
adm_path = r'c:\Users\Usuario\Downloads\Ludmila Ribeiro\Luxury-Website-Studio\artifacts\gente-bonita\src\pages\AdminPage.tsx'
with open(adm_path, 'r', encoding='utf-8') as f:
    adm = f.read()

adm = adm.replace('siteContentForm', 'siteForm')
adm = adm.replace('setSiteContentForm', 'setSiteForm')

with open(adm_path, 'w', encoding='utf-8') as f:
    f.write(adm)
print('AdminPage.tsx updated')

# 3. Update App.tsx to move curve more to the right towards the photo
app_path = r'c:\Users\Usuario\Downloads\Ludmila Ribeiro\Luxury-Website-Studio\artifacts\gente-bonita\src\App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app = f.read()

old_paths = """  const getShapePath = () => {
    switch (shapeType) {
      case 'onda-suave':
        return 'M 650,0 C 580,200 700,450 620,650 C 560,800 680,880 620,900 L 1440,900 L 1440,0 Z';
      case 'diagonal-moderna':
        return 'M 750,0 L 520,900 L 1440,900 L 1440,0 Z';
      case 'curva-organica':
      default:
        // Curva orgânica contornando a foto de Ludmila até a base da seção
        return 'M 690,0 C 620,160 550,320 590,500 C 630,680 560,820 510,900 L 1440,900 L 1440,0 Z';
    }
  };"""

new_paths = """  const getShapePath = () => {
    switch (shapeType) {
      case 'onda-suave':
        return 'M 840,0 C 780,250 870,500 810,700 C 770,820 830,880 790,900 L 1440,900 L 1440,0 Z';
      case 'diagonal-moderna':
        return 'M 880,0 L 760,900 L 1440,900 L 1440,0 Z';
      case 'curva-organica':
      default:
        // Curva orgânica posicionada mais no rumo da foto para não cobrir nenhum texto
        return 'M 830,0 C 790,180 760,360 800,540 C 830,700 780,820 750,900 L 1440,900 L 1440,0 Z';
    }
  };"""

app = app.replace(old_paths, new_paths)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app)
print('App.tsx updated with curve shifted towards photo')
