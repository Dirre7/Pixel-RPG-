extends CharacterBody2D

@export var move_speed: float = 60.0
@export var patrol_radius: float = 80.0

var start_position: Vector2
var target_position: Vector2
var time_passed: float = 0.0

@onready var animated_sprite: AnimatedSprite2D = $AnimatedSprite2D

func _ready() -> void:
	start_position = global_position
	_pick_new_target()

func _physics_process(delta: float) -> void:
	time_passed += delta
	# Movimiento suave oscilatorio de vuelo
	var dir = (target_position - global_position).normalized()
	velocity = dir * move_speed
	
	if global_position.distance_to(target_position) < 8.0:
		_pick_new_target()
		
	# Voltear sprite según dirección
	if velocity.x > 0:
		animated_sprite.flip_h = false
	elif velocity.x < 0:
		animated_sprite.flip_h = true
		
	move_and_slide()

func _pick_new_target() -> void:
	var angle = randf() * TAU
	var dist = randf_range(20.0, patrol_radius)
	target_position = start_position + Vector2(cos(angle), sin(angle)) * dist
