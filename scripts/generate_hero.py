import bpy
import math
import os

# ==============================================================================
# 🎮 GENERADOR PROCEDURAL DE HÉROE AVENTURERO 3D PARA BLENDER 5.2 LTS
# ==============================================================================

# 1. Resetear la escena por completo
bpy.ops.wm.read_factory_settings(use_empty=True)

# 2. Helper para crear materiales PBR en Blender
def create_pbr_material(name, base_color, roughness=0.5, metallic=0.0, emissive=(0,0,0,1), emissive_strength=0.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs['Base Color'].default_value = base_color
        bsdf.inputs['Roughness'].default_value = roughness
        bsdf.inputs['Metallic'].default_value = metallic
        
        # Compatibilidad con Blender 4.x y 5.x para emisión
        if 'Emission Color' in bsdf.inputs:
            bsdf.inputs['Emission Color'].default_value = emissive
        elif 'Emission' in bsdf.inputs:
            bsdf.inputs['Emission'].default_value = emissive
            
        if 'Emission Strength' in bsdf.inputs:
            bsdf.inputs['Emission Strength'].default_value = emissive_strength
    return mat

def assign_material(obj, mat):
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)

# --- CREACIÓN DE PALETA DE MATERIALES PBR ESTILIZADOS ---
mat_skin = create_pbr_material("Mat_Skin", (1.0, 0.85, 0.74, 1.0), roughness=0.6, metallic=0.0)
mat_hair = create_pbr_material("Mat_Hair", (0.85, 0.18, 0.12, 1.0), roughness=0.45, metallic=0.05)
mat_tunic = create_pbr_material("Mat_Tunic", (0.12, 0.45, 0.85, 1.0), roughness=0.55, metallic=0.05)
mat_armor_steel = create_pbr_material("Mat_SteelArmor", (0.55, 0.62, 0.72, 1.0), roughness=0.25, metallic=0.90)
mat_gold_trim = create_pbr_material("Mat_GoldTrim", (0.95, 0.72, 0.12, 1.0), roughness=0.20, metallic=0.95)
mat_leather = create_pbr_material("Mat_Leather", (0.35, 0.18, 0.08, 1.0), roughness=0.75, metallic=0.0)
mat_pants = create_pbr_material("Mat_Pants", (0.08, 0.12, 0.20, 1.0), roughness=0.70, metallic=0.0)
mat_cape = create_pbr_material("Mat_Cape", (0.75, 0.10, 0.15, 1.0), roughness=0.60, metallic=0.0)
mat_blade = create_pbr_material("Mat_BladeSteel", (0.90, 0.95, 1.0, 1.0), roughness=0.15, metallic=0.98)
mat_eye_white = create_pbr_material("Mat_EyeWhite", (1.0, 1.0, 1.0, 1.0), roughness=0.2, metallic=0.0)
mat_iris = create_pbr_material("Mat_Iris", (0.08, 0.65, 0.45, 1.0), roughness=0.2, metallic=0.1, emissive=(0.08, 0.75, 0.5, 1.0), emissive_strength=0.6)
mat_pupil = create_pbr_material("Mat_Pupil", (0.02, 0.02, 0.04, 1.0), roughness=0.1, metallic=0.0)
mat_magic_gem = create_pbr_material("Mat_MagicGem", (0.2, 0.8, 1.0, 1.0), roughness=0.1, metallic=0.2, emissive=(0.2, 0.8, 1.0, 1.0), emissive_strength=2.5)

# ==============================================================================
# 3. CONSTRUCCIÓN GEOMÉTRICA DEL PERSONAJE
# ==============================================================================

# --- A. CABEZA (HEAD) ---
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.38, location=(0, 0, 1.35), segments=24, ring_count=16)
head = bpy.context.active_object
head.name = "Hero_Head"
head.scale = (1.0, 0.95, 1.0)
assign_material(head, mat_skin)

# Mejillas Sonrojadas (Blush)
for side, sign in [("L", -1), ("R", 1)]:
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.07, location=(sign * 0.22, -0.30, 1.28), segments=12, ring_count=8)
    blush = bpy.context.active_object
    blush.name = f"Blush_{side}"
    blush.scale = (1.0, 0.3, 0.6)
    mat_blush = create_pbr_material(f"Mat_Blush_{side}", (0.95, 0.40, 0.50, 1.0), roughness=0.8)
    assign_material(blush, mat_blush)

