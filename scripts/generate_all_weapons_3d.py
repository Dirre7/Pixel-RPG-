import bpy
import math
import os

# ==============================================================================
# ⚔️ GENERADOR PROFESIONAL DE ARMAS Y ESCUDOS 3D (BLENDER 5.2 LTS)
# Genera 24 modelos 3D PBR (.glb) de alta calidad para todas las armas del RPG
# ==============================================================================

def create_pbr_mat(name, base_color, roughness=0.5, metallic=0.0, emissive=(0,0,0,1), emissive_strength=0.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs['Base Color'].default_value = base_color
        bsdf.inputs['Roughness'].default_value = roughness
        bsdf.inputs['Metallic'].default_value = metallic
        if 'Emission Color' in bsdf.inputs:
            bsdf.inputs['Emission Color'].default_value = emissive
        elif 'Emission' in bsdf.inputs:
            bsdf.inputs['Emission'].default_value = emissive
        if 'Emission Strength' in bsdf.inputs:
            bsdf.inputs['Emission Strength'].default_value = emissive_strength
    return mat

def assign_mat(obj, mat):
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)

def export_glb(output_path):
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=True,
        export_apply=True,
        export_materials='EXPORT',
        export_attributes=True
    )
    print(f"✨ [BLENDER 5.2 WEAPON] {os.path.basename(output_path)} guardado.")

# Common Materials
def get_common_materials():
    return {
        'steel': create_pbr_mat("Steel", (0.75, 0.78, 0.84, 1.0), roughness=0.20, metallic=0.95),
        'dark_steel': create_pbr_mat("DarkSteel", (0.24, 0.26, 0.30, 1.0), roughness=0.30, metallic=0.90),
        'gold': create_pbr_mat("Gold", (0.95, 0.78, 0.20, 1.0), roughness=0.18, metallic=0.96),
        'mithril': create_pbr_mat("Mithril", (0.45, 0.85, 0.95, 1.0), roughness=0.15, metallic=0.95, emissive=(0.2, 0.7, 0.9, 1.0), emissive_strength=1.5),
        'wood': create_pbr_mat("Wood", (0.45, 0.26, 0.14, 1.0), roughness=0.80),
        'dark_wood': create_pbr_mat("DarkWood", (0.22, 0.14, 0.08, 1.0), roughness=0.85),
        'leather': create_pbr_mat("Leather", (0.35, 0.18, 0.08, 1.0), roughness=0.75),
        'dark_leather': create_pbr_mat("DarkLeather", (0.18, 0.10, 0.06, 1.0), roughness=0.80),
        'ruby_glow': create_pbr_mat("RubyGlow", (0.95, 0.15, 0.15, 1.0), roughness=0.1, emissive=(0.95, 0.15, 0.15, 1.0), emissive_strength=3.5),
        'magma_glow': create_pbr_mat("MagmaGlow", (1.0, 0.45, 0.05, 1.0), roughness=0.15, emissive=(1.0, 0.45, 0.05, 1.0), emissive_strength=4.0),
        'celestial_glow': create_pbr_mat("CelestialGlow", (1.0, 0.95, 0.65, 1.0), roughness=0.10, metallic=0.3, emissive=(1.0, 0.92, 0.50, 1.0), emissive_strength=4.5),
        'emerald_poison': create_pbr_mat("EmeraldPoison", (0.10, 0.95, 0.45, 1.0), roughness=0.12, emissive=(0.10, 0.95, 0.45, 1.0), emissive_strength=3.0),
        'bone': create_pbr_mat("Bone", (0.90, 0.88, 0.80, 1.0), roughness=0.65),
        'obsidian': create_pbr_mat("Obsidian", (0.12, 0.10, 0.14, 1.0), roughness=0.25, metallic=0.6),
    }

output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "models", "weapons"))
os.makedirs(output_dir, exist_ok=True)

# ==============================================================================
# 1. ESPADAS Y MANDOBLES
# ==============================================================================

