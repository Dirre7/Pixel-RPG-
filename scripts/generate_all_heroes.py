import bpy
import math
import os

# ==============================================================================
# 🎮 GENERADOR COMPLETO DE CLASES RPG 3D PARA BLENDER 5.2 LTS
# ==============================================================================

def create_pbr_material(name, base_color, roughness=0.5, metallic=0.0, emissive=(0,0,0,1), emissive_strength=0.0):
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

def assign_material(obj, mat):
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)

CLASSES_CONFIG = {
    'hero_adventurer': {
        'tunic': (0.12, 0.45, 0.85, 1.0),
        'cape': (0.75, 0.10, 0.15, 1.0),
        'hair': (0.85, 0.18, 0.12, 1.0),
        'weapon_type': 'sword_shield',
        'gem': (0.2, 0.8, 1.0, 1.0),
        'metal': 'steel',
    },
    'hero_warrior': {
        'tunic': (0.15, 0.35, 0.75, 1.0),
        'cape': (0.80, 0.15, 0.15, 1.0),
        'hair': (0.85, 0.65, 0.15, 1.0),
        'weapon_type': 'sword_shield',
        'gem': (0.2, 0.6, 1.0, 1.0),
        'metal': 'steel',
    },
    'hero_mage': {
        'tunic': (0.45, 0.15, 0.85, 1.0),
        'cape': (0.20, 0.05, 0.45, 1.0),
        'hair': (0.25, 0.75, 0.95, 1.0),
        'weapon_type': 'arcane_staff',
        'gem': (0.6, 0.2, 1.0, 1.0),
        'metal': 'gold',
    },
    'hero_rogue': {
        'tunic': (0.08, 0.55, 0.35, 1.0),
        'cape': (0.05, 0.25, 0.15, 1.0),
        'hair': (0.15, 0.15, 0.20, 1.0),
        'weapon_type': 'dual_daggers',
        'gem': (0.1, 0.9, 0.4, 1.0),
        'metal': 'dark_steel',
    },
    'hero_paladin': {
        'tunic': (0.92, 0.92, 0.96, 1.0),
        'cape': (0.95, 0.75, 0.15, 1.0),
        'hair': (0.95, 0.85, 0.45, 1.0),
        'weapon_type': 'holy_blade_shield',
        'gem': (1.0, 0.85, 0.2, 1.0),
        'metal': 'gold',
    },
    'hero_necromancer': {
        'tunic': (0.10, 0.08, 0.16, 1.0),
        'cape': (0.35, 0.08, 0.45, 1.0),
        'hair': (0.85, 0.85, 0.90, 1.0),
        'weapon_type': 'skull_staff',
        'gem': (0.7, 0.1, 0.9, 1.0),
        'metal': 'dark_steel',
    },
    'hero_archer': {
        'tunic': (0.22, 0.55, 0.20, 1.0),
        'cape': (0.45, 0.28, 0.12, 1.0),
        'hair': (0.85, 0.45, 0.15, 1.0),
        'weapon_type': 'bow_quiver',
        'gem': (0.3, 0.85, 0.3, 1.0),
        'metal': 'steel',
    },
    'hero_berserker': {
        'tunic': (0.65, 0.15, 0.08, 1.0),
        'cape': (0.25, 0.12, 0.08, 1.0),
        'hair': (0.90, 0.25, 0.05, 1.0),
        'weapon_type': 'dual_axes',
        'gem': (1.0, 0.3, 0.1, 1.0),
        'metal': 'dark_steel',
    },
}

