import bpy
import math
import os

# ==============================================================================
# 👑 GENERADOR 3D PULIDO DE MINIATURAS RETRO RPG (BLENDER 5.2 LTS)
# Basado en los "Characters Icons": Proporciones armoniosas, sombreado suave,
# ojos estilizados con brillo, armas bien proporcionadas en mano y sin colisiones.
# ==============================================================================

def create_pbr_mat(name, base_color, roughness=0.45, metallic=0.0, emissive=(0,0,0,1), emissive_strength=0.0):
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
    # Sombreado suave en mallas
    try:
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.shade_smooth()
    except Exception:
        pass

def build_polished_hero(hero_class: str, gender: str, output_path: str):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    is_female = (gender == 'female')

    # --- PALETAS DE MATERIALES ---
    mat_skin = create_pbr_mat("Skin", (1.0, 0.84, 0.74, 1.0), roughness=0.55)
    mat_skin_shadow = create_pbr_mat("SkinShadow", (0.80, 0.60, 0.48, 1.0), roughness=0.65)
    mat_steel = create_pbr_mat("Steel", (0.75, 0.78, 0.84, 1.0), roughness=0.20, metallic=0.95)
    mat_dark_steel = create_pbr_mat("DarkSteel", (0.24, 0.26, 0.30, 1.0), roughness=0.30, metallic=0.90)
    mat_gold = create_pbr_mat("Gold", (0.95, 0.78, 0.20, 1.0), roughness=0.18, metallic=0.96)
    mat_leather = create_pbr_mat("Leather", (0.38, 0.20, 0.10, 1.0), roughness=0.75)
    mat_dark_leather = create_pbr_mat("DarkLeather", (0.18, 0.10, 0.06, 1.0), roughness=0.80)
    mat_wood = create_pbr_mat("Wood", (0.42, 0.24, 0.12, 1.0), roughness=0.80)
    mat_white = create_pbr_mat("White", (0.98, 0.98, 1.0, 1.0), roughness=0.2)
    mat_pupil = create_pbr_mat("Pupil", (0.05, 0.05, 0.08, 1.0), roughness=0.1)

    if hero_class == 'Guerrero':
        tunic_col = (0.22, 0.25, 0.30, 1.0)
        cape_col = (0.78, 0.12, 0.16, 1.0)
        hair_col = (0.85, 0.65, 0.20, 1.0) if is_female else (0.42, 0.24, 0.12, 1.0)
        glow_col = (0.95, 0.85, 0.25, 1.0)
        iris_col = (0.20, 0.60, 0.95, 1.0)
    elif hero_class == 'Mago':
        tunic_col = (0.22, 0.38, 0.72, 1.0) # Azul Mago Clásico
        cape_col = (0.15, 0.25, 0.55, 1.0)
        hair_col = (0.35, 0.20, 0.12, 1.0)
        glow_col = (0.95, 0.20, 0.20, 1.0) # Orbe rojo
        iris_col = (0.60, 0.25, 0.95, 1.0)
    elif hero_class == 'Pícaro':
        tunic_col = (0.22, 0.26, 0.32, 1.0)
        cape_col = (0.14, 0.16, 0.22, 1.0)
        hair_col = (0.12, 0.12, 0.15, 1.0)
        glow_col = (0.15, 0.90, 0.45, 1.0)
        iris_col = (0.15, 0.85, 0.45, 1.0)
    elif hero_class == 'Paladín':
        tunic_col = (0.92, 0.94, 0.98, 1.0)
        cape_col = (0.95, 0.78, 0.20, 1.0)
        hair_col = (0.92, 0.82, 0.42, 1.0)
        glow_col = (1.0, 0.88, 0.25, 1.0)
        iris_col = (0.95, 0.80, 0.20, 1.0)
    elif hero_class == 'Nigromante':
        tunic_col = (0.12, 0.10, 0.16, 1.0)
        cape_col = (0.25, 0.08, 0.35, 1.0)
        hair_col = (0.85, 0.85, 0.90, 1.0)
        glow_col = (0.25, 0.95, 0.35, 1.0)
        iris_col = (0.25, 0.95, 0.35, 1.0)
    elif hero_class == 'Arquero':
        tunic_col = (0.28, 0.50, 0.24, 1.0) if not is_female else (0.22, 0.38, 0.65, 1.0)
        cape_col = (0.35, 0.22, 0.12, 1.0)
        hair_col = (0.88, 0.70, 0.25, 1.0) if not is_female else (0.75, 0.25, 0.15, 1.0)
        glow_col = (0.30, 0.85, 0.30, 1.0)
        iris_col = (0.25, 0.75, 0.35, 1.0)
    else: # Berserker / Enano
        tunic_col = (0.26, 0.32, 0.42, 1.0)
        cape_col = (0.22, 0.12, 0.08, 1.0)
        hair_col = (0.94, 0.94, 0.96, 1.0) # Barba blanca monumental
        glow_col = (0.95, 0.40, 0.10, 1.0)
        iris_col = (0.90, 0.45, 0.15, 1.0)

    mat_tunic = create_pbr_mat("Tunic", tunic_col, roughness=0.55)
    mat_cape = create_pbr_mat("Cape", cape_col, roughness=0.60)
    mat_hair = create_pbr_mat("Hair", hair_col, roughness=0.45)
    mat_iris = create_pbr_mat("Iris", iris_col, roughness=0.2, emissive=iris_col, emissive_strength=1.5)
    mat_glow = create_pbr_mat("Glow", glow_col, roughness=0.1, emissive=glow_col, emissive_strength=3.0)

    # ==========================================================================
    # 1. CABEZA PROPORCIONAL Y EXPRESIVA (z = 0.96m, radio = 0.14m)
    # ==========================================================================
    head_z = 0.96
    head_r = 0.14

    if hero_class in ['Guerrero', 'Paladín']:
        is_pal = (hero_class == 'Paladín')
        hmat = mat_steel
        tmat = mat_gold if is_pal else mat_steel

        # Casco de Caballero / Cruzado con Ranura en T
        bpy.ops.mesh.primitive_cylinder_add(radius=0.145, depth=0.24, location=(0, 0, head_z))
        helm = bpy.context.active_object
        assign_mat(helm, hmat)

        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.145, location=(0, 0, head_z + 0.10), segments=16, ring_count=12)
        dome = bpy.context.active_object
        dome.scale = (1.0, 1.0, 0.55)
        assign_mat(dome, hmat)

        # Ranura T-Visor
        bpy.ops.mesh.primitive_cube_add(size=0.06, location=(0, -0.142, head_z + 0.02))
        vh = bpy.context.active_object
        vh.scale = (2.2, 0.1, 0.22)
        assign_mat(vh, mat_pupil)

        bpy.ops.mesh.primitive_cube_add(size=0.06, location=(0, -0.142, head_z - 0.03))
        vv = bpy.context.active_object
        vv.scale = (0.35, 0.1, 1.0)
        assign_mat(vv, mat_pupil)

        # Relieve Cruz Dorada
        bpy.ops.mesh.primitive_cube_add(size=0.06, location=(0, -0.140, head_z + 0.02))
        th = bpy.context.active_object
        th.scale = (2.3, 0.06, 0.35)
        assign_mat(th, tmat)

        if is_female:
            # Coleta de pelo rubio
            bpy.ops.mesh.primitive_cylinder_add(radius=0.035, depth=0.32, location=(0, 0.14, head_z - 0.08), rotation=(math.radians(25), 0, 0))
            pony = bpy.context.active_object
            assign_mat(pony, mat_hair)

    else:
        # Cabeza Esculpida Estilizada
        bpy.ops.mesh.primitive_uv_sphere_add(radius=head_r, location=(0, 0, head_z), segments=18, ring_count=14)
        head = bpy.context.active_object
        head.scale = (0.96, 0.92, 1.0)
        assign_mat(head, mat_skin if hero_class != 'Nigromante' else mat_skin_shadow)

        # Ojos Estilizados Proporcionales (Ovalados con Pupila y Brillo)
        for side, sign in [("L", -1), ("R", 1)]:
            # Blanco del ojo
            bpy.ops.mesh.primitive_uv_sphere_add(radius=0.026, location=(sign * 0.052, -0.125, head_z + 0.01), segments=10, ring_count=8)
            ew = bpy.context.active_object
            ew.scale = (1.0, 0.25, 1.25)
            assign_mat(ew, mat_white)

            # Iris de Color
            bpy.ops.mesh.primitive_uv_sphere_add(radius=0.018, location=(sign * 0.052, -0.130, head_z + 0.01), segments=8, ring_count=6)
            iris = bpy.context.active_object
            iris.scale = (0.9, 0.2, 1.1)
            assign_mat(iris, mat_iris)

            # Pupila Negra
            bpy.ops.mesh.primitive_uv_sphere_add(radius=0.010, location=(sign * 0.052, -0.133, head_z + 0.01), segments=6, ring_count=6)
            pupil = bpy.context.active_object
            pupil.scale = (0.8, 0.2, 0.9)
            assign_mat(pupil, mat_pupil)

            # Punto de Brillo Especular
            bpy.ops.mesh.primitive_ico_sphere_add(radius=0.005, location=(sign * 0.052 + 0.004, -0.135, head_z + 0.015))
            spec = bpy.context.active_object
            assign_mat(spec, mat_white)

        # Tocados / Peinados
        if hero_class == 'Mago':
            # Sombrero Cónico Azul de Ala Ancha con Correa de Cuero
            bpy.ops.mesh.primitive_cylinder_add(radius=0.24, depth=0.025, location=(0, -0.01, head_z + 0.08), rotation=(math.radians(6), 0, 0))
            brim = bpy.context.active_object
            assign_mat(brim, mat_tunic)

            bpy.ops.mesh.primitive_cone_add(radius1=0.16, radius2=0.03, depth=0.38, location=(0, 0.02, head_z + 0.26), rotation=(math.radians(-10), 0, 0))
            cone_hat = bpy.context.active_object
            assign_mat(cone_hat, mat_tunic)

            # Correa de Cuero con Hebilla Dorada
            bpy.ops.mesh.primitive_torus_add(major_radius=0.15, minor_radius=0.016, location=(0, 0, head_z + 0.11), rotation=(math.radians(6), 0, 0))
            hstrap = bpy.context.active_object
            assign_mat(hstrap, mat_leather)

            bpy.ops.mesh.primitive_cube_add(size=0.035, location=(0, -0.15, head_z + 0.11), rotation=(math.radians(6), 0, 0))
            hbuckle = bpy.context.active_object
            assign_mat(hbuckle, mat_gold)

            # Cabello
            for side, sign in [("L", -1), ("R", 1)]:
                bpy.ops.mesh.primitive_cylinder_add(radius=0.035, depth=0.30, location=(sign * 0.12, 0.02, head_z - 0.08), rotation=(math.radians(10), 0, math.radians(sign * 10)))
                whair = bpy.context.active_object
                assign_mat(whair, mat_hair)

        elif hero_class in ['Pícaro', 'Nigromante']:
            # Capucha de Asesino / Sombría
            bpy.ops.mesh.primitive_uv_sphere_add(radius=head_r * 1.14, location=(0, 0.02, head_z + 0.01), segments=16, ring_count=12)
            hood = bpy.context.active_object
            hood.scale = (1.02, 1.15, 1.05)
            assign_mat(hood, mat_tunic)

            # Nudo en el cuello
            bpy.ops.mesh.primitive_cube_add(size=0.045, location=(0, -0.14, head_z - 0.14))
            knot = bpy.context.active_object
            assign_mat(knot, mat_cape)

        elif hero_class == 'Arquero':
            # Orejas Élficas Puntiagudas
            for side, sign in [("L", -1), ("R", 1)]:
                bpy.ops.mesh.primitive_cone_add(radius1=0.025, depth=0.14, location=(sign * 0.14, -0.01, head_z + 0.02), rotation=(0, math.radians(sign * 70), math.radians(-sign * 20)))
                ear = bpy.context.active_object
                ear.scale = (0.7, 1.1, 0.35)
                assign_mat(ear, mat_skin)

            # Pelo Élfico
            bpy.ops.mesh.primitive_uv_sphere_add(radius=head_r * 1.04, location=(0, 0.02, head_z + 0.02), segments=14, ring_count=10)
            hair = bpy.context.active_object
            assign_mat(hair, mat_hair)

            for side, sign in [("L", -1), ("R", 1)]:
                bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=0.32, location=(sign * 0.11, 0.03, head_z - 0.10), rotation=(math.radians(10), 0, math.radians(sign * 5)))
                elock = bpy.context.active_object
                assign_mat(elock, mat_hair)

        else: # Berserker / Enano
            # Gran Barba Blanca Espesa
            bpy.ops.mesh.primitive_cone_add(radius1=0.14, radius2=0.04, depth=0.36, location=(0, -0.10, head_z - 0.16), rotation=(math.radians(12), 0, 0))
            beard = bpy.context.active_object
            beard.scale = (1.1, 0.65, 1.0)
            assign_mat(beard, mat_hair)

            bpy.ops.mesh.primitive_cylinder_add(radius=0.035, depth=0.18, location=(0, -0.14, head_z - 0.04), rotation=(0, 0, math.radians(90)))
            mustache = bpy.context.active_object
            assign_mat(mustache, mat_hair)

    # ==========================================================================
    # 2. TORSO Y CINTURÓN (z = 0.68m)
    # ==========================================================================
    torso_z = 0.68
    bpy.ops.mesh.primitive_cylinder_add(radius=0.18, depth=0.28, location=(0, 0, torso_z))
    torso = bpy.context.active_object
    torso.scale = (1.05, 0.75, 1.0)
    assign_mat(torso, mat_tunic)

    if hero_class in ['Guerrero', 'Paladín']:
        bpy.ops.mesh.primitive_cube_add(size=0.18, location=(0, -0.03, torso_z + 0.03))
        plate = bpy.context.active_object
        plate.scale = (1.15, 0.55, 0.85)
        assign_mat(plate, mat_steel)

    # Cinturón con Hebilla
    bpy.ops.mesh.primitive_cylinder_add(radius=0.19, depth=0.06, location=(0, 0, 0.53))
    belt = bpy.context.active_object
    belt.scale = (1.06, 0.78, 1.0)
    assign_mat(belt, mat_dark_leather)

    bpy.ops.mesh.primitive_cube_add(size=0.055, location=(0, -0.16, 0.53))
    buckle = bpy.context.active_object
    buckle.scale = (1.2, 0.3, 1.0)
    assign_mat(buckle, mat_steel if hero_class != 'Paladín' else mat_gold)

    # Faldón / Base de túnica
    bpy.ops.mesh.primitive_cone_add(radius1=0.22, radius2=0.19, depth=0.16, location=(0, 0, 0.44))
    skirt = bpy.context.active_object
    skirt.scale = (1.06, 0.78, 1.0)
    assign_mat(skirt, mat_tunic)

    # ==========================================================================
    # 3. PIERNAS Y BOTAS
    # ==========================================================================
    for side, sign in [("L", -1), ("R", 1)]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.065, depth=0.18, location=(sign * 0.09, 0, 0.34))
        thigh = bpy.context.active_object
        assign_mat(thigh, mat_dark_leather if hero_class == 'Pícaro' else mat_tunic)

        bpy.ops.mesh.primitive_cylinder_add(radius=0.075, depth=0.16, location=(sign * 0.09, 0, 0.17))
        boot = bpy.context.active_object
        assign_mat(boot, mat_leather if hero_class != 'Guerrero' else mat_steel)

        bpy.ops.mesh.primitive_cube_add(size=0.09, location=(sign * 0.09, -0.03, 0.05))
        foot = bpy.context.active_object
        foot.scale = (0.9, 1.4, 0.7)
        assign_mat(foot, mat_leather if hero_class != 'Guerrero' else mat_steel)

    # ==========================================================================
    # 4. HOMBROS Y BRAZOS
    # ==========================================================================
    for side, sign in [("L", -1), ("R", 1)]:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.085, location=(sign * 0.22, 0, 0.78))
        pau = bpy.context.active_object
        pau.scale = (1.1, 0.9, 0.75)
        assign_mat(pau, mat_steel if hero_class in ['Guerrero', 'Paladín'] else mat_tunic)

        bpy.ops.mesh.primitive_cylinder_add(radius=0.055, depth=0.20, location=(sign * 0.21, 0, 0.65), rotation=(0, 0, math.radians(sign * -10)))
        arm = bpy.context.active_object
        assign_mat(arm, mat_tunic if hero_class != 'Berserker' else mat_skin)

        bpy.ops.mesh.primitive_cylinder_add(radius=0.058, depth=0.16, location=(sign * 0.24, -0.04, 0.50), rotation=(math.radians(-15), 0, math.radians(sign * -8)))
        glove = bpy.context.active_object
        assign_mat(glove, mat_dark_leather if hero_class != 'Paladín' else mat_steel)

        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.045, location=(sign * 0.25, -0.08, 0.42))
        hand = bpy.context.active_object
        assign_mat(hand, mat_skin if hero_class != 'Guerrero' else mat_steel)

    # ==========================================================================
    # 5. ARMAS BIEN PROPORCIONADAS EN MANO (Sin atravesar el suelo!)
    # ==========================================================================
    if hero_class in ['Guerrero', 'Paladín']:
        # Espada Recta Levantada
        bpy.ops.mesh.primitive_cube_add(size=0.05, location=(0.28, -0.10, 0.70), rotation=(math.radians(5), 0, math.radians(-10)))
        blade = bpy.context.active_object
        blade.scale = (0.35, 0.08, 7.5)
        assign_mat(blade, mat_steel)

        bpy.ops.mesh.primitive_cube_add(size=0.05, location=(0.28, -0.08, 0.48), rotation=(math.radians(5), 0, math.radians(-10)))
        guard = bpy.context.active_object
        guard.scale = (2.0, 0.5, 0.5)
        assign_mat(guard, mat_gold)

        # Escudo Heráldico con Estrella Radiante
        bpy.ops.mesh.primitive_cube_add(size=0.24, location=(-0.28, -0.10, 0.58), rotation=(math.radians(65), math.radians(-20), 0))
        shield = bpy.context.active_object
        shield.scale = (1.0, 0.10, 1.35)
        assign_mat(shield, mat_steel if hero_class == 'Guerrero' else mat_tunic)

        bpy.ops.mesh.primitive_ico_sphere_add(radius=0.05, subdivisions=1, location=(-0.28, -0.13, 0.58), rotation=(math.radians(65), math.radians(-20), math.radians(45)))
        star = bpy.context.active_object
        star.scale = (1.0, 0.3, 1.4)
        assign_mat(star, mat_glow)

    elif hero_class == 'Mago':
        # Báculo de Madera con Orbe Carmesí Brillante
        bpy.ops.mesh.primitive_cylinder_add(radius=0.024, depth=1.05, location=(0.28, -0.10, 0.68), rotation=(math.radians(8), 0, math.radians(-6)))
        staff = bpy.context.active_object
        assign_mat(staff, mat_wood)

        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.065, location=(0.32, -0.12, 1.20))
        orb = bpy.context.active_object
        assign_mat(orb, mat_glow)

        bpy.ops.mesh.primitive_cylinder_add(radius=0.13, depth=0.03, location=(-0.26, -0.10, 0.52), rotation=(math.radians(70), math.radians(-20), 0))
        buckler = bpy.context.active_object
        assign_mat(buckler, mat_steel)

    elif hero_class == 'Pícaro':
        # Dagas Gemelas de Asesino
        for side, sign in [("L", -1), ("R", 1)]:
            bpy.ops.mesh.primitive_cone_add(radius1=0.03, depth=0.34, location=(sign * 0.30, -0.12, 0.48), rotation=(math.radians(15), 0, math.radians(sign * -75)))
            dag = bpy.context.active_object
            assign_mat(dag, mat_steel)

    elif hero_class == 'Arquero':
        # Incorporar el Arco Élfico de Fantasía PixelLabs (pixellabs-fantasy-weapon-3466.glb)
        bow_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "models", "weapons", "pixellabs-fantasy-weapon-3466.glb"))
        if os.path.exists(bow_path):
            existing_objs = set(bpy.data.objects)
            bpy.ops.import_scene.gltf(filepath=bow_path)
            new_objs = [o for o in bpy.data.objects if o not in existing_objs]
            for o in new_objs:
                if o.type == 'MESH' and o.name != 'Cube':
                    bpy.ops.object.select_all(action='DESELECT')
                    o.select_set(True)
                    bpy.context.view_layer.objects.active = o
                    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
                    o.scale = (0.58, 0.58, 0.58)
                    o.location = (-0.25, -0.08, 0.08)
                    o.rotation_euler = (math.radians(10), math.radians(-5), math.radians(15))
        else:
            bpy.ops.mesh.primitive_torus_add(major_radius=0.26, minor_radius=0.018, location=(-0.27, -0.12, 0.58), rotation=(math.radians(85), math.radians(35), 0))
            bow = bpy.context.active_object
            assign_mat(bow, mat_wood)

        # Carcaj de flechas en la espalda
        bpy.ops.mesh.primitive_cylinder_add(radius=0.06, depth=0.38, location=(0.10, 0.14, 0.68), rotation=(math.radians(-25), math.radians(-15), 0))
        quiver = bpy.context.active_object
        assign_mat(quiver, mat_leather)

    elif hero_class == 'Nigromante':
        # Báculo de Hueso con Calavera de Fuego Verde
        bpy.ops.mesh.primitive_cylinder_add(radius=0.024, depth=1.05, location=(0.28, -0.10, 0.68), rotation=(math.radians(8), 0, math.radians(-6)))
        nstaff = bpy.context.active_object
        assign_mat(nstaff, mat_dark_steel)

        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.07, location=(0.32, -0.12, 1.18))
        nskull = bpy.context.active_object
        assign_mat(nskull, mat_skin_shadow)

        bpy.ops.mesh.primitive_ico_sphere_add(radius=0.04, location=(0.32, -0.12, 1.25))
        nfire = bpy.context.active_object
        assign_mat(nfire, mat_glow)

    else: # Berserker / Enano
        # Incorporar el Martillo de Guerra PixelLabs (pixellabs-warhammer-3626.glb) erguido y firme en la mano
        warhammer_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "models", "weapons", "pixellabs-warhammer-3626.glb"))
        if os.path.exists(warhammer_path):
            existing_objs = set(bpy.data.objects)
            bpy.ops.import_scene.gltf(filepath=warhammer_path)
            new_objs = [o for o in bpy.data.objects if o not in existing_objs]
            for o in new_objs:
                if o.type == 'MESH' and o.name != 'Cube':
                    bpy.ops.object.select_all(action='DESELECT')
                    o.select_set(True)
                    bpy.context.view_layer.objects.active = o
                    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
                    o.scale = (0.58, 0.58, 0.58)
                    o.location = (0.24, -0.06, 0.16)
                    o.rotation_euler = (math.radians(-5), math.radians(10), math.radians(-15))
        else:
            bpy.ops.mesh.primitive_cylinder_add(radius=0.028, depth=0.75, location=(0.25, -0.08, 0.52), rotation=(math.radians(15), 0, math.radians(-10)))
            ashaft = bpy.context.active_object
            assign_mat(ashaft, mat_wood)

            bpy.ops.mesh.primitive_cube_add(size=0.14, location=(0.28, -0.12, 0.78), rotation=(0, math.radians(90), 0))
            ahead = bpy.context.active_object
            ahead.scale = (0.2, 1.8, 1.1)
            assign_mat(ahead, mat_steel)

    # ==========================================================================
    # 6. EXPORTACIÓN GLB
    # ==========================================================================
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=True,
        export_apply=True,
        export_materials='EXPORT',
        export_attributes=True
    )
    print(f"✨ [BLENDER 5.2 POLISHED] {os.path.basename(output_path)} exportado correctamente.")

# ==============================================================================
# BUCLE DE EXPORTACIÓN
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
        out_f = os.path.join(output_dir, f"{ckey}_{gender}.glb")
        build_polished_hero(cname, gender, out_f)

    build_miniature_hero_alias = os.path.join(output_dir, f"{ckey}.glb")
    build_polished_hero(cname, 'female', build_miniature_hero_alias)

build_polished_hero('Guerrero', 'female', os.path.join(output_dir, "hero_adventurer.glb"))

print("👑 [COMPLETADO CON ÉXITO] 16 Modelos 3D Pulidos exportados a public/models.")