# 1.1 Espada de Hierro (Iron Sword)
def make_iron_sword():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    m = get_common_materials()
    # Hoja
    bpy.ops.mesh.primitive_cube_add(size=0.10, location=(0, 0, 0.45))
    b = bpy.context.active_object
    b.scale = (0.32, 0.08, 7.5)
    assign_mat(b, m['steel'])
    # Punta
    bpy.ops.mesh.primitive_cone_add(radius1=0.032, depth=0.15, location=(0, 0, 0.88))
    tip = bpy.context.active_object
    tip.scale = (1.0, 0.25, 1.0)
    assign_mat(tip, m['steel'])
    # Guarda
    bpy.ops.mesh.primitive_cube_add(size=0.08, location=(0, 0, 0.06))
    g = bpy.context.active_object
    g.scale = (2.4, 0.6, 0.5)
    assign_mat(g, m['steel'])
    # Empuñadura
    bpy.ops.mesh.primitive_cylinder_add(radius=0.024, depth=0.18, location=(0, 0, -0.05))
    h = bpy.context.active_object
    assign_mat(h, m['leather'])
    # Pomo
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.04, location=(0, 0, -0.15))
    p = bpy.context.active_object
    assign_mat(p, m['steel'])
    export_glb(os.path.join(output_dir, "weapon_iron_sword.glb"))

# 1.2 Espada de Acero Templado
def make_steel_sword():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    m = get_common_materials()
    # Hoja con canal
    bpy.ops.mesh.primitive_cube_add(size=0.10, location=(0, 0, 0.48))
    b = bpy.context.active_object
    b.scale = (0.35, 0.08, 8.2)
    assign_mat(b, m['steel'])
    # Guarda de Gavilanes Curvados
    bpy.ops.mesh.primitive_torus_add(major_radius=0.12, minor_radius=0.024, location=(0, 0, 0.06), rotation=(math.radians(90), 0, 0))
    g = bpy.context.active_object
    assign_mat(g, m['gold'])
    # Empuñadura
    bpy.ops.mesh.primitive_cylinder_add(radius=0.024, depth=0.20, location=(0, 0, -0.06))
    h = bpy.context.active_object
    assign_mat(h, m['leather'])
    # Pomo de Oro
    bpy.ops.mesh.primitive_ico_sphere_add(radius=0.045, location=(0, 0, -0.18))
    p = bpy.context.active_object
    assign_mat(p, m['gold'])
    export_glb(os.path.join(output_dir, "weapon_steel_sword.glb"))

# 1.3 Mandoble de Acero (Greatsword)
def make_greatsword():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    m = get_common_materials()
    # Gran Hoja Ancha
    bpy.ops.mesh.primitive_cube_add(size=0.10, location=(0, 0, 0.65))
    b = bpy.context.active_object
    b.scale = (0.50, 0.08, 11.5)
    assign_mat(b, m['steel'])
    # Gavilanes Pesados
    bpy.ops.mesh.primitive_cube_add(size=0.10, location=(0, 0, 0.06))
    g = bpy.context.active_object
    g.scale = (3.6, 0.6, 0.6)
    assign_mat(g, m['dark_steel'])
    # Empuñadura Larga a 2 Manos
    bpy.ops.mesh.primitive_cylinder_add(radius=0.028, depth=0.32, location=(0, 0, -0.12))
    h = bpy.context.active_object
    assign_mat(h, m['dark_leather'])
    # Pomo Macizo
    bpy.ops.mesh.primitive_cube_add(size=0.065, location=(0, 0, -0.30))
    p = bpy.context.active_object
    assign_mat(p, m['steel'])
    export_glb(os.path.join(output_dir, "weapon_greatsword.glb"))

# 1.4 Hoja Volcánica (Magma Blade)
def make_volcanic_blade():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    m = get_common_materials()
    # Hoja de Basalto con Núcleo de Magma
    bpy.ops.mesh.primitive_cube_add(size=0.10, location=(0, 0, 0.52))
    b = bpy.context.active_object
    b.scale = (0.42, 0.08, 9.0)
    assign_mat(b, m['obsidian'])

    # Núcleo de Lava Fluyente
    bpy.ops.mesh.primitive_cube_add(size=0.04, location=(0, 0, 0.52))
    core = bpy.context.active_object
    core.scale = (0.2, 1.2, 20.0)
    assign_mat(core, m['magma_glow'])

    # Guarda Volcánica
    bpy.ops.mesh.primitive_cone_add(radius1=0.16, depth=0.12, location=(0, 0, 0.06))
    g = bpy.context.active_object
    assign_mat(g, m['obsidian'])

    bpy.ops.mesh.primitive_cylinder_add(radius=0.026, depth=0.22, location=(0, 0, -0.07))
    h = bpy.context.active_object
    assign_mat(h, m['dark_leather'])

    bpy.ops.mesh.primitive_ico_sphere_add(radius=0.05, location=(0, 0, -0.20))
    p = bpy.context.active_object
    assign_mat(p, m['ruby_glow'])
    export_glb(os.path.join(output_dir, "weapon_volcanic_blade.glb"))

