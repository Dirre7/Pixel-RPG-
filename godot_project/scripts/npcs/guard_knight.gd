extends CharacterBody2D

@export var speaker_name: String = "Guardia de la Puerta Norte"
@export var dialogue_lines: Array[String] = [
	"¡Saludos, noble viajero! Bienvenido a la Aldea de Roble en Aethelgard.",
	"Los caminos del bosque están agitados... los murciélagos y las ratas de las cloacas merodean cerca.",
	"¡Mantén tu espada lista con clic izquierdo y ten mucho cuidado ahí fuera!"
]

@onready var prompt: Label = $InteractPrompt
var player_in_range: bool = false

func _ready() -> void:
	if prompt:
		prompt.visible = false

func _on_interaction_area_body_entered(body: Node2D) -> void:
	if body.name == "Player":
		player_in_range = true
		if prompt:
			prompt.visible = true

func _on_interaction_area_body_exited(body: Node2D) -> void:
	if body.name == "Player":
		player_in_range = false
		if prompt:
			prompt.visible = false

func _unhandled_input(event: InputEvent) -> void:
	if player_in_range and (event.is_action_pressed("interact") or event.is_action_pressed("ui_accept")):
		if DialogueManager and not DialogueManager.is_dialogue_active:
			DialogueManager.start_dialogue(speaker_name, dialogue_lines)
			get_viewport().set_input_as_handled()