# Ojos Expresivos Anime Chibi
for side, sign in [("L", -1), ("R", 1)]:
    # Esclerótica (Blanco)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.10, location=(sign * 0.15, -0.34, 1.38), segments=16, ring_count=12)
    eye_white = bpy.context.active_object
    eye_white.name = f"Eye_White_{side}"
    eye_white.scale = (1.0, 0.3, 1.2)
    assign_material(eye_white, mat_eye_white)

    # Iris Verde Esmeralda
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.075, location=(sign * 0.15, -0.365, 1.37), segments=14, ring_count=10)
    iris = bpy.context.active_object
    iris.name = f"Eye_Iris_{side}"
    iris.scale = (0.9, 0.2, 1.1)
    assign_material(iris, mat_iris)

    # Pupila Oscura
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.035, location=(sign * 0.15, -0.378, 1.37), segments=10, ring_count=8)
    pupil = bpy.context.active_object
    pupil.name = f"Eye_Pupil_{side}"
    pupil.scale = (0.8, 0.2, 0.9)
    assign_material(pupil, mat_pupil)

    # Brillo Especular (Catchlight)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.025, location=(sign * 0.13, -0.385, 1.40), segments=8, ring_count=6)
    sparkle = bpy.context.active_object
    sparkle.name = f"Eye_Sparkle_{side}"
    assign_material(sparkle, mat_eye_white)

# --- B. CABELLO ANIME ESTILIZADO (HAIR) ---
# Casco base del pelo
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.41, location=(0, 0.03, 1.39), segments=24, ring_count=16)
hair_base = bpy.context.active_object
hair_base.name = "Hair_Base"
hair_base.scale = (1.02, 1.05, 1.02)
assign_material(hair_base, mat_hair)

# Mechones y Puntas Frontales y Superiores
hair_locks = [
    # (loc, rot, scale)
    ((0.0, -0.34, 1.62), (math.radians(-35), 0, 0), (0.10, 0.12, 0.25)),
    ((-0.18, -0.30, 1.58), (math.radians(-30), math.radians(-25), 0), (0.09, 0.10, 0.24)),
    ((0.18, -0.30, 1.58), (math.radians(-30), math.radians(25), 0), (0.09, 0.10, 0.24)),
    ((-0.32, -0.15, 1.48), (math.radians(-15), math.radians(-45), 0), (0.08, 0.10, 0.28)),
    ((0.32, -0.15, 1.48), (math.radians(-15), math.radians(45), 0), (0.08, 0.10, 0.28)),
    ((0.0, 0.15, 1.78), (math.radians(30), 0, 0), (0.11, 0.11, 0.32)),
    ((-0.20, 0.12, 1.72), (math.radians(25), math.radians(-30), 0), (0.10, 0.10, 0.28)),
    ((0.20, 0.12, 1.72), (math.radians(25), math.radians(30), 0), (0.10, 0.10, 0.28)),
    ((0.0, 0.35, 1.38), (math.radians(65), 0, 0), (0.12, 0.12, 0.35)),
]

for idx, (loc, rot, scl) in enumerate(hair_locks):
    bpy.ops.mesh.primitive_cone_add(radius1=scl[0], depth=scl[2]*2, location=loc, rotation=rot)
    lock = bpy.context.active_object
    lock.name = f"Hair_Lock_{idx}"
    assign_material(lock, mat_hair)

# Cinta / Diadema de Aventura (Headband)
bpy.ops.mesh.primitive_torus_add(major_radius=0.39, minor_radius=0.035, location=(0, 0, 1.42), rotation=(math.radians(10), 0, 0))
headband = bpy.context.active_object
headband.name = "Hero_Headband"
assign_material(headband, mat_cape)

# Gema de la frente
bpy.ops.mesh.primitive_ico_sphere_add(radius=0.055, location=(0, -0.38, 1.48))
head_gem = bpy.context.active_object
head_gem.name = "Headband_Gem"
assign_material(head_gem, mat_magic_gem)

# --- C. TORSO Y TÚNICA (BODY) ---
# Túnica
bpy.ops.mesh.primitive_cylinder_add(radius=0.25, depth=0.48, location=(0, 0, 0.85))
torso = bpy.context.active_object
torso.name = "Hero_Torso"
torso.scale = (1.1, 0.85, 1.0)
assign_material(torso, mat_tunic)