# 1.5 Espada Celestial (Holy Light Blade)
def make_celestial_sword():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    m = get_common_materials()
    # Hoja Radiante
    bpy.ops.mesh.primitive_cube_add(size=0.10, location=(0, 0, 0.58))
    b = bpy.context.active_object
    b.scale = (0.38, 0.08, 10.0)
    assign_mat(b, m['celestial_glow'])

    # Alas Angélicas en la Guarda
    for sign in [-1, 1]:
        bpy.ops.mesh.primitive_cone_add(radius1=0.08, depth=0.28, location=(sign * 0.14, 0, 0.10), rotation=(0, 0, math.radians(sign * -65)))
        w = bpy.context.active_object
        assign_mat(w, m['gold'])

    bpy.ops.mesh.primitive_cylinder_add(radius=0.025, depth=0.22, location=(0, 0, -0.06))
    h = bpy.context.active_object
    assign_mat(h, m['gold'])

    bpy.ops.mesh.primitive_ico_sphere_add(radius=0.055, location=(0, 0, -0.19))
    p = bpy.context.active_object
    assign_mat(p, m['celestial_glow'])
    export_glb(os.path.join(output_dir, "weapon_celestial_sword.glb"))

# 1.6 Espada de Hueso Maldita (Cursed Bone Blade)
def make_bone_sword():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    m = get_common_materials()
    # Espina dorsal / Hoja ósea
    bpy.ops.mesh.primitive_cone_add(radius1=0.05, depth=0.85, location=(0, 0, 0.48))
    b = bpy.context.active_object
    b.scale = (0.9, 0.25, 1.0)
    assign_mat(b, m['bone'])

    for yz in [0.25, 0.45, 0.65]:
        bpy.ops.mesh.primitive_torus_add(major_radius=0.06, minor_radius=0.015, location=(0, 0, yz))
        rib = bpy.context.active_object
        assign_mat(rib, m['bone'])

    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.06, location=(0, 0, -0.15))
    skull = bpy.context.active_object
    assign_mat(skull, m['bone'])
    export_glb(os.path.join(output_dir, "weapon_bone_sword.glb"))

# ==============================================================================
# 2. DAGAS Y ARMAS DE SIGILO
# ==============================================================================

# 2.1 Daga de Cazador
def make_hunter_dagger():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    m = get_common_materials()
    bpy.ops.mesh.primitive_cone_add(radius1=0.045, depth=0.45, location=(0, 0, 0.25))
    b = bpy.context.active_object
    b.scale = (1.0, 0.3, 1.0)
    assign_mat(b, m['steel'])

    bpy.ops.mesh.primitive_cube_add(size=0.05, location=(0, 0, 0.03))
    g = bpy.context.active_object
    g.scale = (1.8, 0.6, 0.4)
    assign_mat(g, m['gold'])

    bpy.ops.mesh.primitive_cylinder_add(radius=0.02, depth=0.14, location=(0, 0, -0.06))
    h = bpy.context.active_object
    assign_mat(h, m['leather'])
    export_glb(os.path.join(output_dir, "weapon_hunter_dagger.glb"))

# 2.2 Dagas Sombrías Gemelas
def make_shadow_daggers():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    m = get_common_materials()
    bpy.ops.mesh.primitive_cone_add(radius1=0.042, depth=0.48, location=(0, 0, 0.26))
    b = bpy.context.active_object
    b.scale = (0.8, 0.22, 1.0)
    assign_mat(b, m['dark_steel'])

    bpy.ops.mesh.primitive_ico_sphere_add(radius=0.035, location=(0, 0, 0.02))
    gem = bpy.context.active_object
    assign_mat(gem, m['ruby_glow'])

    bpy.ops.mesh.primitive_cylinder_add(radius=0.018, depth=0.14, location=(0, 0, -0.07))
    h = bpy.context.active_object
    assign_mat(h, m['dark_leather'])
    export_glb(os.path.join(output_dir, "weapon_shadow_daggers.glb"))