def generate_hero_model(class_key, config, output_dir):
    bpy.ops.wm.read_factory_settings(use_empty=True)

    # Materials
    mat_skin = create_pbr_material("Mat_Skin", (1.0, 0.85, 0.74, 1.0), roughness=0.6, metallic=0.0)
    mat_hair = create_pbr_material("Mat_Hair", config['hair'], roughness=0.45, metallic=0.05)
    mat_tunic = create_pbr_material("Mat_Tunic", config['tunic'], roughness=0.55, metallic=0.05)
    mat_cape = create_pbr_material("Mat_Cape", config['cape'], roughness=0.60, metallic=0.0)
    mat_gem = create_pbr_material("Mat_Gem", config['gem'], roughness=0.1, metallic=0.2, emissive=config['gem'], emissive_strength=2.5)

    if config['metal'] == 'gold':
        mat_armor = create_pbr_material("Mat_Armor", (0.95, 0.78, 0.22, 1.0), roughness=0.20, metallic=0.95)
        mat_trim = create_pbr_material("Mat_Trim", (1.0, 0.92, 0.65, 1.0), roughness=0.15, metallic=0.98)
    elif config['metal'] == 'dark_steel':
        mat_armor = create_pbr_material("Mat_Armor", (0.25, 0.28, 0.35, 1.0), roughness=0.35, metallic=0.85)
        mat_trim = create_pbr_material("Mat_Trim", (0.65, 0.15, 0.25, 1.0), roughness=0.25, metallic=0.60)
    else:
        mat_armor = create_pbr_material("Mat_Armor", (0.55, 0.62, 0.72, 1.0), roughness=0.25, metallic=0.90)
        mat_trim = create_pbr_material("Mat_Trim", (0.95, 0.72, 0.12, 1.0), roughness=0.20, metallic=0.95)

    mat_leather = create_pbr_material("Mat_Leather", (0.35, 0.18, 0.08, 1.0), roughness=0.75, metallic=0.0)
    mat_pants = create_pbr_material("Mat_Pants", (0.08, 0.12, 0.20, 1.0), roughness=0.70, metallic=0.0)
    mat_blade = create_pbr_material("Mat_Blade", (0.92, 0.95, 1.0, 1.0), roughness=0.15, metallic=0.98)
    mat_eye_white = create_pbr_material("Mat_EyeWhite", (1.0, 1.0, 1.0, 1.0), roughness=0.2, metallic=0.0)
    mat_iris = create_pbr_material("Mat_Iris", config['gem'], roughness=0.2, metallic=0.1, emissive=config['gem'], emissive_strength=0.8)
    mat_pupil = create_pbr_material("Mat_Pupil", (0.02, 0.02, 0.04, 1.0), roughness=0.1, metallic=0.0)

    # 1. CABEZA
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.38, location=(0, 0, 1.35), segments=24, ring_count=16)
    head = bpy.context.active_object
    head.scale = (1.0, 0.95, 1.0)
    assign_material(head, mat_skin)

    # Mejillas
    for side, sign in [("L", -1), ("R", 1)]:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.07, location=(sign * 0.22, -0.30, 1.28), segments=12, ring_count=8)
        blush = bpy.context.active_object
        blush.scale = (1.0, 0.3, 0.6)
        mat_blush = create_pbr_material(f"Mat_Blush_{side}", (0.95, 0.40, 0.50, 1.0), roughness=0.8)
        assign_material(blush, mat_blush)

    # Ojos Chibi
    for side, sign in [("L", -1), ("R", 1)]:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.10, location=(sign * 0.15, -0.34, 1.38), segments=16, ring_count=12)
        eye_white = bpy.context.active_object
        eye_white.scale = (1.0, 0.3, 1.2)
        assign_material(eye_white, mat_eye_white)

        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.075, location=(sign * 0.15, -0.365, 1.37), segments=14, ring_count=10)
        iris = bpy.context.active_object
        iris.scale = (0.9, 0.2, 1.1)
        assign_material(iris, mat_iris)

        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.035, location=(sign * 0.15, -0.378, 1.37), segments=10, ring_count=8)
        pupil = bpy.context.active_object
        pupil.scale = (0.8, 0.2, 0.9)
        assign_material(pupil, mat_pupil)

        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.025, location=(sign * 0.13, -0.385, 1.40), segments=8, ring_count=6)
        sparkle = bpy.context.active_object
        assign_material(sparkle, mat_eye_white)

    # 2. CABELLO
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.41, location=(0, 0.03, 1.39), segments=24, ring_count=16)
    hair_base = bpy.context.active_object
    hair_base.scale = (1.02, 1.05, 1.02)
    assign_material(hair_base, mat_hair)

    hair_locks = [
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
        assign_material(lock, mat_hair)

    # Diadema
    bpy.ops.mesh.primitive_torus_add(major_radius=0.39, minor_radius=0.035, location=(0, 0, 1.42), rotation=(math.radians(10), 0, 0))
    headband = bpy.context.active_object
    assign_material(headband, mat_cape)

    bpy.ops.mesh.primitive_ico_sphere_add(radius=0.055, location=(0, -0.38, 1.48))
    head_gem = bpy.context.active_object
    assign_material(head_gem, mat_gem)

    # 3. CUERPO Y TORSO
    bpy.ops.mesh.primitive_cylinder_add(radius=0.25, depth=0.48, location=(0, 0, 0.85))
    torso = bpy.context.active_object
    torso.scale = (1.1, 0.85, 1.0)
    assign_material(torso, mat_tunic)

    bpy.ops.mesh.primitive_cube_add(size=0.32, location=(0, -0.06, 0.90))
    cuirass = bpy.context.active_object
    cuirass.scale = (1.1, 0.5, 0.95)
    assign_material(cuirass, mat_armor)

    bpy.ops.mesh.primitive_torus_add(major_radius=0.22, minor_radius=0.02, location=(0, 0, 0.98), rotation=(math.radians(90), 0, 0))
    gold_collar = bpy.context.active_object
    gold_collar.scale = (1.1, 0.85, 1.0)
    assign_material(gold_collar, mat_trim)

    bpy.ops.mesh.primitive_cylinder_add(radius=0.27, depth=0.07, location=(0, 0, 0.65))
    belt = bpy.context.active_object
    belt.scale = (1.12, 0.88, 1.0)
    assign_material(belt, mat_leather)

    bpy.ops.mesh.primitive_cube_add(size=0.09, location=(0, -0.24, 0.65))
    buckle = bpy.context.active_object
    buckle.scale = (1.2, 0.3, 1.0)
    assign_material(buckle, mat_trim)

    bpy.ops.mesh.primitive_cone_add(radius1=0.34, radius2=0.28, depth=0.22, location=(0, 0, 0.52))
    skirt = bpy.context.active_object
    skirt.scale = (1.1, 0.88, 1.0)
    assign_material(skirt, mat_tunic)

    # 4. HOMBRERAS Y BRAZOS
    for side, sign in [("L", -1), ("R", 1)]:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.14, location=(sign * 0.36, 0, 1.02), segments=16, ring_count=12)
        pauldron = bpy.context.active_object
        pauldron.scale = (1.2, 1.1, 0.8)
        assign_material(pauldron, mat_armor)

        bpy.ops.mesh.primitive_torus_add(major_radius=0.14, minor_radius=0.02, location=(sign * 0.36, 0, 1.02), rotation=(0, math.radians(sign * 25), 0))
        pauldron_trim = bpy.context.active_object
        assign_material(pauldron_trim, mat_trim)

        bpy.ops.mesh.primitive_cylinder_add(radius=0.08, depth=0.24, location=(sign * 0.34, 0, 0.84), rotation=(0, 0, math.radians(sign * -15)))
        upper_arm = bpy.context.active_object
        assign_material(upper_arm, mat_tunic)

        bpy.ops.mesh.primitive_cylinder_add(radius=0.09, depth=0.22, location=(sign * 0.40, -0.05, 0.64), rotation=(math.radians(-20), 0, math.radians(sign * -15)))
        gauntlet = bpy.context.active_object
        assign_material(gauntlet, mat_leather)

        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.075, location=(sign * 0.44, -0.12, 0.50))
        hand = bpy.context.active_object
        assign_material(hand, mat_skin)

    # 5. PIERNAS Y BOTAS
    for side, sign in [("L", -1), ("R", 1)]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.10, depth=0.28, location=(sign * 0.14, 0, 0.38))
        thigh = bpy.context.active_object
        assign_material(thigh, mat_pants)

        bpy.ops.mesh.primitive_cylinder_add(radius=0.115, depth=0.26, location=(sign * 0.14, 0, 0.17))
        boot_leg = bpy.context.active_object
        assign_material(boot_leg, mat_leather)

        bpy.ops.mesh.primitive_cube_add(size=0.16, location=(sign * 0.14, -0.06, 0.08))
        foot = bpy.context.active_object
        foot.scale = (1.1, 1.6, 0.9)
        assign_material(foot, mat_leather)

        bpy.ops.mesh.primitive_cube_add(size=0.04, location=(sign * 0.14, -0.15, 0.14))
        boot_buckle = bpy.context.active_object
        assign_material(boot_buckle, mat_armor)

    # 6. CAPA
    bpy.ops.mesh.primitive_cylinder_add(radius=0.35, depth=0.75, location=(0, 0.22, 0.65), rotation=(math.radians(15), 0, 0))
    cape = bpy.context.active_object
    cape.scale = (0.9, 0.12, 1.0)
    assign_material(cape, mat_cape)

    for side, sign in [("L", -1), ("R", 1)]:
        bpy.ops.mesh.primitive_ico_sphere_add(radius=0.04, location=(sign * 0.20, 0.12, 1.05))
        brooch = bpy.context.active_object
        assign_material(brooch, mat_trim)

    # 7. ARMAS POR CLASE
    wtype = config['weapon_type']

    if 'sword' in wtype:
        bpy.ops.mesh.primitive_cube_add(size=0.10, location=(0.46, -0.22, 0.60), rotation=(math.radians(35), math.radians(15), math.radians(-20)))
        blade = bpy.context.active_object
        blade.scale = (0.25, 0.08, 6.8)
        assign_material(blade, mat_blade)

        bpy.ops.mesh.primitive_cube_add(size=0.08, location=(0.38, -0.12, 0.35), rotation=(math.radians(35), math.radians(15), math.radians(-20)))
        crossguard = bpy.context.active_object
        crossguard.scale = (2.2, 0.6, 0.6)
        assign_material(crossguard, mat_trim)

        # Escudo en brazo izquierdo
        bpy.ops.mesh.primitive_cylinder_add(radius=0.30, depth=0.06, location=(-0.46, -0.15, 0.60), rotation=(math.radians(70), math.radians(-25), 0))
        shield = bpy.context.active_object
        assign_material(shield, mat_armor)

        bpy.ops.mesh.primitive_ico_sphere_add(radius=0.08, location=(-0.46, -0.18, 0.60))
        shield_boss = bpy.context.active_object
        assign_material(shield_boss, mat_trim)

    elif 'staff' in wtype:
        # Báculo Mágico
        bpy.ops.mesh.primitive_cylinder_add(radius=0.035, depth=1.4, location=(0.44, -0.15, 0.70), rotation=(math.radians(15), 0, math.radians(-10)))
        staff = bpy.context.active_object
        assign_material(staff, mat_leather)

        bpy.ops.mesh.primitive_torus_add(major_radius=0.14, minor_radius=0.03, location=(0.48, -0.18, 1.35), rotation=(math.radians(15), 0, math.radians(-10)))
        crest = bpy.context.active_object
        assign_material(crest, mat_trim)

        bpy.ops.mesh.primitive_ico_sphere_add(radius=0.10, subdivisions=1, location=(0.48, -0.18, 1.35))
        orb = bpy.context.active_object
        assign_material(orb, mat_gem)

    elif 'daggers' in wtype:
        for side, sign in [("L", -1), ("R", 1)]:
            bpy.ops.mesh.primitive_cone_add(radius1=0.05, depth=0.45, location=(sign * 0.46, -0.22, 0.45), rotation=(math.radians(145), 0, math.radians(sign * -20)))
            dagger = bpy.context.active_object
            assign_material(dagger, mat_blade)

    elif 'axes' in wtype:
        for side, sign in [("L", -1), ("R", 1)]:
            bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=0.80, location=(sign * 0.44, -0.18, 0.55), rotation=(math.radians(20), 0, math.radians(sign * -15)))
            axe_shaft = bpy.context.active_object
            assign_material(axe_shaft, mat_leather)

            bpy.ops.mesh.primitive_cube_add(size=0.18, location=(sign * 0.44, -0.22, 0.85), rotation=(0, math.radians(90), 0))
            axe_head = bpy.context.active_object
            axe_head.scale = (0.2, 1.6, 1.0)
            assign_material(axe_head, mat_armor)

    elif 'bow' in wtype:
        bpy.ops.mesh.primitive_torus_add(major_radius=0.45, minor_radius=0.03, location=(0.42, -0.15, 0.70), rotation=(math.radians(75), math.radians(45), 0))
        bow = bpy.context.active_object
        assign_material(bow, mat_leather)

    # 8. EXPORTACIÓN GLB
    output_path = os.path.join(output_dir, f"{class_key}.glb")
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=True,
        export_apply=True,
        export_materials='EXPORT',
        export_attributes=True
    )
    print(f"✨ [BLENDER EXPORT] {class_key}.glb guardado con éxito.")

output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "models"))
os.makedirs(output_dir, exist_ok=True)

for class_key, cfg in CLASSES_CONFIG.items():
    generate_hero_model(class_key, cfg, output_dir)

print("👑 [COMPLETADO] Todas las clases RPG exportadas en 3D PBR.")
