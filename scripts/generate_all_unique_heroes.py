import bpy
import math
import os

# ==============================================================================
# 🎮 GENERADOR AVANZADO DE MODELOS 3D POR CLASE Y GÉNERO (BLENDER 5.2 LTS)
# Proporciones Heroicas Estilizadas (~6.5 cabezas), Siluetas Únicas, Ropajes y Armaduras
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

# ==============================================================================
# GENERADOR PRINCIPAL DE MODELO POR CLASE Y GÉNERO
# ==============================================================================
def build_hero_model(hero_class: str, gender: str, output_path: str):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    is_female = (gender == 'female')

    # --- PALETAS DE MATERIALES ---
    mat_skin = create_pbr_mat("Skin", (1.0, 0.84, 0.74, 1.0), roughness=0.6)
    mat_eye_white = create_pbr_mat("EyeWhite", (1.0, 1.0, 1.0, 1.0), roughness=0.2)
    mat_pupil = create_pbr_mat("Pupil", (0.02, 0.02, 0.04, 1.0), roughness=0.1)
    mat_steel = create_pbr_mat("Steel", (0.65, 0.70, 0.78, 1.0), roughness=0.25, metallic=0.92)
    mat_dark_steel = create_pbr_mat("DarkSteel", (0.22, 0.24, 0.28, 1.0), roughness=0.35, metallic=0.88)
    mat_gold = create_pbr_mat("Gold", (0.95, 0.76, 0.18, 1.0), roughness=0.18, metallic=0.96)
    mat_leather = create_pbr_mat("Leather", (0.35, 0.18, 0.08, 1.0), roughness=0.75)
    mat_dark_leather = create_pbr_mat("DarkLeather", (0.16, 0.10, 0.06, 1.0), roughness=0.80)
    mat_wood = create_pbr_mat("Wood", (0.42, 0.24, 0.12, 1.0), roughness=0.85)

    # Colores específicos por clase
    if hero_class == 'Guerrero':
        tunic_col = (0.15, 0.38, 0.72, 1.0)
        cape_col = (0.78, 0.12, 0.15, 1.0)
        hair_col = (0.85, 0.65, 0.18, 1.0) if is_female else (0.45, 0.25, 0.12, 1.0)
        eye_col = (0.15, 0.55, 0.85, 1.0)
        glow_col = (0.2, 0.6, 1.0, 1.0)
    elif hero_class == 'Mago':
        tunic_col = (0.42, 0.12, 0.78, 1.0)
        cape_col = (0.22, 0.06, 0.45, 1.0)
        hair_col = (0.30, 0.78, 0.95, 1.0) if is_female else (0.85, 0.85, 0.90, 1.0)
        eye_col = (0.55, 0.20, 0.95, 1.0)
        glow_col = (0.6, 0.2, 1.0, 1.0)
    elif hero_class == 'Pícaro':
        tunic_col = (0.08, 0.48, 0.32, 1.0)
        cape_col = (0.05, 0.20, 0.12, 1.0)
        hair_col = (0.12, 0.12, 0.16, 1.0)
        eye_col = (0.10, 0.85, 0.45, 1.0)
        glow_col = (0.1, 0.9, 0.4, 1.0)
    elif hero_class == 'Paladín':
        tunic_col = (0.94, 0.94, 0.96, 1.0)
        cape_col = (0.95, 0.78, 0.15, 1.0)
        hair_col = (0.95, 0.88, 0.45, 1.0)
        eye_col = (0.95, 0.80, 0.20, 1.0)
        glow_col = (1.0, 0.85, 0.25, 1.0)
    elif hero_class == 'Nigromante':
        tunic_col = (0.10, 0.08, 0.14, 1.0)
        cape_col = (0.28, 0.06, 0.38, 1.0)
        hair_col = (0.85, 0.85, 0.90, 1.0) if is_female else (0.15, 0.12, 0.20, 1.0)
        eye_col = (0.20, 0.95, 0.40, 1.0)
        glow_col = (0.2, 0.95, 0.4, 1.0)
    elif hero_class == 'Arquero':
        tunic_col = (0.20, 0.52, 0.18, 1.0)
        cape_col = (0.42, 0.25, 0.12, 1.0)
        hair_col = (0.88, 0.42, 0.12, 1.0) if is_female else (0.85, 0.70, 0.20, 1.0)
        eye_col = (0.20, 0.75, 0.30, 1.0)
        glow_col = (0.3, 0.85, 0.3, 1.0)
    else: # Berserker
        tunic_col = (0.65, 0.12, 0.08, 1.0)
        cape_col = (0.25, 0.10, 0.06, 1.0)
        hair_col = (0.88, 0.20, 0.05, 1.0)
        eye_col = (0.95, 0.35, 0.10, 1.0)
        glow_col = (1.0, 0.3, 0.1, 1.0)

    mat_tunic = create_pbr_mat("Tunic", tunic_col, roughness=0.55)
    mat_cape = create_pbr_mat("Cape", cape_col, roughness=0.60)
    mat_hair = create_pbr_mat("Hair", hair_col, roughness=0.45)
    mat_iris = create_pbr_mat("Iris", eye_col, roughness=0.2, emissive=eye_col, emissive_strength=1.2)
    mat_glow = create_pbr_mat("Glow", glow_col, roughness=0.1, emissive=glow_col, emissive_strength=3.0)

    # --- 1. CABEZA PROPORCIONAL Y ESTILIZADA (0.16m radio, ~1.60m altura) ---
    head_y = 1.62
    head_radius = 0.16 if not is_female else 0.145
    bpy.ops.mesh.primitive_uv_sphere_add(radius=head_radius, location=(0, 0, head_y), segments=20, ring_count=14)
    head = bpy.context.active_object
    head.scale = (0.95, 0.95, 1.0) if not is_female else (0.90, 0.90, 0.98)
    assign_mat(head, mat_skin)

    # Cuello
    bpy.ops.mesh.primitive_cylinder_add(radius=0.05 if not is_female else 0.042, depth=0.10, location=(0, 0, head_y - 0.18))
    neck = bpy.context.active_object
    assign_mat(neck, mat_skin)

    # Ojos estilizados
    for side, sign in [("L", -1), ("R", 1)]:
        eye_x = sign * (0.055 if is_female else 0.062)
        eye_z = head_y + 0.02
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.038, location=(eye_x, -head_radius * 0.88, eye_z), segments=12, ring_count=8)
        eye_w = bpy.context.active_object
        eye_w.scale = (1.0, 0.25, 1.2)
        assign_mat(eye_w, mat_eye_white)

        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.026, location=(eye_x, -head_radius * 0.94, eye_z), segments=10, ring_count=8)
        iris = bpy.context.active_object
        iris.scale = (0.9, 0.2, 1.1)
        assign_mat(iris, mat_iris)

        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.012, location=(eye_x, -head_radius * 0.98, eye_z), segments=8, ring_count=6)
        pupil = bpy.context.active_object
        pupil.scale = (0.8, 0.2, 0.9)
        assign_mat(pupil, mat_pupil)

    # --- 2. PEINADOS Y TOCADOS ESPECÍFICOS POR CLASE Y GÉNERO ---
    if hero_class == 'Mago':
        # Sombrero Cónico de Archimago (Wizard Hat)
        bpy.ops.mesh.primitive_torus_add(major_radius=0.28, minor_radius=0.035, location=(0, -0.02, head_y + 0.10), rotation=(math.radians(12), 0, 0))
        brim = bpy.context.active_object
        assign_mat(brim, mat_tunic)

        bpy.ops.mesh.primitive_cone_add(radius1=0.22, radius2=0.04, depth=0.55, location=(0, 0.02, head_y + 0.36), rotation=(math.radians(-10), 0, 0))
        cone_hat = bpy.context.active_object
        assign_mat(cone_hat, mat_tunic)

        bpy.ops.mesh.primitive_torus_add(major_radius=0.20, minor_radius=0.02, location=(0, -0.01, head_y + 0.15), rotation=(math.radians(10), 0, 0))
        band = bpy.context.active_object
        assign_mat(band, mat_gold)

        if is_female:
            # Mechones laterales largos de hechicera
            for side, sign in [("L", -1), ("R", 1)]:
                bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=0.45, location=(sign * 0.16, -0.04, head_y - 0.15), rotation=(math.radians(15), 0, math.radians(sign * 10)))
                lock = bpy.context.active_object
                assign_mat(lock, mat_hair)

    elif hero_class == 'Pícaro':
        # Capucha de Asesino (Assassin Hood) + Máscara de Sigilo
        bpy.ops.mesh.primitive_uv_sphere_add(radius=head_radius * 1.18, location=(0, 0.03, head_y + 0.02), segments=16, ring_count=12)
        hood = bpy.context.active_object
        hood.scale = (1.02, 1.15, 1.05)
        assign_mat(hood, mat_cape)

        # Máscara facial inferior
        bpy.ops.mesh.primitive_cylinder_add(radius=head_radius * 0.85, depth=0.10, location=(0, -head_radius * 0.45, head_y - 0.06), rotation=(math.radians(15), 0, 0))
        mask = bpy.context.active_object
        mask.scale = (0.9, 0.6, 0.9)
        assign_mat(mask, mat_dark_leather)

        if is_female:
            # Trenza de asesina cayendo por la espalda
            bpy.ops.mesh.primitive_cylinder_add(radius=0.035, depth=0.60, location=(0.08, 0.20, head_y - 0.25), rotation=(math.radians(20), 0, math.radians(-15)))
            braid = bpy.context.active_object
            assign_mat(braid, mat_hair)

    elif hero_class == 'Guerrero':
        if not is_female:
            # Yelmo de Caballero con Visera y Penacho
            bpy.ops.mesh.primitive_uv_sphere_add(radius=head_radius * 1.12, location=(0, 0.01, head_y + 0.03), segments=16, ring_count=12)
            helm = bpy.context.active_object
            assign_mat(helm, mat_steel)

            # Penacho Carmesí Superior
            bpy.ops.mesh.primitive_cone_add(radius1=0.04, radius2=0.08, depth=0.35, location=(0, 0.08, head_y + 0.28), rotation=(math.radians(45), 0, 0))
            plume = bpy.context.active_object
            plume.scale = (0.6, 1.4, 1.0)
            assign_mat(plume, mat_cape)
        else:
            # Diadema Alada de Guerrera + Coleta de Caballo
            bpy.ops.mesh.primitive_torus_add(major_radius=head_radius * 1.02, minor_radius=0.02, location=(0, 0, head_y + 0.05))
            tiara = bpy.context.active_object
            assign_mat(tiara, mat_steel)

            bpy.ops.mesh.primitive_cylinder_add(radius=0.045, depth=0.55, location=(0, 0.18, head_y - 0.12), rotation=(math.radians(35), 0, 0))
            ponytail = bpy.context.active_object
            assign_mat(ponytail, mat_hair)

    elif hero_class == 'Paladín':
        # Corona / Halo Dorado Radiante
        bpy.ops.mesh.primitive_torus_add(major_radius=head_radius * 1.15, minor_radius=0.025, location=(0, 0, head_y + 0.14), rotation=(math.radians(15), 0, 0))
        halo = bpy.context.active_object
        assign_mat(halo, mat_glow)

        bpy.ops.mesh.primitive_uv_sphere_add(radius=head_radius * 1.05, location=(0, 0.02, head_y + 0.02))
        hair_dome = bpy.context.active_object
        assign_mat(hair_dome, mat_hair)

    elif hero_class == 'Nigromante':
        # Capucha Profunda de Nigromante con Cuernos
        bpy.ops.mesh.primitive_uv_sphere_add(radius=head_radius * 1.20, location=(0, 0.05, head_y + 0.02), segments=16, ring_count=12)
        necro_hood = bpy.context.active_object
        necro_hood.scale = (1.05, 1.25, 1.10)
        assign_mat(necro_hood, mat_tunic)

        # Pequeños cuernos esqueléticos
        for side, sign in [("L", -1), ("R", 1)]:
            bpy.ops.mesh.primitive_cone_add(radius1=0.035, depth=0.22, location=(sign * 0.14, 0.08, head_y + 0.16), rotation=(math.radians(-25), math.radians(sign * 40), 0))
            horn = bpy.context.active_object
            assign_mat(horn, mat_dark_steel)

    elif hero_class == 'Arquero':
        # Orejas Élficas Puntiagudas
        for side, sign in [("L", -1), ("R", 1)]:
            bpy.ops.mesh.primitive_cone_add(radius1=0.035, depth=0.18, location=(sign * (head_radius + 0.04), 0.02, head_y + 0.02), rotation=(0, math.radians(sign * 70), math.radians(-sign * 25)))
            ear = bpy.context.active_object
            ear.scale = (0.8, 1.2, 0.4)
            assign_mat(ear, mat_skin)

        # Pelo Élfico con Cinta
        bpy.ops.mesh.primitive_uv_sphere_add(radius=head_radius * 1.05, location=(0, 0.02, head_y + 0.02))
        elven_hair = bpy.context.active_object
        assign_mat(elven_hair, mat_hair)

        if is_female:
            for side, sign in [("L", -1), ("R", 1)]:
                bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=0.55, location=(sign * 0.12, 0.14, head_y - 0.20), rotation=(math.radians(20), 0, math.radians(sign * 5)))
                side_lock = bpy.context.active_object
                assign_mat(side_lock, mat_hair)

    else: # Berserker
        # Casco con Grandes Cuernos de Bárbaro
        bpy.ops.mesh.primitive_uv_sphere_add(radius=head_radius * 1.08, location=(0, 0.01, head_y + 0.02))
        barb_cap = bpy.context.active_object
        assign_mat(barb_cap, mat_dark_leather)

        for side, sign in [("L", -1), ("R", 1)]:
            bpy.ops.mesh.primitive_cone_add(radius1=0.055, depth=0.35, location=(sign * 0.18, 0, head_y + 0.12), rotation=(0, math.radians(sign * 60), math.radians(sign * -30)))
            bhorn = bpy.context.active_object
            assign_mat(bhorn, mat_steel if not is_female else mat_gold)

        # Melena salvaje
        bpy.ops.mesh.primitive_cylinder_add(radius=0.12, depth=0.50, location=(0, 0.15, head_y - 0.15), rotation=(math.radians(25), 0, 0))
        wild_hair = bpy.context.active_object
        assign_mat(wild_hair, mat_hair)

    # --- 3. TORSO Y ROPAJES ESPECÍFICOS SEGÚN CLASE ---
    torso_y = 1.18

    if hero_class in ['Mago', 'Nigromante']:
        # 🪄 TÚNICA LARGA HASTA EL SUELO (Sin piernas visibles / Robe)
        robe_depth = 1.25
        bpy.ops.mesh.primitive_cone_add(radius1=0.38 if not is_female else 0.34, radius2=0.16 if not is_female else 0.13, depth=robe_depth, location=(0, 0, 0.65))
        robe = bpy.context.active_object
        robe.scale = (1.05, 0.85, 1.0)
        assign_mat(robe, mat_tunic)

        # Cinturón Místico
        bpy.ops.mesh.primitive_torus_add(major_radius=0.18, minor_radius=0.025, location=(0, 0, 1.02))
        robe_belt = bpy.context.active_object
        assign_mat(robe_belt, mat_gold if hero_class == 'Mago' else mat_dark_steel)

        # Manto superior / Capa
        bpy.ops.mesh.primitive_cylinder_add(radius=0.22, depth=0.45, location=(0, 0.05, 1.20))
        mantle = bpy.context.active_object
        mantle.scale = (1.1, 0.85, 1.0)
        assign_mat(mantle, mat_cape)

    else:
        # ⚔️ TORSO ATLETA / ARMADURA CON PIERNAS
        chest_w = 0.32 if not is_female else 0.27
        waist_w = 0.24 if not is_female else 0.20
        torso_h = 0.44

        bpy.ops.mesh.primitive_cylinder_add(radius=chest_w, depth=torso_h, location=(0, 0, torso_y))
        torso = bpy.context.active_object
        torso.scale = (1.0, 0.70, 1.0)
        assign_mat(torso, mat_tunic)

        # Peto de Armadura para Guerrero, Paladín y Berserker
        if hero_class in ['Guerrero', 'Paladín']:
            bpy.ops.mesh.primitive_cube_add(size=0.26, location=(0, -0.04, torso_y + 0.04))
            cuirass = bpy.context.active_object
            cuirass.scale = (1.15, 0.55, 0.95)
            assign_mat(cuirass, mat_steel if hero_class == 'Guerrero' else mat_gold)
        elif hero_class == 'Berserker':
            # Arnés cruzado de cuero
            bpy.ops.mesh.primitive_torus_add(major_radius=0.24, minor_radius=0.03, location=(0, 0, torso_y), rotation=(math.radians(45), math.radians(35), 0))
            harness = bpy.context.active_object
            assign_mat(harness, mat_dark_leather)

        # Cinturón
        bpy.ops.mesh.primitive_cylinder_add(radius=waist_w + 0.03, depth=0.06, location=(0, 0, 0.94))
        belt = bpy.context.active_object
        belt.scale = (1.08, 0.75, 1.0)
        assign_mat(belt, mat_leather)

        # Faldón / Grebas
        bpy.ops.mesh.primitive_cone_add(radius1=waist_w + 0.08, radius2=waist_w + 0.02, depth=0.22, location=(0, 0, 0.82))
        faldon = bpy.context.active_object
        faldon.scale = (1.08, 0.75, 1.0)
        assign_mat(faldon, mat_tunic if hero_class != 'Paladín' else mat_steel)

        # --- 4. PIERNAS Y BOTAS HEROICAS ---
        leg_spacing = 0.12 if not is_female else 0.10
        for side, sign in [("L", -1), ("R", 1)]:
            # Muslo
            bpy.ops.mesh.primitive_cylinder_add(radius=0.075 if not is_female else 0.065, depth=0.38, location=(sign * leg_spacing, 0, 0.58))
            thigh = bpy.context.active_object
            assign_mat(thigh, mat_dark_leather if hero_class == 'Pícaro' else mat_tunic)

            # Bota Alta
            bpy.ops.mesh.primitive_cylinder_add(radius=0.085 if not is_female else 0.072, depth=0.36, location=(sign * leg_spacing, 0, 0.22))
            boot = bpy.context.active_object
            assign_mat(boot, mat_steel if hero_class in ['Guerrero', 'Paladín'] else mat_leather)

            # Pie
            bpy.ops.mesh.primitive_cube_add(size=0.12, location=(sign * leg_spacing, -0.05, 0.06))
            foot = bpy.context.active_object
            foot.scale = (0.9, 1.6, 0.7)
            assign_mat(foot, mat_steel if hero_class in ['Guerrero', 'Paladín'] else mat_leather)

    # --- 5. HOMBRERAS Y BRAZOS ---
    arm_x = 0.32 if not is_female else 0.28
    for side, sign in [("L", -1), ("R", 1)]:
        # Hombreras específicas
        if hero_class == 'Paladín':
            # Grandes hombreras aladas doradas
            bpy.ops.mesh.primitive_cone_add(radius1=0.16, depth=0.32, location=(sign * (arm_x + 0.04), 0, 1.34), rotation=(0, 0, math.radians(sign * -60)))
            pau = bpy.context.active_object
            assign_mat(pau, mat_gold)
        elif hero_class == 'Guerrero':
            bpy.ops.mesh.primitive_uv_sphere_add(radius=0.14, location=(sign * arm_x, 0, 1.32))
            pau = bpy.context.active_object
            pau.scale = (1.2, 1.0, 0.8)
            assign_mat(pau, mat_steel)
        elif hero_class == 'Berserker':
            # Piel de lobo / pelaje
            bpy.ops.mesh.primitive_ico_sphere_add(radius=0.14, location=(sign * arm_x, 0, 1.32))
            fur = bpy.context.active_object
            assign_mat(fur, mat_dark_leather)

        # Brazo superior
        bpy.ops.mesh.primitive_cylinder_add(radius=0.065 if not is_female else 0.055, depth=0.30, location=(sign * arm_x, 0, 1.15), rotation=(0, 0, math.radians(sign * -12)))
        uarm = bpy.context.active_object
        assign_mat(uarm, mat_tunic if hero_class != 'Berserker' else mat_skin)

        # Antebrazo / Guantelete
        bpy.ops.mesh.primitive_cylinder_add(radius=0.07 if not is_female else 0.058, depth=0.28, location=(sign * (arm_x + 0.05), -0.04, 0.90), rotation=(math.radians(-15), 0, math.radians(sign * -10)))
        farm = bpy.context.active_object
        assign_mat(farm, mat_steel if hero_class in ['Guerrero', 'Paladín'] else mat_leather)

        # Mano
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.055 if not is_female else 0.045, location=(sign * (arm_x + 0.08), -0.10, 0.74))
        hand = bpy.context.active_object
        assign_mat(hand, mat_skin)

    # --- 6. ARMAS ÚNICAS POR CLASE ---
    if hero_class == 'Guerrero':
        # Gran Mandoble de Acero (Broadsword)
        bpy.ops.mesh.primitive_cube_add(size=0.08, location=(0.42, -0.18, 0.95), rotation=(math.radians(25), math.radians(10), math.radians(-15)))
        blade = bpy.context.active_object
        blade.scale = (0.28, 0.08, 9.5)
        assign_mat(blade, mat_steel)

        bpy.ops.mesh.primitive_cube_add(size=0.08, location=(0.36, -0.10, 0.60), rotation=(math.radians(25), math.radians(10), math.radians(-15)))
        guard = bpy.context.active_object
        guard.scale = (2.6, 0.6, 0.6)
        assign_mat(guard, mat_gold)

        # Escudo de Caballero en brazo izquierdo
        bpy.ops.mesh.primitive_cylinder_add(radius=0.28, depth=0.05, location=(-0.40, -0.15, 0.90), rotation=(math.radians(65), math.radians(-30), 0))
        shield = bpy.context.active_object
        assign_mat(shield, mat_steel)

    elif hero_class == 'Mago':
        # Báculo Arcano con Cristal Flotante
        bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=1.65, location=(0.42, -0.12, 0.95), rotation=(math.radians(15), 0, math.radians(-8)))
        staff = bpy.context.active_object
        assign_mat(staff, mat_wood)

        bpy.ops.mesh.primitive_torus_add(major_radius=0.14, minor_radius=0.025, location=(0.46, -0.16, 1.72), rotation=(math.radians(15), 0, math.radians(-8)))
        staff_crest = bpy.context.active_object
        assign_mat(staff_crest, mat_gold)

        bpy.ops.mesh.primitive_ico_sphere_add(radius=0.09, subdivisions=1, location=(0.46, -0.16, 1.72))
        staff_gem = bpy.context.active_object
        assign_mat(staff_gem, mat_glow)

    elif hero_class == 'Pícaro':
        # Dagas Gemelas de Asesino
        for side, sign in [("L", -1), ("R", 1)]:
            bpy.ops.mesh.primitive_cone_add(radius1=0.045, depth=0.48, location=(sign * 0.42, -0.18, 0.68), rotation=(math.radians(145), 0, math.radians(sign * -25)))
            dagger = bpy.context.active_object
            assign_mat(dagger, mat_dark_steel)

    elif hero_class == 'Paladín':
        # Espada Sagrada de la Luz + Gran Pavés
        bpy.ops.mesh.primitive_cube_add(size=0.09, location=(0.44, -0.18, 1.05), rotation=(math.radians(25), math.radians(10), math.radians(-15)))
        hblade = bpy.context.active_object
        hblade.scale = (0.30, 0.08, 10.5)
        assign_mat(hblade, mat_steel)

        # Gran Escudo de Torre León Dorado
        bpy.ops.mesh.primitive_cube_add(size=0.35, location=(-0.44, -0.18, 0.90), rotation=(math.radians(65), math.radians(-25), 0))
        tshield = bpy.context.active_object
        tshield.scale = (1.2, 0.15, 1.8)
        assign_mat(tshield, mat_gold)

    elif hero_class == 'Nigromante':
        # Báculo de Hueso con Calavera Cornuda
        bpy.ops.mesh.primitive_cylinder_add(radius=0.032, depth=1.60, location=(0.42, -0.12, 0.95), rotation=(math.radians(15), 0, math.radians(-8)))
        bstaff = bpy.context.active_object
        assign_mat(bstaff, mat_dark_steel)

        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.12, location=(0.46, -0.16, 1.70))
        skull = bpy.context.active_object
        assign_mat(skull, mat_skin)

        bpy.ops.mesh.primitive_ico_sphere_add(radius=0.06, location=(0.46, -0.16, 1.85))
        nfire = bpy.context.active_object
        assign_mat(nfire, mat_glow)

    elif hero_class == 'Arquero':
        # Gran Arco Recurvo Élfico
        bpy.ops.mesh.primitive_torus_add(major_radius=0.55, minor_radius=0.028, location=(0.38, -0.12, 0.95), rotation=(math.radians(75), math.radians(35), 0))
        bow = bpy.context.active_object
        assign_mat(bow, mat_wood)

        # Carcaj con Flechas en la espalda
        bpy.ops.mesh.primitive_cylinder_add(radius=0.09, depth=0.65, location=(-0.10, 0.22, 1.15), rotation=(math.radians(-25), math.radians(25), 0))
        quiver = bpy.context.active_object
        assign_mat(quiver, mat_leather)

    else: # Berserker
        # Hachas Dobles de Guerra Bárbaras
        for side, sign in [("L", -1), ("R", 1)]:
            bpy.ops.mesh.primitive_cylinder_add(radius=0.032, depth=0.85, location=(sign * 0.42, -0.16, 0.80), rotation=(math.radians(20), 0, math.radians(sign * -15)))
            shaft = bpy.context.active_object
            assign_mat(shaft, mat_wood)

            bpy.ops.mesh.primitive_cube_add(size=0.22, location=(sign * 0.42, -0.22, 1.12), rotation=(0, math.radians(90), 0))
            head = bpy.context.active_object
            head.scale = (0.2, 1.8, 1.1)
            assign_mat(head, mat_steel)

    # --- 7. EXPORTACIÓN GLB ---
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=True,
        export_apply=True,
        export_materials='EXPORT',
        export_attributes=True
    )
    print(f"✨ [BLENDER 5.2] {os.path.basename(output_path)} exportado correctamente.")

# ==============================================================================
# EJECUCIÓN PARA TODAS LAS CLASES Y AMBOS GÉNEROS
# ==============================================================================
output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "models"))
os.makedirs(output_dir, exist_ok=True)

CLASS_MAP = {
    'Guerrero': 'hero_warrior',
    'Mago': 'hero_mage',
    'Pícaro': 'hero_rogue',
    'Paladín': 'hero_paladin',
    'Nigromante': 'hero_necromancer',
    'Arquero': 'hero_archer',
    'Berserker': 'hero_berserker',
}

for cname, ckey in CLASS_MAP.items():
    for gender in ['male', 'female']:
        file_name = f"{ckey}_{gender}.glb"
        out_file = os.path.join(output_dir, file_name)
        build_hero_model(cname, gender, out_file)

    # Export fallback alias (e.g. hero_warrior.glb)
    fallback_file = os.path.join(output_dir, f"{ckey}.glb")
    build_hero_model(cname, 'female', fallback_file)

# Export base adventurer alias
build_hero_model('Guerrero', 'female', os.path.join(output_dir, "hero_adventurer.glb"))

print("👑 [COMPLETADO CON ÉXITO] 16 Modelos 3D de Blender 5.2 únicos exportados a public/models.")