# 2.3 Dagas de Veneno Esmeralda
def make_poison_daggers():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    m = get_common_materials()
    bpy.ops.mesh.primitive_cone_add(radius1=0.045, depth=0.50, location=(0, 0, 0.28))
    b = bpy.context.active_object
    b.scale = (0.8, 0.25, 1.0)
    assign_mat(b, m['emerald_poison'])

    bpy.ops.mesh.primitive_cube_add(size=0.05, location=(0, 0, 0.03))
    g = bpy.context.active_object
    g.scale = (1.6, 0.5, 0.4)
    assign_mat(g, m['dark_steel'])

    bpy.ops.mesh.primitive_cylinder_add(radius=0.018, depth=0.14, location=(0, 0, -0.06))
    h = bpy.context.active_object
    assign_mat(h, m['dark_leather'])
    export_glb(os.path.join(output_dir, "weapon_poison_daggers.glb"))

# ==============================================================================
# 3. HACHAS Y MARTILLOS DE GUERRA
# ==============================================================================

# 3.1 Hacha Doble de Guerra (Double Waraxe)
def make_double_waraxe():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    m = get_common_materials()
    # Mango
    bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=0.90, location=(0, 0, 0.35))
    h = bpy.context.active_object
    assign_mat(h, m['wood'])

    # Hojas Dobles en Medialuna
    for sign in [-1, 1]:
        bpy.ops.mesh.primitive_cone_add(radius1=0.16, depth=0.35, location=(sign * 0.16, 0, 0.68), rotation=(0, math.radians(sign * 90), 0))
        blade = bpy.context.active_object
        blade.scale = (1.4, 0.12, 1.0)
        assign_mat(blade, m['steel'])

    # Púa Superior
    bpy.ops.mesh.primitive_cone_add(radius1=0.03, depth=0.18, location=(0, 0, 0.88))
    spike = bpy.context.active_object
    assign_mat(spike, m['steel'])
    export_glb(os.path.join(output_dir, "weapon_double_waraxe.glb"))

# 3.2 Martillo de Guerra de Mithril
def make_mithril_hammer():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    m = get_common_materials()
    bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=0.88, location=(0, 0, 0.34))
    h = bpy.context.active_object
    assign_mat(h, m['dark_wood'])

    # Cabeza de Martillo Facetada
    bpy.ops.mesh.primitive_cube_add(size=0.18, location=(0, 0, 0.68))
    head = bpy.context.active_object
    head.scale = (1.6, 0.9, 0.9)
    assign_mat(head, m['mithril'])

    # Pico Trasero
    bpy.ops.mesh.primitive_cone_add(radius1=0.06, depth=0.22, location=(-0.20, 0, 0.68), rotation=(0, math.radians(-90), 0))
    pick = bpy.context.active_object
    assign_mat(pick, m['mithril'])
    export_glb(os.path.join(output_dir, "weapon_mithril_hammer.glb"))

# 3.3 Martillo de Guerra Titánico
def make_titanic_hammer():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    m = get_common_materials()
    bpy.ops.mesh.primitive_cylinder_add(radius=0.035, depth=0.98, location=(0, 0, 0.38))
    h = bpy.context.active_object
    assign_mat(h, m['obsidian'])

    # Enorme Cabeza Cilíndrica Reforzada
    bpy.ops.mesh.primitive_cylinder_add(radius=0.14, depth=0.38, location=(0, 0, 0.74), rotation=(0, math.radians(90), 0))
    head = bpy.context.active_object
    assign_mat(head, m['obsidian'])

    bpy.ops.mesh.primitive_ico_sphere_add(radius=0.07, location=(0, 0, 0.74))
    core = bpy.context.active_object
    assign_mat(core, m['magma_glow'])
    export_glb(os.path.join(output_dir, "weapon_titanic_hammer.glb"))

# ==============================================================================
# 4. BÁCULOS ARCANOS Y SAGRADOS
# ==============================================================================