# Peto de Acero (Cuirass)
bpy.ops.mesh.primitive_cube_add(size=0.32, location=(0, -0.06, 0.90))
cuirass = bpy.context.active_object
cuirass.name = "Hero_Chestplate"
cuirass.scale = (1.1, 0.5, 0.95)
assign_material(cuirass, mat_armor_steel)

# Borde Dorado del Peto
bpy.ops.mesh.primitive_torus_add(major_radius=0.22, minor_radius=0.02, location=(0, 0, 0.98), rotation=(math.radians(90), 0, 0))
gold_collar = bpy.context.active_object
gold_collar.name = "Gold_Collar"
gold_collar.scale = (1.1, 0.85, 1.0)
assign_material(gold_collar, mat_gold_trim)

# Cinturón de Cuero (Belt) con Hebilla Dorada
bpy.ops.mesh.primitive_cylinder_add(radius=0.27, depth=0.07, location=(0, 0, 0.65))
belt = bpy.context.active_object
belt.name = "Hero_Belt"
belt.scale = (1.12, 0.88, 1.0)
assign_material(belt, mat_leather)

bpy.ops.mesh.primitive_cube_add(size=0.09, location=(0, -0.24, 0.65))
buckle = bpy.context.active_object
buckle.name = "Belt_Buckle"
buckle.scale = (1.2, 0.3, 1.0)
assign_material(buckle, mat_gold_trim)

# Faldón de Batalla
bpy.ops.mesh.primitive_cone_add(radius1=0.34, radius2=0.28, depth=0.22, location=(0, 0, 0.52))
skirt = bpy.context.active_object
skirt.name = "Battle_Skirt"
skirt.scale = (1.1, 0.88, 1.0)
assign_material(skirt, mat_tunic)

# --- D. HOMBRERAS Y BRAZOS (PAULDRONS & ARMS) ---
for side, sign in [("L", -1), ("R", 1)]:
    # Hombrera de Placas Curvada (Puldron)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.14, location=(sign * 0.36, 0, 1.02), segments=16, ring_count=12)
    pauldron = bpy.context.active_object
    pauldron.name = f"Pauldron_{side}"
    pauldron.scale = (1.2, 1.1, 0.8)
    assign_material(pauldron, mat_armor_steel)

    # Ribete Dorado de Hombrera
    bpy.ops.mesh.primitive_torus_add(major_radius=0.14, minor_radius=0.02, location=(sign * 0.36, 0, 1.02), rotation=(0, math.radians(sign * 25), 0))
    pauldron_trim = bpy.context.active_object
    pauldron_trim.name = f"Pauldron_Trim_{side}"
    assign_material(pauldron_trim, mat_gold_trim)

    # Brazo Superior
    bpy.ops.mesh.primitive_cylinder_add(radius=0.08, depth=0.24, location=(sign * 0.34, 0, 0.84), rotation=(0, 0, math.radians(sign * -15)))
    upper_arm = bpy.context.active_object
    upper_arm.name = f"UpperArm_{side}"
    assign_material(upper_arm, mat_tunic)

    # Guantelete / Muñequera de Cuero con Refuerzo de Acero
    bpy.ops.mesh.primitive_cylinder_add(radius=0.09, depth=0.22, location=(sign * 0.40, -0.05, 0.64), rotation=(math.radians(-20), 0, math.radians(sign * -15)))
    gauntlet = bpy.context.active_object
    gauntlet.name = f"Gauntlet_{side}"
    assign_material(gauntlet, mat_leather)

    # Mano
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.075, location=(sign * 0.44, -0.12, 0.50))
    hand = bpy.context.active_object
    hand.name = f"Hand_{side}"
    assign_material(hand, mat_skin)

