extends CharacterBody2D

@export var move_speed: float = 75.0
@export var chase_range: float = 90.0

@onready var animated_sprite: AnimatedSprite2D = $AnimatedSprite2D

var player: Node2D = null

func _ready() -> void:
	await get_tree().process_frame
	var players = get_tree().get_nodes_in_group("player")
	if players.size() > 0:
		player = players[0]

func _physics_process(_delta: float) -> void:
	if not player:
		var players = get_tree().get_nodes_in_group("player")
		if players.size() > 0:
			player = players[0]
		return
		
	var dist = global_position.distance_to(player.global_position)
	
	if dist < chase_range and dist > 12.0:
		# Perseguir al jugador con animación de carrera
		var dir = (player.global_position - global_position).normalized()
		velocity = dir * move_speed
		if animated_sprite.animation != "run":
			animated_sprite.play("run")
		
		if velocity.x > 0:
			animated_sprite.flip_h = false
		elif velocity.x < 0:
			animated_sprite.flip_h = true
	else:
		velocity = Vector2.ZERO
		if animated_sprite.animation != "idle":
			animated_sprite.play("idle")
		
	move_and_slide()