# 4.1 Vara de Roble (Oak Staff)
def make_oak_staff():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    m = get_common_materials()
    bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=1.35, location=(0, 0, 0.60))
    s = bpy.context.active_object
    assign_mat(s, m['wood'])

    bpy.ops.mesh.primitive_torus_add(major_radius=0.12, minor_radius=0.03, location=(0.04, 0, 1.22))
    top = bpy.context.active_object
    assign_mat(top, m['wood'])
    export_glb(os.path.join(output_dir, "weapon_oak_staff.glb"))

# 4.2 Báculo Arcano de Cristal (Crystal Staff)
def make_crystal_staff():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    m = get_common_materials()
    bpy.ops.mesh.primitive_cylinder_add(radius=0.028, depth=1.40, location=(0, 0, 0.62))
    s = bpy.context.active_object
    assign_mat(s, m['mithril'])

    # Engaste de Oro
    bpy.ops.mesh.primitive_torus_add(major_radius=0.12, minor_radius=0.025, location=(0, 0, 1.28))
    crest = bpy.context.active_object
    assign_mat(crest, m['gold'])

    # Gran Cristal Prismático Flotante
    bpy.ops.mesh.primitive_ico_sphere_add(radius=0.10, subdivisions=1, location=(0, 0, 1.34))
    gem = bpy.context.active_object
    assign_mat(gem, m['mithril'])
    export_glb(os.path.join(output_dir, "weapon_crystal_staff.glb"))

# 4.3 Báculo de la Media Luna (Crescent Staff)
def make_crescent_staff():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    m = get_common_materials()
    bpy.ops.mesh.primitive_cylinder_add(radius=0.028, depth=1.45, location=(0, 0, 0.65))
    s = bpy.context.active_object
    assign_mat(s, m['steel'])

    # Media Luna de Plata
    bpy.ops.mesh.primitive_torus_add(major_radius=0.18, minor_radius=0.03, location=(0, 0, 1.38), rotation=(0, math.radians(45), 0))
    crescent = bpy.context.active_object
    assign_mat(crescent, m['steel'])

    # Orbe Central
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.07, location=(0, 0, 1.38))
    orb = bpy.context.active_object
    assign_mat(orb, m['celestial_glow'])
    export_glb(os.path.join(output_dir, "weapon_crescent_staff.glb"))

# 4.4 Báculo de Luz Celestial
def make_celestial_staff():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    m = get_common_materials()
    bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=1.50, location=(0, 0, 0.68))
    s = bpy.context.active_object
    assign_mat(s, m['gold'])

    bpy.ops.mesh.primitive_torus_add(major_radius=0.20, minor_radius=0.025, location=(0, 0, 1.44))
    halo = bpy.context.active_object
    assign_mat(halo, m['celestial_glow'])

    bpy.ops.mesh.primitive_ico_sphere_add(radius=0.09, location=(0, 0, 1.44))
    sun = bpy.context.active_object
    assign_mat(sun, m['celestial_glow'])
    export_glb(os.path.join(output_dir, "weapon_celestial_staff.glb"))

# ==============================================================================
# 5. ARCOS DE TIRADOR
# ==============================================================================

# 5.1 Arco Corto de Fresno (Shortbow)
def make_shortbow():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    m = get_common_materials()
    bpy.ops.mesh.primitive_torus_add(major_radius=0.45, minor_radius=0.024, location=(0, 0, 0.45), rotation=(0, math.radians(90), 0))
    bow = bpy.context.active_object
    assign_mat(bow, m['wood'])

    bpy.ops.mesh.primitive_cylinder_add(radius=0.032, depth=0.14, location=(0.44, 0, 0.45))
    grip = bpy.context.active_object
    assign_mat(grip, m['leather'])
    export_glb(os.path.join(output_dir, "weapon_shortbow.glb"))

# 5.2 Arco Compuesto de Élite (Composite Bow)
def make_composite_bow():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    m = get_common_materials()
    bpy.ops.mesh.primitive_torus_add(major_radius=0.55, minor_radius=0.028, location=(0, 0, 0.50), rotation=(0, math.radians(90), 0))
    bow = bpy.context.active_object
    assign_mat(bow, m['dark_wood'])

    for z in [0.85, 0.15]:
        bpy.ops.mesh.primitive_cone_add(radius1=0.04, depth=0.16, location=(0, 0, z))
        tip = bpy.context.active_object
        assign_mat(tip, m['gold'])
    export_glb(os.path.join(output_dir, "weapon_composite_bow.glb"))