# --- E. PIERNAS Y BOTAS (LEGS & BOOTS) ---
for side, sign in [("L", -1), ("R", 1)]:
    # Muslo (Pantalón)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.10, depth=0.28, location=(sign * 0.14, 0, 0.38))
    thigh = bpy.context.active_object
    thigh.name = f"Thigh_{side}"
    assign_material(thigh, mat_pants)

    # Bota de Aventura de Cuero Doblada
    bpy.ops.mesh.primitive_cylinder_add(radius=0.115, depth=0.26, location=(sign * 0.14, 0, 0.17))
    boot_leg = bpy.context.active_object
    boot_leg.name = f"Boot_Leg_{side}"
    assign_material(boot_leg, mat_leather)

    # Empeine / Pie de la Bota
    bpy.ops.mesh.primitive_cube_add(size=0.16, location=(sign * 0.14, -0.06, 0.08))
    foot = bpy.context.active_object
    foot.name = f"Foot_{side}"
    foot.scale = (1.1, 1.6, 0.9)
    assign_material(foot, mat_leather)

    # Hebilla Plateada de la Bota
    bpy.ops.mesh.primitive_cube_add(size=0.04, location=(sign * 0.14, -0.15, 0.14))
    boot_buckle = bpy.context.active_object
    boot_buckle.name = f"Boot_Buckle_{side}"
    assign_material(boot_buckle, mat_armor_steel)

# --- F. CAPA FLUIDA HEROICA (FLOWING CAPE) ---
bpy.ops.mesh.primitive_cylinder_add(radius=0.35, depth=0.75, location=(0, 0.22, 0.65), rotation=(math.radians(15), 0, 0))
cape = bpy.context.active_object
cape.name = "Hero_Cape"
cape.scale = (0.9, 0.12, 1.0)
assign_material(cape, mat_cape)

# Broches Dorados de la Capa
for side, sign in [("L", -1), ("R", 1)]:
    bpy.ops.mesh.primitive_ico_sphere_add(radius=0.04, location=(sign * 0.20, 0.12, 1.05))
    brooch = bpy.context.active_object
    brooch.name = f"Cape_Brooch_{side}"
    assign_material(brooch, mat_gold_trim)

# --- G. ESPADA HEROICA DE CABALLERO (BROADSWORD) ---
# Hoja de Acero Brillante
bpy.ops.mesh.primitive_cube_add(size=0.10, location=(0.46, -0.22, 0.60), rotation=(math.radians(35), math.radians(15), math.radians(-20)))
blade = bpy.context.active_object
blade.name = "Sword_Blade"
blade.scale = (0.25, 0.08, 6.8)
assign_material(blade, mat_blade)

# Punta Afilada de la Espada
bpy.ops.mesh.primitive_cone_add(radius1=0.025, depth=0.16, location=(0.60, -0.38, 0.98), rotation=(math.radians(35), math.radians(15), math.radians(-20)))
sword_tip = bpy.context.active_object
sword_tip.name = "Sword_Tip"
assign_material(sword_tip, mat_blade)

# Guarda Cruzada Dorada (Crossguard)
bpy.ops.mesh.primitive_cube_add(size=0.08, location=(0.38, -0.12, 0.35), rotation=(math.radians(35), math.radians(15), math.radians(-20)))
crossguard = bpy.context.active_object
crossguard.name = "Sword_Crossguard"
crossguard.scale = (2.2, 0.6, 0.6)
assign_material(crossguard, mat_gold_trim)

# Empuñadura de Cuero (Hilt)
bpy.ops.mesh.primitive_cylinder_add(radius=0.025, depth=0.18, location=(0.33, -0.06, 0.24), rotation=(math.radians(35), math.radians(15), math.radians(-20)))
hilt = bpy.context.active_object
hilt.name = "Sword_Hilt"
assign_material(hilt, mat_leather)

# Pomo Dorado con Gema (Pommel)
bpy.ops.mesh.primitive_ico_sphere_add(radius=0.045, location=(0.28, 0.0, 0.13))
pommel = bpy.context.active_object
pommel.name = "Sword_Pommel"
assign_material(pommel, mat_magic_gem)

# ==============================================================================
# 4. EXPORTACIÓN PROFESIONAL GLB A LA CARPETA DEL JUEGO
# ==============================================================================
output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "models"))
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, "hero_adventurer.glb")

# Seleccionar todos los objetos de la escena
bpy.ops.object.select_all(action='SELECT')

# Exportar en formato GLTF Binary (.glb) optimizado con PBR
bpy.ops.export_scene.gltf(
    filepath=output_path,
    export_format='GLB',
    use_selection=True,
    export_apply=True,
    export_materials='EXPORT',
    export_attributes=True
)

print(f"✨ [BLENDER EXPORT SUCCESS] Modelo 3D exportado exitosamente a: {output_path}")
