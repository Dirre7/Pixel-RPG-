extends CharacterBody2D

@export var walk_speed: float = 120.0
@export var sprint_speed: float = 180.0

@onready var animated_sprite: AnimatedSprite2D = $AnimatedSprite2D
@onready var camera: Camera2D = $Camera2D

var current_direction: Vector2 = Vector2.DOWN
var is_attacking: bool = false

func _ready() -> void:
	add_to_group("player")
	if animated_sprite.sprite_frames and animated_sprite.sprite_frames.has_animation("idle_down"):
		animated_sprite.play("idle_down")
	animated_sprite.animation_finished.connect(_on_animation_finished)

func _physics_process(_delta: float) -> void:
	if is_attacking:
		velocity = Vector2.ZERO
		move_and_slide()
		return
		
	# Ataque con espada (clic izquierdo o tecla J)
	if Input.is_action_just_pressed("attack") and (not DialogueManager or not DialogueManager.is_dialogue_active):
		_perform_attack()
		return

	var input_vector := Vector2.ZERO
	input_vector.x = Input.get_axis("move_left", "move_right")
	input_vector.y = Input.get_axis("move_up", "move_down")
	
	if input_vector != Vector2.ZERO:
		input_vector = input_vector.normalized()
		current_direction = input_vector
		
		var speed = sprint_speed if Input.is_action_pressed("sprint") else walk_speed
		velocity = input_vector * speed
		
		# Animación según dirección
		if abs(input_vector.x) > abs(input_vector.y):
			if input_vector.x > 0:
				_play_anim("walk_right")
			else:
				_play_anim("walk_left")
		else:
			if input_vector.y > 0:
				_play_anim("walk_down")
			else:
				_play_anim("walk_up")
	else:
		velocity = Vector2.ZERO
		
		# Animación de reposo (Idle)
		if abs(current_direction.x) > abs(current_direction.y):
			if current_direction.x > 0:
				_play_anim("idle_right")
			else:
				_play_anim("idle_left")
		else:
			if current_direction.y > 0:
				_play_anim("idle_down")
			else:
				_play_anim("idle_up")
				
	move_and_slide()

func _perform_attack() -> void:
	is_attacking = true
	if abs(current_direction.x) > abs(current_direction.y):
		if current_direction.x > 0:
			_play_anim("slice_right")
		else:
			_play_anim("slice_left")
	else:
		if current_direction.y > 0:
			_play_anim("slice_down")
		else:
			_play_anim("slice_up")

func _on_animation_finished() -> void:
	if is_attacking:
		is_attacking = false
		if abs(current_direction.x) > abs(current_direction.y):
			_play_anim("idle_right" if current_direction.x > 0 else "idle_left")
		else:
			_play_anim("idle_down" if current_direction.y > 0 else "idle_up")

func _play_anim(anim_name: String) -> void:
	if animated_sprite.sprite_frames and animated_sprite.sprite_frames.has_animation(anim_name):
		if animated_sprite.animation != anim_name:
			animated_sprite.play(anim_name)