# ==============================================================================
# 6. ESCUDOS Y BROQUELES
# ==============================================================================

# 6.1 Escudo del Guardián Fluvial / Madera
def make_river_shield():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    m = get_common_materials()
    bpy.ops.mesh.primitive_cylinder_add(radius=0.28, depth=0.04, location=(0, 0, 0.35), rotation=(math.radians(90), 0, 0))
    s = bpy.context.active_object
    assign_mat(s, m['wood'])

    bpy.ops.mesh.primitive_torus_add(major_radius=0.28, minor_radius=0.02, location=(0, 0, 0.35), rotation=(math.radians(90), 0, 0))
    rim = bpy.context.active_object
    assign_mat(rim, m['steel'])

    bpy.ops.mesh.primitive_ico_sphere_add(radius=0.07, location=(0, -0.03, 0.35))
    boss = bpy.context.active_object
    assign_mat(boss, m['steel'])
    export_glb(os.path.join(output_dir, "shield_river_guardian.glb"))

# 6.2 Escudo Rúnico de Obsidiana
def make_obsidian_shield():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    m = get_common_materials()
    bpy.ops.mesh.primitive_cube_add(size=0.32, location=(0, 0, 0.35))
    s = bpy.context.active_object
    s.scale = (1.0, 0.12, 1.4)
    assign_mat(s, m['obsidian'])

    # Runa Púrpura Grabada
    bpy.ops.mesh.primitive_ico_sphere_add(radius=0.08, location=(0, -0.06, 0.35))
    rune = bpy.context.active_object
    assign_mat(rune, m['ruby_glow'])
    export_glb(os.path.join(output_dir, "shield_obsidian_rune.glb"))

# 6.3 Broquel de Basalto Templado
def make_basalt_buckler():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    m = get_common_materials()
    bpy.ops.mesh.primitive_cylinder_add(radius=0.22, depth=0.05, location=(0, 0, 0.30), rotation=(math.radians(90), 0, 0))
    s = bpy.context.active_object
    assign_mat(s, m['obsidian'])

    bpy.ops.mesh.primitive_torus_add(major_radius=0.22, minor_radius=0.02, location=(0, 0, 0.30), rotation=(math.radians(90), 0, 0))
    rim = bpy.context.active_object
    assign_mat(rim, m['magma_glow'])
    export_glb(os.path.join(output_dir, "shield_basalt_buckler.glb"))

# 6.4 Escudo del Sol Invencible
def make_sun_shield():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    m = get_common_materials()
    # Pavés Real con Emblema Solar
    bpy.ops.mesh.primitive_cube_add(size=0.36, location=(0, 0, 0.38))
    s = bpy.context.active_object
    s.scale = (1.0, 0.12, 1.6)
    assign_mat(s, m['steel'])

    bpy.ops.mesh.primitive_torus_add(major_radius=0.18, minor_radius=0.025, location=(0, -0.05, 0.38), rotation=(math.radians(90), 0, 0))
    sun = bpy.context.active_object
    assign_mat(sun, m['gold'])

    bpy.ops.mesh.primitive_ico_sphere_add(radius=0.08, location=(0, -0.06, 0.38))
    core = bpy.context.active_object
    assign_mat(core, m['celestial_glow'])
    export_glb(os.path.join(output_dir, "shield_invincible_sun.glb"))


# ==============================================================================
# EJECUCIÓN DEL BATCH DE MODELADO
# ==============================================================================
make_iron_sword()
make_steel_sword()
make_greatsword()
make_volcanic_blade()
make_celestial_sword()
make_bone_sword()
make_hunter_dagger()
make_shadow_daggers()
make_poison_daggers()
make_double_waraxe()
make_mithril_hammer()
make_titanic_hammer()
make_oak_staff()
make_crystal_staff()
make_crescent_staff()
make_celestial_staff()
make_shortbow()
make_composite_bow()
make_river_shield()
make_obsidian_shield()
make_basalt_buckler()
make_sun_shield()

print("👑 [COMPLETADO CON ÉXITO] Todo el arsenal de armas y escudos 3D exportado a public/models/weapons/.")
